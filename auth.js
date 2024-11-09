const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
	try {
		//Get the token from the authorization header
		const token = await request.headers.authorization.split(" ")[1];

		//Check if the token matches the RANDOM-TOKEN token string
		const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

		//Pass the details oof the decodedToken (the user's details) to the user constant
		const user = await decodedToken;

		//Pass the user details down to the endpoints
		request.user = user;

		//Pass down functionality to the endpoint
		next();
	} catch (error) {
		response.status(401).json({
			error: new Error("Invalid request"),
		});
	}
};
