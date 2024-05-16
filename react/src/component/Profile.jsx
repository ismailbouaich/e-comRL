import React,{useEffect}from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';



const Profile = ({user}) => {
  const navigate = useNavigate();
   
    
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
            <li className="list-group-item">Email: {user.email}</li>
        </ul>
        <Link to={`/edit/user/${user.id}`} className='btn btn-primary'>Edit</Link>

      </div>
    </div>
  </div>
  )
}



export default Profile
