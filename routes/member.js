var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readMemberList,
    updateMember,
    DeleteMember,
    readAccount,
    DeleteMember2
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

    let result =1;
    
    if(req.body.mem_id == -1){
        const id = await readAccount(verifyToken(req.body.token),true);

        if(req.body.creator_id == id){
            res.status(401).json({ 
                message: "member 생성 실패"
            });
            return;
        }
        result = await DeleteMember2([req.body.meet_id,id[0]]);
    }else{
        result = await DeleteMember(req.body.mem_id);
    }

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