const express = require('express');

const router = express.Router();

const userController = require('../controller/userController')

const productController = require('../controller/productController')

const auth = require('../auth/auth')

//USER//
/*.........................//1// CREAT USER //..............................................*/

router.post('/register', userController.creatUserData)

/*.........................//2// LOGIN USER //..............................................*/

router.post('/login', userController.loginUser)

/*.........................//3// GET USER //..............................................*/

router.get('/user/:userId/profile', auth.authenticate, userController.getUserData)

/*.........................//4// EDIT USER //..............................................*/

router.put('/user/:userId/profile', auth.authenticate, auth.authorisation, userController.updateProfile)

//PRODUCT//
/*.........................//5// CREAT PRODUCT //.............................................*/

router.post("/products", productController.createProduct)


router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Please provide correct path!" })
})


module.exports = router;