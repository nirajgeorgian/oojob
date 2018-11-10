import Result from './index';

export class TokenResult extends Result {
	constructor(status, message, token) {
		super(status, message);
		this.token = token || null;
	}
}

export default TokenResult;