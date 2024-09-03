import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from './hooks/useAuth';

const Login = ({ onClose, onSwitchToRegister,onSuccess  }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [errors, setErrors] = useState({});

  const { login } = useAuth();




  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: '' });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors({ ...errors, password: '' });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(loginUser(email, password));
        login(response.token); // Use the login function from AuthContext
        onSuccess();
      } catch (error) {
        // Handle any errors
      }finally{
        onClose();
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-2xl font-bold text-center mb-4">Login Account</h3>
      {error && <span className="text-red-500 block mb-4">{error}</span>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email Address"
          />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

        </div>
        <div className="mb-4">
          <Input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            
            placeholder="Password"
          />
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

        </div>
        <div className="mb-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
      <div className="text-center mt-4">
        <Link to="/forget" className="text-indigo-500 hover:text-indigo-600">
          Forgot My Password?
        </Link>
      </div>
      <p className="text-center my-4">Or</p>
      <div className="text-center mt-4">
        <button onClick={onSwitchToRegister} className="text-indigo-500 hover:text-indigo-600">
          Create A New Account
        </button>
      </div>
    </div>
  );
};

export default Login;