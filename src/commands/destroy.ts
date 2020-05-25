import {Command, flags} from '@oclif/command'
import Environment from '../environment/environment'
import Igniter from '../engine/igniter'
import cli from 'cli-ux'

export default class SuspendCommand extends Command {
  static description = `Turn off an environment machine
  This will put the environment machine offline.`

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'}),
  }

  async run() {
    const {flags} = this.parse(SuspendCommand)
    const baseDir = flags.path || process.cwd()

    const answer: string = await cli.prompt('Are you sure you want to destroy this environment? The machine volume will not persist. (Y/n)')
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const igniter = new Igniter(new Environment(baseDir))
      igniter.destroy()
      this.log('The environment has been successfully destroyed.')
    }
  }
}
