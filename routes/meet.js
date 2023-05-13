var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {
    readMeetList,
    readAccount,
    CreateMeet
} = require('../etc/database');
const multer = require('multer');


const upload = multer({storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
      const fileName = decodeURIComponent(file.originalname.toLowerCase().split(' ').join('-'));
      cb(null, fileName);
    }
  }),
    limits: {
      fileSize: 100 * 1024 * 1024 // 10MB
    }
});


router.get('/', async function (req, res, next) {

    console.log(req.query.keyword);

    const data = await readMeetList(req.query.keyword);

    console.log(data);

    if (!data) {
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
    }
});

router.put('/',upload.single("image") , async function (req, res, next) {
    // 1. 토큰에서 user id 추출
    console.log(req.body.token);
    console.log(verifyToken(req.body.token));

    const creator_id = await readAccount(verifyToken(req.body.token),true);
    if(!creator_id){
        res.status(401).json({ 
            message: "meet 생성 실패"
        });
        return;
    }
    // 2. meet 생성 요청
    const name = req.body.name;
    const description = req.body.description;
    const profile = req.file.path;

    const data = [name,description,creator_id[0],profile];
    console.log(data);

    const result = await CreateMeet(data);

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