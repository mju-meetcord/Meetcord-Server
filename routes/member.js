var express = require('express');
var router = express.Router();
const {
    readMemberList,
    updateMember,
    DeleteMember
} = require('../etc/database');


router.get('/', async function (req, res, next) {

    console.log(req.query.name);

    const result = await readMemberList(req.query.name);

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


router.post('/', async function (req, res, next) {

    console.log(req.body.mem_id);
    console.log(req.body.role);

    const result = await updateMember([req.body.role,req.body.mem_id]);


    if(result==1){
        res.status(200).json({
            result:200
        });
    }else{
        res.status(401).json({
            result:401
        });
    } 

});

router.delete('/' , async function (req, res, next) {
    console.log(req.body.mem_id);
    
    const result = await DeleteMember(req.body.mem_id);

    if(result == 1){
        res.status(200).json({ 
            message: "member 삭제 성공"
        });
    }else{
        res.status(401).json({ 
            message: "member 생성 실패"
        });
    }
    
});



module.exports = router;