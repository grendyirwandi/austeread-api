const redis            = require('redis');
const { SignatureRSA } = require('@ryanbekhen/cryptkhen');
const config           = require('config');

module.exports = function(req, res, next) {
    // Create connection to redis
    const client   = redis.createClient({password: config.get('REDIS.PASS')});

    // Genarate class SignatureRSA
    const signatureRSA = new SignatureRSA({modulusLength: 256});

    // Generate Public Key & Private Key
    rsaKey = signatureRSA.generateKeyPair();

    // Set Public Key & Private Key to redis
    client.set('RSA_KEY', JSON.stringify(rsaKey));
    client.quit();
    next();
}