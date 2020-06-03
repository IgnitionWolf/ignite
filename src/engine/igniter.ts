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
    if (this.environment.isSetup() && this.provider.status() === ProviderStatus.Running) {
      throw new CLIError('The environment is already running.')
    }

    this.environment.create()

    // We need to re-create this to prevent some data assigning issues
    this.provider = new VagrantProvider(this.environment)

    if (this.environment.hadToSetup) {
      this.provider.bootstrapper.bootstrap()
    }

    this.provider.up()
  }

  destroy(): void {
    if (!this.environment.isSetup()) {
      throw new CLIError("The machine hasn't been ignited, type 'ignite up' to get it running.")
    }

    this.provider.destroy()
    this.environment.destroy()
  }

  ensureStatus(): void {
    if (!this.environment.isSetup() || (this.environment.isSetup() && this.provider.status() === ProviderStatus.Offline)) {
      throw new CLIError("The machine hasn't been ignited, type 'ignite up' to get it running.")
    }
  }
}
