import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Register = ({ onClose, onSwitchToLogin }) => {
  const [createUser, setCreateUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateUser({
      ...createUser,
      [name]: value,
    });
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!createUser.name.trim()) tempErrors.name = "Name is required";
    if (!createUser.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(createUser.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!createUser.password) {
      tempErrors.password = "Password is required";
    } else if (createUser.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (createUser.password !== createUser.password_confirmation) {
      tempErrors.password_confirmation = "Passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(registerUser(createUser));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="w-full max-w-md mx-auto">
    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
    <h2 className="text-2xl font-bold text-center mb-6">Register Account</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          name="name"
          value={createUser.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="w-full"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <Input
          type="email"
          name="email"
          value={createUser.email}
          onChange={handleInputChange}
          placeholder="Email Address"
          className="w-full"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <Input
          type="password"
          name="password"
          value={createUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <Input
          type="password"
          name="password_confirmation"
          value={createUser.password_confirmation}
          onChange={handleInputChange}
          placeholder="Confirm Password"
          className="w-full"
        />
        {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
      </div>
      <Button type="submit" disabled={loading} className="w-full text-white py-2 rounded">
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
    <div className="text-center mt-4">
      <button onClick={onSwitchToLogin} className="text-indigo-600 hover:text-indigo-800">
        Already Have an Account?
      </button>
    </div>
  </div>
  );
};

export default Register;