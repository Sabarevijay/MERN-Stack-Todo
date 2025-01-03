import React from 'react'
import { useState } from 'react'
import './Input.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Input = () => {
    
    const [description,setDescription] = useState("");
    // const navigate = useNavigate();

    const onSubmitForm =async e=>{
        e.preventDefault();
        try {
            const body={description};
            const response=await fetch("http://localhost:5000/todos",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token here
                  },
                body:JSON.stringify(body)
            })

            if (response.ok) {
                setDescription("");
                toast.success("Task added!");
                // window.location="/todo";
                // navigate("/todo"); 
            }else{
                toast.error("Failed to add task");
            }
            window.location="/todo";
        } catch (err) {
                      
            toast.error(err.message)
        }
    }

  return (
   <>      
     <form onSubmit={onSubmitForm}>
       <div className='row'>
            <input 
            type="text" 
            id="input-box"
            name='task'
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="ADD Your text"
            required />
            <button >Add </button>
        </div>
     </form>
   </>

  )
}

export default Input
