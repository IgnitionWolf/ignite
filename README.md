ignite
======



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

Ignite is a high-level utility tool to fire up local environments easily based on a configuration file.

This works thanks to [Vagrant](https://www.vagrantup.com/downloads.html) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or [VMWare](https://my.vmware.com/web/vmware/downloads). This means you will need to install these dependencies first before trying to run Ignite.

This is still in early stages, it is fully functional but more features like packages and site types are still being worked on. In the meanwhile, you're free to submit pull requests with more Ansible packages support and site types default configuration.

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Dependencies](#dependencies)
* [Sites](#sites)
* [Site Types](#site-types)
* [Tasks](#tasks)
* [Utilities](#utilities)

<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ignite
$ ignite init
initializing Ignitefile... initialized

# Here you will need to modify the Ignitefile per your needs.

$ ignite up
booting the machine... booted

$ ignite --help [COMMAND]
USAGE
  $ ignite COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ignite help [COMMAND]`](#ignite-help-command)

## `ignite help [COMMAND]`

display help for ignite

```
USAGE
  $ ignite help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

* [`ignite init [NAME]`](#ignite-init-command)

## `ignite init [NAME]`

create the Ignitefile

```
USAGE
  $ ignite init

ARGUMENTS
  NAME  (optional)  environment/machine name

OPTIONS
  --path  target path
  --help  more information about this command
```

* [`ignite up`](#ignite-up-command)

## `ignite up`

start the Vagrant machine

```
USAGE
  $ ignite up

OPTIONS
  --path  target path
  --verbose verbose output
  --help  more information about this command
```

* [`ignite destroy`](#ignite-destroy-command)

## `ignite destroy`

destroy the Vagrant machine

```
USAGE
  $ ignite destroy

OPTIONS
  --path  target path
  --force  destroy forcefully
  --verbose verbose output
  --help  more information about this command
```

* [`ignite ssh`](#ignite-ssh-command)

## `ignite ssh`

SSH in the Vagrant machine

```
USAGE
  $ ignite ssh

OPTIONS
  --path  target path
  --verbose verbose output
  --help  more information about this command
```

* [`ignite down`](#ignite-down-command)

## `ignite down`

power off the Vagrant machine

```
USAGE
  $ ignite down

OPTIONS
  --path  target path
  --verbose verbose output
  --help  more information about this command
```

* [`ignite suspend`](#ignite-suspend-command)

## `ignite suspend`

suspend the Vagrant machine

```
USAGE
  $ ignite suspend

OPTIONS
  --path  target path
  --verbose verbose output
  --help  more information about this command
```

* [`ignite status`](#ignite-status-command)

## `ignite status`

status of the Vagrant machine

```
USAGE
  $ ignite status

OPTIONS
  --path  target path
  --verbose verbose output
  --help  more information about this command
```

* [`ignite ssh-config`](#ignite-ssh-config-command)

## `ignite ssh-config`

get the SSH configuration of the Vagrant machine (useful to configure VSCode remote)

```
USAGE
  $ ignite ssh-config

OPTIONS
  --path  target path
  --verbose verbose output
  --help  more information about this command
```
<!-- commandsstop -->

# Dependencies
<!-- dependencies -->

A "dependency" is a configuration class that links the required dependency to an Ansible role. You can't directly install an Ansible role, it has to be supported by Ignite first. If you don't see a package listed here that you need, please write an issue or a pull request with the respective Ansible role. It's important to note that it must work in different linux distributions.

Supported Packages
* Apache Web Server `apache`
* PHP `php`
* Composer `composer`
* NodeJS `nodejs`
* Redis `redis`


```
dependencies:
  - name: php
    version: 7.4
    extensions:
      - gd

  - name: composer
  - name: apache
  - name: nodejs
```
<!-- dependenciesstop -->

# Sites
<!-- sites -->

You can load a site project files from a local path in your machine or from a git repository.

```
sites:
  - hostname: example.local
    public_folder: ./public
    git: https://github.com/user/repo.git

  - hostname: laravel.local
    type: laravel
    path: /path/to/my/site/files
```

You will need to add these hostnames to your `hosts` file with the machine IP found at the metadata section of the Ignitefile.
<!-- sitesstop -->

# Site Types
<!-- sitetypes -->

A "site type" is a set of necessary configuration/tasks that needs to be executed in order to prepare for a specific website structure. For example, this sets up the virtual hosts in the correct directory and assigns directory permissions.

Supported Site Types
* Laravel
<!-- sitetypesstop -->

# Tasks
<!-- tasks -->

You can run shell commands to do any extra provisioning work you may need in order to get your site working.

```
# Runs before installing dependencies
pre_tasks:
  path: /where/to/run/the/cmd
  inline: ls -l

# Runs after installing dependencies
tasks:
  path: /where/to/run/the/cmd
  inline: ls -l
```
<!-- tasksstop -->

# Utilities
<!-- utilities -->

You can install any extra software by adding it to this list.

```
utilities:
  - htop
  - curl
```
<!-- utilitiesstop -->

## Built With

* [Vagrant](https://www.vagrantup.com/) - Local Environment Provider
* [Ansible](https://github.com/ansible/ansible) - Provisioner


## Authors

* [Ignition Wolf](https://github.com/IgnitionWolf)

## License

* [MIT](http://opensource.org/licenses/MIT)

## Acknowledgments

* Ansible Community
* Vagrant Community
* [Jeff Geerling](https://github.com/geerlingguy) - awesome Ansible roles