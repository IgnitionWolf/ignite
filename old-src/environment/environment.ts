import WorkingDirectory from './working-directory'
import {CLIError} from '@oclif/errors'
import Metafile from './metafile'
import Ignitefile from './ignitefile'
import {v4 as uuidv4} from 'uuid'

export default class Environment {
    directory: string

    workingDirectory: WorkingDirectory

    metafile: Metafile

    ignitefile: Ignitefile

    hadToSetup = false

    constructor(directory: string) {
      this.directory = directory

      this.ignitefile = new Ignitefile(this.directory, this)
      this.ignitefile.load(false) // this is required

      this.workingDirectory = new WorkingDirectory(this)

      this.metafile = new Metafile(this.directory, this)
      this.metafile.load(true) // this can be created on the go

      this.load()
    }

    destroy(): void {
      this.metafile.destroy()
      this.workingDirectory.destroy()
    }

    /**
     * Initialize the environment.
     */
    create() {
      if (this.isSetup()) {
        return
      }

      if (!this.name) {
        this.name = this.ignitefile.get('ignite.name') || (require('random-words'))({exactly: 3, join: '-'})
      }

      this.id = uuidv4()
      this.workingDirectory.create()
      this.metafile.set('path', this.workingDirectory.directory)
      this.metafile.save()

      this.hadToSetup = true
    }

    /**
     * Load all the resources necessary to run the environment.
     */
    load(): void {
      if (this.isSetup()) {
        this.workingDirectory.load(this.metafile.get('path'))
      }
    }

    /**
     * Determine if this environment is already set-up.
     * @return {boolean} -
     */
    isSetup(): boolean {
      return this.metafile.get('path') !== null
    }

    /**
     * Getter and setters
     */

    get id() {
      return this.metafile.get('id')
    }

    set id(value: any) {
      this.metafile.set('id', value)
    }

    get name() {
      return this.metafile.get('name')
    }

    set name(value: any) {
      this.metafile.set('name', value)
    }
}