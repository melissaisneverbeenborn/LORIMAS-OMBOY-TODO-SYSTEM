import React from 'react';

const TodoItem = ({ todo, onToggle, onToggleComplete, onEdit, onDelete, currentTime = Date.now() }) => {
  const handleToggle = () => {
    const toggleFn = onToggle || onToggleComplete;
    if (toggleFn) toggleFn(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(todo.id);
    }
  };

  const getCountdown = (targetDate) => {
    if (!targetDate) return '';
    const target = new Date(targetDate);
    if (Number.isNaN(target.getTime())) return '';
    const diff = target.getTime() - currentTime;
    const absDiff = Math.abs(diff);
    const minutes = Math.floor(absDiff / (1000 * 60));
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours || days) parts.push(`${hours}h`);
    parts.push(`${mins}m`);
    const direction = diff < 0 ? 'ago' : 'left';
    return `${parts.join(' ')} ${direction}`;
  };

  const dueCountdown = getCountdown(todo.dueDate || todo.due_date);
  const reminderCountdown =
    (todo.reminderEnabled || todo.reminder_enabled) && (todo.reminderDateTime || todo.reminder_at)
      ? getCountdown(todo.reminderDateTime || todo.reminder_at)
      : '';

  const isOverdue =
    !todo.completed &&
    (todo.dueDate || todo.due_date) &&
    new Date(todo.dueDate || todo.due_date).getTime() < currentTime;

  const reminderInPast =
    (todo.reminderEnabled || todo.reminder_enabled) &&
    (todo.reminderDateTime || todo.reminder_at) &&
    new Date(todo.reminderDateTime || todo.reminder_at).getTime() < currentTime;

  return (
    <div className={`card mb-3 ${todo.completed ? 'bg-light' : ''}`}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-12 col-md-1 mb-3 mb-md-0 text-center">
            <input
              type="checkbox"
              className="form-check-input"
              checked={todo.completed}
              onChange={handleToggle}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>
          <div className="col-12 col-md-7">
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <span className={`badge ${isOverdue ? 'bg-danger' : 'bg-info'}`}>
                {isOverdue ? `Overdue • ${dueCountdown}` : `Due • ${dueCountdown}`}
              </span>
              {todo.reminderEnabled && (todo.reminderDateTime || todo.reminder_at) && (
                <span className={`badge ${reminderInPast ? 'bg-secondary' : 'bg-warning text-dark'}`}>
                  <i className="bi bi-bell-fill me-1"></i>
                  {reminderInPast ? 'Reminder sent' : `Reminder • ${reminderCountdown}`}
                </span>
              )}
              {todo.completed && (
                <span className="badge bg-success">
                  Completed
                </span>
              )}
            </div>
            <h5 className={`card-title ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
              {todo.title}
            </h5>
            <p className={`card-text ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
              {todo.description}
            </p>
            <small className="text-muted d-block">
              Due: {new Date(todo.dueDate || todo.due_date).toLocaleDateString()}
            </small>
            {(todo.reminderEnabled || todo.reminder_enabled) && (todo.reminderDateTime || todo.reminder_at) && (
              <small className="text-muted d-block">
                Reminder: {new Date(todo.reminderDateTime || todo.reminder_at).toLocaleString()}
              </small>
            )}
          </div>
          <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={handleEdit}
              disabled={todo.completed}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
