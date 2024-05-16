import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Swipe = () => {
    const data = [
        {id: 1, name: 'jamal', email: 'sa3d@ddd.xom'},
        {id: 2, name: 'soma', email: 'soma@ddd.xom'},
        {id: 3, name: 'karo', email: 'karo@ddd.xom'},
        {id: 4, name: 'jarp', email: 'jarp@ddd.xom'},
    ];

    return (
 
        <Swiper
            spaceBetween={50}
            slidesPerView={3}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            className='w-[100%]'
        >
            {data.map((item) => (
                <SwiperSlide key={item.id} className='h-[200px] bg-blue-800 flex items-center justify-center'>
                    <div className="card bg-white p-4 rounded-lg shadow-lg text-center w-[90%] h-[90%] flex flex-col justify-around">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-gray-600">{item.email}</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
       
    );
}

export default Swipe;