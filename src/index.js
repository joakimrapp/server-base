const logEmitter = require( '@jrapp/log-emitter' );
const logWriterConsoleReadable = require( '@jrapp/log-writer-console-readable' );
module.exports = ( ...parts ) => {
	const path = require( 'path' );
	const absolutepath = path.resolve( ...parts );
	const package_json = require( path.resolve( absolutepath, 'package.json' ) );
	const configuration = require( path.resolve( absolutepath, 'configuration/default.json' ) );
	const { log: { writer: { levels = [ "*", "!<fatal", "!>debug" ] } = {} } = {} } = configuration;
	const logWriter = logWriterConsoleReadable( package_json.name, levels );
	const ioc = require( '@jrapp/ioc' )()
		.register.transient.log( logEmitter.log )
		.set.configuration( configuration )
		.set.logWriter( logWriter )
		.scan();
	ioc.catch( err => {
		logEmitter.log( 'server' ).fatal( 'startup failed', err );
		process.exit( 1 );
	} );
	return ioc;
};
