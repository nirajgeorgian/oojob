import { Schema } from 'mongoose';
import { mongodb } from '../../db.connections';

const providerModel = new Schema({
	user_id: {
		type: Schema.Types.ObjectId, ref: 'User',
	},
	company: {
		type: Schema.Types.ObjectId, ref: 'Company',
	},
	jobs_provided: {
		count: { type: Number, default: 0 },
		jobs: [
			{ type: Schema.Types.ObjectId, ref: 'Jobs' },
		],
	},
	key_skills: [
		{ type: String },
	],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongodb.model('Provider', providerModel);