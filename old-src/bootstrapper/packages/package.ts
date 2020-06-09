export default class Package {
  /**
   * Package to install, in Ansible it's the role.
   * @var {string}
   */
  install!: string

  /**
   * Configuration file name, in Asible it goes into the vars directory.
   * @var {string}
   */
  configFilename?: string

  /**
   * List of extensions to install (optional)
   * @var {array}
   */
  extensions: Array<string | object> = []

  /**
   * Package version (optional)
   * If this package is required by another class, and this is undefined,
   * then this will be inherited by the parent class.
   * @var {string}
   */
  version?: string

  /**
   * Required dependencies (other packages)
   * @var {Array<string>}
   */
  requires: Array<string> = []

  /**
   * Conditional check before installing the package.
   * @return {string} condition
   */
  conditional(): string {
    return ''
  }

  /**
   * Get the package's configuration.
   * @return {object} configuration/variables
   */
  get configuration(): object {
    return {}
  }
}
