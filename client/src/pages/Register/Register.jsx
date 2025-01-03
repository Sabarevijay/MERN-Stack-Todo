import React from 'react'
import './Register.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

  const handleRegister = async (e) => {
   
    e.preventDefault(); // Prevent the default form submission

    // Access form data correctly
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const password_confirmation = e.target.elements.password_confirmation.value;

    const user = { name, email, password, password_confirmation };

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        const data = await response.json();
        if (response.ok) {
            // alert("Registration successful");
            toast.success("Registration successful");
            e.target.reset();
            navigate('/');
        } else {
            // alert(data.message || "Something went wrong");
            toast.error("Something went wrong");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};
  return (
    <div class="container">
     <div class="register">
        <div class="login-reg">
        <h1 id='reg-h1'>Registration</h1>
            <form onSubmit={handleRegister}>
                <div class="form-group" id='reg-form'>
                <label for="name"><strong>Name:</strong></label>
                <input type="text" name="name" id="name" required class="form-control" placeholder="Enter your name" size="" />
                
                <label for="email"><strong>Email:</strong></label>
                <input type="email" name="email" id="email" required class="form-control" placeholder="Enter your email" />
                
                <label for="password"><strong>Password:</strong></label>
                <input type="password" name="password" id="password" required class="form-control" placeholder="Enter your password" />
            
                <label for="password_confirmation"><strong>Confirm Password:</strong></label>
                <input type="password" name="password_confirmation" id="password_confirmation" required class="form-control" placeholder="Confirm your password" />
                </div>

                <button type="submit" id='log-btn' class="btn btn-primary">Register</button>
            </form>
        </div>
     </div>
    </div>
  )
}

export default Register
