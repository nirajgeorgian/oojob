import debug from 'debug';

export const development = debug('development');
export const testing = debug('testing');
export const production = debug('production');
export const staging = debug('staging');
export const feature = debug('feature');
export const bug = debug('bug');

export const appRunningEnvironment = () => {
	/*
		Tell us in which mode we are currently executing ..
	 */
	development('Running in development mode 🚀');
	testing('Running in testing mode 🚀');
	staging('Running in staging mode 🚀');
	feature('Running in fearure mode 🚀');
	bug('Running in bug fix mode 🚀');
	production('Running in production mode 🚀');
};
