import Environment from '../environment/environment'
import {CLIError} from '@oclif/errors'
import VagrantProvider, {VagrantStatus} from './vagrant'

/**
 * This is the middleman between the commands, Vagrant and the environment.
 */
export default class Igniter {
  provider!: VagrantProvider

  environment: Environment

  verbose: boolean

  constructor(environment: Environment, verbose: boolean) {
    this.environment = environment
    this.verbose = verbose

    if (this.environment.isSetup()) {
      this.provider = new VagrantProvider(this.environment, this.verbose)
    }
  }

  async ignite() {
    if (this.environment.isSetup() && await this.provider.status() === VagrantStatus.Running) {
      throw new CLIError('The environment is already running.')
    }

    this.environment.create()

    // We need to create this here to prevent some data assigning issues
    this.provider = new VagrantProvider(this.environment, this.verbose)

    if (this.environment.hadToSetup) {
      this.provider.bootstrap()
    }

    await this.provider.up()
  }

  async destroy() {
    if (!this.environment.isSetup()) {
      throw new CLIError("The machine hasn't been ignited, type 'ignite up' to get it running.")
    }

    await this.provider.destroy()
    await this.environment.destroy()
  }

  async ensureStatus(onlySetup?: boolean) {
    onlySetup = onlySetup || false
    if (!this.environment.isSetup() || (this.environment.isSetup() && await this.provider.status() === VagrantStatus.Offline && !onlySetup)) {
      throw new CLIError("The machine hasn't been ignited, type 'ignite up' to get it running.")
    }
  }
}
