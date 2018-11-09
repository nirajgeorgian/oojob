import mongoose from 'mongoose'
import { mongodb } from '../../db.connections'
const Schema = mongoose.Schema

const jobSchema = new Schema({
	name: { type: String, required: true },
	// 'featured'|'default'|'premium'
	type: { type: String, required: true },
	category: { type: String, required: true },
	desc: { type: String, required: true },
	skills_required: [ { type: String } ],
	sallary_min: { value: { type: Number }, currency: { type: String } },
	sallary_max: { value: { type: Number }, currency: { type: String } },
	location: { type: String },
	attachment: [{ "type": { type: String },file: { type: String } }],
	// status: 'active'|'disabled'
	current_status: { type: String, lowercase: true },
	views: { type: Number, default: 0 },
	users_applied: [{
		type: Schema.Types.ObjectId,
		ref: 'ApplyJob'
	}],
	created_by: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
	profile: { type: String, default: 'company' }
})

export const Jobs = mongodb.model('Jobs', jobSchema)


/*
	milestone: [
		{
			key: {
				type: Number
			},
			value: {
				type: String
			}
		}
	],
*/
