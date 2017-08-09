module.exports = ( log ) => {
	const listeners = [];
	let invoked = false;
	const shutdown = ( listeners ) => log.info( 'emitting shutdown to', `${listeners.length} components` )
		.timer( Promise.all( listeners.map( ( { moduleName, listener } ) =>
			log.info( 'emitting shutdown to', moduleName )
				.timer( Promise.resolve().then( listener ) )
				.info( 'shutdown listener finished', moduleName ).promise ) ) )
		.info( 'finished graceful shutdown', () => ( setImmediate( () => process.exit() ), 'exiting...' ) ).promise;
	process.once( 'SIGTERM', () => log.warning( 'SIGTERM emitted' ).return( shutdown( listeners.splice( 0, listeners.length ) ) ) );
	process.once( 'SIGINT', () => log.warning( 'SIGINT emitted' ).return( shutdown( listeners.splice( 0, listeners.length ) ) ) );
	return ( moduleName ) => ( listener ) =>
		listeners.push( { moduleName, listener } );
};
