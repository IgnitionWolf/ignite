import Package from '../../package'

export default class RemiRepositoryPackage extends Package {
  install = 'geerlingguy.repo-remi'

  conditional(): string {
    return "ansible_os_family == 'RedHat'"
  }
}
