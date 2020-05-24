import Basefile from './basefile'
import * as fs from 'fs-extra'
import {CLIError} from '@oclif/errors'
import * as path from 'path'

/**
 * The metafile contains the Enviroment's meta data. It depends on WorkingDirectory
 * as the metafile must contain the path to that directory, which is the main objective.
 */
export default class Metafile extends Basefile {
  filename = path.join('.ignite', 'config.yaml')

  settings = {id: '', name: '', path: ''}

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

  destroy() {
    fs.unlinkSync(this.getPath())
  }
}
