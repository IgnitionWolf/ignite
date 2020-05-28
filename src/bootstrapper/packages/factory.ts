import PhpPackage from './php'
import Package from './package'
import {CLIError} from '@oclif/errors'

const PackagesFactory = {
  php: PhpPackage,
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

