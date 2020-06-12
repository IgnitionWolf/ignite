import Provisioner from '../provisioner'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import * as path from 'path'
import * as _ from 'lodash'
import {CLIError} from '@oclif/errors'
import IgnitefileTask from '../../environment/ignitefile/task'
import {AnsiblePlaybook} from './playbook'
import VagrantBridge from '../../engine/vagrant'
import IgnitefileDependency from '../../environment/ignitefile/dependency'
import Package from '../package'
import AnsibleGalaxy from './galaxy'

export default class AnsibleProvisioner extends Provisioner {
  playbook: AnsiblePlaybook;

  galaxy: AnsibleGalaxy;

  constructor(provider: VagrantBridge) {
    super(provider)
    this.playbook = new AnsiblePlaybook(this)
    this.galaxy = new AnsibleGalaxy(this)
  }

  registerPackages(packages: Array<IgnitefileDependency>): void {
    packages.forEach((dependency: IgnitefileDependency) => {
      const pkg = new Package()

      // Update the requirements.yml file
      this.galaxy.add(pkg.install)

      // Create the configuration file
      if (pkg.configFilename) {
        const configurationFile = path.join(this.directory, 'vars', pkg.configFilename)
        fs.ensureFileSync(configurationFile)
        fs.writeFileSync(configurationFile, YAML.stringify(pkg.configuration))
      }

      /**
       * Update the playbook file to add the new role.
       */
      const role: any = {
        role: pkg.install,
        when: (pkg.conditional() ? pkg.conditional() : undefined),
      }

      if (pkg.configFilename) {
        this.playbook.vars_files.push(path.join('vars', pkg.configFilename))
      }

      this.playbook.roles.push(role)
    })
  }

  registerTasks(tasks: Array<IgnitefileTask>): void {
    tasks.forEach((task: IgnitefileTask) => {
      if (task?.inline) {
        // Apply some rules here..
        let extra = {}
        if (task.inline.indexOf('composer') !== -1) {
          task.inline = task.inline.replace('composer', '/usr/local/bin/composer')
          extra = {become: 'no'}
        }

        const ansibleTask = _.merge({
          name: `Execute task: ${task.inline}`,
          shell: task.inline,
          args: {...task?.args, chdir: task.path},
        }, extra)

        this.playbook.post_tasks.push(ansibleTask)
      } else if (task?.file) {
        const ansibleTask = {
          name: `Execute task: ${task.inline}`,
          shell: task.inline,
          args: {...task?.args, chdir: task.path},
        }

        this.playbook.post_tasks.push(ansibleTask)
      }
    })
  }

  registerUtilities(utilities: Array<string>): void {
    const task = ({
      name: 'Install miscellaneous dependencies',
      package: {
        name: '{{ item }}',
        state: 'present',
      },
      with_list: utilities,
    })

    this.playbook.pre_tasks.push(task)
  }
}
