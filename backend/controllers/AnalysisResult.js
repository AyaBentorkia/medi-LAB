const AnalysisResultService= require("../services/AnalysisResultService");
const AppError = require("../utils/AppError");
/**
 * @desc Créer plusieurs résultats d'analyse
 * @route POST /analysis-results/:requestId
 * @access Private (technician)
 */
const createMultipleResults = async (req, res) => {
  try {
    const { requestId } = req.params;
    const technicianId = req.user.id; // supposé récupéré via middleware auth
    const analysisResultData = req.body; // tableau des résultats à créer

    const results = await AnalysisResultService.createMultipleResults(
      analysisResultData,
      requestId,
      technicianId
    );

    return res.status(201).json({ message: 'Résultats créés avec succès', results });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @desc Récupérer tous les résultats pour une demande d'analyse
 * @route GET /analysis-results/request/:requestId
 * @access Private
 */
const getResultsByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const results = await AnalysisResultService.getResultsByRequestId(requestId);
    return res.status(200).json({ message: 'Résultats récupérés avec succès', results });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @desc Mettre à jour un résultat d'analyse
 * @route PATCH /analysis-results/:id
 * @access Private (technician)
 */
const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedResult = await AnalysisResultService.updateResult(id, updates);
    return res.status(200).json({ message: 'Résultat modifié avec succès', updatedResult });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @desc Supprimer un résultat d'analyse
 * @route DELETE /analysis-results/:id
 * @access Private (technician)
 */
const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await AnalysisResultService.deleteResult(id);
    return res.status(200).json({ message: response.message });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  createMultipleResults,
  getResultsByRequestId,
  updateResult,
  deleteResult,
};