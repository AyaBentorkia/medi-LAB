const EmailService = require("../services/EmailService");
const AppError = require("../utils/AppError");

const SendAnalysisReportEmail= async(req,res)=>{
    try{
       const mail= await EmailService.sendAnalysisReportEmail(req.params.id);
    return res.status(200).json({ message: 'Mail envoyé avec succès', mail });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
module.exports= {SendAnalysisReportEmail}