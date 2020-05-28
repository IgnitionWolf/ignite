# Local Environment Template

This template runs with Vagrant, provisioned with Ansible. This template is meant to be used with the Ignite utility tool, and can't be directly started with Vagrant. This will be cloned by Ignite and placed in a special directory, therefore you will find a lot of "variable placeholders" that will be replaced with the correct values when the environment is ignited up.

The project is written in such way to support multiple providers; Vagrant for now, not sure what other tool is around, and provisioners; Ansible for now, there are more possible candidates like Chef or Puppet.

## Getting Started

### Prerequisites

You must have Ansible and [Molecule](https://github.com/ansible-community/molecule) installed. You can find Ansible installation instructions [in their documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html), it's important to note that Ansible does not work on Windows, therefore if you want to develop and contribute in this template you must do it in any platform supported by Ansible.

In order to use Molecule you will need a Python virtual environment; I highly recommend [pipenv](https://github.com/pypa/pipenv), after you install it just follow these steps:

```
$ cd "repository-folder/environment/ansible"
$ pipenv install
$ pipenv shell
```

From now on you will need to execute `pipenv shell` in the `environment/ansible` directory whenever you want to use Molecule. After you've got this running, it will be necessary to install a few Ansible roles using [Ansible Galaxy](https://galaxy.ansible.com/).

```
$ ansible-galaxy install -r requirements.yml
```

## Running the tests

Tests will be ran by Molecule. Instructions TBD.

## Deployment

Any new roles or modifications must work flawlessly in different Linux distributions, such as Ubuntu/Debian and CentOS.

## Built With

* [Vagrant](https://www.vagrantup.com/) - Development Environment Provider
* [Ansible](https://github.com/ansible/ansible) - Provisioner
* [Molecule](https://github.com/ansible-community/molecule) - Ansible Roles Utility Tool


## Authors

* [Ignition Wolf](https://github.com/IgnitionWolf)

## License

TBD

## Acknowledgments

* Ansible Community
* Vagrant Community
* [Jeff Geerling](https://github.com/geerlingguy) - awesome Ansible roles