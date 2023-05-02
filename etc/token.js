const jwt = require('jsonwebtoken');

const secretKey = 'mysecretkey';
const expiresIn = '1h';

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn });
}

module.exports  = {
    generateToken
};