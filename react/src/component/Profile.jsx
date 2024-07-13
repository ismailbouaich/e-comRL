import {useEffect}from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';




const Profile = () => {
  const navigate = useNavigate();
   
  const user = useSelector((state) => state.user.user);
    
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return navigate('/login')
    }
  });
 
  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-lg-4 bg-light p-4 rounded shadow">
        <h3 className="text-center mb-4">User Profile</h3>
        <ul className="list-group">
        <li className="list-group-item">Name: {user.name}</li>
            <li className="list-group-item">Email: {user.email} </li>
        </ul>
        <Button>
          sssssssssss
        </Button>
        <Link to={`/edit/user/}`} className='btn btn-primary'>Edit</Link>

      </div>
    </div>
  </div>
  )
}



export default Profile
