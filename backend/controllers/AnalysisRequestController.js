const AnalysisRequestService = require("../services/AnalysisRequestService");
const AppError = require("../utils/AppError");
const {User} = require("../models");

/**
 * @desc Créer nouveau demande d'analyse
 * @route /analysis-requests
 * @method post
 * @access private (only secretaries)
 */
const CreateAnalysisRequest = async (req, res) => {
    try{
        const secretaryId = req.user.id;
        const {analysisRequest,notification} = await AnalysisRequestService.createAnalysisRequest(req.body, secretaryId);
        return res.status(200).json({ message: 'Demande d\'analyse créée avec succès', analysisRequest, notification });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Recuperer les demandes d'analyse
 * @route /analysis-requests
 * @method get
 * @access private (only admin tech secretary)
 */
const GetAnalysisRequests = async (req, res) => {
    try{
        const { total, analysisRequests } = await AnalysisRequestService.getAnalysisRequests(req.query, req.user.id);
        return res.status(200).json({ message: 'Demandes d\'analyse récupérées avec succès', total, analysisRequests });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Recuperer les demandes d'analyse
 * @route /analysis-requests
 * @method get
 * @access private (only admin tech secretary)
 */
const GetAllAnalysisRequests = async (req, res) => {
    try{
        const { total, analysisRequests } = await AnalysisRequestService.getAllAnalysisRequests(req.query);
        return res.status(200).json({ message: 'Demandes d\'analyse récupérées avec succès', total, analysisRequests });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Recuperer la demande d'analyse par id
 * @route /analysis-requests/:id
 * @method get
 * @access private (only admin)
 */
const GetAnalysisRequestById = async (req, res) => {
    try{
        const analysisRequest = await AnalysisRequestService.getAnalysisRequestById(req.params.id);
        return res.status(200).json({ message: 'Demande d\'analyse récupérée avec succès', analysisRequest });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Mettre à jour un type d'analyse
 * @route /analysis-types/:id
 * @method put
 * @access private (only admin, secretary)
 */
const UpdateAnalysisRequest = async (req, res) => {
    try{
        const analysisRequest = await AnalysisRequestService.updateAnalysisRequest(req.params.id, req.body);
        return res.status(200).json({ message: 'Demande d\'analyse mise à jour avec succès', analysisRequest });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Mettre à jour la statut d'une demande d'analyse
 * @route /analysis-requests/:id
 * @method put
 * @access private (only admin, secretary)
 */
const UpdateAnalysisRequestStatus = async (req, res) => {
    try{
        const analysisRequest = await AnalysisRequestService.updateAnalysisRequestStatus(req.params.id, req.body.status);
        return res.status(200).json({ message: 'Statut de la demande d\'analyse mise à jour avec succès', analysisRequest });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}


/**
 * @desc Supprimer une demande d'analyse
 * @route /analysis-requests/:id
 * @method delete
 * @access private (only admin)
 */
const DeleteAnalysisRequest = async (req, res) => {
    try{
        await AnalysisRequestService.deleteAnalysisRequest(req.params.id);
        return res.status(204).json({ message: 'Demande d\'analyse supprimée avec succès' });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    CreateAnalysisRequest,
    GetAnalysisRequests,
    GetAnalysisRequestById,
    UpdateAnalysisRequest,
    UpdateAnalysisRequestStatus,
    DeleteAnalysisRequest,
    GetAllAnalysisRequests
}