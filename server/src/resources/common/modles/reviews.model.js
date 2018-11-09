import mongoose from 'mongoose'
import { mongodb } from '../../db'
const Schema = mongoose.Schema

const ReviewsSchema = new Schema({
	userid: { type: Schema.Types.ObjectId, ref: 'User' },
	stars: { type: Number },
	pros: [{ type: String }],
	cons: [{ type: String }],
	suggestions: [{ type: String }]
})

export const Reviews = mongodb.model('Reviews', ReviewsSchema)
