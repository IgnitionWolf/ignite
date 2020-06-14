import IgnitefileDependency from './dependency'
import IgnitefileSite from './site'
import IgnitefileTask from './task'
import IgnitefileMeta from './meta'
import {CLIError} from '@oclif/errors'
import Basefile from '../basefile'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as YAML from 'yaml'
import * as _ from 'lodash'

interface IgnitefileInterface {
  meta: IgnitefileMeta;
  dependencies?: Array<IgnitefileDependency>;
  sites?: Array<IgnitefileSite>;
  pre_tasks?: Array<IgnitefileTask>;
  tasks?: Array<IgnitefileTask>;
  utilities?: Array<string>;
}

export default class Ignitefile extends Basefile implements IgnitefileInterface {
  filename = 'Ignitefile.yml'

  template = path.resolve(__dirname, '..', '..', '..', 'templates', this.filename)

  meta: IgnitefileMeta = {
    name: 'Box-Name',
    box: 'centos/7',
    ip: this.generateIP(),
  };

  dependencies: Array<IgnitefileDependency> = []

  sites: Array<IgnitefileSite> = []

  tasks: Array<IgnitefileTask> = []

  pre_tasks: Array<IgnitefileTask> = []

  utilities: Array<string> = []

  /**
   * Create the Ignitefile in the project directory.
   */
  create() {
    const target = this.getPath()
    if (fs.existsSync(target)) {
      throw new CLIError('The Ignitefile already exists.')
    }

    fs.copyFileSync(this.template, target)
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

    if (content?.pre_tasks) {
      this.pre_tasks = content.pre_tasks
    }

    if (content?.tasks) {
      this.tasks = content.tasks
    }

    if (content?.utilities) {
      this.utilities = content.utilities
    }
  }

  /**
   * Save/create the ignitefile file.
   */
  save(): void {
    const template: IgnitefileInterface = YAML.parse(fs.readFileSync(this.filename).toString('UTF-8'))

    const settings = _.merge(template, {
      meta: this.meta,
      dependencies: (this.dependencies.length > 0) ? this.dependencies : 'eeeeempty',
      sites: (this.sites.length > 0) ? this.sites : 'eeeeempty',
      pre_tasks: (this.pre_tasks.length > 0) ? this.pre_tasks : 'eeeeempty',
      tasks: (this.tasks.length > 0) ? this.tasks : 'eeeeempty',
      utilities: (this.utilities.length > 0) ? this.utilities : 'eeeeempty',
    })

    fs.writeFileSync(this.getPath(), YAML.stringify(settings).replace(new RegExp('eeeeempty', 'g'), ''))
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
