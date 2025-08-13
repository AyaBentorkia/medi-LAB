const {AnalysisResult,AnalysisRequest,AnalysisType}=require("../models")
const AppError = require("../utils/AppError");
//a faire demain, ajouter les includes au resultats de retour
class AnalysisResultService {

    // Création de plusieurs résultats d'analyse
    async createMultipleResults(analysisResultData, requestId, TechnicianId) {
            // Vérification de l'existence de la demande d'analyse
            const request = await AnalysisRequest.findByPk(requestId, {
                    include: [
                        {
                            model: AnalysisType,
                            as: 'analysisTypes',
                            through: { attributes: [] } // évite de ramener les colonnes de la table pivot
                        }
                    ]
                });
                if (!request)  throw new AppError("La demande d'analyse n'est pas trouvée",404);
                 if (!request.analysisTypes || request.analysisTypes.length === 0) {
        throw new AppError("Aucun type d'analyse associé à cette demande", 400);
    } 
    if (analysisResultData.length !== request.analysisTypes.length) {
        throw new AppError(
            `Le nombre de résultats (${analysisResultData.length}) ne correspond pas au nombre de types attendus (${request.analysisTypes.length})`,
            400
        );
    }
            // Construire les enregistrements à créer
             const toCreate = request.analysisTypes.map((type, index) => ({
        AnalysisRequestId: requestId,
        AnalysisTypeId: type.id,
        resultValue: analysisResultData[index].resultValue,
        comment: analysisResultData[index].comment || null,
        TechnicianId: TechnicianId,
    }));

            // Création multiple en base (transaction possible si besoin)
            const createdResults = await AnalysisResult.bulkCreate(toCreate);

            const resultsWithTypeTitle = createdResults.map((result, i) => ({
    id: result.id,
    AnalysisRequestId: result.AnalysisRequestId,
    AnalysisTypeId: result.AnalysisTypeId,
    resultValue: result.resultValue,
    comment: result.comment,
    TechnicianId: result.TechnicianId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    analysisTypeTitle: request.analysisTypes[i].title || request.analysisTypes[i].name // adapte selon le nom réel de ton attribut
  }));

  return resultsWithTypeTitle;
       
        }

        // Récupération de tous les résultats d'analyse pour une demande donnée
          async getResultsByRequestId(requestId) {
    const results = await AnalysisResult.findAll({
      where: { AnalysisRequestId: requestId },
      include: [
        {
          model: AnalysisType,
          as: 'analysisType',
          attributes: ['id', 'title', 'name'] // adapter selon le champ exact
        }
      ]
    });
    if (!results || results.length === 0) throw new AppError("Aucun résultat d'analyse trouvé", 404);

    // Ajouter un champ analysisTypeTitle dans chaque résultat pour uniformiser
    const resultsWithTypeTitle = results.map(r => ({
      id: r.id,
      AnalysisRequestId: r.AnalysisRequestId,
      AnalysisTypeId: r.AnalysisTypeId,
      resultValue: r.resultValue,
      comment: r.comment,
      TechnicianId: r.TechnicianId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      analysisTypeTitle: r.analysisType?.title || r.analysisType?.name || null
    }));

    return resultsWithTypeTitle;
  }


        // Mise à jour d'un résultat d'analyse
       async updateResult(resultId, updateData) {
    const result = await AnalysisResult.findByPk(resultId, {
      include: [
        {
          model: AnalysisType,
          as: 'analysisType',
          attributes: ['id', 'title', 'name']
        }
      ]
    });
    if (!result) throw new AppError("Résultat d'analyse non trouvé", 404);

    await result.update(updateData);

    return {
      id: result.id,
      AnalysisRequestId: result.AnalysisRequestId,
      AnalysisTypeId: result.AnalysisTypeId,
      resultValue: result.resultValue,
      comment: result.comment,
      TechnicianId: result.TechnicianId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      analysisTypeTitle: result.analysisType?.title || result.analysisType?.name || null
    };
  }
         // Suppression d’un résultat
  async deleteResult(id) {
    const result = await AnalysisResult.findByPk(id);
    if (!result) throw new AppError('Résultat introuvable', 404);
    await result.destroy();
    return { message: 'Résultat supprimé avec succès' };
  }
}
module.exports = new AnalysisResultService();