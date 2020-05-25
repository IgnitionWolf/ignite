import Environment from '../environment/environment'

export default abstract class Bootstrapper {
  environment: Environment

  constructor(environment: Environment) {
    this.environment = environment
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
