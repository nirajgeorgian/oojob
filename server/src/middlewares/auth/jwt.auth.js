import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

// sign the request
const privateCert = fs.readFileSync(path.resolve(__dirname, 'private.key'));
export const generateJwtToken = (payload, cert = privateCert) => jwt.sign(
	payload,
	cert,
	{
		algorithm: 'RS256',
		expiresIn: '30d',
	},
);

// verify the request
const publicCert = fs.readFileSync(path.resolve(__dirname, 'public.key'));
export const verifyJwtToken = (token, cert = publicCert) => {
	try {
		return jwt.verify(
			token,
			cert,
		);
	} catch (e) {
		throw new Error(e);
	}
};

// verify the authpayload from header
export const verifyJwt = (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		const token = req.headers.authorization.split(' ')[1];
		const payload = verifyJwtToken(token);
		if (payload !== null || payload !== undefined) {
			req.user = payload;
		}
	} else {
		req.user = {};
	}
	next();
};