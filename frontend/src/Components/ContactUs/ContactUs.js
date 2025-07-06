import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Nav from "../Nav/nav";

function ContactUs() {
     const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_qce232t', 'template_5ak4krr', form.current, {
        publicKey: 'yg7Qt_nDPrN1fQ6HP',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("Success");
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert("Not send");
        },
      );
  };
  return (
    <div>
                 <Nav/>
      <h1>Contact Us</h1>
      <form ref={form} onSubmit={sendEmail}>
         <label for="fname">Name</label>
         <br></br>
        <input className='adduserfeild' type="text" id="user_name" name="user_name" placeholder="Your name.."  required ></input>
          <br></br>
        <label for="lname">Gmail</label>
              <br></br>
        <input className='adduserfeild' type="text" id="user_email" name="user_email" placeholder="Your gmail.."  required></input>
              <br></br>
        <label for="age">Message</label>
              <br></br>
              <textarea type="text" className='adduserfeild' id="message" name="message" placeholder="Your Message.."  required></textarea>
              <br></br>
        
        <button type='submit' className='submitBtn'>Send</button>
      </form>
    </div>
  )
}

export default ContactUs
