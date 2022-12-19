const userModel = require('../model/userModel')

const getUserData = async function(req,res){

    try{
        let userId = req.params.userId

        let userData = await userModel.findById(userId)
        if(!userData){
            return res.status(404).send({status:false,msg:"user not found"})
        }

        let data = {
            address:userData.address,
            _id:userData._id,
            fname:userData.fname,
            lname:userData.lname,
            email:userData.email,
            profileImage:userData.profileImage,
            phone:userData.phone,
            password:userData.password
        }
        return res.status(200).send({status:true,message:"User profile details",data:data})

    } catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports.getUserData = getUserData