#!/bin/bash

if type lsb_release >/dev/null 2>&1 ; then
   distro=$(lsb_release -i -s)
elif [ -e /etc/os-release ] ; then
   distro=$(awk -F= '$1 == "ID" {print $2}' /etc/os-release)
elif [ -e /etc/some-other-release-file ] ; then
   distro=$(ihavenfihowtohandleotherhypotheticalreleasefiles)
fi

# convert to lowercase
distro=$(printf '%s\n' "$distro" | LC_ALL=C tr '[:upper:]' '[:lower:]' | sed 's/\"//g')

# now do different things depending on distro
case $distro in
   debian*)  deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main; sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367; sudo apt update; sudo apt install ansible ;;
   centos*)  sudo yum install epel-release -y; sudo yum install ansible -y ;;
   ubuntu*)  sudo apt update; sudo apt install --yes software-properties-common; sudo apt-add-repository --yes --update ppa:ansible/ansible; sudo apt install --yes ansible ;;
   *)        echo "unknown distro: '$distro'" ; exit 1 ;;
esac
