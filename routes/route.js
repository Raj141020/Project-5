const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');

router.get('/user/:userId/profile',userController.getUserData)

router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Please provide correct path!" })
})


module.exports = router;