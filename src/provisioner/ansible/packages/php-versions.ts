import Package from '../../package'

export default class PhpVersionsPackage extends Package {
  name = 'geerlingguy.php-versions'

  configFilename = 'php-versions.yml'

  get configuration(): object {
    return {
      php_version: this.version,
    }
  }
}
