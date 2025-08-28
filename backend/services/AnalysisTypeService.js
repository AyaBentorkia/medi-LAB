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
            const {title,description,StandardValue,unite} = data;
            const analysisType = await AnalysisType.create({
                title,
                description,
                StandardValue,
                unite,
            });
            return analysisType;
    }

    // méthode pour récupérer tous les types d'analyse
     async getAnalysisTypes(query) {
        const { title} = query;
        let filtre={};
        if (title) filtre.title = { [Op.like]: `%${title}%` };
        const total = await AnalysisType.count({ where: filtre });

        const analysisTypes = await AnalysisType.findAll({
            where: filtre,
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
     async updateAnalysisType(typeId, data) {
            if (!typeId) throw new AppError('ID est requis',401);
            console.log(data)
            const {id,createdAt,updatedAt,price,...other}=data;
            const { error } = ValidateAnalysisUpdateType(other);
            console.log("error de validation : ",error)
            if (error) throw new AppError(error?.details[0].message || 'erreur de validation',400);
            const analysisType = await AnalysisType.findByPk(typeId);
            if (!analysisType) throw new AppError("Type d'analyse non trouvé", 404);
            analysisType.set(other);
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
