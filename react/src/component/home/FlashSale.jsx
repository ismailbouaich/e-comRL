import React from 'react'

const FlashSale = () => {
    const data = [
        {id: 1, name: 'jamal', email: 'sa3d@ddd.xom'},
        {id: 2, name: 'soma', email: 'soma@ddd.xom'},
        {id: 3, name: 'karo', email: 'karo@ddd.xom'},
        {id: 4, name: 'jarp', email: 'jarp@ddd.xom'},
    ];

  return (
    <div className='mb-12 md:mb-14 xl:mb-16 border border-gray-300 rounded-md pt-5 md:pt-6 lg:pt-7 pb-5 lg:pb-7 px-4 md:px-5 lg:px-7'>

            <div className="flex flex-wrap items-center justify-between mb-5 md:mb-6">
                    <div className="flex items-center justify-between -mt-2 lg:-mt-2.5 mb-0">
                            <h3 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold">
                                Flash Sale
                            </h3>
                    </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-3 md:gap-x-5 xl:gap-x-7 gap-y-4 lg:gap-y-5 xl:lg:gap-y-6 2xl:gap-y-8'>
            {data.map((item) => {
    return (
        <div key={item.id} className='group box-border overflow-hidden flex rounded-md cursor-pointer ltr:pr-0 rtl:pl-0 md:pb-1 flex-col items-start bg-white'>
            <div className='flex relative ltr:rounded-l-md rtl:rounded-r-md  mb-3 md:mb-3.5 pb-0 aspect-square w-full rounded-md overflow-hidden'>
                <img src="https://chawkbazar.redq.io/_next/image?url=https%3A%2F%2Fchawkbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F177%2Fj.png&w=1920&q=100" alt="" className='bg-gray-300 object-cover transition duration-150 ease-linear transform group-hover:scale-105' style={{
                    position:'absolute',height:'100%',width:'100%',left:'0',top:'0',right:'0',bottom:'0',color:'transparent'
                }} sizes="(max-width: 768px) 100vw"/>
            </div>
            <div className="w-full overflow-hidden ltr:pl-0 rtl:pr-0">
                <h2 className="text-heading font-semibold truncate mb-1 md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg">
                    Tuma Kidsa bag
                </h2>
                <div className="text-heading font-semibold text-sm sm:text-base mt-1.5 space-x-1 rtl:space-x-reverse sm:text-lg md:text-base 3xl:text-xl md:mt-2.5 2xl:mt-3">
                    <span className="inline-block">
                        {item.name}
                    </span>
                    <span> - </span>
                    <span className="inline-block">
                        {item.email}
                    </span>
                </div>
            </div>
        </div>
    );
})}
            </div>
    </div>
  )
}

export default FlashSale