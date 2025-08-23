const [User, AnalysisReport]=require("../models/");
// services/emailService.js
const User = require('../models/User');
const transporter = require('../utils/mailer');

async function sendAnalysisReportEmail( patientId, analysisReportId) {
    const patient=await User.findByPk(patientId);
    const analysisisReport= await AnalysisReport.findByPk(analysisReportId);
  const mailOptions = {
    from: `"Lab" ${process.env.APP_EMAIL_ADDRESSE}` ,
    to: patient.email,
    subject: `Rapport d'analyses médicales - ${patient.firstname + patient.lastname}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Bonjour ${patient.firstname},</h2>
        <p>Veuillez trouver ci-joint votre rapport d’analyses médicales.</p>
        <p><b>Important :</b> Merci de ne pas répondre à ce mail automatique.</p>
        <br>
        <p>Cordialement,<br>
        <b>Laboratoire d’analyses médicales</b></p>
      </div>
    `,
    attachments: [
      {
        filename: `rapport_${Date.now()}.pdf`,
        path: analysisisReport.path, // chemin vers le fichier généré
        contentType: 'application/pdf',
      },
    ],
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé à', toEmail);
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
  }
}

module.exports = new sendAnalysisReportEmail();
