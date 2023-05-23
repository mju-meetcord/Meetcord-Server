var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readAccount,
    readMyMeetList,
    RegisterMeet
} = require('../etc/database');

router.post('/', async function (req, res, next) {

    console.log(req.body.token);

    const user_id = await readAccount(verifyToken(req.body.token),true);
    const data = await readMyMeetList(user_id);

    res.status(200).json({
        data:data
    });

    /*if (!data) {
        res.status(401).json({
            result: 401,
            message: 'meet 리스트 조회 실패'
        });
    } else {
        res.status(200).json({
            result: 200,
            data: data,
            message: "meet 리스트 조회 성공"
        });
    }*/
});

router.put('/' , async function (req, res, next) {
    // 1. 토큰에서 user id 추출
    console.log(req.body.token);
    console.log(verifyToken(req.body.token));
    console.log(req.body.group_id);

    const creator_id = await readAccount(verifyToken(req.body.token),true);

    if(!creator_id){
        res.status(401).json({ 
            message: "meet 생성 실패"
        });
        return;
    }
    
    const result = await RegisterMeet([creator_id[0],req.body.group_id,"waiting"]);

    if(result == 1){
        res.status(200).json({ 
            message: "meet 생성 성공"
        });
    }else{
        res.status(401).json({ 
            message: "meet 생성 실패"
        });
    }
    
});

module.exports = router;