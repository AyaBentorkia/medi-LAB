const AnalysisTypeService = require("../services/AnalysisTypeService");
const AppError = require("../utils/AppError");


/**
 * @desc Créer nouveau type d'analyse
 * @route /analysis-types
 * @method post
 * @access private (only admin)
 */
const CreateAnalysisType = async (req, res) => {
    try{
        const analysisType = await AnalysisTypeService.createAnalysisType(req.body);
        return res.status(200).json({ message: 'Type d\'analyse créé avec succès', analysisType });
    }
    catch(error){
        console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
    return res.status(500).json({ message: error || "Server error" });
    }
}

/**
 * @desc Recuperer les types d'analyse
 * @route /analysis-types
 * @method get
 * @access private (only admin)
 */
const GetAnalysisTypes = async (req, res) => {
    try{
        const { total, analysisTypes } = await AnalysisTypeService.getAnalysisTypes(req.query);
        return res.status(200).json({ message: 'Types d\'analyse récupérés avec succès', total, analysisTypes });
    }
    catch(error){
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Recuperer le type d'analyse par id
 * @route /analysis-types/:id
 * @method get
 * @access private (only admin)
 */
const GetAnalysisTypeById = async (req, res) => {
    try{
        const analysisType = await AnalysisTypeService.getAnalysisTypeById(req.params.id);
        return res.status(200).json({ message: 'Type d\'analyse récupéré avec succès', analysisType });
    }
    catch(error){
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
 * @access private (only admin)
 */
const UpdateAnalysisType = async (req, res) => {
    try{
        const analysisType = await AnalysisTypeService.updateAnalysisType(req.params.id, req.body);
        return res.status(200).json({ message: 'Type d\'analyse mis à jour avec succès', analysisType });
    }
    catch(error){
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Supprimer un type d'analyse
 * @route /analysis-types/:id
 * @method delete
 * @access private (only admin)
 */
const DeleteAnalysisType = async (req, res) => {
    try{
        await AnalysisTypeService.deleteAnalysisType(req.params.id);
        return res.status(204).json({ message: 'Type d\'analyse supprimé avec succès' });
    }
    catch(error){
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    CreateAnalysisType,
    GetAnalysisTypes,
    GetAnalysisTypeById,
    UpdateAnalysisType,
    DeleteAnalysisType
}