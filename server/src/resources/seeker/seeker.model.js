import { Schema } from 'mongoose';
import { mongodb } from '../../db.connections';

const seekerModel = new Schema({
	user_id: {
		type: Schema.Types.ObjectId, ref: 'User',
	},
	resume: { type: String },
	jobs_applied: [{
		count: { type: Number, default: 0 },
		jobs: {
			job_id: { type: Schema.Types.ObjectId, ref: 'Jobs' },
			// status: 'default'|'approved'|'rejected'
			status: { type: String, default: 'default' },
		},
	}],
	company_worked: [{
		type: Schema.Types.ObjectId, ref: 'Company',
	}],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongodb.model('Seeker', seekerModel);