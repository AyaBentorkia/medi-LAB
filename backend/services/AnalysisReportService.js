const {AnalysisRequest,User,AnalysisResult}= require("../models");
const AppError = require("../utils/AppError");

class AnalysisReportService {

  async createReport(requestId,fileUrl) {
      const report = await this.AnalysisReportModel.create({
        AnalysisRequestId: requestId,
        fileUrl: fileUrl,
        // uploadedBy: userId, // Uncomment if you want to track who uploaded the report
      });
      const request = await AnalysisRequest.findByPk(requestId, {
        include: [
          { model: User, as: "Patient", attributes: ["id", "firstname", "lastname", "birth_date", "email"] },
          { model: AnalysisResult, as: "results", include: [{ model: AnalysisType, as: "analysisType" }] }
        ]
      });
      if (!request) throw new AppError("Demande introuvable");
// 📄 Créer un PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../uploads/reports/report-${requestId}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    // 📝 Contenu du rapport
    doc.fontSize(20).text("Rapport d'Analyse Médicale", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Patient : ${request.patient.firstname} ${request.patient.lastname}`);
    doc.fontSize(12).text(`Date de naissance : ${request.patient.birth_date.toLocaleDateString()}`);
    doc.text(`Email : ${request.patient.email}`);
    doc.text(`Date de prélèvement : ${request.SamplingDate.toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Résultats :");
    doc.moveDown();
    request.results.forEach(result => {
      doc.fontSize(12).text(
        `${result.analysisType.title} : ${result.resultValue} ${result.analysisType.unite || ""} (Standard: ${result.analysisType.StandardValue || "-"})`
      );

         if (result.comment) {
        doc.text(`Commentaire : ${result.comment}`);
      }
      doc.moveDown();
    });

    doc.end();

    stream.on("finish", async () => {
      // Sauvegarder dans la table Reports
      const report = await Report.create({
        AnalysisRequestId: requestId,
        filePath: `/uploads/reports/report-${requestId}.pdf`
      });

    });
      return report;

  }

  async getReportById(id) {
      const report = await this.AnalysisReportModel.findByPk(id);
      return report;
    
  }

  async getReportByPatient(patientId){
    const reports = await Report.findAll({
      include: [
        {
          model: AnalysisRequest,
          where: { PatientId: patientId },
          include: [{ model: User, as: "patient", attributes: ["name"] }]
        }
      ],
      order: [["generatedAt", "DESC"]]
    });
  }

  async getAllReports() {
    const reports = await Report.findAll({
      include: [
        {
          model: AnalysisRequest,
          include: [{ model: User, as: "patient", attributes: ["name"] }]
        }
      ],
      order: [["generatedAt", "DESC"]]
    });
    return reports;
  }

  async downloadReport(reportId){
    const report = await Report.findByPk(reportId);
    if (!report) throw new AppError("Rapport introuvable");
     const filePath = path.join(__dirname, `..${report.filePath}`);
    if (!fs.existsSync(filePath)) {
      throw new AppError("Fichier introuvable", 404);
    }

    return filePath
  }

}

module.exports = AnalysisReportService;
