import Environment from './environment'
import {execSync} from 'child_process'
import {CLIError} from '@oclif/errors'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'

export default class WorkingDirectory {
  static template = ''

  static directoriesPath = path.join(os.homedir(), '.ignite')

  directory!: string

  environment: Environment

  constructor(environment: Environment) {
    this.environment = environment
  }

  /**
   * Load a Working Directory in a specific target path.
   * @param {string} target target path
   * @param {boolean} createIfMissing create the working directory if not existent
   */
  load(target: string, createIfMissing?: boolean): void {
    createIfMissing = createIfMissing || false
    if (!fs.existsSync(target)) {
      if (createIfMissing === true) {
        this.create()
      } else {
        throw new CLIError('The working directory does not exist.')
      }
    }

    this.directory = target
  }

  /**
   * Create the Working Directory (the Vagrant/Ansible files)
   */
  create(): void {
    const target = path.join(
      WorkingDirectory.directoriesPath,
      this.environment.id
    )

    if (fs.existsSync(target)) {
      throw new CLIError('The working directory already exists.')
    }

    execSync(`cp -r ${WorkingDirectory.template} ${target}`)
    this.directory = target
  }
}
