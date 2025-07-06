import React, { useState } from 'react';
import Nav from "../Nav/nav";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const history = useNavigate();
  const [user,setUsers] = useState({
    name:"",
    gmail:"",
    password:"",
  });
  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setUsers((prevUser) => ({
      ...prevUser,
      [name] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(()=>{
        alert("Register Success");
        history('/userdetails');
    }).catch((err) => {
        alert(err.message);
    });
  };

  const sendRequest = async ()=>{
    await axios.post("http://localhost:5000/register",{
      name: String(user.name),
      gmail:String(user.gmail),
      password: String(user.password),
    }).then(res => res.data);
  };
  return (
    <div>
         <Nav/>
      <h1>User Register</h1>
      <form onSubmit={handleSubmit}>
         <label for="fname">User name</label>
         <br></br>
        <input className='adduserfeild' type="text" id="name" name="name" placeholder="Your name.." value={user.name} onChange={handleInputChange}  required ></input>
          <br></br>
        <label for="lname">Gmail</label>
              <br></br>
        <input className='adduserfeild' type="text" id="gmail" name="gmail" placeholder="Your gmail.." value={user.gmail} onChange={handleInputChange} required></input>
              <br></br>
        <label for="age">Password</label>
              <br></br>
        <input className='adduserfeild' type="Password" id="password" name="password" placeholder="Your password.." value={user.password} onChange={handleInputChange}  required></input>
              <br></br>
        
        <button type='submit' className='submitBtn'>Register</button>
      </form>
    </div>
  )
}

export default Register
