var express = require('express');
var router = express.Router();
const {
    readNotiListDetail,
    DeleteNoti
} = require('../etc/database');



router.get('/', async function (req, res, next) {

    console.log(req.query.id);

    const result = await readNotiListDetail(req.query.id);

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

router.delete('/' , async function (req, res, next) {
    console.log(req.body.notification_id);
    
    const result = DeleteNoti(req.body.notification_id);

    if(result == 1){
        res.status(200).json({ 
            message: "noti 삭제 성공"
        });
    }else{
        res.status(401).json({ 
            message: "noti 생성 실패"
        });
    }
    
});


module.exports = router;