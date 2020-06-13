import Package from '../../package'

export default class ApachePackage extends Package {
  name = 'geerlingguy.apache'

  configFilename = 'apache.yml'

  extensions = []

  get configuration(): object {
    return {
      apache_listen_port: 80,
      apache_vhosts: this.extensions ?? [],
      apache_remove_default_vhost: false,
      apache_packages_state: 'latest',
    }
  }
}
