import { useEffect, useState } from 'react';

import api from '../api/axios.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: ''
};

const toDateInputValue = (date) => {
  if (!date) {
    return '';
  }

  return new Date(date).toISOString().slice(0, 10);
};

function TaskForm({ editingTask, onCancelEdit, onError, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'todo',
        priority: editingTask.priority || 'medium',
        dueDate: toDateInputValue(editingTask.dueDate)
      });
      return;
    }

    setForm(emptyForm);
  }, [editingTask]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
    };

    try {
      if (editingTask) {
        const { data } = await api.patch(`/tasks/${editingTask.id}`, payload);
        onSaved(data.task, 'updated');
      } else {
        const { data } = await api.post('/tasks', payload);
        onSaved(data.task, 'created');
        setForm(emptyForm);
      }
    } catch (error) {
      onError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="panel task-form" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h2>{editingTask ? 'Update task' : 'Create task'}</h2>
        {editingTask && (
          <button className="button button-secondary" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <label>
        Title
        <input name="title" type="text" value={form.title} onChange={handleChange} maxLength="120" required />
      </label>

      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} maxLength="1000" rows="5" />
      </label>

      <div className="form-row">
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label>
        Due date
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
      </label>

      <button className="button button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : editingTask ? 'Update task' : 'Create task'}
      </button>
    </form>
  );
}

export default TaskForm;
