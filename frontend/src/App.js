//import logo from './logo.svg';
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./Components/Home/home";
import AddUser from "./Components/AddUser/AddUser";
import Users from "./Components/UserDetails/Users";
import UpdateUser from "./Components/UpadateUser/UpdateUser";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Contact from "./Components/ContactUs/ContactUs";
import Upload from "./Components/SendPdf/SendPdf";
import Gallery from "./Components/Gallery/Gallery";
function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
           <Route path='/' element={< Home/>}/>
           <Route path='/mainhome' element={< Home/>}/>
           <Route path='/adduser' element={< AddUser/>}/>
           <Route path='/userdetails' element={<Users/>}/>
           <Route path='/userdetails/:id' element={< UpdateUser/>}/>
           <Route path='/regi' element={< Register />}/>
           <Route path='/upload' element={< Upload />}/>
           <Route path='/gallery' element={< Gallery />}/>
           <Route path='/log' element={< Login />}/>
           <Route path='/contactus' element={< Contact />}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
