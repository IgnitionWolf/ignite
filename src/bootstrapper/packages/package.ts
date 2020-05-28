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
  configFilename!: string

  /**
   * Get the package's configuration.
   * @return {object} configuration/variables
   */
  get configuration(): object {
    return {}
  }
}
