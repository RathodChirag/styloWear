const jwt = require("jsonwebtoken");
const AdminModel = require("../Model/adminModel");

const auth = async (req,res,next) =>{
    console.log('in auth file');
    const token = req.body.token;

    if(!token){
        res.status(401).json({message:"Unauthorized"});
    }

    try {
        const verifyToken = jwt.verify(token,'This&is&my@secret*key&Dont@try@tocrackIt');
        console.log('verify token',verifyToken);
        req.user = await AdminModel.findById({_id: verifyToken._id});
        console.log('user', req.user);
        next();
        console.log("admin authenticated successfully !!");
    } catch (error) {
        return res.status(401).json({message:"Invalid Token"});
    }
}

module.exports = auth;