import WorkingDirectory from './working-directory'
import * as fs from 'fs-extra'
import * as path from 'path'

export default class Vagrantfile {
  workingDirectory: WorkingDirectory

  syncFolders: Array<{path: string; dest: string}> = [];

  constructor(workingDirectory: WorkingDirectory) {
    this.workingDirectory = workingDirectory
  }

  /**
   * Render the Vagrantfile.
   */
  save(): void {
    const filename = path.join(this.workingDirectory.directory, 'Vagrantfile')
    const content = fs.readFileSync(filename).toString('UTF-8')
    const ignitefile = this.workingDirectory.environment.ignitefile

    const syncFolders: Array<string> = this.syncFolders.map((site: any) => {
      return `config.vm.synced_folder "${site.path}", "${site.dest}"`
    })

    const settings = {
      hostname: ignitefile.meta.name,
      box: ignitefile.meta.box,
      ip: ignitefile.meta.ip,
      sync_folders: syncFolders.join('\n') || '',
    }

    fs.writeFileSync(filename, Vagrantfile.renderTemplate(content, settings))
  }

  /**
   * Helper function to render the Vagrantfile template.
   * @param {string} content Template
   * @param {object} variables Variables to replace
   * @return {string} formatted Vagrantfile
   */
  static renderTemplate(content: string, variables: object): string {
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }

    return content
  }
}
