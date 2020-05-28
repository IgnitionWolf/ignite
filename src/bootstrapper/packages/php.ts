import Package from './package'

export default class PhpPackage extends Package {
  install = 'geerlingguy.php'

  configFilename = 'php.yml'

  packages = []

  get configuration(): object {
    return {
      php_memory_limit: '128M',
      php_max_execution_time: '90',
      php_upload_max_filesize: '256M',
      php_packages: this.packages || [],
    }
  }
}
