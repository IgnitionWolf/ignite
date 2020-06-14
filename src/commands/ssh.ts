import {Command, flags} from '@oclif/command'
import Environment from '../environment/environment'
import Igniter from '../engine/igniter'

export default class SSHCommand extends Command {
  static description = `SSH in the provisioned machine
  This will not load keys `

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'}),
    verbose: flags.boolean({char: 'v', description: 'verbose output'}),
  }

  async run() {
    const {flags} = this.parse(SSHCommand)
    const baseDir = flags.path || process.cwd()

    const igniter = new Igniter(new Environment(baseDir), flags.verbose || false)
    await igniter.ensureStatus()
    await igniter.provider.ssh()
  }
}
