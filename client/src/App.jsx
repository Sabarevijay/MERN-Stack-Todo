import { Fragment} from 'react';

import {ToastContainer} from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Todo from './pages/Todo/Todo';
import Register from './pages/Register/Register';


function App() {
  return (
    <>
    <ToastContainer/>
   
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/todo' element={<Todo />} />
          <Route path='/register' element={<Register />} />
      </Routes>

   
    </>
    
  )
}

export default App
