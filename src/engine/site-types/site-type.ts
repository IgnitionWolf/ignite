import IgnitefileTask from '../../environment/ignitefile/task'

/**
 * Special site types, this is an optional feature.
 * This is useful to apply common tasks to common site types
 * such as NodeJS, Symfony, Laravel, etc...
 */
export default interface SiteType {
  /**
   * Tasks to perform before running the packages.
   */
  pre_tasks: Array<IgnitefileTask>;

  /**
   * Tasks to perform after running the packages.
   */
  post_tasks: Array<IgnitefileTask>;

  /**
   * Relative path to the public folder.
   */
  public_folder: string;
}
