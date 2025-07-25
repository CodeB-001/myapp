import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck, FaFilter, FaSun } from 'react-icons/fa';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import './todo.css';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(true);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('react-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save todos and theme to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos));
    localStorage.setItem('theme-preference', darkMode ? 'dark' : 'light');
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [todos, darkMode]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className={`todo-app ${darkMode ? 'dark' : 'light'}`}>
      <div className="app-header">
        <h1>Todo List</h1>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="theme-toggle"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </div>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="add-button">
          <FaPlus className="icon" /> Add
        </button>
      </form>

      <div className="todo-filters">
        <button 
          onClick={() => setFilter('all')} 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
        >
          <FaFilter className="icon" /> All
        </button>
        <button 
          onClick={() => setFilter('active')} 
          className={`filter-button ${filter === 'active' ? 'active' : ''}`}
        >
          <FaSun className="icon" /> Active
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
        >
          <FaCheck className="icon" /> Completed
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="checkmark"></span>
            </label>
            <span className="todo-text">{todo.text}</span>
            <button 
              onClick={() => deleteTodo(todo.id)} 
              className="delete-button"
              aria-label="Delete todo"
            >
              <FaTrash className="icon" />
            </button>
          </li>
        ))}
      </ul>

      <div className="todo-footer">
        <span>{activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left</span>
        {todos.some(todo => todo.completed) && (
          <button onClick={clearCompleted} className="clear-button">
            <FaTrash className="icon" /> Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

export default Todo;