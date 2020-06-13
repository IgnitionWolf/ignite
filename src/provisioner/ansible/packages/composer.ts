import Package from '../../package'

export default class ComposerPackage extends Package {
  name = 'geerlingguy.composer'

  get configuration(): object {
    return {}
  }
}
