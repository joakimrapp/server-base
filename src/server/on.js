module.exports = ( shutdown ) =>
	( moduleName ) => ( {
		shutdown: shutdown( moduleName )
	} );
