import React from 'react'
import './Login.css'
import logo2 from '../../assets/logo2.png'; 
import icon from '../../assets/icon.png'; 
import { Link , useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Used to navigate to the Todo page
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const user = { email, password };
  
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
  
        const data = await response.json();
        
        if (response.ok) {
          // Store the token in localStorage or sessionStorage
          localStorage.setItem('authToken', data.token);
  
          // Redirect to the Todo page
          navigate('/todo');
        } else {
        //   alert(data.message || 'Invalid credentials');
          toast.error("Invalid Credentials");
        }
      } catch (error) {
        console.error("Error:", error);
        alert('An error occurred while logging in');
      }
    };

  return (
    <div className='container'>
        <div className='todo-app'>
        <h1 class="tit">
            <img src={icon} alt="icon" />
            To-do List
         </h1>   
        <h1>
            <img src={logo2} alt="logo" />
            Sign In
        </h1>

        <form onSubmit={handleSubmit}>
        <div class="form-group">
                <label for="email"> <strong>Email:</strong> </label>
                <input type="email" name="email" id="email" required className="form-control" placeholder="Enter your email " onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>

            <div class="form-group">
                <label for="password"> <strong>Password:</strong> </label>
                <input type="password" name="password" id="password" required className="form-control" placeholder="Enter your password " onChange={(e) => setPassword(e.target.value)} value={password} />
            </div>

            <button type="submit" id='log-btn' class="btn btn-primary">Login</button>
        </form>
         <div class="register-link">
                <strong>Don't have an account?</strong>
                {/* <a href="#" class="btn btn-secondary" >Register</a> */}
                <Link to={'/register'} class="btn-secondary">Register</Link>
            </div>

        </div>      
    </div>
  )
}

export default Login
