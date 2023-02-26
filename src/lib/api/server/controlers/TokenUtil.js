import jwt from 'jsonwebtoken';

// CAN WE GET A THUMBS UP FOR https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48

function TokenGenerator(secretOrPrivateKey, secretOrPublicKey, options) {
	this.secretOrPrivateKey = secretOrPrivateKey;
	this.secretOrPublicKey = secretOrPublicKey;
	this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
}

TokenGenerator.prototype.sign = function (payload, signOptions) {
	const jwtSignOptions = Object.assign({}, signOptions, this.options);
	return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
};

// refreshOptions.verify = options you would use with verify function
// refreshOptions.jwtid = contains the id for the new token
TokenGenerator.prototype.refresh = function (token, refreshOptions) {
	const payload = jwt.verify(token, this.secretOrPublicKey, refreshOptions.verify);
	delete payload.iat;
	delete payload.exp;
	delete payload.nbf;
	delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
	const jwtSignOptions = Object.assign({}, this.options, { jwtid: refreshOptions.jwtid });
	// The first signing converted all needed options into claims, they are already in the payload
	return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
};

TokenGenerator.prototype.decode = function (token, key) {
	return jwt.verify(token, key);
};

export { TokenGenerator };
