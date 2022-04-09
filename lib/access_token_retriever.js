const jsonwebtoken = require('jsonwebtoken');
const axios = require('axios');

// ------------------------------------------------------------

async function get(options) {
	const program = this;

	try {
		const jwtToken = getSignedJsonWebToken(options.appId, options.privateKey);

		const response = await axios({
			method: 'POST',
			url: 'https://api.github.com/app/installations/' + options.installationId.toString() + '/access_tokens',
			headers: {
				'Accept': 'application/vnd.github.machine-man-preview+json',
				'Authorization': 'Bearer ' + jwtToken
			},
			timeout: 10000,
			responseEncoding: 'utf8'
		});

		if (response.status < 200 || response.status > 299) {
			throw new Error('unexpected response status code (' + response.status.toString() + ')');
		}

		if (typeof response.data !== 'object' || typeof response.data.token !== 'string') {
			throw new Error('unexpected response');
		}

		process.stdout.write(response.data.token);
	}
	catch (err) {
		program.error(err.toString());
	}
}

async function getWithToken(options) {
	await get(options.credentials);
}

// ------------------------------------------------------------

function getSignedJsonWebToken(appId, privateKey) {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iat: now - 60, // Issued at time (with clock drift)
		exp: now + (60 * 10) - 30, // JWT expiration time (10 minute maximum, 30 second safeguard)
		iss: appId.toString()
	};
	const token = jsonwebtoken.sign(payload, privateKey, { algorithm: "RS256" });
	return token;
}

// ------------------------------------------------------------

module.exports = {
	get,
	getWithToken
};
