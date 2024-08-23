import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditUser = ({user}) => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({
    name: '', // Initialize with an empty string
    email: '',
    password:'',
    password_confirmation: '',

  });

  useEffect(() => {
    axios.get(`/user/edit/${id}`)
      .then((response) => {
        setUser(response.data);
        setEditedUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data for editing:', error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post(`/user/update/${id}`, editedUser)
      .then((response) => {
        console.log('User data updated:', response);
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10"> 
    <form onSubmit={handleFormSubmit}>

      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Edit User</h2>
     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
          <div className="mt-2">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="name"
            value={user.name}
            onChange={handleInputChange}
          />
          </div>
        </div>
        <div className="relative sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div className="mt-2">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />
          </div>
        </div>
        <div className="relative sm:col-span-2">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div className="mt-2">
          <input
            type="password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="password"
            value={editedUser.password}
            onChange={handleInputChange}
          />
          </div>
        </div>
        <div className="relative sm:col-span-2">
          <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">Password Confirmation</label>
          <div className="mt-2">
          <input
            type="password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="password_confirmation"
            value={editedUser.password_confirmation}
            onChange={handleInputChange}
          />
          </div>
        </div>
        
       

      </div>
      </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Changes</button>

      </div>

      </form>
    </div>
  );
};

export default EditUser;
