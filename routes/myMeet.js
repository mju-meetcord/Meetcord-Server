var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readAccount,
    readMyMeetList
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

module.exports = router;