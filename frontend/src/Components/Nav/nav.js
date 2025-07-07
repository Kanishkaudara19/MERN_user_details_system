import React from 'react'
import './nav.css'
import { Link } from 'react-router-dom';

function nav() {
  return (
    <div>
<ul className='home-ul'>
    <li className='home-ll'>
        <Link to="/mainhome" className='active home-a'>
        <h1>Home</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/adduser" className='active home-a'>
        <h1>Add user</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/userdetails" className='active home-a'>
        <h1>User Details</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/contactus" className='active home-a'>
        <h1>Contact Us</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/upload" className='active home-a'>
        <h1>Pdf Upload</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/gallery" className='active home-a'>
        <h1>Gallery</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/regi" className='active home-a'>
        <h1>Register</h1>
        </Link>
    </li>
    <li className='home-ll'>
        <Link to="/log" className='active home-a'>
        <h1>Login</h1>
        </Link>
    </li>
</ul>
    </div>
  )
}

export default nav
