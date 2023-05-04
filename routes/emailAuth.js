const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { CreateAccount , readAccount,updateAccount,deleteAccount} = require('../etc/database');
const { generateToken } = require('../etc/token');
const Redisclient = require('../etc/redisStore');
const { generateOTP } = require('../etc/util');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wjswnsdh1599@gmail.com',
        pass: 'ndturwqlcnmwfjfp'
    }
});
  


router.post('/', async function(req, res, next) {
    console.log(" /emailAuth 요청 들어옴.");
    console.log(req.body);

    const {email} = req.body;
    console.log(email);

    // 1. 아이디와 비밀번호 디비 조회 후 , 내용 비교
    const result = await EmailDoudle(email);
    // 이때 토큰을 보낸 유저 식별을 위해 임시토큰 발급
    if (result == 1){
        console.log(" 이메일 조회 성공");
        const token = generateToken({email :email});
        const otp =generateOTP();

        Redisclient.get(email).then((data)=>{
            if (data == null){
                Redisclient.set(email,JSON.stringify({token:token,otp:otp}));
            }else{
                res.status(401).json({ 
                    message: '실패 : 이미 요청된 이메일 입니다.',
                    result: 401
                });
            }
        });


        const mailOptions = {
            from: 'wjswnsdh1599@gmail.com',
            to: email,
            subject: 'Email verification Test',
            text: 'otp :  '+otp
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                  console.log(error);
              } else {
                console.log(info);
              }
        });
        
        res.status(200).json({ 
            token: token,
            message: "사용가능한 Email , otp 숫자가 해당 Email로 전송되었습니다.",
            result: 200
        });

    }else{
        res.status(401).json({ 
            message: '실패 : 중복된 Email 입니다.',
            result: 401
        });
    }

});

router.put('/', async function(req, res, next) {
    const {email,token,otp} = req.body;

    Redisclient.get(email).then((data)=>{
        const result = JSON.parse(data);

        if(data == null) res.status(401).json({ message: '실패 : 다른 Email 입니다.',result: 401});
        
        if (result.token == token && result.otp == otp){
            Redisclient.del(email);
            res.status(200).json({ 
                message: "otp번호가 일치합니다. 인증 성공!!",
                result: 200
            });
        }else{
            res.status(401).json({ 
                message: "otp번호가 일치하지않습니다. 인증 실패!!",
                result: 401
            });
        }
    });
});

const EmailDoudle  = async(email)=>{
    const result = await readAccount(email);
    
    console.log("CheakData _ db_email : "+result);

    if (!result){
        return 1; // 해당하는 Email 없음 ( 미중복 )
    }else{
        return 0; // 중복된 이메일이 있음.
    }
}

module.exports = router;
