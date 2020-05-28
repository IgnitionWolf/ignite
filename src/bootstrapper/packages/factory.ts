import PhpPackage from './php'
import Package from './package'

const PackagesFactory = {
  php: PhpPackage,
} as {
  [key: string]: typeof Package;
}

export default PackagesFactory

