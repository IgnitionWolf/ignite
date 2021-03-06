import * as path from 'path'
import * as YAML from 'yaml'
import * as fs from 'fs-extra'
import Provisioner from '../provisioner'

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

    original[0].roles = original[0].roles || []
    original[0].pre_tasks = original[0].pre_tasks || []
    original[0].vars_files = original[0].vars_files || []
    original[0].post_tasks = original[0].post_tasks || []

    original[0].roles = [...this.roles, ...original[0].roles]
    original[0].vars_files = [...this.vars_files, ...original[0].vars_files]
    original[0].pre_tasks = [...this.pre_tasks, ...original[0].pre_tasks]
    original[0].post_tasks = [...this.post_tasks, ...original[0].post_tasks]

    fs.writeFileSync(this.filename, YAML.stringify(original))
  }
}
