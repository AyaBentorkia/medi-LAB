const {AnalysisResult,AnalysisRequest}=require("../models")
const AppError = require("../utils/AppError");
//a faire demain, ajouter les includes au resultats de retour
class AnalysisResultService {

    // Création de plusieurs résultats d'analyse
    async createMultipleResults(analysisResultData, requestId, TechnicianId) {
            const { resultValue, comment } = analysisResultData;
            // Vérification de l'existence de la demande d'analyse
            const request = await AnalysisRequest.findByPk(requestId);
            if (!request)  throw new AppError("La demande d'analyse n'est pas trouvée",404);
                // Valider que chaque AnalysisTypeId existe dans la base
            const typeIds = analysisResultData.map(r => r.AnalysisTypeId);
            const validTypes = await AnalysisType.findAll({ where: { id: typeIds } });
            if (validTypes.length !== typeIds.length) {
            throw new AppError('Un ou plusieurs types d’analyse invalides', 400);
            }
            // Construire les enregistrements à créer
            const toCreate = analysisResultData.map(r => ({
                AnalysisRequestId: requestId,
                AnalysisTypeId: r.AnalysisTypeId,
                resultValue: r.resultValue,
                comment: r.comment || null,
                TechnicianId: TechnicianId,
            }));

            // Création multiple en base (transaction possible si besoin)
            const createdResults = await AnalysisResult.bulkCreate(toCreate);

            return createdResults;
       
        }

        // Récupération de tous les résultats d'analyse pour une demande donnée
        async getResultsByRequestId(requestId) {
            const results = await AnalysisResult.findAll({ where: { AnalysisRequestId: requestId } });
            if (!results) throw new AppError("Aucun résultat d'analyse trouvé", 404);
            return results;
        }
        // Mise à jour d'un résultat d'analyse
        async updateResult(resultId, updateData) {
            const result = await AnalysisResult.findByPk(resultId);
            if (!result) throw new AppError("Résultat d'analyse non trouvé", 404);
            await result.update(updateData);
            return result;
        }
         // Suppression d’un résultat
  async deleteResult(id) {
    const result = await AnalysisResult.findByPk(id);
    if (!result) throw new AppError('Résultat introuvable', 404);
    await result.destroy();
    return { message: 'Résultat supprimé avec succès' };
  }
    }