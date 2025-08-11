const AppError = require("../utils/AppError");
const {Sample}= require("../models");

// ce fichier contient les services liés aux échantillons
class SampleService {
    // Créer un nouvel échantillon
    async createSample(title){
            if(!title) throw new AppError('Title est requis',400);
            const sample = await Sample.create({ title });
            return sample;
    }
    //recuperer les echantillons
    async getSamples() {
            const samples = await Sample.findAll();
            return samples;
    }
    //recuperer un echantillon par son id
    async getSampleById(id) {
            if (!id) throw new AppError('ID est requis',400);
            const sample = await Sample.findByPk(id);
            if (!sample) throw new AppError('Échantillon non trouvé',404);
            return sample;
       
    }
    //recuperer echantillon par son titre
    async getSampleByTitle(title) {
            if (!title) throw new AppError('Title est requis',400);
            const sample = await Sample.findOne({ where: { title } });
            if (!sample) throw new AppError('Échantillon non trouvé',404);
            return sample;
       
    }
    //modifier infos d'echantillon
    async updateSample(id, title) {
            if (!id) throw new AppError('ID est requis',400);
            if (!title) throw new AppError('Title est requis',400);
            const sample = await Sample.findByPk(id);
            if (!sample) throw new AppError('Échantillon non trouvé',404);
            sample.set({ title });
            await sample.save();
            return sample;
       
    }
    //supprimer echantillon
    async deleteSample(id) {
            if (!id) throw new AppError('ID est requis',400);
            const sample = await Sample.findByPk(id);
            if (!sample) throw new AppError('Échantillon non trouvé',404);
            await sample.destroy();
            return { message: 'Échantillon supprimé avec succès' };
       }



}
module.exports = new SampleService();