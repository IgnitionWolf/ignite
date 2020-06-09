import Package from './package'

export default class NodeJSPackage extends Package {
  install = 'geerlingguy.nodejs'

  configFilename = 'nodejs.yml'

  extensions: Array<string> = ['node-sass']

  version = '12.x'

  get configuration(): object {
    return {
      nodejs_version: this.version,
      nodejs_install_npm_user: 'root',
      npm_config_unsafe_perm: 'true',
      nodejs_npm_global_packages: this.extensions || [],
    }
  }
}
