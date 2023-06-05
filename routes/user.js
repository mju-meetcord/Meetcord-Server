var express = require('express');
var router = express.Router();
const { verifyToken } = require('../etc/token');
const {readAccount,UpdateUser} = require('../etc/database');
const multer = require('multer');


const upload = multer({storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/user/');
    },
    filename: function (req, file, cb) {
      const fileName = decodeURIComponent(file.originalname.toLowerCase().split(' ').join('-'));
      console.log(fileName);
      cb(null, fileName);
    }
  }),
    limits: {
      fileSize: 100 * 1024 * 1024 // 10MB
    }
});

router.get('/', async function (req, res, next) {

    console.log(req.query.token);

    const data = await readAccount(verifyToken(req.query.token));
    
    res.status(200).json({
        data:{
            email:data[0],
            name:data[2],
            birth:data[3],
            prolie:data[4],
            phone:data[5],
            nickName:data[6],
            user_id:data[7]
        }
    });
});

router.post('/',upload.single("image") ,async function (req, res, next) {

    console.log(req.body.token);
    console.log(req.body.nickname);
    console.log(req.file.filename);
    const id = await readAccount(verifyToken(req.body.token),true);
    const result = await UpdateUser([req.body.nickname,req.file.filename,id[0]]);
    
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


module.exports = router;