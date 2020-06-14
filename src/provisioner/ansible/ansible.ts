import Provisioner from '../provisioner'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import * as path from 'path'
import * as _ from 'lodash'
import {CLIError} from '@oclif/errors'
import IgnitefileTask from '../../environment/ignitefile/task'
import {AnsiblePlaybook} from './playbook'
import VagrantProvider from '../../engine/vagrant'
import IgnitefileDependency from '../../environment/ignitefile/dependency'
import AnsibleGalaxy from './galaxy'
import IgnitefileSite from '../../environment/ignitefile/site'
import Package from '../package'
import getSiteTypeByName from '../../engine/site-types/factory'

export default class AnsibleProvisioner extends Provisioner {
  playbook: AnsiblePlaybook;

  galaxy: AnsibleGalaxy;

  constructor(provider: VagrantProvider) {
    super(provider)
    this.directory = path.join(this.workingDirectory.directory, 'ansible')
    this.playbook = new AnsiblePlaybook(this)
    this.galaxy = new AnsibleGalaxy(this)
  }

  registerSites(sites: Array<IgnitefileSite>): void {
    sites.forEach((site: IgnitefileSite) => {
      const destination = this.getSiteDestination(site)
      let task: object = {
        name: `Installing site: ${site.hostname}`,
      }

      if (site?.git) {
        task = {
          ...task,
          git: {
            repo: site.git,
            dest: destination,
            update: 'no',
            accept_hostkey: 'yes',
          },
        }
      } else if (site?.path) {
        if (!fs.existsSync(site.path)) {
          throw new CLIError(`The site path ${site.path} does not exist.`)
        }

        const directory = `/vagrant/sites/${path.basename(site.path)}`
        const vagrantfile = this.provider.environment.workingDirectory.vagrantfile
        vagrantfile.syncFolders.push({path: site.path, dest: directory})

        task = {
          ...task,
          command: `cp -rf ${directory} ${destination}`,
        }
      }

      this.playbook.post_tasks.unshift(task, {
        shell: `sudo chown vagrant:vagrant -R ${destination}`,
        become: 'yes',
      })

      // Check some site type related tasks
      if (site?.type) {
        // We'll need to assign the destination path to the tasks
        // as this is generated on the runtime
        const siteType = getSiteTypeByName(site.type)
        siteType.post_tasks = siteType.post_tasks.map((task: IgnitefileTask) => {
          task.path = destination
          return task
        })

        siteType.pre_tasks = siteType.pre_tasks.map((task: IgnitefileTask) => {
          task.path = destination
          return task
        })

        this.registerTasks(siteType.pre_tasks, 'before')
        this.registerTasks(siteType.post_tasks, 'after')

        if (!site?.public_folder) {
          site.public_folder = siteType.public_folder
        }
      }
    })
  }

  registerDependencies(dependencies: Array<IgnitefileDependency | Package>): void {
    dependencies.forEach((dependency: IgnitefileDependency | Package) => {
      let pkg
      if (dependency instanceof Package) {
        pkg = dependency
      } else pkg = this.convertPackage(dependency)

      // Update the requirements.yml file
      this.galaxy.add(pkg.name)

      if (dependency.name === 'apache') {
        this.handleApache(pkg)
      }

      // Create the configuration file
      if (pkg.configFilename) {
        const configurationFile = path.join(this.directory, 'vars', pkg.configFilename)
        fs.ensureFileSync(configurationFile)
        fs.writeFileSync(configurationFile, YAML.stringify(pkg.configuration))
      }

      /**
       * Update the playbook file to add the new role.
       */
      const role: any = {
        role: pkg.name,
      }

      if (pkg.conditional()) {
        role.when = pkg.conditional()
      }

      if (pkg.configFilename) {
        this.playbook.vars_files.push(path.join('vars', pkg.configFilename))
      }

      this.playbook.roles.push(role)
    })
  }

  registerTasks(tasks: Array<IgnitefileTask>, where?: string): void {
    where = where || 'after'
    tasks.forEach((task: IgnitefileTask) => {
      if (task?.inline) {
        // Apply some rules here..
        let extra = {}
        if (task.inline.indexOf('composer') !== -1) {
          task.inline = task.inline.replace('composer', '/usr/local/bin/composer')
          extra = {become: 'no'}
        }

        const ansibleTask = _.merge({
          name: `Execute task: ${task.inline}`,
          shell: task.inline,
          args: {...task?.args, chdir: task.path},
        }, extra)

        if (where === 'after') this.playbook.post_tasks.push(ansibleTask)
        else this.playbook.pre_tasks.push(ansibleTask)
      } else if (task?.file) {
        const ansibleTask = {
          name: `Execute task: ${task.inline}`,
          shell: task.inline,
          args: {...task?.args, chdir: task.path},
        }

        if (where === 'after') this.playbook.post_tasks.push(ansibleTask)
        else this.playbook.pre_tasks.push(ansibleTask)
      } else throw new CLIError(`The task with path ${task.path} needs either inline, or file attribute.`)
    })
  }

  registerUtilities(utilities: Array<string>): void {
    const task = ({
      name: 'Install miscellaneous dependencies',
      package: {
        name: '{{ item }}',
        state: 'present',
      },
      with_list: utilities.concat(['git', 'curl', 'vim', 'nano']),
    })

    this.playbook.pre_tasks.push(task)
  }

  save() {
    this.playbook.save()
    this.galaxy.save()
  }

  /**
   * We need to add the virtual host in the Package extensions.
   * This is a workaround..
   * TODO: Fix a flexible way to handle this, for future packages.
   * @param {Package} pkg apache package
   */
  private handleApache(pkg: Package): void {
    const sites = this.provider.environment.ignitefile.sites
    pkg.extensions = sites.map((site: IgnitefileSite) => {
      const conf = {
        documentroot: path.join(this.getSiteDestination(site), site.public_folder || ''),
        servername: `www.${site.hostname}`,
        serveralias: site.hostname,
      }

      if (site.hostname.indexOf('www.') !== -1) {
        conf.servername = site.hostname
        conf.serveralias = site.hostname.replace('www.', '')
      }

      return conf
    })
  }

  private getSiteDestination(site: IgnitefileSite): string {
    return `/var/www/${site.hostname}`
  }
}
