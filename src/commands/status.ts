import {Command, flags} from '@oclif/command'
import Environment from '../environment/environment'
import Igniter from '../engine/igniter'

export default class StatusCommand extends Command {
  static description = `Get the status of the environment machine.
  This will tell you if the machine is running, offline, or suspended.`

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'})
  }

  async run() {
    const {flags} = this.parse(StatusCommand)
    const baseDir = flags.path || process.cwd()

    const igniter = new Igniter(new Environment(baseDir))
    this.log(`Current machine status: ${igniter.vagrant.status()}`)
  }
}
