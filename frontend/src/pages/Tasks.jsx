import React, { useEffect, useState, useCallback } from 'react';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    search: '', priority: '', status: '', dueDate: ''
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 9, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await taskAPI.getAll(params);
      setTasks(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
    setPage(0);
  };

  const handleOpenCreate = () => { setEditTask(null); setModalOpen(true); };
  const handleOpenEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditTask(null); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editTask) {
        await taskAPI.update(editTask.id, form);
        toast.success('Task updated! ✅');
      } else {
        await taskAPI.create(form);
        toast.success('Task created! 🎉');
      }
      handleClose();
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FiSearch style={{
            position: 'absolute', left: '0.75rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem'
          }} />
          <input
            type="text" name="search" value={filters.search}
            onChange={handleFilterChange} placeholder="Search tasks..."
            className="search-input" style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <select name="priority" value={filters.priority}
          onChange={handleFilterChange} className="filter-select">
          <option value="">All Priorities</option>
          <option value="HIGH">🔴 High</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="LOW">🟢 Low</option>
        </select>

        <select name="status" value={filters.status}
          onChange={handleFilterChange} className="filter-select">
          <option value="">All Status</option>
          <option value="PENDING">⏳ Pending</option>
          <option value="IN_PROGRESS">🔄 In Progress</option>
          <option value="COMPLETED">✅ Completed</option>
        </select>

        <input
          type="date" name="dueDate" value={filters.dueDate}
          onChange={handleFilterChange} className="filter-select"
          title="Filter by due date"
        />

        <button className="btn-add" onClick={handleOpenCreate} id="add-task-btn">
          <FiPlus /> Add Task
        </button>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
          <span>Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No tasks found</h3>
          <p>Create your first task or try different filters</p>
          <button className="btn-add" onClick={handleOpenCreate}>
            <FiPlus /> Create Task
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button className="page-btn" onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}>‹ Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn${i === page ? ' active' : ''}`}
                  onClick={() => setPage(i)}>{i + 1}</button>
              ))}
              <button className="page-btn" onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}>Next ›</button>
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editTask={editTask}
        loading={saving}
      />
    </div>
  );
};

export default Tasks;
