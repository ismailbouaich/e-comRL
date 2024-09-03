// src/components/EditUser.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce'; // Adjust the path as necessary

const EditUser = ({ user }) => {
  const { id } = useParams();

  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [isValidating, setIsValidating] = useState(false); // Optional: to show loading state

  // Use the debounce hook for current_password
  const debouncedCurrentPassword = useDebounce(editedUser.current_password, 5000); // 500ms delay

  useEffect(() => {
    // Fetch user data on mount
    axios.get(`/user/edit/${user.id}`)
      .then((response) => {
        setEditedUser({
          name: response.data.name,
          email: response.data.email,
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      })
      .catch((error) => {
        console.error('Error fetching user data for editing:', error);
      });
  }, [user.id]);

  useEffect(() => {
    if (debouncedCurrentPassword) {
      setIsValidating(true);
      // Validate the debounced current password
      axios.post('/user/validate-password', { current_password: debouncedCurrentPassword })
        .then(() => {
          setIsCurrentPasswordValid(true);
          setCurrentPasswordError('');
        })
        .catch(() => {
          setIsCurrentPasswordValid(false);
          setCurrentPasswordError('Current password is incorrect');
        })
        .finally(() => {
          setIsValidating(false);
        });
    } else {
      // If current_password is empty, reset validation
      setIsCurrentPasswordValid(false);
      setCurrentPasswordError('');
      setIsValidating(false);
    }
  }, [debouncedCurrentPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post(`/user/update/${user.id}`, editedUser)
      .then((response) => {
        console.log('User data updated:', response);
        // Add success feedback here, e.g., redirect or show a success message
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
        // Add error feedback here, e.g., show error messages
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
      <form onSubmit={handleFormSubmit} autoComplete="off">
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
                    value={editedUser.name}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div className="mt-2">
                  <input
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="current_password" className="block text-sm font-medium leading-6 text-gray-900">Current Password</label>
                <div className="mt-2">
                  <input
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="current_password"
                    value={editedUser.current_password}
                    onChange={handleInputChange}
                    autoComplete="new-password" // Ensure no auto-fill for password fields
                  />
                </div>
                {isValidating && (
                  <p className="text-sm text-gray-600 mt-1">Validating...</p>
                )}
                {currentPasswordError && (
                  <p className="text-sm text-red-600 mt-1">{currentPasswordError}</p>
                )}
              </div>
              {isCurrentPasswordValid && (
                <>
                  <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">New Password</label>
                    <div className="mt-2">
                      <input
                        type="password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        name="password"
                        value={editedUser.password}
                        onChange={handleInputChange}
                        autoComplete="new-password" // Ensure no auto-fill for password fields
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">Confirm New Password</label>
                    <div className="mt-2">
                      <input
                        type="password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        name="password_confirmation"
                        value={editedUser.password_confirmation}
                        onChange={handleInputChange}
                        autoComplete="new-password" // Ensure no auto-fill for password fields
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={!isCurrentPasswordValid && editedUser.current_password !== ''}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
