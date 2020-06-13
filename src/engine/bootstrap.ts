import Environment from '../environment/environment'
import Provisioner from '../provisioner/provisioner'
import {CLIError} from '@oclif/errors'

/**
 * This starts all the processes to get the working directory ready.
 * Afterwards, it will be ready for Vagrant to start the machine.
 */
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
    this.provisioner.registerSites(this.environment.ignitefile.sites)
  }

  handlePackages(): void {
    this.provisioner.registerDependencies(this.environment.ignitefile.dependencies)
  }

  handleCommon(): void {
    this.provisioner.registerUtilities(this.environment.ignitefile.utilities)

    this.provisioner.registerTasks(this.environment.ignitefile.tasks)
  }

  handleVagrant(): void {
    // this.provisioner.provider.installPlugin(['vagrant-vbguest'])
  }
}
