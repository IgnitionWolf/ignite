/**
 * You can list dependencies in the Ignitefile and the engine will
 * install them, you can find this under "dependencies".
 *
 * Example:
 * ```
 *  dependencies:
 *    - name: php
 *      version: 7.2
 *      extra:
 *        - php-mbstring
 * ```
 */
export default interface IgnitefileDependency {
  /**
   * The dependency name, it must be a supported package by Ignite.
   */
  name: string;

  /**
   * Load a specific version of the dependency.
   * (optional)
   */
  version?: string;

  /**
   * Extra related items, depending on the package this could be extensions.
   * (optional)
   */
  extra?: Array<string>;
}
