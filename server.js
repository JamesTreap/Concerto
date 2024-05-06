const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

const http_port = process.env.HTTP_PORT || 3000;
const httpServer = http.createServer(app);

httpServer.listen(http_port, () => {
	console.log(`HTTP Server running on port ${http_port}`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED CONNECTION REJECTION! Shutting down...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
