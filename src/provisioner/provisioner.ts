import {CLIError} from '@oclif/errors'
import Package from './package'
import VagrantBridge from '../engine/vagrant'
import IgnitefileTask from '../environment/ignitefile/task'

export default abstract class Provisioner {
  provider: VagrantBridge

  directory: string

  constructor(provider: VagrantBridge) {
    this.provider = provider
    this.directory = provider.environment.workingDirectory.directory
  }

  /**
   * Register a package or a task.
   * @param {Package | IgnitefileTask} element -
   * @return {void}
   */
  register(element: Package | IgnitefileTask): void {
    if (element instanceof Package) {
      return this.registerPackage(element)
    }
    return this.registerTask(element)
  }

  /**
   * Prepare all the required steps for Ansible to load a package.
   * @param {Package} pkg the package to install
   */
  abstract registerPackage(pkg: Package): void;

  /**
   * Prepare all the required steps for Ansible to perform a task.
   * @param {IgnitefileTask} task the task to perform
   */
  abstract registerTask(task: IgnitefileTask): void;
}
