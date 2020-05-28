import {Provider, ProviderStatus} from './provider'
import {Client, ClientChannel} from 'ssh2'
import {execSync} from 'child_process'
import {CLIError} from '@oclif/errors'
import * as fs from 'fs'

// @ts-ignore
import * as SSHConfig from 'ssh-config'
import Bootstrapper from '../../bootstrapper/bootstrapper'
import VagrantBootstrap from '../../bootstrapper/vagrant'
import Environment from '../../environment/environment'
import AnsibleProvisioner from '../../bootstrapper/provisioner/ansible'

export default class VagrantProvider implements Provider {
  environment: Environment

  bootstrapper: Bootstrapper

  constructor(environment: Environment) {
    this.environment = environment
    this.bootstrapper = new VagrantBootstrap(environment, new AnsibleProvisioner(this))
  }

  /**
   * Start the Vagrant environment, it's provisioned on the first start,
   * if it's already provisioned it will boot the box.
   */
  up(): void {
    this.exec('vagrant up')
  }

  /**
   * Stop the Vagrant environment by shutting down the box safely.
   */
  down(): void {
    this.exec('vagrant halt')
  }

  /**
   * Suspend the Vagrant environment by suspending the box safely.
   */
  suspend(): void {
    this.exec('vagrant suspend')
  }

  /**
   * Destroy the Vagrant environment.
   */
  destroy(): void {
    this.exec('vagrant destroy --force')
  }

  /**
   * Get the Vagrant environment status.
   * @return {string} status
   */
  status(): string {
    const buffer = this.exec('vagrant status')

    if (buffer.indexOf('running') !== -1) {
      return ProviderStatus.Running
    }
    if (buffer.indexOf('off') !== -1) {
      return ProviderStatus.Offline
    }
    if (buffer.indexOf('saved') !== -1) {
      return ProviderStatus.Suspended
    }
    return ProviderStatus.Unknown
  }

  /**
   * Check if Vagrant is installed or not.
   * @return {boolean} -
   */
  isInstalled(): boolean {
    const buffer = this.exec('vagrant')
    return (buffer.indexOf('--help') !== -1)
  }

  /**
   * SSH into the environment box, we will not be able to use 'vagrant ssh' here.
   * This connects the SSH pipes to provide an interactive functionality.
   */
  ssh(): void {
    const connection = this.sshConfig(true)

    const conn = new Client()
    conn.on('ready', () => {
      conn.shell((err: Error | undefined, stream: ClientChannel) => {
        if (err) throw err

        // @ts-ignore
        process.stdin.setRawMode(true)
        process.stdin.pipe(stream)
        stream.pipe(process.stdout)
        stream.stderr.pipe(process.stderr)

        stream.on('close', function () {
          process.stdin.end()
          conn.end()
        })
      })
    }).connect(connection)
  }

  /**
   * Get the environment's SSH configuration.
   * @throws {CLIError}
   * @param {boolean=} ssh2 output in the ssh2 package format
   * @return {any} ssh config (object/string)
   */
  sshConfig(ssh2?: boolean): any {
    const config = this.exec('vagrant ssh-config')

    if (!config) {
      throw new CLIError('Failed to obtain the SSH configuration from the provider.')
    }

    ssh2 = ssh2 || false
    if (ssh2) {
      const result = {host: '', port: 22, username: '', privateKey: ''}
      const section = SSHConfig.parse(config)[0]
      for (const line of section.config) {
        if (line.param === 'HostName') {
          result.host = line.value
        } else if (line.param === 'Port') {
          result.port = line.value
        } else if (line.param === 'User') {
          result.username = line.value
        } else if (line.param === 'IdentityFile') {
          result.privateKey = fs.readFileSync(line.value).toString('UTF-8')
        }
      }
      return result
    }

    return config
  }

  /**
   * Execute a CLI command, in a specific directory.
   * @param {string} command operation to execute
   * @return {string} output buffer in string
   */
  exec(command: string): string {
    const directory = this.environment.workingDirectory.directory
    return execSync(`(cd ${directory} && ${command})`).toString('UTF-8')
  }
}
