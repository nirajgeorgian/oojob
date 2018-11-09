import { promisify } from 'util';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import Sentry from '@sentry/node';
import { merge } from 'lodash';
import depthLimit from 'graphql-depth-limit';
import { redisClient } from './db.connections';
/*
 * import graphql schema
 */
import { RootSchema, RootQuery } from './resources/root';
import { CompanySchema, CompanyMutations } from './resources/company';
import { EmailSchema, EmailMutations } from './resources/email';
import { JobsSchema, JobsMutations } from './resources/jobs';
import { ProviderSchema } from './resources/provider';
import { SeekerSchema } from './resources/seeker';
import { UserSchema, UserQuery, UserMutations } from './resources/user';

export const resolvers = merge(
	{},
	/*
     * All Queries and Mutations merged together to form a Schema
     */
	// Mutations
	CompanyMutations,
	EmailMutations,
	JobsMutations,
	UserMutations,
	// Queries
	RootQuery,
	UserQuery,
);

/*
 * form a Schema by combining all the graphql files
 */
export const typeDefs = [
	RootSchema,
	CompanySchema,
	EmailSchema,
	JobsSchema,
	ProviderSchema,
	SeekerSchema,
	UserSchema,
];

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});
/*
 * Redis with promises
 */
const getAsync = promisify(redisClient.get).bind(redisClient);

const GraphQLServer = new ApolloServer({
	schema,
	formatError: (err) => {
		Sentry.captureException(err);
		return {
			message: err.message,
			code: err.extensions && err.extensions.code, // <--
			locations: err.locations,
			path: err.path ? err.path : 'path not defined',
			error: err,
		};
	},
	context: ({ req, res }) => ({
		req, res, redisClient, getAsync, user: req.user,
	}),
	playground: {
		settings: {
			'editor.theme': 'dark',
		},
	},
	maxFileSize: 25 * 1024 * 1024, // 25MB
	// enable playground and introspection in production
	introspection: true,
	tracing: true,
	cacheControl: true,
	engine: false,
	validationRules: [depthLimit(10)],
});

export default GraphQLServer;