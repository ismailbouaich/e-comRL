// useAuth.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token && !!user);
    setIsLoading(false);
  }, [user]);

  return { isAuthenticated, isLoading };
};