import { forgetPassword } from '../redux/actions/userActions';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(state => state.user.forgetPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgetPassword(email));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Reset Password'}
      </button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Forgot
