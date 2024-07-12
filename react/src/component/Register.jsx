import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';
import Input from './ui/Input';


const Register = () => {
  const [createUser, setCreateUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state) => state.user);


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateUser({
      ...createUser,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(createUser));
  };

  useEffect(() => {
    if (user) {
      navigate('/profile');
    } else if (error) {
      setMessage(error);
    }
  }, [user, error, navigate]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-4 bg-light p-4 rounded shadow">
          <h3 className="text-center mb-4">Register Account</h3>
          {message && <span className='text-danger'>{message}</span>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">Full Name</label>
         
              <Input
              type="text"
              name="name"
              value={createUser.name}
              onChange={handleInputChange}
              placeholder="name"
              
              />


            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={createUser.email}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={createUser.password}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">Password Confirmation</label>
              <input
                type="password"
                className="form-control"
                name="password_confirmation"
                value={createUser.password_confirmation}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
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
