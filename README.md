# waker-cli
This is a command line tool to create and manage [**waker**](https://www.npmjs.com/package/waker) servers.

##Install
To install latest version of waker-cli, run following command:

`npm install -g waker-cli`

##Commands
List of waker-cli commands can be seen by running:

    waker --help

###init
The command is used to create new waker server.

usage

	waker init [options]
options

	-p --path <path>          server creation path
	-v --version <version>    version of waker to use

###run
The command is used to run waker server.

usage

	waker run [options]
options

	-b --background            run as background
	-e --environment <name>    environment to run server
	
###add
The command is used to create new modules/entities in waker server.

usage

	waker add <type> [options]
types

	module    waker module
	entity    system entity
options

	-n --name <name>      name of module or entity (required)
	-m --module <name>    name of module to add entity in (required if type is entity)
	
###enable
The command is used to enable plugins/helpers in waker server.

usage

	waker enable <type> [options]
types

	helper    waker helper
	plugin    waker integrated hapi plugin
options

	-n --name <name>    name of helper/plugin to enable (required)
	
###disable
The command is used to disable plugins/helpers in waker server.

usage

	waker disable <type> [options]
types

	helper    waker helper
	plugin    waker integrated hapi plugin
options

	-n --name <name>    name of helper/plugin to disable (required)
	
###config
The command is used to config plugins/helpers in waker server.

usage

	waker config <type> [options]
types

	helper    waker helper
	plugin    waker integrated hapi plugin
options

	-n --name <name>    name of helper/plugin to disable (required)
	
###show
The command is used to show info about waker server.

usage

	waker show <type> [options]
types

	version     version of waker of server
	status      list of plugins and helpers with their enable/disable status and version
	modules     list of waker modules and their dependencies
	entities    list of waker entities
options

	-m --module <name>    name of module to see its entities (acceptable if type is entities)
	
###test
The command is used to run tests

usage

	waker test [options]
options

	-m --module <name>    name of module to run its tests
	-t --type <type>      type of tests to run. Acceptable types are "unit" and "functional"