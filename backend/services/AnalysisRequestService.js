const {AnalysisRequest} = require("../models");
const {User,Sample,AnalysisType} = require("../models");
const AppError = require("../utils/AppError");
const {Op} = require('sequelize');
const joi= require('joi');


//ce fichier contient les services pour les demandes d'analyse
function ValidateAnalysisRequest(obj){
       const schema=joi.object({
           status:joi.string().valid('En attente', 'En cours', 'Terminé').default('En attente'),
           note:joi.string().optional(),
           samplingDate:joi.date().optional(),
           CIN:joi.string().required(),
       })
    return schema.validate(obj);
}
class AnalysisRequestService {
    // méthode pour créer une demande d'analyse
    async createAnalysisRequest(data,SecretaryId) {
            const {status,note,samplingDate,CIN,analysisTypes,samples}=data;
            const {error}=ValidateAnalysisRequest({status,note,samplingDate,CIN});
            if(error) throw new AppError(error.details[0].message,400);
            const patient = await User.findOne({ where: { CIN } });
            if (!patient) throw new AppError('Patient non trouvé', 404);
            console.log("*********PPatient ID", patient.id)
            const newAnalysisRequest=await AnalysisRequest.create({...data,PatientId: patient.id,SecretaryId});

             // Ajoute l'association des types d'analyses si présents
    if (Array.isArray(analysisTypes) && analysisTypes.length > 0) {
        await newAnalysisRequest.setAnalysisTypes(analysisTypes);
    }
    
    // Ajoute l'association des samples si présents
    if (Array.isArray(samples) && samples.length > 0) {
        await newAnalysisRequest.setSamples(samples);
    }
            // Recharge la demande avec les associations pour retourner les infos complètes
  const analysisRequest = await AnalysisRequest.findByPk(newAnalysisRequest.id, {
    include: [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'CIN', 'firstname', 'lastname', 'birth_date', 'phoneNumber']
      },
      {
        model: AnalysisType,
        as: 'analysisTypes',
        attributes: ['id', 'title','unite'] 
      },
      {
        model: Sample,
        as: 'samples',
        attributes: ['id', 'title']
      }
    ]
  });

            return analysisRequest;
    }
    // méthode pour récupérer toutes les demandes d'analyse
    async getAnalysisRequests(query,secretaryId) {
            const { page, limit, status} = query;
                         const pageQ = parseInt(page) || 1; // Page actuelle
                    const limitQ = parseInt(limit) || 5;
                    const skip = (pageQ - 1) * limitQ;
                    let filtre={SecretaryId: secretaryId};
                    
                    if (status) filtre.status = { [Op.like]: `%${status}%` };
             const total = await AnalysisRequest.count({ where: filtre });

  // Liste paginée avec filtre
  const analysisRequests = await AnalysisRequest.findAll({
    where: filtre,  
                offset: skip,
                limit: limitQ,
                include: [{
                    model: User,
                    as: 'patient',
                    attributes: ['id', "CIN",'firstname','lastname','birth_date']
                },
            {
        model: AnalysisType,
        as: 'analysisTypes',
        attributes: ['id', 'title'] 
      },
      {
        model: Sample,
        as: 'samples',
        attributes: ['id', 'title']
      }]
            });
            return {analysisRequests, total};
        
    }
       // méthode pour récupérer toutes les demandes d'analyse
    async getAllAnalysisRequests(query) {
            const { page, limit, status} = query;
                         const pageQ = parseInt(page) || 1; // Page actuelle
                    const limitQ = parseInt(limit) || 5;
                    const skip = (pageQ - 1) * limitQ;
                    let filtre={};
                    
                    if (status) filtre.status = { [Op.like]: `%${status}%` };
             const total = await AnalysisRequest.count({ where: filtre });

  // Liste paginée avec filtre
  const analysisRequests = await AnalysisRequest.findAll({
    where: filtre,  
                offset: skip,
                limit: limitQ,
                include: [{
                    model: User,
                    as: 'patient',
                    attributes: ['id', "CIN",'firstname','lastname','birth_date']
                },
            {
        model: AnalysisType,
        as: 'analysisTypes',
        attributes: ['id', 'title'] 
      },
      {
        model: Sample,
        as: 'samples',
        attributes: ['id', 'title']
      }]
            });
            return {analysisRequests, total};
        
    }

    // méthode pour récupérer une demande d'analyse par son ID
    async getAnalysisRequestById(id) {
            if(!id) throw new AppError('ID de la demande d\'analyse manquant', 400);
            const analysisRequest = await AnalysisRequest.findByPk(id, {
                include: [{
                    model: User,
                    as: 'patient',
                    attributes: ['id', "CIN",'firstname','lastname','birth_date']
                },
                {
                    model: AnalysisType,
                    as: 'analysisTypes',
        attributes: ['id', 'title','unite', 'StandardValue'] 
                },
                {
                    model: Sample,
                    as: 'samples',
                    attributes: ['id', 'title']
                }
                ]
            });
            if (!analysisRequest) throw new AppError('Demande d\'analyse non trouvée',404);
            return analysisRequest;
       
    }

    // méthode pour mettre à jour une demande d'analyse
    async updateAnalysisRequest(id, data, patientId) {
        try {
            if(!id) throw new AppError('ID de la demande d\'analyse manquant', 400);
            const {status, note, samplingDate} = data;
            const {error} = ValidateAnalysisRequest({status, note, samplingDate});
            if(error) throw new AppError(error.details[0].message, 400);
            const analysisRequest = await AnalysisRequest.findByPk(id);
            if (!analysisRequest) throw new AppError('Demande d\'analyse non trouvée',404);
            analysisRequest.set({data, patientId});
            await analysisRequest.save();
            const patientInfo= await User.findByPk(patientId, {
                attributes: ['id','CIN' ,'firstname','lastname','birth_date']
            });
            const analysisRequestUpdated = {
                ...analysisRequest.toJSON(),
                patient: patientInfo
            };
            return analysisRequestUpdated;
        } catch (error) {
            throw new Error("Erreur de serveur");
        }
    }
    //methode pour gerer le statut du demande d'analyse
    async updateAnalysisRequestStatus(id, status) {
            if (!id) throw new AppError('ID de la demande d\'analyse manquant', 400);
            const analysisRequest = await AnalysisRequest.findByPk(id);
            if (!analysisRequest) throw new AppError('Demande d\'analyse non trouvée', 404);
            analysisRequest.set({status});
            await analysisRequest.save();
            return analysisRequest;
            
    }

    // méthode pour supprimer une demande d'analyse
    async deleteAnalysisRequest(id) {
        try {
            if(!id) throw new AppError('ID de la demande d\'analyse manquant', 400);
            const analysisRequest = await AnalysisRequest.findByPk(id);
            if (!analysisRequest) throw new AppError('Demande d\'analyse non trouvée',404);
            await analysisRequest.destroy();
            return { message: 'Demande d\'analyse supprimée avec succès' };
        } catch (error) {
            throw new Error("Erreur de serveur");
        }
    }

}
module.exports = new AnalysisRequestService();
