import React from 'react';

const Reports = ({ reports }) => {
  if (!reports) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const { summary, byCategory, byPriority } = reports;

  return (
    <div>
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{summary.total}</h3>
              <p className="mb-0">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{summary.completed}</h3>
              <p className="mb-0">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{summary.active}</h3>
              <p className="mb-0">Active</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-danger">{summary.overdue}</h3>
              <p className="mb-0">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Completion Rate</h5>
          <div className="progress" style={{ height: '30px' }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${summary.completionRate}%` }}
              aria-valuenow={summary.completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {summary.completionRate}%
            </div>
          </div>
          <small className="text-muted">
            {summary.recentCompleted} tasks completed in the last 7 days
          </small>
        </div>
      </div>

      <div className="row">
        {/* By Category */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Tasks by Category</h5>
            </div>
            <div className="card-body">
              {byCategory && byCategory.length > 0 ? (
                <div>
                  {byCategory.map((cat) => (
                    <div key={cat.name} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>
                          <span
                            className="badge me-2"
                            style={{ backgroundColor: cat.color }}
                          >
                            {cat.name}
                          </span>
                        </span>
                        <strong>{cat.count}</strong>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${summary.total > 0 ? (cat.count / summary.total) * 100 : 0}%`,
                            backgroundColor: cat.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No tasks by category</p>
              )}
            </div>
          </div>
        </div>

        {/* By Priority */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Tasks by Priority</h5>
            </div>
            <div className="card-body">
              {byPriority && byPriority.length > 0 ? (
                <div>
                  {byPriority.map((pri) => {
                    const priorityColors = {
                      low: 'bg-secondary',
                      medium: 'bg-info',
                      high: 'bg-warning',
                      urgent: 'bg-danger'
                    };
                    const priorityLabels = {
                      low: 'Low',
                      medium: 'Medium',
                      high: 'High',
                      urgent: 'Urgent'
                    };
                    return (
                      <div key={pri.priority} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span>
                            <span className={`badge ${priorityColors[pri.priority] || 'bg-info'} me-2`}>
                              {priorityLabels[pri.priority] || pri.priority}
                            </span>
                          </span>
                          <strong>{pri.count}</strong>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar ${priorityColors[pri.priority] || 'bg-info'}`}
                            role="progressbar"
                            style={{
                              width: `${summary.total > 0 ? (pri.count / summary.total) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No tasks by priority</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

