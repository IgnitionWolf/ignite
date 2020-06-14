import {Command, flags} from '@oclif/command'
import Environment from '../environment/environment'
import Igniter from '../engine/igniter'

export default class DownCommand extends Command {
  static description = `Turn off an environment's machine
  This will put the environment's machine offline.`

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'}),
  }

  async run() {
    const {flags} = this.parse(DownCommand)
    const baseDir = flags.path || process.cwd()

    const igniter = new Igniter(new Environment(baseDir))
    await igniter.ensureStatus()
    await igniter.provider.down()
  }
}