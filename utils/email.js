const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
const AWS = require('aws-sdk');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `James Treap <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// Sendgrid
			return 1;
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		// 1) Render HTML based on pug template
		const html = pug.renderFile(
			`${__dirname}/../views/email/${template}.pug`,
			{
				firstName: this.firstName,
				url: this.url,
				subject,
			}
		);

		// 2) Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: subject,
			html: html,
			text: convert(html),
		};

		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('Welcome', 'Welcome to the Concerto Family!');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Your password reset token (valid for 10 minutes)'
		);
	}
};
