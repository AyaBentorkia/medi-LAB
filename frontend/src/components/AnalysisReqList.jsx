import { Eye } from "lucide-react";
import React from "react";

const AnalysisReqList = ({
  role,
  filteredRequests,
  getStatusBadge,
  setIsModalAddReqOpen,
  setSelectedRequestId,
  setIsModalViewOpen,
}) => {
  return (
    <div className="table-container">
      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom & Prénom</th>
            <th>ID du patient</th>
            <th>Date de création</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests?.map((request) => (
            <tr key={request?.id}>
              <td>{request?.id}</td>
              <td>
                <div className="patient-info">
                  <div className="patient-avatar">
                    {`${request?.patient?.firstname[0]}${request?.patient?.lastname[0]}`}
                  </div>
                  <div className="patient-details">
                    <div className="patient-name">{`${request?.patient?.firstname} ${request?.patient?.lastname}`}</div>
                  </div>
                </div>
              </td>
              <td>{request?.patient?.id}</td>
              <td>{request?.createdAt.split("T")[0]}</td>
              <td>{getStatusBadge(request?.status)}</td>
              <td>
                <div className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setIsModalAddReqOpen(false);
                      setSelectedRequestId(request?.id);
                      setIsModalViewOpen(true);
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisReqList;
