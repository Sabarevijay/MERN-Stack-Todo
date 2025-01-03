import React, { useEffect, useState } from 'react';
import './List.css';
import { toast } from 'react-toastify';
// import uncheckedImage from '../../assets/unchecked.png'; // Import image
// import checkedImage from '../../assets/checked.png';

const List = () => {
  const [todos, setTodos] = useState([]);
  

  // Fetch all tasks
  const getTodos = async () => {
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    if (!token) {
      return alert("Please log in to view your todos.");
  }

    try {
      const response = await fetch('http://localhost:5000/todos',{
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      const jsonData = await response.json();
      if (Array.isArray(jsonData) && jsonData.every(todo => 'description' in todo && 'is_completed' in todo)) {
        setTodos(jsonData); // Set the todos only if the structure matches
      } else {
        console.error("Unexpected data format:", jsonData);
        toast.error("Invalid data received from server.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };


  // Delete a task
  const deleteTask = async (todo_id) => {
    const token = localStorage.getItem('authToken'); // Retrieve token here
    if (!token) {
      return alert("Please log in to manage your todos.");
    }
    try {
      await fetch(`http://localhost:5000/todos/${todo_id}`, {
        method: 'DELETE',
        headers: {
          Authorization:  `Bearer ${token}`, 
        },
      });
      setTodos(todos.filter((todo) => todo.todo_id !== todo_id));
    } catch (err) {
      console.log(err.message);
    }
  };

  // Toggle completion status
  const toggleTask = async (todo_id, is_completed) => {
    const token = localStorage.getItem('authToken'); // Retrieve token here
    if (!token) {
      return alert("Please log in to manage your todos.");
    }
    try {
      const body = { is_completed: !is_completed };
      const response = await fetch(`http://localhost:5000/todos/${todo_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`, 
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        toast.error("Failed to update the task's status.");
    }

      const updatedTodo = await response.json();

      // Update the local state
      setTodos(
        todos.map((todo) =>
          todo.todo_id === todo_id ?  { ...todo, is_completed: updatedTodo.is_completed }: todo
        )
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="t">
        

      {/* Task List */}
      <ul id="list-container">
        {todos. sort((a, b) => a.is_completed - b.is_completed) .map((todo) => (
          <li
            key={todo.todo_id}
            className={todo.is_completed ? 'checked' : ''}
            onClick={() => toggleTask(todo.todo_id, todo.is_completed)}
         
          >
            <span>{todo.description}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(todo.todo_id);
              }}
              style={{ cursor: 'pointer', color: 'grey', float: 'right', marginLeft: '10px' }}
            >
              &#x2716;
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
