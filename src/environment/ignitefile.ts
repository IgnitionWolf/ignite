import Basefile from './basefile'
import * as fs from 'fs-extra'
import {CLIError} from '@oclif/errors'
import * as path from 'path'
import Package from '../bootstrapper/packages/package'

export interface IgnitefilePackage {
  name: string;
  version?: string;
  extensions?: string;
  requires?: Array<Package>;
}

export default class Ignitefile extends Basefile {
  filename = 'Ignitefile.yml'

  create() {
    const target = this.getPath()
    if (fs.existsSync(target)) {
      throw new CLIError('The Ignitefile already exists.')
    }

    fs.copyFileSync(path.join(__dirname, 'templates', this.filename), target)
    this.load() // Load the template content after copying it..
  }

  destroy() {
    fs.removeSync(this.getPath())
  }
}
