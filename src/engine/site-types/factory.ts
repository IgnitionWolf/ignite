import SiteType from './site-type'
import LaravelSiteType from './laravel'
import {CLIError} from '@oclif/errors'

const SiteTypesFactory: any = {
  laravel: LaravelSiteType,
}

/**
 * Instantiate a site type.
 * @param {string} name site type name
 * @throws {CLIError} when SiteType is not found
 * @return {SiteType} -
 */
const getSiteTypeByName = (name: string): SiteType => {
  if (!SiteTypesFactory[name]) {
    throw new CLIError(`Trying to load unknown site type ${name} from the SiteTypesFactory.`)
  }

  return new SiteTypesFactory[name]()
}

export default getSiteTypeByName
