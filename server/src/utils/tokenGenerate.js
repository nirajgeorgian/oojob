import crypto from 'crypto';

export const generateToken = (size) => {
	const buf = crypto.randomBytes(size);
	const token = buf.toString('hex');
	return token;
};
