/* eslint-disable */
import env from './config/env/env'
/* eslint-enable */
import http from 'http';
import cluster from 'cluster';
import os from 'os';
/*
 * create server
 */
import app, { GraphQLEngine, GraphQLServer } from './server';
import { appRunningEnvironment, production, development } from './config/debug/debug';
import logs from './config/logs/logs';

/*
 * dynamically port configuration
 */
/* eslint-disable */
export const port = process.env.API_SERVER_PORT || 8080;
/* eslint-enable */
const numCPUs = os.cpus().length;

/*
 * Display the app running environemnt
 */
appRunningEnvironment();

/*
 * Start the log's for local references
 */
logs(app);

if (cluster.isMaster) {
	production(`Master ${process.pid} is running`);
	// Fork workers.
	for (let i = 0; i < numCPUs; i += 1) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		production(`worker ${worker.process.pid} died with signal ${signal}`);
	});
} else {
	const server = http.createServer(app);
	let currentApp = app;
	GraphQLEngine.on('error', (err) => {
		development('There was an error starting the server or Engine.');
		development(err);

		// The app failed to start, we probably want to kill the server
		process.exit(1);
	});
	GraphQLEngine.listen({ port, httpServer: server }, () => {
		development(`🚀 Server ready at http://localhost:${port}${GraphQLServer.graphqlPath}`);
	});
	development(`Worker ${process.pid} started`);
	development('🚀 All Database connected successfully');

	if (module.hot) {
		module.hot.accept('./server', () => {
			server.removeListener('request', currentApp);
			server.on('request', app);
			currentApp = app;
		});
	}
}