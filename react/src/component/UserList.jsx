// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomPagination from '../common/CustomPagination';





const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page')) || 1;


  useEffect(() => {
    axios
      .get(`/user/list?page=${currentPage}`)
      .then((response) => {
        setUsers(response.data.data);
        setTotalPages(response.data.last_page);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [currentPage]); // Fetch data when the currentPage changes


   const handlePageChange = (newPage) => {
    navigate(`?page=${newPage}`);
  };

  return (
    <div>
      <h2>User List</h2>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {users.map((user) => (
          <div className="col" key={user.id}>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D" className="card-img-top" alt="image" />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </p>

              </div>
              <Link to={`/edit/user/${user.id}`} className='btn btn-primary'>Edit</Link>
            </div>
          </div>
        ))}
      </div>
      <CustomPagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserList;





