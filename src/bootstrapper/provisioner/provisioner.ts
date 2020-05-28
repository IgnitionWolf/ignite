import PackagesFactory from '../packages/factory'
import {CLIError} from '@oclif/errors'
import Package from '../packages/package'

export default abstract class Provisioner {
  /**
   * Perform all the required steps to install/register a package.
   * @param {Package} pkg the package to install
   */
  abstract registerPackage(pkg: Package): void;

  /**
   * Instantiate a package wrapper from the name.
   * @param {string} name package name
   * @return {Package} -
   */
  static getPackageByName(name: string): Package {
    if (!PackagesFactory[name]) {
      throw new CLIError(`Trying to load unknown package ${name} from the PackagesFactory.`)
    }

    return new PackagesFactory[name]()
  }
}
