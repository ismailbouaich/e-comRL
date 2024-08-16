import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Swipe = ({ categories }) => {
  const navigate = useNavigate();

  

  

  const handleCategoryClick = (category) => {
    navigate('/store', { state: { selectedCategory: category.name } });
  };
 
  if (!categories || categories.length === 0) {
    return <p>No categories available</p>;
  }

  return (
    <Swiper spaceBetween={10} slidesPerView={5} className="w-[100%]">
      {categories.map((item, index) => (
        <SwiperSlide key={index} className="h-[200px] flex items-center" onClick={() => handleCategoryClick(item)}>
          <div className="card p-4 rounded-lg shadow-lg text-center max-w-[200px] min-w-[200px] h-[90%] flex flex-col justify-center">
            <h3 className="text-sm font-bold">{item.name}</h3>
            <img src={`http://127.0.0.1:8000/storage/${item.icon}`} className="bg-cover" alt={item.name} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Swipe;
