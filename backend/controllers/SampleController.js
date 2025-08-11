const SampleService = require("../services/SampleService");
const AppError = require("../utils/AppError");

/**
 * @desc Créer nouveau echantillon
 * @route /samples
 * @method post
 * @access private (only admin)
 */
const CreateSample= async (req, res)=>{
    try{
        const { title } = req.body;
        const sample = await SampleService.createSample(title);
        return res.status(201).json({ message: 'Échantillon créé avec succès', sample });
    }
    catch(error){
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc recuperer les echantillons
 * @route /samples
 * @method get
 * @access private (only admin secretary technician)
 */
const GetSamples = async (req, res) => {
    try {
        const samples = await SampleService.getSamples();
        return res.status(200).json({ message: 'Échantillons récupérés avec succès', samples });
    } catch (error) {

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc recuperer un echantillon par son id
 * @route /samples/:id
 * @method get
 * @access private (only admin secretary technician)
 */
const GetSampleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sample = await SampleService.getSampleById(id);
        if (!sample) {
            throw new AppError('Échantillon non trouvé', 404);
        }
        return res.status(200).json({ message: 'Échantillon récupéré avec succès', sample });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc recuperer un echantillon par son titre
 * @route /samples
 * @method get
 * @access private (only admin secretary technician)
 */
const GetSampleByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const sample = await SampleService.getSampleByTitle(title);
        if (!sample) {
            throw new AppError('Échantillon non trouvé', 404);
        }
        return res.status(200).json({ message: 'Échantillon récupéré avec succès', sample });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}


/**
 * @desc modifier les infos d'un echantillon
 * @route /samples/:id
 * @method patch
 * @access private (only admin secretary technician)
 */
const UpdateSample = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const sample = await SampleService.updateSample(id, title);
        if (!sample) {
            throw new AppError('Échantillon non trouvé', 404);
        }
        return res.status(200).json({ message: 'Échantillon modifié avec succès', sample });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}


/**
 * @desc supprimer un echantillon
 * @route /samples/:id
 * @method delete
 * @access private (only admin)
 */
const DeleteSample = async (req, res) => {
    try {
        const { id } = req.params;
        const sample = await SampleService.deleteSample(id);
        if (!sample) {
            throw new AppError('Échantillon non trouvé', 404);
        }
        return res.status(200).json({ message: 'Échantillon supprimé avec succès', sample });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    GetSamples,
    GetSampleById,
    GetSampleByTitle,
    UpdateSample,
    DeleteSample,
    CreateSample,
}