import {CLIError} from '@oclif/errors'
import * as path from 'path'
import * as _ from 'lodash'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import Environment from '../environment'

export default abstract class Basefile {
  abstract filename: string

  directory: string

  environment!: Environment

  constructor(directory: string, environment?: Environment) {
    this.directory = directory

    if (environment) {
      this.environment = environment
    }

    if (!fs.existsSync(this.directory)) {
      throw new CLIError(`${this.directory} does not exist.`)
    }
  }

  /**
   * Store / create the configuration file.
   */
  abstract create(): void

  /**
   * Destroy the configuration file.
   */
  abstract destroy(): void

  /**
   * Get the formatted path to the configuration file.
   * @return {string} path
   */
  getPath(): string {
    return path.join(this.directory, this.filename)
  }

  /**
   * Determine if the file exists.
   * @return {boolean} -
   */
  exists(): boolean {
    return fs.existsSync(this.filename)
  }
}
