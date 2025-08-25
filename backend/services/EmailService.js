const {User, AnalysisReport,AnalysisRequest}=require("../models/");
const AppError = require("../utils/AppError");
// services/emailService.js
const transporter = require('../utils/mailer');
class EmailService{

async sendAnalysisReportEmail(analysisReportId) {
    const analysisisReport= await AnalysisReport.findByPk(analysisReportId,
      {include:[
        {
model: AnalysisRequest,
            as: 'request',
            attributes: ['id'],
            include:[
               {
model: User,
            as: 'patient',
            attributes: ['firstname', 'lastname','email']    
              }
            ]    
              }
      ]}
    );
    // const patient=await User.findByPk(patientId);
  const mailOptions = {
    from: `"Lab" ${process.env.APP_EMAIL_ADDRESSE}` ,
    to: analysisisReport?.request?.patient?.email,
    subject: `Rapport d'analyses médicales - ${analysisisReport?.request?.patient?.firstname + analysisisReport?.request?.patient?.lastname}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Bonjour ${analysisisReport?.request?.patient?.firstname},</h2>
        <p>Veuillez trouver ci-joint votre rapport d’analyses médicales.</p>
        <br>
        <p>Cordialement,<br>
        <b>Laboratoire d’analyses médicales</b></p>
      </div>
    `,
    attachments: [
      {
        filename: `rapport_${Date.now()}.pdf`,
        path: analysisisReport.fileUrl, // chemin vers le fichier généré
        contentType: 'application/pdf',
      },
    ],
  };


  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
    throw new AppError("Erreur lors de l'envoi ",500)
  }
  return analysisisReport;
}
}
module.exports = new EmailService();
