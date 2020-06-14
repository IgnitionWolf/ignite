/**
 * This specifies which sites should be set-up and where
 * to load the code from, git or local files.
 */
export default interface IgnitefileSite {
  /**
   * Virtual hostname to access the site (e.g, example.local)
   */
  hostname: string;

  /**
   * Load the site from a git repository, it should be done
   * via an SSH url with your loaded key.
   * (optional)
   */
  git?: string;

  /**
   * Load the site from local files in your machine.
   * (optional)
   */
  path?: string;

  /**
   * Relative path to the public folder in the project directory.
   * This will be used in the virtual host, default is `/`.
   * (optional)
   */
  public_folder?: string;

  /**
   * The type of applications supported for a special setup.
   * This grants file permissions and setup virtual hosts accordingly.
   * (optional)
   */
  type?: 'nodejs'|'symfony'|'laravel';
}
