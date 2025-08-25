import React from "react";
import "../AnalysisResults/AddResultModal.css"; // on réutilise le même style
import { X, Trash2, Send, Download, Eye } from "lucide-react";

const ReportActionModal = ({
  isOpen,
  onClose,
  report,
  actionType, // "view" | "download" | "send" | "delete"
  handleDeleteReport,
  handleSendReport,
  message,
}) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (actionType) {
      case "view":
        return (
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <Eye size={18} className="icon-add-result" />
              Aperçu du rapport
            </h3>
            <iframe
              src={report?.fileUrl}
              title="Rapport PDF"
              style={{
                width: "100%",
                height: "400px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
          </div>
        );

      case "download":
        return (
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <Download size={18} className="icon-add-result" />
              Télécharger le rapport
            </h3>
            <p>Voulez-vous télécharger ce rapport ?</p>
          </div>
        );

      case "send":
        return (
          <div className="form-add-result-section">
            <h3 className="section-add-result-title">
              <Send size={18} className="icon-add-result" />
              Envoyer le rapport par email
            </h3>
            <p>
              Le rapport sera envoyé à :{" "}
              <b>{report?.request?.patient?.email || "Adresse non disponible"}</b>
            </p>
            {message && <div className="alert success">{message}</div>}
          </div>
        );

      case "delete":
        return (
          <div className="form-add-result-section" style={{ borderLeft: "4px solid #dc2626" }}>
            <h3 className="section-add-result-title">
              <Trash2 size={18} className="icon-add-result" />
              Supprimer le rapport
            </h3>
            <p>Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.</p>
          </div>
        );

      default:
        return <p>Aucune action sélectionnée.</p>;
    }
  };

  return (
    <div className="modal-add-result-overlay analysis-request-modal">
      <div className="modal-add-result-content">
        {/* Header */}
        <div className="modal-add-result-header">
          <h2 className="modal-add-result-title">
            {actionType === "view" && <>📄 Consulter le Rapport</>}
            {actionType === "download" && <>⬇️ Télécharger le Rapport</>}
            {actionType === "send" && <>✉️ Envoyer le Rapport</>}
            {actionType === "delete" && <>🗑️ Supprimer le Rapport</>}
          </h2>
          <button
            type="button"
            className="modal-add-result-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-add-result-body">{renderContent()}</div>

        {/* Footer */}
        <div className="modal-add-result-footer">
          <button
            type="button"
            className="cancel-add-result-btn btn-add-result"
            onClick={onClose}
          >
            Annuler
          </button>

          {actionType === "download" && (
            <a
              href={report?.fileUrl}
              download
              className="submit-add-result-btn btn-add-result"
            >
              <Download size={18} /> Télécharger
            </a>
          )}

          {actionType === "send" && (
            <button
              type="button"
              className="submit-add-result-btn btn-add-result"
              onClick={() => handleSendReport(report?.id)}
            >
              <Send size={18} /> Envoyer
            </button>
          )}

          {actionType === "delete" && (
            <button
              type="button"
              className="submit-add-result-btn btn-add-result"
              style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}
              onClick={() => handleDeleteReport(report?.id)}
            >
              <Trash2 size={18} /> Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportActionModal;
