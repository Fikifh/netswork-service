const express = require('express');
const userRoutes = require('./userRoute');
const authRoutes = require('./auth');
const presentRoute = require('./presentRoute');
const cutiRoute = require('./cutiRoute');

const router = express.Router();

/**
 * get api/status
 */
router.get('/status',(req, res) =>res.send('ok'));

/**
 * GET api/docs
 */
router.use('/docs', express.static('docs'));

router.use('/cuti', cutiRoute);
router.use('/present', presentRoute);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;

