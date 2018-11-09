import Sequelize from 'sequelize';
import redis from 'redis';
import mongoose from 'mongoose';
import { development } from './config/debug/debug';

/*
 * @redis connection
 * create a redis client and connection is established
*/
const redisClient = redis.createClient({
	host: process.env.REDIS_SERVER_HOST,
	port: process.env.REDIS_SERVER_PORT,
	password: process.env.REDIS_SERVER_PASSWORD,
	db: process.env.REDIS_SERVER_DB,
});
const redisConnect = new Promise((resolve, reject) => {
	redisClient.on('error', (err) => {
		development(`Redis Connection Error due to ${err.message}`);
		reject(err.message);
		process.exit();
	});
	redisClient.on('connect', () => {
		development(`Connected to redis ${process.env.REDIS_SERVER_HOST}:///${process.env.REDIS_SERVER_PORT} 🚀`);
		resolve(redisClient);
	});
	redisClient.on('end', () => {
		development('Connection to redis ended');
	});
});

/*
 * @postgress connection
 * postgress connected with sequelize package
*/
const sequelize = new Sequelize(`${process.env.POSTGRES_SERVER_DB}`, `${process.env.POSTGRES_SERVER_USER}`, `${process.env.POSTGRES_SERVER_PASSWORD}`, {
	host: `${process.env.POSTGRES_SERVER_HOST}`,
	dialect: `${process.env.POSTGRES_DB_DIALECT}`,
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
	operatorsAliases: false,
});

const sequelizeConnect = new Promise((resolve, reject) => {
	sequelize
		.authenticate()
		.then(() => {
			development(`Connected to ${process.env.POSTGRES_SERVER_DB} postgress database successfully!!🚀`);
			resolve(sequelize);
		})
		.catch((err) => {
			development(`Unable to connect to the database: ${err.message}`);
			reject(err.message);
			process.exit();
		});
});

/*
 * @mongodb connection
 * Database connection for nosql database
*/
const mongoUrl = `mongodb://${process.env.MONGO_SERVER_HOST}:${process.env.MONGO_SERVER_PORT}/${process.env.MONGO_SERVER_DATABASE}`;
const mongooseConnect = mongoose.connect(mongoUrl, {
	autoReconnect: true, useNewUrlParser: true, useCreateIndex: true,
});
const mongodb = mongoose.connection;
const mongoConnect = new Promise((resolve, reject) => {
	mongodb.once('open', () => {
		development(`Connected to ${mongoUrl} nosql mongo database 🚀`);
		resolve(mongodb);
	});
	mongodb.on('error', (err) => {
		development(`error connection to mongodb database due to ${err.message}`);
		reject(err.message);
		process.exit();
	});
});

const resolveAllDbConnection = async () => {
	await mongoConnect;
	await sequelizeConnect;
	await redisConnect;
};

export {
	mongodb,
	sequelize,
	redisClient,
	mongooseConnect,
	resolveAllDbConnection,
};

export default resolveAllDbConnection();
