import WorkingDirectory from './working-directory';
import * as path from 'path'

export default class Vagrantfile {
  workingDirectory: WorkingDirectory

  constructor(workingDirectory: WorkingDirectory) {
    this.workingDirectory = workingDirectory
  }

  /**
   * Render the Vagrantfile.
   */
  render(): void {
    const filename = path.join(this.workingDirectory.directory, 'Vagrantfile')
    const content = fs.readFileSync(Vagrantfile).toString('UTF-8')

    // const syncFolders: Array<string> = this.sitesToSync.map((site: any) => {
    //   return `config.vm.synced_folder "${site.path}", "${site.dest}"`
    // })

    // const defaultIp = `192.168.${Math.floor(Math.random() * 254) + 1}.33`
    // const settings = {
    //   hostname: this.environment.name,
    //   box: this.environment.ignitefile.get('ignite.box', 'centos/7'),
    //   ip: this.environment.ignitefile.get('ignite.ip', defaultIp),
    //   sync_folders: syncFolders.join('\n') || '',
    // }

    // fs.writeFileSync(Vagrantfile, Bootstrapper.renderTemplate(content, settings))
  }

  static renderTemplate(content: string, variables: object) {
    if (!variables) return

    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }

    return content
  }
}
