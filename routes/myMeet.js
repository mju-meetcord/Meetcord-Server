var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readMeetList
} = require('../etc/database');

router.post('/', async function (req, res, next) {

    //const data = await readMeetList();
    //console.log(data);

    console.log(req.body.token);

    const email = verifyToken(req.body.token);
    console.log(email);

    res.status(200).json({
        data:123
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

module.exports = router;