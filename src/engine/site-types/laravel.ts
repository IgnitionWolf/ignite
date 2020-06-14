import SiteType from './site-type'
import IgnitefileTask from '../../environment/ignitefile/task'

export default class LaravelSiteType implements SiteType {
  pre_tasks: Array<IgnitefileTask> = []

  post_tasks: Array<IgnitefileTask> = [
    {
      path: '/path/to/site',
      inline: 'composer install',
    }, {
      path: '/path/to/site',
      inline: "sudo chown -R $USER:$(ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d ' ' -f1) storage && sudo chmod -R 775 storage",
    },
  ]

  public_folder = 'public'
}
