import {Client, ClientChannel} from 'ssh2'
import {spawn} from 'child_process'
import {CLIError} from '@oclif/errors'
import * as fs from 'fs'

import Environment from '../environment/environment'
import AnsibleProvisioner from '../provisioner/ansible/ansible'
import Bootstrap from './bootstrap'

const SSHConfig = require('ssh-config')

export enum VagrantStatus {
  Running = 'Running',
  Offline = 'Offline',
  Suspended = 'Suspended',
  Unknown = 'Unknown'
}

export default class VagrantProvider {
  environment: Environment

  bootstrapper: Bootstrap

  verbose: boolean

  constructor(environment: Environment, verbose: boolean) {
    this.environment = environment
    this.bootstrapper = new Bootstrap(environment, new AnsibleProvisioner(this))
    this.verbose = verbose
  }

  /**
   * Bootstrap the Vagrant files.
   * @return {void} -
   */
  bootstrap(): void {
    return this.bootstrapper.bootstrap()
  }

  /**
   * Start the Vagrant environment, it's provisioned on the first start,
   * if it's already provisioned it will boot the box.
   */
  async up() {
    await this.exec('vagrant up')
  }

  /**
   * Stop the Vagrant environment by shutting down the box safely.
   */
  async down() {
    await this.exec('vagrant halt')
  }

  /**
   * Suspend the Vagrant environment by suspending the box safely.
   */
  async suspend() {
    await this.exec('vagrant suspend')
  }

  /**
   * Destroy the Vagrant environment.
   */
  async destroy() {
    await this.exec('vagrant destroy --force')
  }

  /**
   * Get the Vagrant environment status.
   * @return {string} status
   */
  async status(): Promise<string> {
    const buffer = await this.exec('vagrant status')

    if (buffer.indexOf('running') !== -1) {
      return VagrantStatus.Running
    }
    if (buffer.indexOf('off') !== -1) {
      return VagrantStatus.Offline
    }
    if (buffer.indexOf('saved') !== -1) {
      return VagrantStatus.Suspended
    }
    return VagrantStatus.Unknown
  }

  /**
   * Check if Vagrant is installed or not.
   * @return {boolean} -
   */
  async isInstalled(): Promise<boolean> {
    const buffer = await this.exec('vagrant')
    return (buffer.indexOf('--help') !== -1)
  }

  /**
   * SSH into the environment box, we will not be able to use 'vagrant ssh' here.
   * This connects the SSH pipes to provide an interactive functionality.
   */
  async ssh() {
    const connection = await this.sshConfig(true)

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
    }).connect(connection as object)
  }

  /**
   * Get the environment's SSH configuration.
   * @throws {CLIError}
   * @param {boolean=} ssh2 output in the ssh2 package format
   * @return {object | string} ssh config
   */
  async sshConfig(ssh2?: boolean): Promise<object | string> {
    const config = await this.exec('vagrant ssh-config')

    if (!config) {
      throw new CLIError('Failed to obtain the SSH configuration from the provider.')
    }

    ssh2 = ssh2 || false
    if (ssh2) {
      const result = {host: '', port: 22, username: '', privateKey: ''}
      const section = SSHConfig.parse(config.toString())[0]
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
   * Install a set of Vagrant plugins.
   * @param {string} plugins -
   */
  installPlugin(plugins: Array<string>) {
    this.exec(`vagrant plugin install ${plugins.join(' ')}`)
  }

  /**
   * Execute a CLI command, in a specific directory.
   * @param {string} command operation to execute
   * @return {string} output buffer in string
   */
  async exec(command: string): Promise<string> {
    return new Promise((resolve: any, reject: any) => {
      const directory = this.environment.workingDirectory.directory

      const args = command.split(' ') || []
      const process = spawn(args.shift() || '', args, {cwd: directory})
      let result: string

      this.log(`> ${command}`)
      process.stdout.on('data', data => {
        this.log(data.toString())
        result = data
      })

      process.stderr.on('data', data => {
        console.error(data.toString())
        return reject(data.toString())
      })

      process.on('close', () => {
        return resolve(result)
      })
    })
  }

  /**
   * Helper function to log if verbose.
   * @param {string} message -
   */
  log(message: string): void {
    if (this.verbose === true) {
      console.log(message)
    }
  }
}
