#!/usr/bin/env node
const fs = require('fs');
const { Command, Option } = require('commander');
const { get, getWithToken } = require('./lib/access_token_retriever');
const { generateToken } = require('./lib/generate_token');

// ------------------------------------------------------------

const program = new Command("github-app-installation-access-token");
program.command('get')
	.description('Get an installation token given an application id, installation id and private key')
	.addOption(new Option('-a, --appId <app-id>', 'Application ID')
		.env('GAIAT_APPID')
		.makeOptionMandatory(true)
		.argParser(parseAppId))
	.addOption(new Option('-i, --installationId <installation-id>', 'Installation ID')
		.env('GAIAT_INSTID')
		.makeOptionMandatory(true)
		.argParser(parseInstallationId))
	.addOption(new Option('-k, --privateKey <pem>', 'Private key in PEM format')
		.env('GAIAT_PKEY')
		.makeOptionMandatory(true)
		.argParser(parsePrivateKey))
	.action(get);

program.command('get-with-cred')
	.description('Get an installation token given a base64 encoded credentials')
	.addOption(new Option('-c, --credentials <credentials-token>', 'Base64 encoded credentials')
		.env('GAIAT_CREDENTIALS')
		.makeOptionMandatory(true)
		.argParser(parseCredentials))
	.action(getWithToken);

program.command('gen-creds')
	.description('Generates a base64 encoded credentials given an application id, installation id and private key')
	.addOption(new Option('-a, --appId <app-id>', 'Application ID')
		.env('GAIAT_APPID')
		.makeOptionMandatory(true)
		.argParser(parseAppId))
	.addOption(new Option('-i, --installationId <installation-id>', 'Installation ID')
		.env('GAIAT_INSTID')
		.makeOptionMandatory(true)
		.argParser(parseInstallationId))
	.addOption(new Option('-k, --privateKey <pem>', 'Private key in PEM format')
		.env('GAIAT_PKEY')
		.makeOptionMandatory(true)
		.argParser(parsePrivateKey))
	.action(generateToken);

program.parse();

// ------------------------------------------------------------

function getAppId(value) {
	if (typeof value !== 'string') {
		return false;
	}
	if (!((/^[0-9]+$/ui).test(value))) {
		return false;
	}
	return parseInt(value, 10);
}

function parseAppId(value) {
	value = getAppId(value);
	if (value === false) {
		program.error('invalid application id argument');
	}
	return value;
}

function getInstallationId(value) {
	if (typeof value !== 'string') {
		return false;
	}
	if (!((/^[0-9]+$/ui).test(value))) {
		return false;
	}
	return parseInt(value, 10);
}

function parseInstallationId(value) {
	value = getInstallationId(value);
	if (value === false) {
		program.error('invalid installation id argument');
	}
	return value;
}

function getPrivateKey(value) {
	if (typeof value !== 'string') {
		return false;
	}
	if (value.startsWith('@')) {
		try {
			value = fs.readFileSync(value.substring(1), 'utf8');
		}
		catch (err) {
			return false;
		}
	}
	const startIdx = value.indexOf('-----BEGIN RSA PRIVATE KEY-----');
	const endIdx = value.indexOf('-----END RSA PRIVATE KEY-----');
	if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) {
		return false;
	}
	return value;
}

function parsePrivateKey(value) {
	value = getPrivateKey(value);
	if (value === false) {
		program.error('invalid private key argument');
	}
	return value;
}

function parseCredentials(value) {
	if (!value) {
		program.error('invalid credentials argument');
	}
	try {
		const payload = JSON.parse(Buffer.from(value, 'base64').toString());
		if (getAppId(payload.appId) === false || getInstallationId(payload.installationId) === false) {
			throw new Error("invalid payload");
		}
		if (typeof payload.privateKey !== 'string' || payload.privateKey.startsWith('@') || getPrivateKey(payload.privateKey) === false) {
			throw new Error("invalid payload");
		}
		return payload;
	}
	catch (err) {
		program.error('invalid credentials argument');
	}
}
