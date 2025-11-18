import React from 'react';

const ActivityLog = ({ logs }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bi-plus-circle-fill text-success';
      case 'UPDATE':
        return 'bi-pencil-fill text-primary';
      case 'COMPLETE':
        return 'bi-check-circle-fill text-success';
      case 'DELETE':
        return 'bi-trash-fill text-danger';
      default:
        return 'bi-circle-fill text-secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          <i className="bi bi-clock-history display-4"></i>
          <p className="mt-2">No activity yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>
          Recent Activity
        </h5>
      </div>
      <div className="card-body">
        <div className="list-group list-group-flush">
          {logs.map((log) => (
            <div key={log.id} className="list-group-item px-0">
              <div className="d-flex align-items-start">
                <i className={`bi ${getActionIcon(log.action)} me-3 mt-1`} style={{ fontSize: '1.2rem' }}></i>
                <div className="flex-grow-1">
                  <div className="fw-bold">{log.description || log.action}</div>
                  {log.todo_title && (
                    <small className="text-muted">Task: {log.todo_title}</small>
                  )}
                  <div className="text-muted small mt-1">
                    <i className="bi bi-clock me-1"></i>
                    {formatDate(log.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;

