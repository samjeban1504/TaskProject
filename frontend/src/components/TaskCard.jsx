import React from 'react';
import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const priorityClass = {
  HIGH: 'priority-high',
  MEDIUM: 'priority-medium',
  LOW: 'priority-low',
};

const statusClass = {
  PENDING: 'status-pending',
  IN_PROGRESS: 'status-in_progress',
  COMPLETED: 'status-completed',
};

const statusLabel = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'COMPLETED';

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-title" style={{
          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
          opacity: task.status === 'COMPLETED' ? 0.6 : 1,
        }}>
          {task.title}
        </span>
      </div>

      {task.description && (
        <p className="task-desc">
          {task.description.length > 100
            ? task.description.slice(0, 100) + '…'
            : task.description}
        </p>
      )}

      <div className="task-meta">
        <span className={`badge-priority ${priorityClass[task.priority] || 'priority-medium'}`}>
          {task.priority}
        </span>
        <span className={`badge-status ${statusClass[task.status] || 'status-pending'}`}>
          {statusLabel[task.status] || task.status}
        </span>
        {task.dueDate && (
          <span className="task-date" style={{ color: isOverdue ? '#f87171' : undefined }}>
            <FiCalendar size={11} />
            {new Date(task.dueDate).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}
            {isOverdue && ' ⚠️'}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn-icon" onClick={() => onEdit(task)}>
          <FiEdit2 size={13} /> Edit
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(task.id)}>
          <FiTrash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
