import Environment from '../environment/environment'
import Provisioner from './provisioner/provisioner'

export interface PlaybookInterface {
  hosts: string;
  roles: Array<string | object>;
  vars: object;
  pre_tasks: Array<object>;
  post_tasks: Array<object>;
}
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
