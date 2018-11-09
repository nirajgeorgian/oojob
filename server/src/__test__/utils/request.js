import { graphql } from 'graphql';
import { makeExecutableSchema } from 'apollo-server-express';
import { resolvers, typeDefs } from '../../graphql';

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});
const request = (source, contextValue, variableValues, rootValue = {}) => graphql({
	schema,
	source,
	rootValue,
	contextValue,
	variableValues,
});

export default request;
