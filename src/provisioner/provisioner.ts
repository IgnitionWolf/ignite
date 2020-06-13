import {CLIError} from '@oclif/errors'
import Package from './package'
import VagrantProvider from '../engine/vagrant'
import IgnitefileTask from '../environment/ignitefile/task'
import WorkingDirectory from '../environment/working-directory/working-directory'
import IgnitefileDependency from '../environment/ignitefile/dependency'
import getPackageByName from './ansible/packages/factory'
import IgnitefileSite from '../environment/ignitefile/site'

/**
 * The engine in charge of provisioning the machine.
 */
export default abstract class Provisioner {
  provider: VagrantProvider

  workingDirectory: WorkingDirectory

  directory!: string

  constructor(provider: VagrantProvider) {
    this.provider = provider
    this.workingDirectory = provider.environment.workingDirectory
  }

  /**
   * Prepare all the required steps for Ansible to set up a site and virtual host.
   * @param {Array<IgnitefileSite>} sites the sites to install
   */
  abstract registerSites(sites: Array<IgnitefileSite>): void;

  /**
   * Prepare all the required steps for Ansible to load a package.
   * @param {Array<IgnitefileDependency>} packages the packages to install
   */
  abstract registerDependencies(packages: Array<IgnitefileDependency>): void;

  /**
   * Prepare all the required steps for Ansible to perform a task.
   * @param {Array<IgnitefileTask>} tasks the task to perform
   */
  abstract registerTasks(tasks: Array<IgnitefileTask>): void;

  /**
   * Prepare all the required steps for Ansible to install an utility.
   * @param {Array<string>} utilities the utilities to install
   */
  abstract registerUtilities(utilities: Array<string>): void;

  /**
   * Converts an IgnitefileDependency to a Package.
   * When it's time to add a new provisioner, we'll need to use
   * a Package factory per provisioner. In the meanwhile, this is ok
   * @param {IgnitefileDependency} dependency -
   * @returns {Package} -
   */
  convertPackage(dependency: IgnitefileDependency): Package {
    const pkg = getPackageByName(dependency.name)

    if (dependency?.extra) {
      pkg.extensions.concat(dependency.extra)
    }

    if (dependency?.version) {
      pkg.version = dependency.version
    }

    // Load any other dependencies required by this dependency, confusing?
    if (pkg.requires.length > 0) {
      pkg.requires.forEach((requiredPackage: any) => {
        requiredPackage = getPackageByName(requiredPackage)

        // Inherit the version to the child package if blank
        if (!requiredPackage.version) {
          requiredPackage.version = pkg.version
        }

        this.registerDependencies([Object.create(requiredPackage)])
      })
    }

    return pkg
  }
}
