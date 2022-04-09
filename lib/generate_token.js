function generateToken(options) {
	const program = this;

	try {
		const payload = JSON.stringify({
			appId: options.appId,
			installationId: options.installationId,
			privateKey: options.privateKey,
		});

		process.stdout.write(Buffer.from(payload).toString('base64'));
	}
	catch (err) {
		program.error(err.toString());
	}
}

// ------------------------------------------------------------

module.exports = {
	generateToken
};
