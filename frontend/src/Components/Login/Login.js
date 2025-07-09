import React, { useState } from 'react';
import Nav from "../Nav/nav";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
     const history = useNavigate();
  const [user,setUsers] = useState({
    gmail:"",
    name:"",
  });
  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setUsers((prevUser) => ({
      ...prevUser,
      [name] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await sendRequest();
        if(response.status === "ok"){
            alert("Login success");
            history("/mainhome");
            localStorage.setItem('token', response.token);

        }else{
            alert("Login error");
        }
    }catch(err){
        alert("Error" + err.message);
    }
  };

  const sendRequest = async ()=>{
  return  await axios.post("http://localhost:5000/login",{
      gmail:user.gmail,
      password: user.password,
    }).then(res => res.data);
  };
  return (
    <div>
      {/* <Nav/> */}
      <h1>User Login</h1>
      <form onSubmit={handleSubmit}>
        
        <label for="lname">Gmail</label>
              <br></br>
        <input className='adduserfeild' type="text" id="gmail" name="gmail" placeholder="Your gmail.." value={user.gmail} onChange={handleInputChange} required></input>
              <br></br>
        <label for="age">Password</label>
              <br></br>
        <input className='adduserfeild' type="Password" id="password" name="password" placeholder="Your password.." value={user.password} onChange={handleInputChange}  required></input>
              <br></br>
        
        <button type='submit' className='submitBtn'>Login</button>
      </form>
    </div>
  )
}

export default Login
