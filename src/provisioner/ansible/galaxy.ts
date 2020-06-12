import Provisioner from '../provisioner'
import {CLIError} from '@oclif/errors'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import * as path from 'path'

/**
 * This is a wrapper to the Ansible Galaxy functionality.
 * Basically, store the roles to install in a requirements.yml file.
 */
export default class AnsibleGalaxy {
  requirements: Array<string> = [];

  provisioner: Provisioner;

  constructor(provisioner: Provisioner) {
    this.provisioner = provisioner
  }

  /**
   * Add an item to the list of roles for Galaxy to install
   * @param {string} role -
   */
  add(role: string) {
    this.requirements.push(role)
  }

  /**
   * Save the requirements.yml file used by Galaxy to install roles.
   */
  save() {
    const requirementsFile = path.join(this.provisioner.directory, 'requirements.yml')
    if (!fs.existsSync(requirementsFile)) {
      throw new CLIError(`Could not find the requirements.yml file at ${requirementsFile}`)
    }
    fs.writeFileSync(requirementsFile, YAML.stringify(this.requirements))
  }
}
