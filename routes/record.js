var express = require('express');
var router = express.Router();
const {
    readRecord,
    UpdateRecord,
    CreateRecord
} = require('../etc/database');
const multer = require('multer');


const upload = multer({storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/record/');
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

    console.log(req.query.id);

    const result = await readRecord(req.query.id);

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

router.post('/',upload.single("image") ,async function (req, res, next) {

    console.log(req.body.tag_message);
    console.log(req.body.detail);
    console.log(req.body.id);

    const filename = req.file == undefined ? '':req.file.filename;

    const result = await UpdateRecord([req.body.detail,req.body.tag_message,filename,req.body.id]);

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

router.put('/',upload.single("image") ,async function (req, res, next) {

    console.log(req.body.tag_message);
    console.log(req.body.detail);
    console.log(req.body.event_id);
    //console.log(req.file.filename);
    
    const filename = req.file == undefined ? '':req.file.filename;

    const result = await CreateRecord([req.body.event_id,filename,req.body.tag_message,req.body.detail]);

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