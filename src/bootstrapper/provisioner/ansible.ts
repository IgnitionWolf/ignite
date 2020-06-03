import Provisioner from './provisioner'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import Package from '../packages/package'
import * as path from 'path'

import {CLIError} from '@oclif/errors'

interface PlaybookInterface {
  hosts: string;
  roles: Array<string | object>;
  vars_files: Array<string>;
}

export default class AnsibleProvisioner extends Provisioner {
  registerPackage(pkg: Package): void {
    const baseDir = path.join(this.directory, 'ansible')

    /**
     * Update the requirements.yml file.
     */
    const requirementsFile = path.join(baseDir, 'requirements.yml')
    fs.ensureFileSync(requirementsFile)

    const requirements = YAML.parse(fs.readFileSync(requirementsFile).toString('UTF-8')) || []
    requirements.push(pkg.install)
    fs.writeFileSync(requirementsFile, YAML.stringify(requirements))

    /**
     * Create a configuration/variables file.
     */
    if (pkg.configFilename) {
      const configurationFile = path.join(baseDir, 'vars', pkg.configFilename)
      fs.ensureFileSync(configurationFile)
      fs.writeFileSync(configurationFile, YAML.stringify(pkg.configuration))
    }

    /**
     * Update the playbook file to add the new roles.
     */
    const playbookFile = path.join(baseDir, 'playbook.yml')
    fs.ensureFileSync(playbookFile)

    const playbook = YAML.parse(fs.readFileSync(playbookFile).toString('UTF-8')) || {}

    playbook.forEach((element: PlaybookInterface) => {
      if (element.hosts === 'webservers') {
        const conditional = pkg.conditional()
        element.roles = element.roles ?? []
        if (conditional) {
          element.roles.push({role: pkg.install, vars: pkg.configuration, when: conditional})
        } else element.roles.push({role: pkg.install, vars: pkg.configuration})

        // if (pkg.configFilename) {
        //   element.vars_files = element.vars_files ?? []
        //   element.vars_files.push(path.join('vars', pkg.configFilename))
        // }
      }
    })

    fs.writeFileSync(playbookFile, YAML.stringify(playbook))
  }
}
