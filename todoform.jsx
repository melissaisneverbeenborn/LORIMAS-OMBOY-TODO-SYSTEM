import React, { useState, useEffect } from 'react';

const formatDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const iso = date.toISOString();
  return iso.slice(0, 16);
};

const TodoForm = ({ onSubmit, editTodo, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    reminderEnabled: false,
    reminderDateTime: ''
  });

  useEffect(() => {
    if (editTodo) {
      setFormData({
        title: editTodo.title,
        description: editTodo.description,
        dueDate: editTodo.dueDate,
        reminderEnabled: Boolean(editTodo.reminderEnabled || editTodo.reminder_enabled),
        reminderDateTime: editTodo.reminderDateTime || editTodo.reminder_at
          ? formatDateTimeLocal(editTodo.reminderDateTime || editTodo.reminder_at)
          : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        reminderEnabled: false,
        reminderDateTime: ''
      });
    }
  }, [editTodo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReminderToggle = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      reminderEnabled: checked,
      reminderDateTime: checked ? prev.reminderDateTime : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title for the task');
      return;
    }

    if (!formData.dueDate) {
      alert('Please select a due date');
      return;
    }

    if (formData.reminderEnabled && !formData.reminderDateTime) {
      alert('Please pick a date & time for the reminder');
      return;
    }

    const todoData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      reminderEnabled: formData.reminderEnabled,
      reminderDateTime: formData.reminderEnabled ? formData.reminderDateTime : null,
      id: editTodo ? editTodo.id : Date.now(),
      completed: editTodo ? editTodo.completed : false,
      createdAt: editTodo ? editTodo.createdAt : new Date().toISOString()
    };

    onSubmit(todoData);
    
    if (!editTodo) {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        reminderEnabled: false,
        reminderDateTime: ''
      });
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4 className="mb-0">
          {editTodo ? 'Edit Task' : 'Add New Task'}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">
              Due Date *
            </label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id="reminderEnabled"
                name="reminderEnabled"
                checked={formData.reminderEnabled}
                onChange={handleReminderToggle}
              />
              <label className="form-check-label" htmlFor="reminderEnabled">
                Enable Reminder
              </label>
            </div>
            <small className="text-muted">
              Get a reminder before the due date.
            </small>
          </div>

          {formData.reminderEnabled && (
            <div className="mb-3">
              <label htmlFor="reminderDateTime" className="form-label">
                Reminder Date &amp; Time
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="reminderDateTime"
                name="reminderDateTime"
                value={formData.reminderDateTime}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-secondary">
              {editTodo ? 'Update Task' : 'Add Task'}
            </button>
            {editTodo && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
