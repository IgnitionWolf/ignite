import PhpPackage from './php'
import {CLIError} from '@oclif/errors'
import ApachePackage from './apache'
import PhpVersionsPackage from './php-versions'
import RemiRepositoryPackage from './repo-remi'
import NodeJSPackage from './nodejs'
import ComposerPackage from './composer'
import Package from '../../package'
import EpelRepositoryPackage from './repo-epel'
import RedisPackage from './redis'

const PackagesFactory = {
  php: PhpPackage,
  apache: ApachePackage,
  'php-versions': PhpVersionsPackage,
  'remi-repo': RemiRepositoryPackage,
  'epel-repo': EpelRepositoryPackage,
  nodejs: NodeJSPackage,
  composer: ComposerPackage,
  redis: RedisPackage,
} as {
  [key: string]: typeof Package;
}

const getPackageByName = (name: string): Package => {
  if (!PackagesFactory[name]) {
    throw new CLIError(`Trying to load unknown package ${name} from the PackagesFactory.`)
  }

  return new PackagesFactory[name]()
}

export default getPackageByName

