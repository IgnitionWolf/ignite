import Environment from '../environment/environment'
import Provisioner from '../provisioner/provisioner'
import {CLIError} from '@oclif/errors'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as YAML from 'yaml'
import * as _ from 'lodash'
import IgnitefileSite from '../environment/ignitefile/site'
import IgnitefileDependency from '../environment/ignitefile/dependency'
import { AnsiblePlaybookInterface } from '../provisioner/ansible/playbook'

export default class Bootstrap {
  environment: Environment

  provisioner: Provisioner

  constructor(environment: Environment, provisioner: Provisioner) {
    this.environment = environment
    this.provisioner = provisioner
  }

  bootstrap(): void {
    this.handleCommon()

    this.handleSites()

    this.handlePackages()
  }

  handleSites(): void {

  }

  handlePackages(): void {
    const packages = this.environment.ignitefile.dependencies
    this.provisioner.registerPackages(packages)
  }

  handleCommon(): void {
    // 'git', 'curl', 'vim', 'nano'
    this.provisioner.registerUtilities(this.environment.ignitefile.utilities)

    this.provisioner.registerTasks(this.environment.ignitefile.tasks)
  }

  handleVagrant(): void {
    // this.provisioner.provider.installPlugin(['vagrant-vbguest'])
  }
}
