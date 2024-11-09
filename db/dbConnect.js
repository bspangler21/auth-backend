const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
	mongoose
		.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => {
			console.log("Successfully connected to MongoDB Atlas");
		})
		.catch((error) => {
			console.log("Error connecting to MongoDB Atlas");
			console.error(error);
		});
}

module.exports = dbConnect;
