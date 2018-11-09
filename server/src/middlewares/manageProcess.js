import { port } from '../index';

/*
	Nodejs process handling as per the status code
	0 => Process exit
	11 => Database Connection
	22 => Server Connection
*/
/* Uncaught Error handling */
process.on('uncaughtException', async (err) => {
	if (err.code === 'EADDRINUSE') {
		await process.stderr.write(`Caught PORT conflict exception: ${err}\n`);
		await process.stderr.write(`Please choose another port or switch off the :${port} port\n`);
		await process.exit(1);
	} else {
		await process.stderr.write(`Caught exception: ${err.message}\n`);
	}
});

process.on('unhandledRejection', async (err) => {
	await process.stderr.write(`Caught exception: ${err.message}\n`);
});

process.on('exit', (code) => {
	switch (code) {
	case 1:
		process.stderr.write(`About to exit with code: ${code} => Server Connection Error\n`);
		return process.exit(0);
	default:
		process.stderr.write(`About to exit with code: ${code} => Unhandled Error : By Raven\n`);
		return process.exit(0);
	}
});
