import Bootstrapper from './bootstrapper'
import * as fs from 'fs-extra'
import * as path from 'path'
import {IgnitefilePackage} from '../environment/ignitefile'
import getPackageByName from './packages/factory'
import {CLIError} from '@oclif/errors'
import {execSync} from 'child_process'
import * as os from 'os'
import Package from './packages/package'

export default class VagrantBootstrap extends Bootstrapper  {
  bootstrap(): void {
    /**
     * Process the Vagrantfile
     */
    const Vagrantfile = path.join(this.environment.workingDirectory.directory, 'Vagrantfile')
    const content = fs.readFileSync(Vagrantfile).toString('UTF-8')

    const defaultIp = `192.168.${Math.floor(Math.random() * 254) + 1}.33`
    const settings = {
      hostname: this.environment.name,
      box: this.environment.ignitefile.get('ignite.box', 'centos/7'),
      ip: this.environment.ignitefile.get('ignite.ip', defaultIp),
    }

    fs.writeFileSync(Vagrantfile, Bootstrapper.renderTemplate(content, settings))

    /**
     * Handle the provisioner
     */
    const packages = this.environment.ignitefile.get('requires', [])
    if (packages.length > 0) {
      packages.forEach((element: IgnitefilePackage) => {
        this.loadPackage(element)
      })
    }

    /**
     * Install necessary plugins
     */
    // const plugins = ['vagrant-vbguest']
    // this.provisioner.provider.installPlugin(plugins)
  }

  /**
   * Perform the necessary steps to load the package data.
   * @param {IgnitefilePackage} element package from ignitefile to load
   */
  loadPackage(element: IgnitefilePackage): void {
    const pkg = getPackageByName(element.name)
    if (element?.extensions) {
      pkg.extensions.concat(element.extensions)
    }

    if (element?.version) {
      pkg.version = element.version
    }

    if (pkg.requires.length > 0) {
      // The 'requiredPackage' is a Package class prototype
      pkg.requires.forEach((requiredPackage: any) => {
        requiredPackage = getPackageByName(requiredPackage)
        if (!requiredPackage.version) {
          requiredPackage.version = pkg.version
        }
        this.provisioner.registerPackage(Object.create(requiredPackage))
      })
    }

    this.provisioner.registerPackage(pkg)
  }
}
