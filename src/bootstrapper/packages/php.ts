import Package from './package'

export default class PhpPackage extends Package {
  install = 'geerlingguy.php'

  configFilename = 'php.yml'

  requires: Array<string> = ['remi-repo', 'php-versions']

  extensions: Array<string> = [
    'php-cli',
    'php-common',
    'php-json',
    'php-mbstring',
    'php-curl',
    'php-mysql',
    'php-xml',
    'php-zip',
    'php-openssl',
    'php-bcmath',
    'php-pdo',
  ]

  version = '7.4'

  get configuration(): object {
    return {
      php_version: this.version,
      php_packages_state: 'latest',
      php_install_recommends: 'no',

      php_memory_limit: '128M',
      php_max_execution_time: '90',
      php_upload_max_filesize: '256M',
      php_packages: this.extensions || [],
    }
  }
}
