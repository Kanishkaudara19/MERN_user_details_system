import React, { useEffect, useRef, useState } from 'react';
import Nav from "../Nav/nav";
import axios from 'axios';
import User from "../User/User";
import { useReactToPrint } from 'react-to-print';
import './Users.css'

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
}

function Users() {
  const [users, setUsers] = useState();
  useEffect(()=> {
    fetchHandler().then((data) => setUsers(data.users));
  },[]);

  const ComponentsRef = useRef();
      const handlePrint = useReactToPrint({
        contentRef: ComponentsRef,
        documentTitle: "Users Report",
        onAfterPrint: () => alert("User Report Successfully Downloaded !"),
    });

    const [searchQuery ,setSearchQuery] = useState("");
    const [noResults ,setNoResults] = useState(false);

    const handleSearch = ()=>{
      fetchHandler().then((data)=>{
        const filteredUsers = data.users.filter((user)=>
        Object.values(user).some((field)=>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ))
        setUsers(filteredUsers);
        setNoResults(filteredUsers.length === 0);
      });
    };

    const handleSendRequest = () => {
      const phoneNumber = "+94764426028";
      const message = `Selected User Report`;
      const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text${encodeURIComponent(message)}`;

      window.open(WhatsAppUrl,"_blank");
    };

  return (
    <div>
        <Nav/>
        <h1>User details page</h1>
        <div class="search-section">
        <input onChange={(e)=>setSearchQuery(e.target.value)} type='text' name='search' placeholder='Search User Details..'></input>
        <button type="button" onClick={handleSearch}>Search</button>
        </div>
        { noResults?(
          <div> <p>No Users Found.</p></div>
        ):(
        <div ref={ComponentsRef}>
          { users && users.map((user, i) => (
            <div key ={i}> 
            <User user={user} />
             </div>
          )) }
        </div>
        )}
        <br></br>
        <div class="report-buttons">
         <button onClick={ handlePrint } class="report-btn download-report">Download Report</button>
         <br></br>
         <button onClick={ handleSendRequest } class="report-btn send-report">Send Report</button>
         </div>
    </div>
  )
}

export default Users
