var express = require('express');
var router = express.Router();
const {
    readMeetList
} = require('../etc/database');

router.get('/', async function (req, res, next) {

    const data = await readMeetList();

    console.log(data);

    res.send(data);
    /*if (result == 0) {
        res.status(401).json({
            result: 401,
            message: '회원가입 실패 ,다시 시도하세요.'
        });
    } else {
        res.status(200).json({
            result: 200,
            message: "회원가입 성공"
        });
    }*/
});

module.exports = router;