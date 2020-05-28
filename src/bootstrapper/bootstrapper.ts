import Environment from '../environment/environment'
import Provisioner from './provisioner/provisioner'

export default abstract class Bootstrapper {
  environment: Environment

  provisioner: Provisioner

  constructor(environment: Environment, provisioner: Provisioner) {
    this.environment = environment
    this.provisioner = provisioner
  }

  abstract bootstrap(): void;

  renderTemplate(content: string, variables: object) {
    if (!variables) return

    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(`{{${key}}}`, value)
    }

    return content
  }
}
