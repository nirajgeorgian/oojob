import Result from './index';

export class UserResult extends Result {
	constructor(status, message, user) {
		super(status, message);
		this.user = user || null;
	}
}

export default UserResult;