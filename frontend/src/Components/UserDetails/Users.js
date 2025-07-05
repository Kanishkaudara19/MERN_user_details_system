import React, { useEffect, useRef, useState } from 'react';
import Nav from "../Nav/nav";
import axios from 'axios';
import User from "../User/User";
import { useReactToPrint } from 'react-to-print';

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

  return (
    <div>
        <Nav/>
        <h1>User details page</h1>
        <input onChange={(e)=>setSearchQuery(e.target.value)} type='text' name='search' placeholder='Search User Details..'></input>
        <button onClick={handleSearch}>Search</button>

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
         <button onClick={ handlePrint }>Download Report</button>
    </div>
  )
}

export default Users
