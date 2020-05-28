import Provisioner from './provisioner'
import * as fs from 'fs-extra'
import * as YAML from 'yaml'
import Package from '../packages/package'
import * as path from 'path'

export default class AnsibleProvisioner extends Provisioner {
  registerPackage(pkg: Package): void {
    const requirementsFile = 'requirements.yml'
    fs.ensureFileSync(requirementsFile)

    const requirements = YAML.parse(fs.readFileSync(requirementsFile).toString('UTF-8')) || []
    requirements.push(pkg.install)

    const configurationFile = path.join('', pkg.configFilename)
    fs.ensureFileSync(configurationFile)
    fs.writeFileSync(configurationFile, YAML.stringify(pkg.configuration))
  }
}
