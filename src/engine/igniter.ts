import VagrantProvider from './provider/vagrant'
import Environment from '../environment/environment'
import {CLIError} from '@oclif/errors'
import {ProviderStatus} from './provider/provider'

export default class Igniter {
  vagrant: VagrantProvider

  environment: Environment

  constructor(environment: Environment) {
    this.environment = environment
    this.vagrant = new VagrantProvider(this.environment.workingDirectory)
  }

  ignite(): void {
    if (!this.environment.isSetup()) {
      this.environment.create()
    }

    if (this.vagrant.status() === ProviderStatus.Running) {
      throw new CLIError('The environment is already running.')
    }

    this.vagrant.up()
  }
}
