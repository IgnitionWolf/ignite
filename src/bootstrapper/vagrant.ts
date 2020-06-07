import {IgnitefilePackage, IgnitefileSite} from '../environment/ignitefile'
import getPackageByName from './packages/factory'
import Bootstrapper, { PlaybookInterface } from './bootstrapper'
import {CLIError} from '@oclif/errors'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as YAML from 'yaml'

export default class VagrantBootstrap extends Bootstrapper  {
  sites: Array<IgnitefileSite> = []

  sitesToSync: Array<object> = []

  bootstrap(): void {
    /**
     * Handle sites
     */
    this.sites = this.environment.ignitefile.get('sites', [])

    /**
     * Handle the provisioner
     */
    const packages = this.environment.ignitefile.get('requires', [])
    if (packages.length > 0) {
      packages.forEach((element: IgnitefilePackage) => {
        this.loadPackage(element)
      })
    }

    /**
     * Handle the common role.
     */
    this.handleCommon()

    /**
     * Install necessary plugins
     */
    // const plugins = ['vagrant-vbguest']
    // this.provisioner.provider.installPlugin(plugins)

    /**
     * Process the Vagrantfile
     */
    const Vagrantfile = path.join(this.environment.workingDirectory.directory, 'Vagrantfile')
    const content = fs.readFileSync(Vagrantfile).toString('UTF-8')

    const syncFolders: Array<string> = this.sitesToSync.map((site: any) => {
      return `config.vm.synced_folder "${site.path}", "${site.dest}"`
    })

    const defaultIp = `192.168.${Math.floor(Math.random() * 254) + 1}.33`
    const settings = {
      hostname: this.environment.name,
      box: this.environment.ignitefile.get('ignite.box', 'centos/7'),
      ip: this.environment.ignitefile.get('ignite.ip', defaultIp),
      sync_folders: syncFolders.join('\n') || '',
    }

    fs.writeFileSync(Vagrantfile, Bootstrapper.renderTemplate(content, settings))
  }

  handleCommon(): void {
    const pre_tasks: Array<object> = []
    const post_tasks: Array<object> = []

    /**
     * Install common dependencies
     */
    const utilities = this.environment.ignitefile.get('utilities', []).concat(['git', 'curl', 'vim', 'nano'])
    pre_tasks.push({
      name: 'Install miscellaneous dependencies',
      package: {
        name: '{{ item }}',
        state: 'present',
      },
      with_list: utilities,
    })

    /**
     * Install sites
     */
    this.sites.forEach((site: IgnitefileSite) => {
      let task: object = {
        name: `Installing site: ${site.host}`,
      }

      if (site?.git) {
        task = {
          ...task,
          git: {
            repo: site.git,
            dest: site.dest,
            update: 'no',
            accept_hostkey: 'yes',
          },
        }
      }

      if (site?.path) {
        if (!fs.existsSync(site.path)) {
          throw new CLIError(`The site path ${site.path} does not exist.`)
        }

        const directory = `/vagrant/sites/${path.basename(site.path)}`

        this.sitesToSync.push({
          path: site.path,
          dest: directory,
        })

        task = {
          ...task,
          command: `cp -rf ${directory} ${site.dest}`,
        }
      }

      post_tasks.push(task)
    })

    /**
     * Add tasks to playbook as pre_tasks
     * Add sites to playbook as post_tasks
     */
    const playbookFile = path.join(this.environment.workingDirectory.directory, 'ansible', 'playbook.yml')
    fs.ensureFileSync(playbookFile)

    const playbook = YAML.parse(fs.readFileSync(playbookFile).toString('UTF-8')) || {}

    playbook.forEach((element: PlaybookInterface) => {
      if (element.hosts === 'server') {
        element.pre_tasks = pre_tasks
        element.post_tasks = post_tasks
      }
    })

    fs.writeFileSync(playbookFile, YAML.stringify(playbook))
  }

  /**
   * Perform the necessary steps to load the package data.
   * @param {IgnitefilePackage} element package from ignitefile to load
   */
  loadPackage(element: IgnitefilePackage): void {
    const pkg = getPackageByName(element.name)
    if (element?.extensions) {
      pkg.extensions.concat(element.extensions)
    }

    if (element?.version) {
      pkg.version = element.version
    }

    if (pkg.requires.length > 0) {
      // The 'requiredPackage' is a Package class prototype
      pkg.requires.forEach((requiredPackage: any) => {
        requiredPackage = getPackageByName(requiredPackage)
        if (!requiredPackage.version) {
          requiredPackage.version = pkg.version
        }
        this.provisioner.registerPackage(Object.create(requiredPackage))
      })
    }

    if (element.name === 'apache') {
      pkg.extensions = this.sites.map((site: IgnitefileSite) => {
        return {servername: site.dest, documentroot: site.host}
      })
    }

    this.provisioner.registerPackage(pkg)
  }
}
