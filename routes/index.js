const express = require('express');
const router = express.Router();

const loginRouter = require('./login');
const emailAuthRouter = require('./emailAuth');
const registerRouter = require('./register');
const userRouter = require('./user');
const meetRouter = require('./meet');
const myMeetRouter = require('./myMeet');
const notificationRouter = require('./notification');
const notificationDetailRouter = require('./notificationDetail');
const memberRouter = require('./member');
const testRouter = require('./test');

router.use('/login', loginRouter);
router.use('/emailAuth', emailAuthRouter);
router.use('/register', registerRouter);
router.use('/user', userRouter);
router.use('/meet', meetRouter);
router.use('/myMeet', myMeetRouter);
router.use('/notification', notificationRouter);
router.use('/notificationDtail', notificationDetailRouter);
router.use('/member', memberRouter);
router.use('/test', testRouter);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
