ignite
======



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ignitionwolf/ignite.svg)](https://npmjs.org/package/ignite)

Ignite is a high-level utility tool to fire up local environments easily based on a configuration file.

This works thanks to [Vagrant](https://www.vagrantup.com/downloads.html) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or [VMWare](https://my.vmware.com/web/vmware/downloads). This means you will need to install these dependencies first before trying to run Ignite.

This is still in early stages, it is fully functional but more features like packages and site types are still being worked on. In the meanwhile, you're free to submit pull requests with more Ansible packages support and site types default configuration.

## Install

```
npm install -g @ignitionwolf/ignite
```

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Dependencies](#dependencies)
* [Sites](#sites)
* [Site Types](#site-types)
* [Tasks](#tasks)
* [Runs before installing dependencies](#runs-before-installing-dependencies)
* [Runs after installing dependencies](#runs-after-installing-dependencies)
* [Utilities](#utilities)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @ignitionwolf/ignite
$ ignite COMMAND
running command...
$ ignite (-v|--version|version)
@ignitionwolf/ignite/1.0.1 linux-x64 node-v10.19.0
$ ignite --help [COMMAND]
USAGE
  $ ignite COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ignite destroy`](#ignite-destroy)
* [`ignite down`](#ignite-down)
* [`ignite help [COMMAND]`](#ignite-help-command)
* [`ignite init [NAME]`](#ignite-init-name)
* [`ignite ssh`](#ignite-ssh)
* [`ignite ssh-config`](#ignite-ssh-config)
* [`ignite status`](#ignite-status)
* [`ignite suspend`](#ignite-suspend)
* [`ignite up`](#ignite-up)

## `ignite destroy`

Turn off an environment machine

```
USAGE
  $ ignite destroy

OPTIONS
  -f, --force      proceed forcefully
  -p, --path=path  target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  This will put the environment machine offline.
```

_See code: [src/commands/destroy.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/destroy.ts)_

## `ignite down`

Turn off an environment's machine

```
USAGE
  $ ignite down

OPTIONS
  -p, --path=path  Target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  This will put the environment's machine offline.
```

_See code: [src/commands/down.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/down.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `ignite init [NAME]`

Initialize a Ignitefile configuration file

```
USAGE
  $ ignite init [NAME]

OPTIONS
  -p, --path=path  Target path (optional)

DESCRIPTION
  Modify this file to instruct Ignite on how to setup your desired environment.
```

_See code: [src/commands/init.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/init.ts)_

## `ignite ssh`

SSH in the provisioned machine

```
USAGE
  $ ignite ssh

OPTIONS
  -p, --path=path  Target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  This will not load keys
```

_See code: [src/commands/ssh.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/ssh.ts)_

## `ignite ssh-config`

Get the SSH config to access the machine

```
USAGE
  $ ignite ssh-config

OPTIONS
  -p, --path=path  Target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  You can use this to configure your IDE remote connection.
```

_See code: [src/commands/ssh-config.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/ssh-config.ts)_

## `ignite status`

Get the status of the environment machine.

```
USAGE
  $ ignite status

OPTIONS
  -p, --path=path  Target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  This will tell you if the machine is running, offline, or suspended.
```

_See code: [src/commands/status.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/status.ts)_

## `ignite suspend`

Turn off an environment machine

```
USAGE
  $ ignite suspend

OPTIONS
  -p, --path=path  Target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  This will put the environment machine offline.
```

_See code: [src/commands/suspend.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/suspend.ts)_

## `ignite up`

Ignite an environment based on Ignitefile

```
USAGE
  $ ignite up

OPTIONS
  -p, --path=path  Target path (optional)
  -v, --verbose    verbose output

DESCRIPTION
  This might take some time while the configuration is processed and the machine is ignited.
```

_See code: [src/commands/up.ts](https://github.com/IgnitionWolf/ignite/blob/v1.0.1/src/commands/up.ts)_
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
