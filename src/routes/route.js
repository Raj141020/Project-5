const express = require('express');

const router = express.Router();

const userController = require('../controller/userController')

const auth = require('../auth/auth')

router.post('/register', userController.creatUserData)

router.post('/login', userController.loginUser)

router.get('/user/:userId/profile', auth.authenticate, userController.getUserData)

router.put("/user/:userId/profile", auth.authenticate, auth.authorisation, userController.updateProfile)


router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Please provide correct path!" })
})


module.exports = router;