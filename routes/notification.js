var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readNotiList,
    readAccount,
    readMeetList,
    CreateNoti
} = require('../etc/database');



router.get('/', async function (req, res, next) {

    console.log(req.query.name);

    const result = await readNotiList(req.query.name);

    if(result){
        res.status(200).json({
            data:result
        });
    }else{
        res.status(401).json({
            data:{}
        });
    } 

});

router.put('/' , async function (req, res, next) {
    // 1. 토큰에서 user id 추출
    console.log(req.body);
    console.log(req.body.title);
    console.log(verifyToken(req.body.token));

    const title = req.body.title;
    const message = req.body.message;
    const user_id = await readAccount(verifyToken(req.body.token),true);
    const groupData = await readMeetList(req.body.group);
    if(!user_id){
        res.status(401).json({ 
            message: "공지 등록 실패"
        });
        return;
    }
    
    // 2. meet 생성 요청


    const data = [groupData[0].group_id,title,message,user_id[0]];
    console.log(data);

    const result = await CreateNoti(data);

    if(result == 1){
        res.status(200).json({ 
            message: "noti 생성 성공"
        });
    }else{
        res.status(401).json({ 
            message: "noti 생성 실패"
        });
    }
    
});

module.exports = router;