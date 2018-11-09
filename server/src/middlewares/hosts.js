import hostValidation from 'host-validation';

export default (app) => {
	// allowed hosts
	const hosts = [
		'http://localhost:8080/graphql',
		process.env.API_URL,
		/^(https?:\/\/)\w(:?[0-9]?)*/,
		/^(https?:\/\/)\w(:?[0-9]?)?\.\w/,
	];

	// allowed referer
	// Express.js middleware that protects Node.js servers from DNS
	// Rebinding attacks by validating Host and Referer [sic] headers from incoming requests.
	app.use(hostValidation({
		hosts,
	}));
};
