var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readMemberList
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



module.exports = router;