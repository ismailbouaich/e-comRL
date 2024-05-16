import React from 'react'

export const Hero = () => {
  return (
    <div className="mb-12 md:mb-14 xl:mb-16 px-2.5 grid grid-cols-2 sm:grid-cols-9 gap-2 md:gap-2.5 max-w-[1920px] mx-auto">
    <div className="mx-auto w-full col-span-full sm:col-span-5">
      <a href="#" className='group flex justify-center relative overflow-hidden w-full aspect-[2.3/1] sm:aspect-[5.075/2]'>
      <img className="img"  src="https://chawkbazar.redq.io/_next/image?url=%2Fassets%2Fimages%2Fbanner%2Fmasonry%2Fbanner-1.jpg&w=1920&q=100" alt="" />
      </a>
    </div>
    <div className="mx-auto w-full col-span-1 sm:col-span-2">
      <a href="" className='group flex justify-center relative overflow-hidden w-full aspect-square h-full'>
      <img className="img"  src="https://chawkbazar.redq.io/_next/image?url=%2Fassets%2Fimages%2Fbanner%2Fmasonry%2Fbanner-2.jpg&w=1920&q=100" alt=""  />
      </a>
    </div>
    <div className="mx-auto w-full col-span-1 sm:col-span-2">
      <a href="" className="group flex justify-center relative overflow-hidden w-full aspect-square h-full">

      <img className="img" src="https://chawkbazar.redq.io/_next/image?url=%2Fassets%2Fimages%2Fbanner%2Fmasonry%2Fbanner-3.jpg&w=1920&q=100" alt="" />
      </a>
    </div>
    <div className="mx-auto w-full col-span-1 sm:col-span-2">
      <a href="" className="group flex justify-center relative overflow-hidden w-full aspect-square h-full">
      <img className="img"  src="https://chawkbazar.redq.io/_next/image?url=%2Fassets%2Fimages%2Fbanner%2Fmasonry%2Fbanner-4.jpg&w=1920&q=100" /></a>
      <div className="absolute top-0 block w-1/2 h-full transform -skew-x-12 -left-full z-5 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine"></div>
    </div>
    <div className="mx-auto w-full col-span-1 sm:col-span-2">
      <a href="" className="group flex justify-center relative overflow-hidden w-full aspect-square h-full">
        <img className="img" src="https://chawkbazar.redq.io/_next/image?url=%2Fassets%2Fimages%2Fbanner%2Fmasonry%2Fbanner-5.jpg&w=1920&q=100" alt="" /></a>
    </div>
    <div className="mx-auto w-full col-span-full sm:col-span-5 ">
      <a href=""className='group flex justify-center relative overflow-hidden w-full aspect-[2.3/1] sm:aspect-[5.075/2] '>
      <img className="img" src="https://chawkbazar.redq.io/_next/image?url=%2Fassets%2Fimages%2Fbanner%2Fmasonry%2Fbanner-6.jpg&w=1920&q=100" alt="" />
      </a>
      
    </div>
  </div>
  )
}
