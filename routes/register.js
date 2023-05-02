var express = require('express');
var router = express.Router();
const { CreateAccount , readAccount,updateAccount,deleteAccount} = require('../etc/database');

router.post('/', async function(req, res, next) {
    console.log(req.body);
    const {name,phoneNum,birth,email,password} = req.body;
    const result = await CreateAccount([email,phoneNum,name,password,1,birth]);

    if(result == 0){
        res.status(401).json({result: 401, message: '회원가입 실패 ,다시 시도하세요.'});
    }else{
        res.status(200).json({result: 200,message: "회원가입 성공"});
    }
});

module.exports = router;