import path from 'path';

/* eslint-disable */
const envConfig = async () => {
	const env = process.env.NODE_ENV;
	/*
	load appropiate .env file based on the NODE_ENV environemtn variable
	 */
	switch (env) {
	case 'development':
	case 'dev':
		process.stdout.write('Loaded development environment variable config/env/.env.dev 🚀\n');
		return require('dotenv').config({ path: path.resolve(process.cwd(), 'src/config/env/.env.dev') });
	case 'testing':
	case 'test':
		process.stdout.write('Loaded testing environment variable config/env/.env.test 🚀\n');
		return await require('dotenv').config({ path: path.resolve(process.cwd(), 'src/config/env/.env.test') });
	case 'production':
	case 'prod':
		process.stdout.write('Loaded production environment variable config/env/.env.prod 🚀\n');
		return require('dotenv').config({ path: path.resolve(process.cwd(), 'src/config/env/.env.prod') });
	default:
		process.stdout.write('Not Loaded any environment variable and switch to default config/env/.env.dev 🚀\n');
		return require('dotenv').config({ path: path.resolve(process.cwd(), 'src/config/env/.env.dev') });
	}
};

/* eslint-enable */
/*
Resolve the above promise before proceding to load appropiate environment
 */
// envConfig()

export default envConfig();