export default class Package {
  /**
   * Package to install, in Ansible it's the role.
   * @var {string}
   */
  name!: string

  /**
   * List of extensions to install (optional)
   * @var {array}
   */
  extensions: Array<string | object> = []

  /**
   * Required dependencies (other packages)
   * @var {Array<string>}
   */
  requires: Array<string> = []

  /**
   * Configuration file name, in Asible it goes into the vars directory.
   * @var {string}
   */
  configFilename?: string

  /**
   * Package version (optional)
   * If this package is required by another class, and this is undefined,
   * then this will be inherited by the parent class.
   * @var {string}
   */
  version?: string

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
