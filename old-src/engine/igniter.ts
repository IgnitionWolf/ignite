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

  async ignite() {
    if (this.environment.isSetup() && await this.provider.status() === ProviderStatus.Running) {
      throw new CLIError('The environment is already running.')
    }

    this.environment.create()

    // We need to re-create this to prevent some data assigning issues
    this.provider = new VagrantProvider(this.environment)

    if (this.environment.hadToSetup) {
      this.provider.bootstrapper.bootstrap()
    }

    await this.provider.up()
  }

  async destroy() {
    if (!this.environment.isSetup()) {
      throw new CLIError("The machine hasn't been ignited, type 'ignite up' to get it running.")
    }

    await this.provider.destroy() // llama destroy()
    await this.environment.destroy() // destruye el directorio donde se corre destroy()
  }

  async ensureStatus(onlySetup?: boolean) {
    onlySetup = onlySetup || false
    if (!this.environment.isSetup() || (this.environment.isSetup() && await this.provider.status() === ProviderStatus.Offline && !onlySetup)) {
      throw new CLIError("The machine hasn't been ignited, type 'ignite up' to get it running.")
    }
  }
}
