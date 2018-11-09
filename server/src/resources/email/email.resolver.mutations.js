import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (_, { input }, { user }) => {
	if(!user) {
		throw new Error("You must be logged in")
	}
	const msg = {
		to: input.email.to,
		from: input.email.from,
		subject: input.email.subject,
		text: input.email.text
	}
	const mailData = await sgMail.send(msg)
	if(!mailData) {
		throw new Error("Error sending email")
	}
	return true
}

const EmailResolvers = {
	Mutation: {
		sendMail
	}
}

export default EmailResolvers;