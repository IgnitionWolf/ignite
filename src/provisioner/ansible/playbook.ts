import WorkingDirectory from '../../environment/working-directory/working-directory'
import * as path from 'path'
import * as YAML from 'yaml'
import * as _ from 'lodash'
import * as fs from 'fs-extra'

export interface PlaybookInterface {
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

export class AnsiblePlaybook implements PlaybookInterface {
  workingDirectory: WorkingDirectory;

  vars_files!: Array<string>;

  roles!: Array<object>;

  pre_tasks!: Array<object>;

  post_tasks!: Array<object>;

  constructor(workingDirectory: WorkingDirectory) {
    this.workingDirectory = workingDirectory
  }

  /**
   * Write the main playbook settings into the file.
   */
  save(): void {
    const filename = path.join(this.workingDirectory.directory, 'ansible', 'playbook.yml')
    const original = YAML.parse(fs.readFileSync(filename).toString('UTF-8'))

    fs.writeFileSync(filename, YAML.stringify(_.merge(original, {
      vars_files: this.vars_files,
      roles: this.roles,
      pre_tasks: this.pre_tasks,
      post_tasks: this.post_tasks,
    })))
  }
}
