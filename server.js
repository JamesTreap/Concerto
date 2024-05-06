const https = require('https');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

// place this high-up so it catches errors quickly
process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app'); // must appear after dotenv.config for logging purposes
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() =>
		// use con instead of () if trying con.connections
		// console.log(con.connections);
		console.log('DB connection successful!')
	);

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(
	{
		key: fs.readFileSync('client-key.pem'),
		cert: fs.readFileSync('client-cert.pem'),
	},
	app
);

httpServer.listen(port, () => {
	console.log(`HTTP Server running on port ${port}`);
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED CONNECTION REJECTION! Shutting down...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
