import {Command, flags} from '@oclif/command'
import Environment from '../environment/environment'
import Igniter from '../engine/igniter'

export default class SSHConfigCommand extends Command {
  static description = `Get the SSH config to access the machine
  You can use this to configure your IDE remote connection.`

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'}),
  }

  async run() {
    const {flags} = this.parse(SSHConfigCommand)
    const baseDir = flags.path || process.cwd()

    const igniter = new Igniter(new Environment(baseDir))
    await igniter.ensureStatus()
    this.log(await igniter.provider.sshConfig() as string)
  }
}
