import Package from '../../package'

export default class RemiRepositoryPackage extends Package {
  name = 'geerlingguy.repo-remi'

  conditional(): string {
    return "ansible_os_family == 'RedHat'"
  }
}
