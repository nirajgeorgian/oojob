import { AuthenticationError } from 'apollo-server-express'
import { JobsGraphqlSchema } from './jobs.graphql'
import { Jobs } from './jobs.model'

const jobCreate = async (_, {input}, {mongodb, user}) => {
	// validate the job creation before creating job
	/*
	check weather the user is logged in or not
	 */
	if(!user.username) {
		throw new AuthenticationError("must authenticate")
	}
	/*
		user is logged in
	 */
	console.log(user);
	const job = new Jobs({
		name: input.name,
		type: input.type,
		desc: input.desc,
		skills_required: input.skills_required,
		sallary_min: input.sallary_min,
		sallary_max: input.sallary_max,
		location: input.location,
		created_by: user.id,
		profile: input.profile,
		[input.profile]: input[input.profile]
	})
	const savedJob = await job.save()
	console.log(savedJob)
}

const JobMutation = {
	Mutation: {
		jobCreate
	}
}

export default JobMutation;