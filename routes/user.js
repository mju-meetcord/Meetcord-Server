var express = require('express');
var router = express.Router();
const { CreateAccount , readAccount,updateAccount,deleteAccount} = require('../etc/database');
const multer = require('multer');
const fs = require('fs');

const upload = multer({
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
});

router.post('/',upload.single('image'),async function(req, res, next) {
    console.log(req.body);
    //const reuslt = await updateAccount("wjs2282@naver.com");

    const dataUrl = req.body.image; // 저장할 Data URL
    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/); // Data URL에서 MIME type과 base64 문자열 추출

    if (matches.length !== 3) {
        throw new Error('Invalid Data URL format');
    }

    const extension = matches[1].split('/')[1]; // 파일 확장자 추출
    const base64Data = matches[2]; // base64 문자열 추출
    const buffer = Buffer.from(base64Data, 'base64'); // base64 문자열을 Buffer 객체로 변환

    fs.writeFile(`./public/images/image.${extension}`, buffer, (err) => { // 파일 저장
        if (err) throw err;
        console.log('The file has been saved!');
    });


    res.send({result:"qqqqqqqq"});
});

module.exports = router;