const productModel = require("../model/productModel")
const aws = require("../aws/aws")

const { isValidBody, isValidTitle, isValid, isValidPrice, isValidName, isValidNumbers, isValidFile } = require("../validation/validation")

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
      return res.status(400).send({ status: false, message: "Installments' is invalid" });
    }

    const productCreate = await productModel.create(data);
    res.status(201).send({ status: true, message: "Success", data: productCreate })
  } 
  catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
}

