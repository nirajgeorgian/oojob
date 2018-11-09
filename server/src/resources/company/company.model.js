import mongoose from 'mongoose'
import { mongodb } from '../../db.connections'
const Schema = mongoose.Schema

const companyModel = new Schema({
	created_by: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
  name: { type: String, unique: true, required: true },
  desc: { type: String, required: true },
	url: { type: String, unique: true, lowercase: true },
	logo: { type: String },
	location: { type: String, default: null },
	reviews: [{
		rev_id: { type: Schema.Types.ObjectId, ref: 'Reviews' }
	}],
	timings: {
		fulltime: { value: { type: Number, default: 8 }, units: { type: String, default: 'HRS' }, per: { type: String, default: 'DD'} },
		parttime: { value: { type: Number, default: 2 }, units: { type: String, default: 'HRS' }, per: { type: String, default: 'DD'} },
		internship: { value: { type: Number, default: 4 }, units: { type: String, default: 'HRS' }, per: { type: String, default: 'DD'} }
	},
	company_since: { type: Date },
	last_seen: { type: Date },
	hiring_status: {type: Boolean, default: false },
	languages: [{ type: String }],
	no_of_employees: { min: { type: Number, default: null }, max: { type: Number, default: null } },
	opensource: [{
		open_source_id: { type: Schema.Types.ObjectId, ref: 'OpenSource'}
	}]
})

export default mongodb.model('Company', companyModel);
