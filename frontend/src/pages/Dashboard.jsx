import { useEffect, useMemo, useState } from 'react';

import api from '../api/axios.js';
import Message from '../components/Message.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';

const statusLabels = {
  todo: 'Todo',
  'in-progress': 'In progress',
  done: 'Done'
};

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  const taskStats = useMemo(() => {
    return tasks.reduce(
      (stats, task) => ({
        ...stats,
        [task.status]: (stats[task.status] || 0) + 1
      }),
      { todo: 0, 'in-progress': 0, done: 0 }
    );
  }, [tasks]);

  const fetchTasks = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaved = (savedTask, action) => {
    if (action === 'updated') {
      setTasks((current) => current.map((task) => (task.id === savedTask.id ? savedTask : task)));
      setEditingTask(null);
      setMessage({ type: 'success', text: 'Task updated successfully' });
      return;
    }

    setTasks((current) => [savedTask, ...current]);
    setMessage({ type: 'success', text: 'Task created successfully' });
  };

  const handleDelete = async (taskId) => {
    const shouldDelete = window.confirm('Delete this task?');

    if (!shouldDelete) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setMessage({ type: 'success', text: 'Task deleted successfully' });
      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) });
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{user?.role === 'admin' ? 'Admin dashboard' : 'My dashboard'}</p>
          <h1>Tasks</h1>
        </div>
        <div className="stats">
          <span>Todo: {taskStats.todo}</span>
          <span>In progress: {taskStats['in-progress']}</span>
          <span>Done: {taskStats.done}</span>
        </div>
      </div>

      <Message message={message.text} type={message.type} onClose={() => setMessage({ type: '', text: '' })} />

      <div className="dashboard-grid">
        <TaskForm
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
          onError={(text) => setMessage({ type: 'error', text })}
          onSaved={handleSaved}
        />

        <div className="panel task-list-panel">
          <div className="panel-header">
            <h2>{user?.role === 'admin' ? "All users' tasks" : 'Your tasks'}</h2>
            <button className="button button-secondary" type="button" onClick={fetchTasks} disabled={isLoading}>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <p className="muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks yet.</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div className="task-card-header">
                    <div>
                      <h3>{task.title}</h3>
                      {user?.role === 'admin' && task.owner && (
                        <p className="owner-line">
                          {task.owner.name} · {task.owner.email}
                        </p>
                      )}
                    </div>
                    <span className={`status-badge status-${task.status}`}>{statusLabels[task.status]}</span>
                  </div>

                  {task.description && <p className="task-description">{task.description}</p>}

                  <div className="task-meta">
                    <span>Priority: {task.priority}</span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>

                  <div className="task-actions">
                    <button className="button button-secondary" type="button" onClick={() => setEditingTask(task)}>
                      Edit
                    </button>
                    <button className="button button-danger" type="button" onClick={() => handleDelete(task.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
