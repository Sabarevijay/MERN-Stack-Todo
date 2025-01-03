import React from 'react'
import './Todo.css'
import logo2 from '../../assets/logo2.png'
import icon from '../../assets/icon.png'
import Input from '../../components/Input/Input'
import List from '../../components/List/List'
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react'

const todo = () => {
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return alert("Please log in to view your todos.");
      }

      try {
        const response = await fetch("http://localhost:5000/todos", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setTodo(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className='t-container'>
         <form className='logout-btn' action="" >
                {/* <button type="submit" className="btn-danger" >Logout</button> */}
                <Link to={'/'} className="btn-danger"> Logout</Link>
            </form>
        <div className='todo-app'>  
             <h1><img src={logo2} alt="" />BIT</h1>
            <h2><img src={icon} alt="" />To-do List </h2>

          <Input />
          <List />   
        
        </div>  
    </div>
  )
}

export default todo
