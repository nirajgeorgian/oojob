import { AuthenticationError, ApolloError } from 'apollo-server-express';
import UserModel from './user.model';
// import redis from 'redis'
//
// /* Util method's here */
// import { generateToken } from '../../utils/tokenGenerate'
// import { generateResult } from '../utils/resuleGenerate';
// import { ObjectCheck } from '../utils/helper';
//
// /**
//  * Below are the Query Functions
//  */
//
// /**
//  * @params { email }
//  * @return { success, message }
//  * Query to check email exists's or not
//  */
// const checkEmail = async (_, { email }) => {
// 	const user = await User.findOne({ email: email })
// 	if(!user) {
// 		return generateResult(false, "no use exist for it")
// 	}
// 	return generateResult(true, "email exists");
// }
//
//
// /**
//  * @params { email }
//  * @return { success, message }
//  * Query to check username exists's or not
//  */
// const checkUser = async (_, { username }) => {
// 	const user = await User.findOne({ username: username })
// 	if(!user) {
// 		return generateResult(false, "no user exist for it")
// 	}
// 	return generateResult(true, "username exists")
// }


const currentUser = async (_, __, { user }) => {
	if (!user.id) {
		throw new AuthenticationError('must authenticate');
	}
	const returnedUser = await UserModel.findById(user.id);
	if (!returnedUser) {
		throw new ApolloError('no user found', 'NO_USER_FOUND');
	}
	return returnedUser;
};


const getUser = async (_, { id }) => {
	const returnedUser = await UserModel.findById(id);
	if (!returnedUser) {
		return new ApolloError('no user found', 'NO_USER_FOUND');
	}
	return returnedUser;
};


const getUsers = async (_, { ids }) => {
	const returnedUsers = await UserModel.find({ _id: { $in: ids } });
	return returnedUsers;
};


const UserQuery = {
	Query: {
		getUser,
		getUsers,
		// checkEmail,
		// checkUser,
		currentUser,
		// getUser,
		// getAllUser,
	},
// 	User: {
// 		notifications: (rootUser) => {
// 			// make query for nested fields inside user
// 			return {
// 				job_posting: {
// 					status: rootUser.notification.job_posting.status
// 				},
// 				company_promotion: {
// 					status: rootUser.notification.company_promotion.status
// 				},
// 				message: {
// 					status: rootUser.notification.message.status
// 				},
// 				mail: {
// 					status: rootUser.notification.mail.status
// 				},
// 				comment: {
// 					status: rootUser.notification.comment.status
// 				}
// 			}
// 		},
// 		account: (rootUser) => {
// 			return rootUser.account
// 		},
// 		social_urls: (rootUser) => {
// 			return rootUser.social_urls
// 		}
// 	}
};

export default UserQuery;