import  { AuthenticationError, UserInputError, ApolloError } from 'apollo-server-express'
import { Company } from './company.model'
import { User } from '../user/user.model'

/**
 * @params { companyname }
 * @return { Company }
 * Mutation to create one company
 */
const createCompany = async (_, {input}, { user, mongodb }) => {
	if(!user || !user.username || user === undefined) {
		throw new AuthenticationError('must authenticate')
	}
	// check that the account type should be creator
	if(!user.account_type === 'provider') {
		throw new ApolloError('Your account must have provider credential rather than seeker', 3)
	}
	const oldCompany = await Company.findOne({ name: input.name })
	if(oldCompany) {
		throw new ApolloError("Company already exists", 2)
	}
	const loggedInUser = await User.findById(user.id)
	// now create the new company
	const company = new Company(input)
	company.created_by = user.id
	const newCompany = await company.save()
	loggedInUser.ownedCompany.push({
		comp_id: newCompany.id
	})
	await loggedInUser.save()
	return newCompany
}

const CompanyMutations = {
	Mutation: {
		createCompany
	}
}

export default CompanyMutations;