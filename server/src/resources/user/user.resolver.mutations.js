import redis from 'redis';
import { AuthenticationError } from 'apollo-server-express';
import UserModel from './user.model';
import { UserResult } from '../../utils/result/user.result';
import { TokenResult } from '../../utils/result/token.result';
import { generateJwtToken } from '../../middlewares/auth/jwt.auth';
import { generateToken } from '../../utils/tokenGenerate';
import { development } from '../../config/debug/debug';
import {
	validateName, validateEmail, validatePassword, validateUsername,
} from '../../utils/validate/validate';


/*
 * @params Required { email, username, password }
 * @return UserResult
 * Mutation to create single user
 */
const signup = async (_, { input }, { user }) => {
	development('signup');
	// if user is logged in throw him error
	if (user && user.id) {
		return new UserResult(false, 'You must not be logged in');
	}
	/*
	 * validate the input
	 */
	const email = (input && input.email) ? input.email : '';
	const username = (input && input.username) ? input.username : '';
	if (email === '' && username === '') {
		return new TokenResult(false, 'Please pass email or username');
	}
	if (input && input.email) {
		if (!validateEmail(input.email)) {
			return new UserResult(false, 'Wrong email address format');
		}
	}
	if (input && input.firstname && input.lastname) {
		if ((!validateName(input.firstname)) || (!validateName(input.lastname))) {
			return new UserResult(false, 'Wrong name format');
		}
	}
	if (input && input.username) {
		if (!validateUsername(input.username)) {
			return new UserResult(false, 'Wrong username format');
		}
	}
	if (input && input.password) {
		if (!validatePassword(input.password)) {
			return new UserResult(false, 'Wrong password format');
		}
	}
	/*
	 * check for old user
	 */
	const oldUser = await UserModel.findOne({ $or: [{ email }, { username }] });
	if (oldUser) {
		return new UserResult(false, 'User already exists');
	}
	/*
	 * create new user
	 */
	const newUser = new UserModel(input);
	newUser.hashPassword();
	const savedUser = await newUser.save();
	return new UserResult(true, 'successfully created user', savedUser);
};


/*
 * @params { username, password }
 * @return { success, message }
 * Mutation to login user
 */
const login = async (_, { input }) => {
	development('login');
	/*
	 * validate input before hitting the backend
	 */
	const email = (input && input.email) ? input.email : '';
	const username = (input && input.username) ? input.username : '';
	if (email === '' && username === '') {
		return new TokenResult(false, 'Please pass email or username');
	}
	if (input && input.username) {
		if (!validateUsername(input.username)) {
			return new UserResult(false, 'Wrong username format');
		}
	}
	if (input && input.email) {
		if (!validateEmail(input.email)) {
			return new UserResult(false, 'Wrong email format');
		}
	}
	if (input && input.password) {
		if (!validatePassword(input.password)) {
			return new UserResult(false, 'Wrong password format');
		}
	}
	// before hitting the server try to validate for email address
	const user = await UserModel.findOne({ $or: [{ email }, { username }] });
	if (!user) {
		return new UserResult(false, 'No user exist with this username or email address');
	}
	const verified = user.verifyPassword(input.password);
	if (!verified) {
		return new UserResult(false, 'Wrong password');
	}
	const payload = { id: user.id, account_type: user.account.account_type };
	const token = `Bearer ${generateJwtToken(payload)}`;
	return new UserResult(true, token);
};


/*
 * @params { email, username }
 * @return { success, message }
 * Mutation to create password reset token
 */
const passwordToken = async (_, { input }, { redisClient }) => {
	development('passwordToken');
	/*
	 * store the user related data
	 */
	const email = (input && input.email) ? input.email : '';
	const username = (input && input.username) ? input.username : '';
	if (email === '' && username === '') {
		return new TokenResult(false, 'Please pass email or username');
	}
	/*
	 * validate input before hitting the backend
	 */
	if (input && input.username) {
		if (!validateUsername(input.username)) {
			return new TokenResult(false, 'Wrong username format');
		}
	}
	if (input && input.email) {
		if (!validateEmail(input.email)) {
			return new TokenResult(false, 'Wrong email format');
		}
	}
	/*
	 * Validate weather email was passed or email
	 */
	const user = await UserModel.findOne({ $or: [{ email }, { username }] });
	if (!user) {
		if (email !== '') {
			return new TokenResult(false, `no user exist for this ${email}`);
		}
		if (username !== '') {
			return new TokenResult(false, `no user exist for this ${username}`);
		}
	}
	const token = generateToken(50);
	/*
	 * Set the token with redis client appropiately
	 */
	if (email !== '') {
		redisClient.set(`${email}-password-reset`, token, redis.print);
	}
	if (username !== '') {
		redisClient.set(`${username}-password-reset`, token, redis.print);
	}
	return new TokenResult(true, 'Successfully created the token', token);
};


/*
 * @params { token, username, email }
 * @return { success, message }
 * Mutation to confirm password reset token and generate token for updating password
 */
const confirmToken = async (_, { input }, { redisClient, getAsync }) => {
	development('confirmToken');
	const { token } = input;
	/*
	 * store the user related data
	 */
	const email = (input && input.email) ? input.email : '';
	const username = (input && input.username) ? input.username : '';
	if (email === '' && username === '') {
		return new TokenResult(false, 'Please pass email or username');
	}
	/*
	 * validate input before hitting the backend
	 */
	if (input && input.username) {
		if (!validateUsername(input.username)) {
			return new UserResult(false, 'Wrong username format');
		}
	}
	if (input && input.email) {
		if (!validateEmail(input.email)) {
			return new UserResult(false, 'Wrong email format');
		}
	}
	let key = null;
	if (email !== '') {
		key = `${email}-password-reset`;
	}
	if (username !== '') {
		key = `${username}-password-reset`;
	}
	if (key !== null) {
		const isKey = redisClient.get(key, redis.print);
		if (!isKey) {
			return new TokenResult(false, 'no value for provider key');
		}
	}
	const user = await UserModel.findOne({ $or: [{ email }, { username }] });
	if (!user) {
		if (email !== '') {
			return new TokenResult(false, `no user exist for this ${email}`);
		}
		if (username !== '') {
			return new TokenResult(false, `no user exist for this ${email}`);
		}
	}
	const data = await getAsync(key);
	if (data !== token || data === null) {
		return new TokenResult(false, 'Please pass valid token');
	}
	// data is equal to token
	redisClient.del(key);
	const newToken = generateToken(50);
	if (email !== '') {
		redisClient.set(`${email}-password-token`, newToken, redis.print);
	}
	if (username !== '') {
		redisClient.set(`${username}-password-token`, newToken, redis.print);
	}
	return new TokenResult(true, newToken);
};


/**
 * @params { token, againPassword, password }
 * @return { success, message }
 * Mutation to confirm reset password with token
 */
const resetPassword = async (_, { input }, { redisClient, getAsync }) => {
	const { token } = input;
	/*
	 * store the user related data
	 */
	const email = (input && input.email) ? input.email : '';
	const username = (input && input.username) ? input.username : '';
	if (email === '' && username === '') {
		return new TokenResult(false, 'Please pass email or username');
	}
	/*
	 * validate input before hitting the backend
	 */
	if (input && input.username) {
		if (!validateUsername(input.username)) {
			return new UserResult(false, 'Wrong username format');
		}
	}
	if (input && input.email) {
		if (!validateEmail(input.email)) {
			return new UserResult(false, 'Wrong email format');
		}
	}
	let key = null;
	if (email !== '') {
		key = `${email}-password-token`;
	}
	if (username !== '') {
		key = `${username}-password-token`;
	}
	const user = await UserModel.findOne({ $or: [{ email }, { username }] });
	if (!user) {
		if (email !== '') {
			return new UserResult(false, `no user exist for this ${email}`);
		}
		if (username !== '') {
			return new UserResult(false, `no user exist for this ${username}`);
		}
	}
	const data = await getAsync(key);
	if (data !== token || data === null) {
		return new UserResult(false, 'Please pass valid token');
	}
	if (input.password !== input.againPassword) {
		return new UserResult(false, 'Wrong password match.');
	}
	user.password = input.password;
	user.hashPassword();
	await user.save();
	redisClient.del(key);
	return new UserResult(true, 'Successfully updated the password');
};


/**
 * @params { email, username }
 * @return { success, message }
 * Mutation to create username or email (unique across the database)
 */
const changeIdentity = async (_, { input }, { user }) => {
	if (user && !user.id) {
		throw new AuthenticationError('must authenticate');
	}
	/*
	 * store the user related data
	 */
	const email = (input && input.email) ? input.email : '';
	const username = (input && input.username) ? input.username : '';
	if (email === '' && username === '') {
		return new UserResult(false, 'Please pass email or username');
	}
	if (email && username) {
		return new UserResult(false, 'Please pass either email or username');
	}
	/*
	 * validate input before hitting the backend
	 */
	if (input && input.username) {
		if (!validateUsername(input.username)) {
			return new UserResult(false, 'Wrong username format');
		}
	}
	if (input && input.email) {
		if (!validateEmail(input.email)) {
			return new UserResult(false, 'Wrong email format');
		}
	}
	const returnUser = await UserModel.findOne({ $or: [{ email }, { username }] });
	if (returnUser) {
		return new UserResult(false, 'Username is taken');
	}
	// user does not exist with the provided detals so let's proceed with update
	const currentUser = await UserModel.findById(user.id);
	if (email !== '') {
		currentUser.email = email;
		await currentUser.save();
	}
	if (username !== '') {
		currentUser.username = username;
		await currentUser.save();
	}
	return new UserResult(true, 'Sucessfully updated', currentUser);
};


const UserMutations = {
	Mutation: {
		signup,
		login,
		passwordToken,
		confirmToken,
		resetPassword,
		changeIdentity,
	},
};

export default UserMutations;