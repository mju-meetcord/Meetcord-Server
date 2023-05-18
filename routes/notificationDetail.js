var express = require('express');
var router = express.Router();
const {
    readNotiListDetail
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


module.exports = router;