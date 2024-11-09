const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

app.post("/login", (request, response) => {
	//Check that user exists
	User.findOne({ email: request.body.email })
		.then((user) => {
			bcrypt
				.compare(request.body.password, user.password)
        //Do this if the passwords match
				.then((passwordCheck) => {
					//Check if password matches
					if (!passwordCheck) {
						return response.status(400).send({
							message: "Email or password do not match",
						});
					}

					//Create JWT token
					const token = jwt.sign(
						{
							userId: user._id,
							userEmail: user.email,
						},
						"RANDOM-TOKEN",
						{ expiresIn: "24h" }
					);

					//Return success response
					response.status(200).send({
						message: "Login successful",
						email: user.email,
						token,
					});
				})
				.catch((error) => {
					response.status(400).send({
						message: "Email or password do not match",
						error,
					});
				});
		})
		.catch((error) => {
			response.status(404).send({
				message: "User not found",
				error,
			});
		});
});

module.exports = app;
