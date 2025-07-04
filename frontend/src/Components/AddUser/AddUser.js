import React, { useState } from 'react';
import Nav from "../Nav/nav";
import { useNavigate } from 'react-router-dom';
import './adduser.css'
import axios from 'axios';

function AddUser() {
  const history = useNavigate();
  const [inputs,setInputs] = useState({
    name:"",
    gmail:"",
    age:"",
    address:"",
  });
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>history('/userdetails'))
  };

  const sendRequest = async ()=>{
    await axios.post("http://localhost:5000/users",{
      name: String(inputs.name),
      gmail:String(inputs.gmail),
      age: Number(inputs.age),
      address: String(inputs.address),
    }).then(res => res.data)
  }

  return (
    <div>
         <Nav/>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
         <label for="fname">Name</label>
         <br></br>
        <input className='adduserfeild' type="text" id="name" name="name" placeholder="Your name.." value={inputs.name} onChange={handleChange} required ></input>
          <br></br>
        <label for="lname">Gmail</label>
              <br></br>
        <input className='adduserfeild' type="text" id="gmail" name="gmail" placeholder="Your gmail.." value={inputs.gmail} onChange={handleChange} required></input>
              <br></br>
        <label for="age">Age</label>
              <br></br>
        <input className='adduserfeild' type="text" id="age" name="age" placeholder="Your age.." value={inputs.age} onChange={handleChange} required></input>
              <br></br>
        <label for="address">Address</label>
              <br></br>
        <input className='adduserfeild' type="text" id="address" name="address" placeholder="Your address.." value={inputs.address} onChange={handleChange} required></input>
              <br></br>
        <button type='submit' className='submitBtn'>Submit</button>
      </form>
    </div>
  )
}

export default AddUser
