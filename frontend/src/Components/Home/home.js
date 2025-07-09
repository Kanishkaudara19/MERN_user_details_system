import React, { useContext } from 'react';
import Nav from "../Nav/nav";
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
function Home() {
const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            console.log(decoded.name);

  return (
    <div>
      <Nav/>
      <h1>Welcome {decoded.name}</h1>
    </div>
  )
}

export default Home
