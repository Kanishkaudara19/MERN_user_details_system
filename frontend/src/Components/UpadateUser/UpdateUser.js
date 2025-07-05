import React, { useEffect, useState } from 'react';
// import Nav from "../Nav/nav";
import axios from 'axios';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

function UpdateUser() {
    const history = useNavigate();
    const [inputs,setInputs] = useState({ 
        name: "",
        gmail: "",
        age: "",
        address: ""
    });
    const id = useParams().id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user with ID:", id);
                const response = await axios.get(`http://localhost:5000/users/${id}`);
                console.log("Response data:", response.data);

                const userData = response.data.users;

                setInputs({
                    name: userData.name || "",
                    gmail: userData.gmail || "",
                    age: userData.age || "",
                    address: userData.address || ""
                });

                console.log("Updated inputs:", userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (id) {
            fetchUserData();
        } else {
            console.log("No ID found in URL params");
        }
    }, [id]);

    console.log("Current inputs state:", inputs);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/users/${id}`, {
            name: String(inputs.name),
            gmail: String(inputs.gmail),
            age: Number(inputs.age),
            address: String(inputs.address),
        }).then(res => res.data)
    }

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        sendRequest().then(() => history('/userdetails'))
    };

  return (
    <div>
      <h1>Update user</h1>
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
        <button type='submit' className='submitBtn'>Update</button>
      </form>
    </div>
  )
}

export default UpdateUser
