
import Swipe from './Swipe'
import FlashSale from './FlashSale'
import { Hero } from './Hero'
import Brand from './Brand'
import {  useSelector } from 'react-redux';

const Home = () => {

 


  

  const categories = useSelector((state) => state.category.categories);

  const brands = useSelector((state) => state.brand.brands);

 

  return (
    <main className='relative flex-grow '>
     <Hero/>

    <div className='mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16'>
      <FlashSale/>
    </div>

    <div className='mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16'>
    <Swipe categories={categories} />
    </div>

    <div className='mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16'>
      <Brand brands={brands}/>
    </div>

    </main>
  )
}

export default Home
