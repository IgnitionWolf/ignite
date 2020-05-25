import Bootstrapper from './bootstrapper'
import * as fs from 'fs-extra'
import * as path from 'path'

export default class VagrantBootstrap extends Bootstrapper  {
  bootstrap(): void {
    const Vagrantfile = path.join(this.environment.workingDirectory.directory, 'Vagrantfile')
    const content = fs.readFileSync(Vagrantfile)
    
    const settings = {
      hostname: this.environment.ignitefile.get('ignite.name'),
      box: this.environment.ignitefile.get('ignite.box'),
      ip: this.environment.ignitefile.get('ignite.ip', `192.168.10.33`),
    }

    fs.writeFileSync(Vagrantfile, this.renderTemplate(content, settings))
  }
}
