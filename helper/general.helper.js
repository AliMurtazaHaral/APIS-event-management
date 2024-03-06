const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

module.exports = {
	generateOtp() {
		otp = Math.floor(100000 + Math.random() * 9000);
		return otp;
	},
	generateRandomString(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	encrypt(text) {
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
	},
	decrypt(text) {
		let iv = Buffer.from(text.iv, 'hex');
		let encryptedText = Buffer.from(text.encryptedData, 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
		decipher.setAutoPadding(false);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		console.log('TCL: decrypt -> decrypted', decrypted.toString());
		return decrypted.toString();
	}
};
