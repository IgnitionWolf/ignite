import WorkingDirectory from './working-directory/working-directory'
import {CLIError} from '@oclif/errors'
import Metafile from './metafile/metafile'
import Ignitefile from './ignitefile/ignitefile'
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
      this.ignitefile.load() // this is required

      this.workingDirectory = new WorkingDirectory(this)

      this.metafile = new Metafile(this.directory, this)
      this.metafile.load(true) // this can be created on the go

      this.load()
    }

    /**
     * Destroy the environment.
     */
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

      this.id = uuidv4()
      this.name = this.ignitefile.meta.name
      this.workingDirectory.create()
      this.metafile.path = this.workingDirectory.directory
      this.metafile.save()

      this.hadToSetup = true
    }

    /**
     * Load all the resources necessary to run the environment.
     */
    load(): void {
      if (this.isSetup()) {
        this.workingDirectory.load(this.metafile.path || '')
      }
    }

    /**
     * Determine if this environment is already set-up.
     * @return {boolean} -
     */
    isSetup(): boolean {
      return typeof this.metafile.path !== 'undefined'
    }

    /**
     * Getter and setters
     */

    get id() {
      return this.metafile.id
    }

    set id(value: any) {
      this.metafile.id = value
    }

    get name() {
      return this.metafile.name
    }

    set name(value: any) {
      this.metafile.name = value
    }
}
