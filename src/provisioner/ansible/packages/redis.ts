import Package from '../../package'

export default class RedisPackage extends Package {
  name = 'geerlingguy.redis'

  configFilename = 'redis.yml'

  requires: Array<string> = ['epel-repo']

  get configuration(): object {
    return {
      redis_enablerepo: 'epel',
    }
  }
}
