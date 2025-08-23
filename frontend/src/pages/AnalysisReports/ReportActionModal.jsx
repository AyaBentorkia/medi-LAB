import React, { useState } from "react";
import { X, Trash2, Send, Download, Eye } from "lucide-react";
import axios from "axios";

const ReportActionModal = ({ 
  isOpen, 
  onClose, 
  report, 
  actionType, 
  token 
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (actionType === "delete") {
      handleDeleteReport();
      return;
    }

    if (actionType === "send" && !email) {
      handleSendReport();
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Ici vous ajouterez l'appel API pour envoyer par email
      const response = await axios.post(
        `http://localhost:5000/api/reports/${report.id}/send`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Rapport envoyé avec succès!");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("Erreur lors de l'envoi: " + error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalConfig = () => {
    switch (actionType) {
      case "delete":
        return {
          title: "Confirmer la suppression",
          content: "Êtes-vous sûr de vouloir supprimer ce rapport? Cette action est irréversible.",
          icon: <Trash2 size={24} className="text-red-500" />,
          buttonText: "Supprimer",
          buttonClass: "bg-red-500 hover:bg-red-600"
        };
      case "send":
        return {
          title: "Envoyer le rapport par email",
          content: "Entrez l'adresse email du destinataire",
          icon: <Send size={24} className="text-blue-500" />,
          buttonText: "Envoyer",
          buttonClass: "bg-blue-500 hover:bg-blue-600"
        };
      case "download":
        return {
          title: "Télécharger le rapport",
          content: "Voulez-vous télécharger ce rapport?",
          icon: <Download size={24} className="text-green-500" />,
          buttonText: "Télécharger",
          buttonClass: "bg-green-500 hover:bg-green-600"
        };
      default:
        return {
          title: "Action",
          content: "",
          icon: null,
          buttonText: "Confirmer",
          buttonClass: "bg-gray-500 hover:bg-gray-600"
        };
    }
  };

  const config = getModalConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {config.icon}
            <h2 className="text-xl font-semibold">{config.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-600 mb-4">{config.content}</p>
          
          {actionType === "send" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email du destinataire
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="exemple@email.com"
                  required
                />
              </div>
            </form>
          )}

          {message && (
            <div className={`p-3 rounded-md ${
              message.includes("succès") 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={actionType === "send" ? undefined : handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md ${config.buttonClass} disabled:opacity-50`}
          >
            {isLoading ? "Chargement..." : config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportActionModal;