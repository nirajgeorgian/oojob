import express from 'express';
import { ApolloEngine } from 'apollo-engine';
import GraphQLServer from './graphql.server';
import middlewares from './middlewares/index';
/* eslint-disable */
import resolveAllDbConnection from './db.connections';

/* eslint-enable */
const app = express();
middlewares(app);
/*
 * Mount a jwt or other authentication middleware that is run before the GraphQL execution
 * app.use('/graphql', auth)
 * graphql configuration
*/
GraphQLServer.applyMiddleware({
	app,
	path: '/graphql',
});
const GraphQLEngine = new ApolloEngine({
	apiKey: process.env.APOLLO_ENGINE_KEY,
	logging: {
		level: 'ERROR', // Engine Proxy logging level. DEBUG, INFO (default), WARN or ERROR.
	},
});

export {
	GraphQLEngine,
	GraphQLServer,
};
export default app;