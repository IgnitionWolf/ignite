import {CLIError} from '@oclif/errors'
import Package from './package'
import VagrantBridge from '../engine/vagrant'
import IgnitefileTask from '../environment/ignitefile/task'
import WorkingDirectory from '../environment/working-directory/working-directory'
import IgnitefileDependency from '../environment/ignitefile/dependency'

/**
 * The engine in charge of provisioning the machine.
 */
export default abstract class Provisioner {
  provider: VagrantBridge

  workingDirectory: WorkingDirectory

  directory: string

  constructor(provider: VagrantBridge) {
    this.provider = provider
    this.directory = provider.environment.workingDirectory.directory
    this.workingDirectory = provider.environment.workingDirectory
  }

  /**
   * Prepare all the required steps for Ansible to load a package.
   * @param {Array<IgnitefileDependency>} packages the packages to install
   */
  abstract registerPackages(packages: Array<IgnitefileDependency>): void;

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
}
