import React, { useEffect,useState } from 'react'
import UserList from '../UserList'
import { useNavigate } from 'react-router'

import Swipe from './Swipe'
import FlashSale from './FlashSale'
import { Hero } from './Hero'


const Home = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const navigate=useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
      return navigate('/login')
    }
  });
  return (
    <main className='relative flex-grow '>
     <Hero/>

    <div className='mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16'>
      <FlashSale/>
    </div>

    <div className='mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16'>
      <Swipe/>
    </div>

    </main>
  )
}

export default Home
