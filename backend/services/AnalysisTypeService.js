const {AnalysisType} = require("../models");
const AppError = require("../utils/AppError");
const joi= require("joi")

// ce fichier contient les services liés aux types d'analyse
function ValidateAnalysisType(obj){
       const schema=joi.object({
           title:joi.string().trim().required(),
           description:joi.string().trim().optional(),
           StandardValue:joi.string().trim().optional(),
           price:joi.number().min(0).optional().default(0.0),
           unite:joi.string().trim().optional(),
       })
    return schema.validate(obj);
}
function ValidateAnalysisUpdateType(obj){
    const schema=joi.object({
        title:joi.string().trim().optional(),
        description:joi.string().trim().optional(),
        StandardValue:joi.string().trim().optional(),
        price:joi.number().min(0).optional().default(0.0),
        unite:joi.string().trim().optional(),
    })
    return schema.validate(obj);
}
class AnalysisTypeService {
    // méthode pour créer un type d'analyse
     async createAnalysisType(data) {
            const { error } = ValidateAnalysisType(data);
            if (error) throw new AppError("Données d'entrée invalides", 400);
            const {title,description,StandardValue,unite,price} = data;
            const analysisType = await AnalysisType.create({
                title,
                description,
                StandardValue,
                unite,
                price
            });
            return analysisType;
    }

    // méthode pour récupérer tous les types d'analyse
     async getAnalysisTypes(query) {
        const { title,page,limit } = query;
             const pageQ = parseInt(page) || 1; // Page actuelle
        const limitQ = parseInt(limit) || 5;
        const skip = (pageQ - 1) * limitQ;
        let filtre={};
        if (title) filtre.title = { [Op.like]: `%${title}%` };
        const total = await AnalysisType.count({ where: filtre });

        const analysisTypes = await AnalysisType.findAll({
            where: filtre,
            limit: limitQ,
            offset: skip
        });
        return { total, analysisTypes };
    }

    // méthode pour récupérer un type d'analyse par son id
     async getAnalysisTypeById(id) {
            if (!id) throw new AppError('ID est requis',400);
            const analysisType = await AnalysisType.findByPk(id);
            if (!analysisType) throw new AppError("Type d'analyse non trouvé", 404);
            return analysisType;
    }

    // méthode pour mettre à jour un type d'analyse
     async updateAnalysisType(id, data) {
            if (!id) throw new AppError('ID est requis',400);
            console.log(data)
            const { error } = ValidateAnalysisUpdateType(data);
            if (error) throw new AppError("Données d'entrée invalides", 400);
            const analysisType = await AnalysisType.findByPk(id);
            if (!analysisType) throw new AppError("Type d'analyse non trouvé", 404);
            analysisType.set(data);
            await analysisType.save();
            return analysisType;
    }

    // méthode pour supprimer un type d'analyse
     async deleteAnalysisType(id) {
            if (!id) throw new AppError('ID est requis',400);
            const analysisType = await AnalysisType.findByPk(id);
            if (!analysisType) throw new AppError("Type d'analyse non trouvé", 404);
            await analysisType.destroy();
            return analysisType;
    }
}
module.exports = new AnalysisTypeService();
