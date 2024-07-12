import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, user, error } = useSelector((state) => state.user);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    };

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/profile');
        }
    }, [navigate]);

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-4 bg-light p-4 rounded shadow">
                    <h3 className="text-center mb-4">Login Account</h3>
                    {error && <span className="text-danger">{error}</span>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="off"
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 text-center">
                        <Link to="/forget" className="text-decoration-none">
                            Forgot My Password?
                        </Link>
                    </div>
                    <p className="text-center my-3">Or</p>
                    <div className="mt-3 text-center">
                        <Link to="/register" className="text-decoration-none">
                            Create A New Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
