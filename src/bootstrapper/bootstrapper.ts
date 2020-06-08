import Environment from '../environment/environment'
import Provisioner from './provisioner/provisioner'

export interface PlaybookInterface {
  hosts: string;
  roles: Array<string | object>;
  vars_files: object;
  pre_tasks: Array<object>;
  post_tasks: Array<object>;
}

/**
 * TO-DO: The whole bootstrap process must be written again.
 * Store all the files data in memory and write them as last step.
 * This way we can add some flexibility to the whole bootstrapping
 * process and prevent excessive file IOs
 */
export default abstract class Bootstrapper {
  environment: Environment

  provisioner: Provisioner

  constructor(environment: Environment, provisioner: Provisioner) {
    this.environment = environment
    this.provisioner = provisioner
  }

  abstract bootstrap(): void;

  static renderTemplate(content: string, variables: object) {
    if (!variables) return

    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }

    return content
  }
}
