# Local Environment Template

This template runs with Vagrant, provisioned with Ansible. This template is meant to be used with the Ignite utility tool, and can't be directly started with Vagrant. This will be cloned by Ignite and placed in a special directory, therefore you will find a lot of "variable placeholders" that will be replaced with the correct values when the environment is ignited up.

The project is written in such way to support multiple providers; Vagrant for now, not sure what other tool is around, and provisioners; Ansible for now, there are more possible candidates like Chef or Puppet.

## Deployment

Any new roles or modifications must work flawlessly in different Linux distributions, such as Ubuntu/Debian and CentOS.

## Built With

* [Vagrant](https://www.vagrantup.com/) - Development Environment Provider
* [Ansible](https://github.com/ansible/ansible) - Provisioner


## Authors

* [Ignition Wolf](https://github.com/IgnitionWolf)

## License

* [MIT](http://opensource.org/licenses/MIT)

## Acknowledgments

* Ansible Community
* Vagrant Community
* [Jeff Geerling](https://github.com/geerlingguy) - awesome Ansible roles