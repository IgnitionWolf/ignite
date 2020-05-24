import {Command, flags} from '@oclif/command'
import Ignitefile from '../environment/ignitefile'

export default class InitCommand extends Command {
  static description = `Initialize a Ignitefile configuration file
  Modify this file to instruct Ignite on how to setup your desired environment.`

  static flags = {
    path: flags.string({char: 'p', description: 'Target path (optional)'}),
    deps: flags.string({char: 'd', description: 'Required dependencies (optional)'}),
  }

  static args = [{name: 'name'}]

  async run() {
    const {args, flags} = this.parse(InitCommand)
    const baseDir = flags.path || process.cwd()

    const ignitefile = new Ignitefile(baseDir)
    ignitefile.create()

    ignitefile.set('ignite.name', args.name ?? null)
    ignitefile.save()

    this.log(`The Ignitefile has been created at ${baseDir}.`)
    this.log("Once you've modified it, type 'ignite up' to get it running.")
  }
}
