import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import { development, testing, production } from '../debug/debug';

const logDirectory = path.join(__dirname, 'log');

/* eslint-disable */
// Make sure folder exists or create one folder
const result = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// filename according to environment
const logFileName = process.env.NODE_ENV === 'production'
	? 'logs.log'
	: (process.env.NODE_ENV === 'development' ? 'dev.log' : 'test.log');

/* eslint-enable */
// Creating rotating log files which change after 1 day
const logStream = rfs((logFileName || 'dev.log'), {
	interval: '1d', // rotate per day
	path: logDirectory,
});

const logs = (app) => {
	const env = process.env.NODE_ENV;
	switch (env) {
	case 'development':
		development('Development logging start 🚀');
		app.use(morgan('dev', {
			skip(req, res) { return res.statusCode < 400; },
		}));
		app.use(morgan('short', {
			stream: logStream,
		}));
		break;
	case 'production':
		production('Production logging start 🚀');
		app.use(morgan('combined', { stream: logStream }));
		break;
	case 'testing':
		testing('Testing logging start 🚀');
		app.use(morgan('common', { stream: logStream }));
		break;
	default:
		development('Default logging start with development 🚀');
		app.use(morgan('dev', {
			skip(req, res) { return res.statusCode < 400; },
		}));
		app.use(morgan('common', {
			skip(req, res) { return res.statusCode < 400; },
			stream: logStream,
		}));
		break;
	}
};

export default logs;
