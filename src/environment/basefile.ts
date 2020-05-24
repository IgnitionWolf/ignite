import {CLIError} from '@oclif/errors'
import * as path from 'path'
import * as _ from 'lodash'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import Environment from './environment'

export default abstract class Basefile {
  abstract filename: string

  directory: string

  settings: object

  environment!: Environment

  constructor(directory: string, environment?: Environment) {
    this.directory = directory
    this.settings = {}

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
   * Load the configuration file, and create it if not existent.
   * @param {boolean} createIfMissing Create the file if not existent
   */
  load(createIfMissing?: boolean): void {
    const target = this.getPath()
    createIfMissing = createIfMissing || false
    if (createIfMissing) {
      this.save()
    } else {
      const className = this.constructor.name
      if (!fs.existsSync(target)) {
        throw new CLIError(`The ${className} does not exist.`)
      }
    }

    const content = fs.readFileSync(target).toString('UTF-8')
    this.settings = YAML.parse(content)
  }

  /**
   * Save the configuration file, it's created if not existent.
   */
  save(): void {
    const content = YAML.stringify(this.settings)
    const target = this.getPath()

    fs.ensureFileSync(target)
    fs.writeFileSync(target, content)
  }

  /**
   * Get the formatted path to the configuration file.
   * @return {string} path
   */
  getPath(): string {
    return path.join(this.directory, this.filename)
  }

  /**
   * Set a value in the settings with dot notation.
   * @param {string} key target key
   * @param {any=} value new value
   */
  set(key: string, value: any): void {
    _.set(this.settings, key, value)
  }

  /**
   * Obtain a value from the settings with dot notation.
   * @param {string} key target key
   * @param {any=} fallback default/fallback value
   * @return {any} value
   */
  get(key: string, fallback?: any): any {
    fallback = fallback ?? null
    return _.get(this.settings, key, fallback)
  }

  /**
   * Ensure file is accessible and existent.
   * @throws {CLIError}
   * @param {string} file path to file
   */
  validateFile(file: string) {
    // Check if the file exists in the current directory, and if it is writable.
    fs.access(file, fs.constants.F_OK | fs.constants.W_OK, err => {
      if (err) {
        throw new CLIError(
          `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`)
      }
    })

    // Check if the file is readable.
    fs.access(file, fs.constants.R_OK, err => {
      if (err) {
        throw new CLIError(`${file} is not readable`)
      }
    })
  }
}
