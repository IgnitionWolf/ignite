import Bootstrapper from './bootstrapper'
import * as fs from 'fs-extra'
import * as path from 'path'
import { IgnitefilePackage } from '../environment/ignitefile'
import getPackageByName from './packages/factory'

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
        const pkg = getPackageByName(element.name)
        this.provisioner.registerPackage(pkg)
      })
    }
  }
}
