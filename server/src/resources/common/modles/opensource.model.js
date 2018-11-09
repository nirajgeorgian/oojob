import mongoose from 'mongoose'
const Schema = mongoose.Schema

const OpenSourceSchema = new Schema({
	title: { type: String },
	description: { type: String },
	url: { type: String },
	languages: [{ type: String }],
	licence_type: { type: String }
})

export const OpenSource = mongoose.model('OpenSource', OpenSourceSchema)
