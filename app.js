const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./db/userModel");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbConnect = require("./db/dbConnect");
dbConnect();

app.get("/", (request, response, next) => {
	response.json({ message: "Hey! This is your server response!" });
	next();
});

app.post("/register", (request, response) => {
	bcrypt
		.hash(request.body.password, 10)
		.then((hashedPassword) => {
			//Create new instance of userModel and collect the data
			const user = new User({
				email: request.body.email,
				password: hashedPassword,
			});

			user.save().then((result) => {
				response.status(201).send({
					message: "User created successfully",
					result,
				});
			});
		})
		.catch((error) => {
			response.status(500).send({
				message: "Password was not hashed successfully",
				error,
			});
		});
});

module.exports = app;
