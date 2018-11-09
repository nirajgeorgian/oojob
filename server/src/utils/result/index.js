class Result {
	constructor(status, message) {
		this.status = status || false;
		this.message = message || '';
	}
}

export default Result;