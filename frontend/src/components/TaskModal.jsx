import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const INITIAL = {
  title: '', description: '', priority: 'MEDIUM',
  status: 'PENDING', dueDate: ''
};

const TaskModal = ({ isOpen, onClose, onSubmit, editTask, loading }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'MEDIUM',
        status: editTask.status || 'PENDING',
        dueDate: editTask.dueDate || '',
      });
    } else {
      setForm(INITIAL);
    }
    setErrors({});
  }, [editTask, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{editTask ? '✏️ Edit Task' : '➕ New Task'}</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className="form-control-custom"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Task description (optional)..."
              className="form-control-custom"
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" value={form.priority}
                onChange={handleChange} className="form-control-custom filter-select"
                style={{ width: '100%' }}>
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" value={form.status}
                onChange={handleChange} className="form-control-custom filter-select"
                style={{ width: '100%' }}>
                <option value="PENDING">⏳ Pending</option>
                <option value="IN_PROGRESS">🔄 In Progress</option>
                <option value="COMPLETED">✅ Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="form-control-custom"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose}
              className="btn-icon" style={{ flex: 1, justifyContent: 'center', padding: '0.7rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="btn-primary-custom" style={{ flex: 2 }}>
              {loading ? '⏳ Saving...' : editTask ? '💾 Update Task' : '➕ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
