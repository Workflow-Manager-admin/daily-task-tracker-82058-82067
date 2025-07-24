import React, { useState, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main todo app component. Renders header, task list, input, and filtering controls.
   */
  // Color palette as per requirements
  const COLORS = {
    accent: '#ff9800',
    primary: '#1976d2',
    secondary: '#424242',
    bg: '#fff',
    border: '#e9ecef',
    taskInactive: '#eee',
    text: '#282c34',
    textLight: '#888',
  };

  // Task shape: { id, text, completed }
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  // PUBLIC_INTERFACE
  const addTask = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: val,
        completed: false,
      },
    ]);
    setInput('');
  };

  // PUBLIC_INTERFACE
  const startEdit = (id, currentValue) => {
    setEditId(id);
    setEditValue(currentValue);
  };

  // PUBLIC_INTERFACE
  const commitEdit = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, text: editValue.trim() || task.text } : task)));
    setEditId(null);
    setEditValue('');
  };

  // PUBLIC_INTERFACE
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // PUBLIC_INTERFACE
  const toggleTask = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // PUBLIC_INTERFACE
  const filteredTasks = () => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  };

  // Keyboard shortcut: Enter to save on edit
  const handleEditKey = (e, id) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') {
      setEditId(null);
      setEditValue('');
    }
  };

  // Responsive minHeight: fill viewport except header/footer
  // Minimal inline styling, most is in CSS for color palette

  return (
    <div
      className="todo-app min-light"
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-testid="todo-app"
    >
      <header
        className="todo-header"
        style={{
          padding: '2.3rem 0 1.1rem 0',
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '2px',
          color: COLORS.primary,
          background: COLORS.bg,
          textAlign: 'center',
        }}
      >
        📝 Daily Tasks
      </header>

      {/* TASK LIST */}
      <main
        className="todo-list-wrapper"
        style={{
          flex: '1 1 auto',
          maxWidth: 400,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
        {filteredTasks().length === 0 && (
          <div
            style={{
              color: COLORS.textLight,
              fontSize: '1rem',
              marginTop: '2.5rem',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            {tasks.length === 0
              ? 'No tasks for today!'
              : filter === 'active'
                ? 'No active tasks'
                : 'No completed tasks'}
          </div>
        )}

        <ul
          className="task-list"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100%',
          }}
        >
          {filteredTasks().map((task) => (
            <li
              key={task.id}
              className="task-list-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${COLORS.border}`,
                padding: '1rem 0.25rem 1rem 0',
                gap: '0.5rem',
              }}
            >
              <span
                onClick={() => toggleTask(task.id)}
                role="checkbox"
                aria-checked={task.completed}
                tabIndex={0}
                style={{
                  minWidth: 24,
                  minHeight: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: task.completed ? COLORS.accent : COLORS.taskInactive,
                  border: `1.5px solid ${COLORS.accent}`,
                  borderRadius: 7,
                  cursor: 'pointer',
                  fontSize: 17,
                  marginRight: 15,
                  color: task.completed ? '#fff' : COLORS.primary,
                  transition: 'all 0.16s',
                  userSelect: 'none',
                }}
                title={task.completed ? 'Mark as incomplete' : 'Mark as done'}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') toggleTask(task.id);
                }}
              >
                {task.completed ? '✔' : ''}
              </span>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                }}
                onDoubleClick={() => startEdit(task.id, task.text)}
              >
                {editId === task.id ? (
                  <input
                    className="edit-task-input"
                    style={{
                      width: '100%',
                      fontSize: 17,
                      border: `1px solid ${COLORS.accent}`,
                      borderRadius: 5,
                      padding: '5px 8px',
                      outline: 'none',
                      background: '#faf6f2',
                    }}
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(task.id)}
                    onKeyDown={e => handleEditKey(e, task.id)}
                    autoFocus
                    maxLength={65}
                  />
                ) : (
                  <span
                    className="task-text"
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? COLORS.textLight : COLORS.text,
                      fontSize: 17,
                      wordBreak: 'break-word',
                      flex: 1,
                      cursor: 'pointer',
                      padding: '2px 0',
                      transition: 'color 0.15s',
                    }}
                    title="Double-click to edit"
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <button
                className="delete-btn"
                style={{
                  background: 'transparent',
                  color: COLORS.secondary,
                  fontSize: '1.12rem',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  borderRadius: 4,
                  marginLeft: 8,
                  opacity: 0.7,
                  transition: 'background 0.13s, color 0.22s',
                }}
                title="Delete"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </main>

      {/* FILTER + INPUT */}
      <footer
        className="todo-footer"
        style={{
          width: '100%',
          background: COLORS.bg,
          maxWidth: 400,
          margin: '0 auto',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <form
          className="add-task-form"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.0rem 0.8rem 0.6rem 0.8rem',
            borderTop: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
            gap: '0.7rem',
          }}
          onSubmit={addTask}
        >
          <input
            ref={inputRef}
            className="add-task-input"
            style={{
              flex: '1',
              fontSize: 16,
              padding: '0.7em 1em',
              borderRadius: 7,
              border: `1px solid ${COLORS.primary}`,
              outline: 'none',
              background: '#fafcfa',
            }}
            type="text"
            value={input}
            maxLength={65}
            autoComplete="off"
            placeholder="Add a new task..."
            onChange={e => setInput(e.target.value)}
            aria-label="Add a new task"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              background: input.trim() ? COLORS.primary : COLORS.taskInactive,
              color: COLORS.bg,
              border: 'none',
              borderRadius: 6,
              padding: '0.7em 1.35em',
              fontWeight: 600,
              fontSize: '1.05em',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.13s, color 0.2s',
              boxShadow: input.trim()
                ? `0 2px 6px 0 ${COLORS.primary}22`
                : 'none',
            }}
          >
            Add
          </button>
        </form>
        <div
          className="task-filters"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            padding: '0.45rem',
            background: COLORS.bg,
            borderRadius: 8,
            marginBottom: 9,
          }}
        >
          <button
            style={{
              border: 'none',
              background: filter === 'all' ? COLORS.accent : '#fafafa',
              color: filter === 'all' ? '#fff' : COLORS.secondary,
              padding: '0.38em 1.15em',
              borderRadius: 5,
              fontWeight: filter === 'all' ? 700 : 400,
              cursor: 'pointer',
              outline: 'none',
              fontSize: 14,
              boxShadow: filter === 'all' ? `0 2px 5px ${COLORS.accent}19` : 'none',
              borderBottom: filter === 'all' ? `2px solid ${COLORS.accent}` : 'none',
              transition: 'all 0.13s',
            }}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            style={{
              border: 'none',
              background: filter === 'active' ? COLORS.accent : '#fafafa',
              color: filter === 'active' ? '#fff' : COLORS.secondary,
              padding: '0.38em 1.1em',
              borderRadius: 5,
              fontWeight: filter === 'active' ? 700 : 400,
              cursor: 'pointer',
              outline: 'none',
              fontSize: 14,
              boxShadow:
                filter === 'active' ? `0 2px 5px ${COLORS.accent}19` : 'none',
              borderBottom:
                filter === 'active' ? `2px solid ${COLORS.accent}` : 'none',
              transition: 'all 0.13s',
            }}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            style={{
              border: 'none',
              background: filter === 'completed' ? COLORS.accent : '#fafafa',
              color: filter === 'completed' ? '#fff' : COLORS.secondary,
              padding: '0.38em 1.1em',
              borderRadius: 5,
              fontWeight: filter === 'completed' ? 700 : 400,
              cursor: 'pointer',
              outline: 'none',
              fontSize: 14,
              boxShadow:
                filter === 'completed' ? `0 2px 5px ${COLORS.accent}19` : 'none',
              borderBottom:
                filter === 'completed' ? `2px solid ${COLORS.accent}` : 'none',
              transition: 'all 0.13s',
            }}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
