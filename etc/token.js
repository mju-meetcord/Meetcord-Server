const jwt = require('jsonwebtoken');

const secretKey = 'mysecretkey';
const expiresIn = '1h';

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn });
}

const verifyToken =(token)=>{
  try{
    const verified = jwt.verify(token, secretKey);
    
    console.log(verified);  

    return verified.email;
  }catch(err){
    console.log(err);
  }
}
module.exports  = {
    generateToken,
    verifyToken
};