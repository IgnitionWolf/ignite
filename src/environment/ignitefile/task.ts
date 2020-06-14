/**
 * Perform tasks before/after the boostrapping process,
 * a shell command or a bash file in your local path.
 *
 * Example:
 * ```
 *  tasks:
 *    - path: /path/to/dir
 *      inline: ls -l
 *      # or
 *      path: /path/to/bash/file
 * ```
 */
export default interface IgnitefileTask {
  /**
   * Path where to run the task.
   */
  path: string;

  /**
   * Inline shell command to run.
   * (optional)
   */
  inline?: string;

  /**
   * Path to the bash file to run.
   * (optional)
   */
  file?: string;

  /**
   * Extra arguments.
   * (optional)
   */
  args?: object;

  /**
   * For more advanced usages, you can use Ansible task power
   * by setting this to true, and use their syntax.
   * @see https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html
   */
  // ansible: boolean;
}
