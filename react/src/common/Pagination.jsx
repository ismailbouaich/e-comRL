import React from 'react';
import { useNavigate } from 'react-router-dom';


const CustomPagination = ({ pageCount, currentPage }) => {

  const navigate = useNavigate();

  const handlePageChange = (page) => {
    navigate(`?page=${page}`);
  };
  return (
    <ul className="pagination">
      <li className="page-item">
        <a className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </a>
      </li>
      {Array.from({ length: pageCount }).map((_, index) => (
        <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
          <a className="page-link" onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </a>
        </li>
      ))}
      <li className="page-item">
        <a className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </a>
      </li>
    </ul>
  );
};


export default CustomPagination