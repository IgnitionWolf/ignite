import Package from '../../package'

export default class ComposerPackage extends Package {
  install = 'geerlingguy.composer'

  get configuration(): object {
    return {}
  }
}
