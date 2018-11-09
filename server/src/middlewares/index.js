import compression from 'compression';
import bodyParser from 'body-parser';
import createGraphQLLogger from 'graphql-log';
import { resolvers } from '../graphql.server';
/*
middleware
*/
import toobusy from './toobussy';
import security from './security';
import ignoreRequest from './ignReq';
import cors from './cors';
import { verifyJwt } from './auth/jwt.auth';

const Sentry = require('@sentry/node');
/*
Sentry configuration for error tracking ...
 */
Sentry.init({
	dsn: 'https://1730b0d8433a4912a2a01807f48cf908@sentry.io/1278141',
	maxBreadcrumbs: 50,
	debug: true,
	environment: 'staging',
});


export default (app) => {
	// The request handler must be the first middleware on the app
	app.use(Sentry.Handlers.requestHandler());
	app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
	app.use(bodyParser.json()); // parse application/json
	app.set('trust proxy', true); // run it also behind proxy
	app.use(toobusy);
	security(app);
	ignoreRequest(app);
	cors(app);
	app.use(compression());
	app.use('/graphql', verifyJwt);
	/* create a graphql logger */
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
		const logExecutions = createGraphQLLogger({
			prefix: 'resolvers : ',
		});
		logExecutions(resolvers);
	}
	// The error handler must be before any other error middleware
	app.use(Sentry.Handlers.errorHandler());
	app.use((err, req, res, next) => {
		if (err.name === 'UnauthorizedError') {
			Sentry.captureException(err);
			next(err);
		}
		next();
	});
};