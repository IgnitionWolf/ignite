import VagrantProvider from './provider/vagrant'
import Environment from '../environment/environment'
import {CLIError} from '@oclif/errors'
import {ProviderStatus} from './provider/provider'

export default class Igniter {
  provider: VagrantProvider

  environment: Environment

  constructor(environment: Environment) {
    this.environment = environment
    this.provider = new VagrantProvider(this.environment)
  }

  ignite(): void {
    const setup = this.environment.isSetup()
    if (!setup) {
      this.environment.create()
    }

    if (this.provider.status() === ProviderStatus.Running) {
      throw new CLIError('The environment is already running.')
    }

    this.provider.up()

    if (!setup) {
      this.provider.bootstrapper.bootstrap()
    }
  }

  destroy(): void {
    this.provider.destroy()
    this.environment.destroy()
  }
}
