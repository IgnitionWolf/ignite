import Package from './package'

export default class ApachePackage extends Package {
  install = 'geerlingguy.apache'

  configFilename = 'apache.yml'

  extensions = []

  get configuration(): object {
    return {
      apache_listen_port: 8080,
      apache_vhosts: this.extensions ?? [],
    }
  }
}
