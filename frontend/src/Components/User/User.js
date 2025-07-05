import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './user.css'

function User(props) {
  const {_id,name,gmail,age,address} = props.user;
      const history = useNavigate();

      const deleteHandler = async () => {
        await axios.delete(`http://localhost:5000/users/${_id}`)
        .then(res=>res.data)
        .then(() => window.location.reload())
        .then(()=>history("/userdetails"))
      };

  return (
    
    <div>
      <div class="user-card">
            <div class="user-details">
                <div class="user-detail-item">
                    <span class="detail-label">ID:</span>
                    <span class="detail-value">{_id}</span>
                </div>
                <div class="user-detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">{name}</span>
                </div>
                <div class="user-detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{gmail}</span>
                </div>
                <div class="user-detail-item">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">{age}</span>
                </div>
                <div class="user-detail-item">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">{address}</span>
                </div>
            </div>
            <div class="action-buttons">
               <Link to={`/userdetails/${_id}`} className='active home-a'>
                <button class="btn btn-update" >Update</button></Link>
                <button class="btn btn-delete" onClick={ deleteHandler }>Delete</button>
            </div>
        </div>
         {/* <h1>User Display</h1>
         <br></br>
          <h1>ID : {_id}</h1>
          <h1>Name : {name}</h1>
          <h1>Gmail : {gmail}</h1>
          <h1>Age : {age}</h1>
          <h1>Address : {address}</h1>
          <Link to={`/userdetails/${_id}`} className='active home-a'>
         <button>Update</button>
        </Link>
         
          <button onClick={ deleteHandler }>Delete</button>
          <br></br> */}
    </div>
  )
}

export default User
