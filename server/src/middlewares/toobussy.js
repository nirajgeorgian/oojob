import toobusy from 'toobusy-js';

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';

export default (req, res, next) => {
	if (!isDevelopment && toobusy()) {
		// only show status in production and not in development
		res.statusCode = 503;
		res.send('It looke like ooJob is bussy. Wait few seconds...');
	} else {
		// queue up the request and wait for it to complete in testing and development phase
		next();
	}
};
