/**
 * This contains the meta data of the environment/virtual machine.
 */
export default interface IgnitefileMeta {
  /**
   * The name of the environment.
   */
  name?: string;

  /**
   * The box that will be used in the machine.
   * Any Vagrant box is supported, default is `centos/7`.
   * (optional)
   */
  box?: string;

  /**
   * The IP to access this local environment.
   * If not specified, one will be generated automatically.
   * (optional)
   */
  ip?: string;
}
