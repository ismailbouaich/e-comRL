

import { useState,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const Login = ({ setUser }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();



    
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
      };
    
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
          email: email,
          password: password,
          message: message,
        };
        axios.post('/login', data)
  .then((response) => {
    console.log(response); // Add this line
    localStorage.setItem('token', response.data.token);
    setLoggedIn(true);
    setUser(response.data.user);
    setMessage(response.data.message);
  })
  .catch((error) => { // Remove `response` here
    console.log(error); // Add this line
    setMessage(error.response.data.message); // A generic message
  });
      };
    useEffect(() => {
      if (loggedIn) {
        navigate('/profile');
      }
    });

    useEffect(() => {
      const token = localStorage.getItem('token');
        if (token) {
        return navigate('/profile')
      }
    });
     
     

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-4 bg-light p-4 rounded shadow">
          <h3 className="text-center mb-4">Login Account</h3>
          <span className='text-danger'>{message}</span>      
              <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" className="form-control" name="email" onChange={handleEmailChange} autoComplete='off'/>
             
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" name="password"  onChange={handlePasswordChange} autoComplete='off'/>
            </div>
            <div className="d-grid gap-2">
              <button type="submit"  className="btn btn-primary">Login</button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <Link to="/forget" className="text-decoration-none">Forgot My Password?</Link>
          </div>
          <p className="text-center my-3">Or</p>
          <div className="mt-3 text-center">
            <Link to="/register" className="text-decoration-none">Create A New Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
