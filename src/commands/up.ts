import {Command, flags} from '@oclif/command'
import Environment from '../environment/environment'
import Igniter from '../engine/igniter'

export default class UpCommand extends Command {
  static description = `Ignite an environment based on Ignitefile
  This might take some time while the configuration is processed and the machine is ignited.`

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'}),
  }

  async run() {
    const {flags} = this.parse(UpCommand)
    const baseDir = flags.path || process.cwd()

    const igniter = new Igniter(new Environment(baseDir))
    igniter.ignite()
  }
}
