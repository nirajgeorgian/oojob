/* eslint-disable */
import env from '../../config/env/env';

/* eslint-enable */
import request from '../utils/request';

describe('Dummy Schema test', () => {
	test('Query dummy return Hello World', async (done) => {
		const query = `
		query {
				dummy
			}
		`;
		const { data: { dummy } } = await request(query, {}, {});
		expect(dummy).toBe('hello world');
		done();
	});
});
