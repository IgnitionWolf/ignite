import Environment from '../environment/environment'
import Provisioner from '../provisioner/provisioner'
import {CLIError} from '@oclif/errors'

/**
 * This starts all the processes to get the working directory ready.
 * Afterwards, it will be ready for Vagrant to start the machine.
 * This is just a middleman between the provisioner and environment.
 * If anything goes wrong... it's the bootstrapper fault!
 */
export default class Bootstrap {
  environment: Environment

  provisioner: Provisioner

  constructor(environment: Environment, provisioner: Provisioner) {
    this.environment = environment
    this.provisioner = provisioner
  }

  /**
   * Boooootstrap everything...
   * This depends on the provisioner, but this will create/modify
   * all the necessary files to provide sites/packages/machine in general.
   */
  bootstrap(): void {
    this.handleCommon()
    this.handleSites()
    this.handlePackages()
    this.handleVagrant()
    this.save()
  }

  /**
   * Mostly all the files data are stored in memory and saved when
   * everything is ready, this is to prevent many I/Os and a blurry code.
   */
  save(): void {
    this.provisioner.save()
    this.environment.workingDirectory.vagrantfile.save()
  }

  /**
   * Let the provisioner handle the sites for us...
   */
  handleSites(): void {
    this.provisioner.registerSites(this.environment.ignitefile.sites)
  }

  /**
   * Process packages!
   */
  handlePackages(): void {
    this.provisioner.registerDependencies(this.environment.ignitefile.dependencies)
  }

  /**
   * Handle the common stuff here, utilities and shell commands.
   */
  handleCommon(): void {
    this.provisioner.registerUtilities(this.environment.ignitefile.utilities)
    this.provisioner.registerTasks(this.environment.ignitefile.tasks)
  }

  /**
   * Anything extra that Vagrant may require..
   */
  handleVagrant(): void {
    // this.provisioner.provider.installPlugin(['vagrant-vbguest'])
  }
}
