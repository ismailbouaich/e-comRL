import axios from 'axios';
import { useState,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
const Register = ({ setUser }) => {

    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [createUser, setCreateUser] = useState({
      name: '', 
      email: '', 
      password: '',
     
    });
     

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCreateUser({
        ...createUser,
        [name]: value,
      });
    };
           
 


  const click = (e) => {

    e.preventDefault();
    axios.post('/register',createUser)
          .then( (response)=> {
         localStorage.setItem('token',response.data.token);
         setLoggedIn(true);

        setUser(response.data.user);
        setMessage(response.data.message);

          })
          
          .catch((error)=> {
            console.log(error);
            setMessage(error.response.data.message);
          });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/profile');
    }
  });


  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-4 bg-light p-4 rounded shadow">
          <h3 className="text-center mb-4">Register Account</h3>

          <span className='text-danger'>{message}</span> 
          <form onSubmit={click}>
            
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" onChange={handleInputChange} autoComplete='off' />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" className="form-control" name="email" onChange={handleInputChange} autoComplete='off' />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" name="password" onChange={handleInputChange} autoComplete='off'/>
            </div>
            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">Password Confirmation</label>
              <input type="password" className="form-control" name="password_confirmation" onChange={handleInputChange} autoComplete='off'/>
            </div>
            <div className="d-grid gap-2">
              <button type="submit"  className="btn btn-primary">Register</button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <Link to="/login" className="text-decoration-none">Already Have an Account? </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
