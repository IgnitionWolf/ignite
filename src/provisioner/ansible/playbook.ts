import WorkingDirectory from '../../environment/working-directory/working-directory'
import * as path from 'path'
import * as YAML from 'yaml'
import * as _ from 'lodash'
import * as fs from 'fs-extra'
import Provisioner from '../provisioner'
import {CLIError} from '@oclif/errors'

export interface AnsiblePlaybookInterface {
  /**
   * Target host present in the file.
   */
  hosts?: string;

  /**
   * Variable files, for each role.
   */
  vars_files: Array<string>;

  /**
   * Roles to install in the machine.
   */
  roles: Array<object>;

  /**
   * Tasks to perform before installing roles.
   */
  pre_tasks: Array<object>;

  /**
   * Tasks to perform after installing roles.
   */
  post_tasks: Array<object>;
}

export class AnsiblePlaybook implements AnsiblePlaybookInterface {
  filename: string;

  provisioner: Provisioner;

  vars_files: Array<string> = [];

  roles: Array<object> = [];

  pre_tasks: Array<object> = [];

  post_tasks: Array<object> = [];

  constructor(provisioner: Provisioner) {
    this.provisioner = provisioner
    this.filename = path.join(this.provisioner.directory, 'playbook.yml')
  }

  /**
   * Write the main playbook settings into the file.
   */
  save(): void {
    const original = YAML.parse(fs.readFileSync(this.filename).toString('UTF-8'))

    fs.writeFileSync(this.filename, YAML.stringify(_.merge(original, {
      vars_files: this.vars_files,
      roles: this.roles,
      pre_tasks: this.pre_tasks,
      post_tasks: this.post_tasks,
    })))
  }
}
