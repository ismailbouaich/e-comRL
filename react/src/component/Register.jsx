import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Register = () => {
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold text-center mb-4">Register Account</h3>
        {error && <span className="text-red-500 block mb-4">{error}</span>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Name" className="block font-medium mb-2">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              value={createUser.name}
              onChange={handleInputChange}
              placeholder="Full Name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              value={createUser.email}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="Email Address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={createUser.password}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password_confirmation" className="block font-medium mb-2">
              Password Confirmation
            </label>
            <Input
              type="password"
              name="password_confirmation"
              value={createUser.password_confirmation}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="Confirm Password"
            />
            {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
          </div>
          <div className="mb-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-indigo-500 hover:text-indigo-600">
            Already Have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;