/* eslint-disable */
import env from '../../config/env/env';

/* eslint-enable */
import request from '../utils/request';
import { resolveAllDbConnection, mongodb } from '../../db';

/*
	Setup and teardown
 */
beforeAll(async () => resolveAllDbConnection());

afterAll(async () => {
	const collections = await mongodb.db.collections();
	/* eslint-disable */
	for (const collection of collections) {
		collection.remove();
	}
	/* eslint-enable */
	return mongodb.close();
});

describe('USer Schema test', () => {
	// user signup feature
	test('User successfull signup feature', async (done) => {
		/*
			User object used for signup
		 */
		const userInput = {
			input: {
				firstname: 'test',
				lastname: 'test',
				gender: 'male',
				username: 'test123',
				email: 'test123@example.com',
				password: 'testN9',
				account: {
					account_type: 'provider',
					subscription_type: 'free',
				},
			},
		};
		const context = {};
		const query = `
		mutation createUser($input: UserSignupCredInput!){
			user: signup(input: $input) {
				status
				message
				user {
					id
					username
					email
				}
			}
		}
		`;
		const { data: { user: { status, message, user } } } = await request(query, context, userInput);
		expect(status).toBeTruthy();
		expect(message).toBe('successfully created user');
		expect(user.username).toBe(userInput.input.username);
		expect(user.email).toBe(userInput.input.email);
		done();
	});

	test('User names validation', async (done) => {
		/*
			User object used for signup
		 */
		const userInput = {
			input: {
				firstname: 't',
				lastname: 't',
				gender: 'male',
				username: 'test12',
				email: 'test12@example.com',
				password: 'testN9',
				account: {
					account_type: 'provider',
					subscription_type: 'free',
				},
			},
		};
		const context = {};
		const query = `
		mutation createUser($input: UserSignupCredInput!){
			user: signup(input: $input) {
				status
				message
				user {
					id
					username
					email
				}
			}
		}
		`;
		const result = await await request(query, context, userInput);
		expect(result.data).toBeNull();
		done();
	});
});
