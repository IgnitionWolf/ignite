import IgnitefileDependency from './dependency'
import IgnitefileSite from './site'
import IgnitefileTask from './task'
import IgnitefileMeta from './meta'
import {CLIError} from '@oclif/errors'
import Basefile from '../basefile'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as YAML from 'yaml'

interface IgnitefileInterface {
  meta: IgnitefileMeta;
  dependencies?: Array<IgnitefileDependency>;
  sites?: Array<IgnitefileSite>;
  tasks?: Array<IgnitefileTask>;
  utilities?: Array<string>;
}

export default class Ignitefile extends Basefile implements IgnitefileInterface {
  filename = 'Ignitefile.yml'

  meta: IgnitefileMeta = {
    name: 'Box-Name',
    box: 'centos/7',
    ip: this.generateIP(),
  };

  dependencies: Array<IgnitefileDependency> = []

  sites: Array<IgnitefileSite> = []

  tasks: Array<IgnitefileTask> = []

  utilities: Array<string> = []

  /**
   * Create the Ignitefile in the project directory.
   */
  create() {
    const target = this.getPath()
    if (fs.existsSync(target)) {
      throw new CLIError('The Ignitefile already exists.')
    }

    fs.copyFileSync(path.join(__dirname, 'templates', this.filename), target)
    this.load() // Load the template content after copying it..
  }

  /**
   * Load the configuration file settings into the object.
   */
  load(): void {
    const target = this.getPath()
    if (!fs.existsSync(target)) {
      throw new CLIError('The Ignitefile does not exist.')
    }

    const content: IgnitefileInterface = YAML.parse(fs.readFileSync(target).toString('UTF-8'))

    if (content?.meta) {
      this.meta = content.meta
    }

    if (content?.dependencies) {
      this.dependencies = content.dependencies
    }

    if (content?.sites) {
      this.sites = content.sites
    }

    if (content?.tasks) {
      this.tasks = content.tasks
    }

    if (content?.utilities) {
      this.utilities = content.utilities
    }
  }

  /**
   * Destroy the Ignitefile.
   */
  destroy() {
    fs.removeSync(this.getPath())
  }

  /**
   * Helper function to generate a random IP address.
   * @return {string} IP address
   */
  generateIP(): string {
    return `192.168.${Math.floor(Math.random() * 254) + 1}.33`
  }
}
