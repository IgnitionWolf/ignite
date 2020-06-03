import Package from './package'

export default class ApachePackage extends Package {
  install = 'geerlingguy.apache'

  configFilename = 'apache.yml'

  packages = []

  get configuration(): object {
    return {
      apache_listen_port: 8080,
      apache_vhosts: [{servername: 'example.com', documentroot: '/var/www/vhosts/example_com'}],
    }
  }
}
