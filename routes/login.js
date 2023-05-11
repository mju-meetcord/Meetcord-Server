var express = require('express');
var router = express.Router();
const { CreateAccount , readAccount,updateAccount,deleteAccount} = require('../etc/database');
const { generateToken } = require('../etc/token');
const Redisclient = require('../etc/redisStore');

/* GET login listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body);
    console.log(req.sessionID);

    const {email,password} = req.body;

    // 1. 아이디와 비밀번호 디비 조회 후 , 내용 비교
    const result = await CheakData(email,password);
    // 이때 세션유지를 위해 토큰 발급 생각중.
    if (result == 1){
        
        const token = generateToken({email :email});
        console.log("Login Token:"+token);
        Redisclient.get(email).then((data)=>{
            if (data == null){
                Redisclient.set(email,JSON.stringify({token:token,email:email,message:'login Token'}));
            }
        });

        res.status(200).json({ 
            email: email,
            token: token,
            message: "로그인 성공"
        });
    }else if(result == 2){
        res.status(401).json({ message: '로그인 실패 : 해당하는 Email이 없습니다.' });
    }else{
        res.status(401).json({ message: '로그인 실패 : 비밀번호가 일치 하지 않습니다.' });
    }

});


const CheakData  = async(email,pw)=>{
    const result = await readAccount(email);
    
    console.log("CheakData _ db_email : "+result);

    if (!result){
        return 2; // 해당하는 Email 없음
    }else if((result[0] == email) && (result[1] == pw)){
        return 1; // 로그인 성공
    }else{
        return 0; // 비밀번호 미일치
    }
}

module.exports = router;
