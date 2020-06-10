import * as fs from 'fs-extra'
import {CLIError} from '@oclif/errors'
import * as path from 'path'
import * as YAML from 'yaml'
import Basefile from '../basefile'

interface MetafileInterface {
  /**
   * The environment identifier, this is used to ID the working directory.
   */
  id: string;

  /**
   * The environment identifier, this is used to ID the working directory.
   */
  name: string;

  /**
   * Path to the working directory.
   */
  path?: string;
}

export default class Metafile extends Basefile implements MetafileInterface {
  filename = path.join('.ignite', 'config.yml')

  id!: string;

  name!: string;

  path?: string;

  create() {
    const target = this.getPath()
    if (fs.existsSync(target)) {
      throw new CLIError('The metafile already exists.')
    }

    const workingDirectory = this.environment.workingDirectory
    if (!workingDirectory) {
      throw new CLIError('The working directory needs to be assigned to the Environment before the Metafile.')
    }

    this.save()
  }

  /**
   * Load the configuration file, and create it if not existent.
   * @param {boolean} createIfMissing Create the file if not existent
   */
  load(createIfMissing?: boolean): void {
    createIfMissing = createIfMissing || false

    const target = this.getPath()
    if (!fs.existsSync(target)) {
      if (createIfMissing) {
        this.save()
      } else {
        throw new CLIError('The metafile does not exist.')
      }
    }

    this.settings = YAML.parse(fs.readFileSync(target).toString('UTF-8'))
  }

  /**
   * Wrapper to map the settings easily.
   * @return {MetafileInterface} -
   */
  get settings(): MetafileInterface {
    return {
      id: this.id,
      path: this.path,
      name: this.name,
    }
  }

  /**
   * Wrapper to map the settings easily.
   * @param {MetafileInterface} value -
   */
  set settings(value: MetafileInterface) {
    if (value?.id) {
      this.id = value.id
    }

    if (value?.name) {
      this.name = value.name
    }

    if (value?.path) {
      this.path = value.path
    }
  }

  /**
   * Save/create the metafile file.
   */
  save(): void {
    const target = this.getPath()

    fs.ensureFileSync(target)
    fs.writeFileSync(target, YAML.stringify(this.settings))
  }

  /**
   * Destroy the metafile.
   */
  destroy() {
    fs.removeSync(path.join(this.directory, '.ignite'))
  }
}
