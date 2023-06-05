var express = require('express');
var router = express.Router();
const {
    readEventList,
    CreateEvent,
    updateEvent,
    DeleteEvent,
    readEvent,
    UpdateAttendencd
} = require('../etc/database');
const {getFormattedDate} =require('../etc/util');



router.get('/', async function (req, res, next) {

    console.log(req.query.name);
    console.log(req.query.date);
    let result = await readEventList(req.query.name);

    if( (req.query.date != undefined) & (result != 0)){
        result = result.filter(i=>i.end_time.toISOString().split('T')[0] == req.query.date);
    }

    if(result){
        res.status(200).json({
            data:result
        });
    }else{
        res.status(401).json({
            data:[]
        });
    } 
    

});

router.put('/', async function (req, res, next) {
    const result = await CreateEvent([req.body.group_id,req.body.title,req.body.description,getFormattedDate(req.body.start_time),getFormattedDate(req.body.end_time),req.body.place,'']);

    if(result){
        res.status(200).json({
            result:'완료'
        });
    }else{
        res.status(401).json({
            result:'실패'
        });
    } 
    

});

router.post('/', async function (req, res, next) {
    console.log(req.body);
    const result = await updateEvent([req.body.title,req.body.description,getFormattedDate(req.body.start_time),getFormattedDate(req.body.end_time),req.body.place,req.body.id]);

    if(result==1){
        res.status(200).json({
            result:'완료'
        });
    }else{
        res.status(401).json({
            result:'실패'
        });
    } 

});

router.patch('/', async function (req, res, next) {
    console.log(req.body);

    const temp = await readEvent(req.body.event_id);
    console.log(temp[0].joinlist);

    let list = temp[0].joinlist.split(",").filter(i=>parseInt(i)).map(i=>parseInt(i))

    if(req.body.option == 1){
        if(!list.includes(req.body.member_id)){
            list.push(req.body.member_id);
            console.log(list.join(","));
            await UpdateAttendencd([list.join(","),req.body.event_id]);
        }

    }else{
        if(list.includes(req.body.member_id)){
            await UpdateAttendencd([list.filter(i=>req.body.member_id!=i).join(","),req.body.event_id]);
        }
    }
    
    const result =1;

    if(result==1){
        res.status(200).json({
            result:'완료'
        });
    }else{
        res.status(401).json({
            result:'실패'
        });
    } 

});

router.delete('/', async function (req, res, next) {
    console.log(req.body);
    
    const result = await DeleteEvent(req.body.id);

    if(result==1){
        res.status(200).json({
            result:'완료'
        });
    }else{
        res.status(401).json({
            result:'실패'
        });
    } 

});



module.exports = router;