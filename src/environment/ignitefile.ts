import Basefile from './basefile'
import * as fs from 'fs'
import {CLIError} from '@oclif/errors'
import * as path from 'path'

export default class Ignitefile extends Basefile {
  filename = 'Ignitefile.yaml'

  create() {
    const target = this.getPath()
    if (fs.existsSync(target)) {
      throw new CLIError('The Ignitefile already exists.')
    }

    fs.copyFileSync(path.join(__dirname, 'templates', 'Ignitefile.yaml'), target)
    this.load() // Load the template content after copying it..
  }

  destroy() {
    fs.unlinkSync(this.getPath())
  }
}
