const jwt=require("jsonwebtoken");
const User = require("../models/User");
const VerifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization || req.headers.Authorization;
    //Bearer token
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"unauthorized"});
    }
    const token = authHeader.split(" ")[1]; 
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.status(403).json({message:"access forbidden"});
        }
        req.user=decoded.userInfo;    
        next();
    })
}
const verifyAdmin=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="Admin"){
        next();
    }
    else{
        return res.status(400).json({message:"access denied, admin only"});
    }})
}
const verifySecretaire=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="Secrétaire d'accueil"){
        next();
    }
    else{
        return res.status(400).json({message:"access denied, secrétaire only"});
    }})
}
const verifyTechnicienLabo=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="Technicien de laboratoire"){
        next();
    }
    else{
        return res.status(400).json({message:"access denied, technicien de laboratoire only"});
    }})
}
const verifyAccountStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findByPk(userId, {
      attributes: ['status'],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: "Account not active" });
    }
    next();
  } catch (error) {
    console.error('verifyAccountStatus error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};module.exports = {
  VerifyToken,
  verifyAdmin,
  verifySecretaire,
  verifyTechnicienLabo,
  verifyAccountStatus
};
