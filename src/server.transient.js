module.exports = ( moduleName, on ) => {
	return {
		on: on( moduleName )
	};
};
