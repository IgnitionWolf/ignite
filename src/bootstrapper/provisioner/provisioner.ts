import PackagesFactory from '../packages/factory'
import {CLIError} from '@oclif/errors'
import Package from '../packages/package'
import {Provider} from '../../engine/provider/provider'

export default abstract class Provisioner {
  provider: Provider

  directory: string

  constructor(provider: Provider) {
    this.provider = provider
    this.directory = provider.environment.workingDirectory.directory
  }

  /**
   * Perform all the required steps to install/register a package.
   * @param {Package} pkg the package to install
   */
  abstract registerPackage(pkg: Package): void;
}
