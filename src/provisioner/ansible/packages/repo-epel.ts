import Package from '../../package'

export default class EpelRepositoryPackage extends Package {
  name = 'geerlingguy.repo-epel'

  conditional(): string {
    return "ansible_os_family == 'RedHat'"
  }
}
