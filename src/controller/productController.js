const productModel = require("../model/productModel")
const aws = require("../aws/aws")
const moment = require('moment')

const { isValidBody, isValidTitle, isValid, isValidPrice, isValidName, isValidNumbers, isValidFile, isValidId } = require("../validation/validation")

//--------------------------------------------- Create Product --------------------------------------------//

exports.createProduct = async function (req, res) {

  try {
    let data = req.body

    let {title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments} = data

    if (!isValidBody(data)) {
      return res.status(400).send({status: false,message: "Please provide data in body"})
    }

    if (!title)
      return res.status(400).send({ status: false, message: "Title is required" })

    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, message: "Title is invalid" })
    }

    let titleCheck = await productModel.findOne({ title: title })
    if (titleCheck)
      return res.status(400).send({status: false,message: "This title already exists"})

    if (!description)
      return res.status(400).send({ status: false, message: "Description is required!" })

    if (!isValid(description)) {
      return res.status(400).send({ status: false, msg: "descritions is invalid" })
    }

    if (!price)
      return res.status(400).send({ status: false, message: "Price is required!" })

    if (!isValidPrice(price)) {
      return res.status(400).send({ status: false, msg: "Price is invalid!" });
    }

    if (!currencyId)
      return res.status(400).send({ status: false, message: "Currency Id is required" })

    if (currencyId != "INR")
      return res.status(400).send({status: false,msg: "Currency will be in INR"})

    if (!currencyFormat)
      return res.status(400).send({ status: false, message: "Currency Format is required!" })

    if (currencyFormat != "₹")
      return res.status(400).send({status: false, message: "Please provide the currencyformat as ₹"})

    if (isFreeShipping) {
      if (!(isFreeShipping == "true" || isFreeShipping == "false")) {
        return res.status(400).send({status: false, message: "isFreeShipping should either be True or False"})
      }
    }

    let files = req.files

    if (files && files.length > 0) {

      if (!isValidFile(files[0].originalname))
      return res.status(400).send({ status: false, message: 'Enter format jpeg/jpg/png only' })

      let uploadedFileURL = await aws.uploadFile(files[0])

      data.productImage = uploadedFileURL
    }

    else {
      return res.status(400).send({ message: "Product Image is required" })
    }

    if (!isValidName(style)) {
      return res.status(400).send({ status: false, msg: "Style is invalid" });
    }

    if (availableSizes!="S" && availableSizes!="XS" && availableSizes!="M" && availableSizes!="X" && availableSizes!="L" && availableSizes!="XXL" && availableSizes!="XL") {
       return res.status(400).send({status:false,message:"Available sizes are XS,S,M,L,X,XXL,XL, please enter available size"})
    }

    if (!isValid(installments) || !isValidNumbers(installments)) {
      return res.status(400).send({ status: false, message: "Installment is invalid" });
    }

    const productCreate = await productModel.create(data);
    res.status(201).send({ status: true, message: "Success", data: productCreate })
  } 
  catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
}

//--------------------------------------------- GET Product --------------------------------------------//




//-------------------------------------- Get Product By Id --------------------------------------//


exports.getProductById = async function (req, res) {

    try {

      let productId = req.params.productId;
  
      if (!isValidId(productId)) 
        return res.status(400).send({ status: false, message: "ProductId is not valid" })
      
      let productData = await productModel.findOne({ _id: productId,isDeleted: false})
      if (!productData) {
        return res.status(404).send({ status: false, message: "Product not exist" })
      }
  
      return res.status(200).send({ status: true, message: "Success", data: productData })
    } 
    
    catch (err) {
      return res.status(500).send({ satus: false, err: err.message });
    }
  }

  //-------------------------------------- Delete Product --------------------------------------//

exports.deleteProduct = async function (req, res) {

    try {

      let productId = req.params.productId
  
      if (!isValidId(productId)) {
        return res.status(400).send({ status: false, message: "ProductId not valid" })
      }
  
      let productData = await productModel.findOne({ _id: productId,isDeleted: false})
      if (!productData) {
        return res.status(404).send({ status: false, message: "Product not exist" })
      }
  
      await productModel.updateOne(
        { _id: productId },
        { isDeleted: true, deletedAt:moment().format("dddd, MMMM Do YYYY, h:mm:ss") }
      );
  
      return res.status(200).send({ status: true, message: "Product Successfully Deleted" })
    } 
    catch (err) {
      return res.status(500).send({ satus: false, err: err.message })
    }
  }
  