import React from 'react'
import { Link } from 'react-router-dom';
import HotelCarditem from './HotelCarditem';

function Hotels({ trip }) {
    return (
        <div className='mt-10'>
            <h2 className='font-bold text-xl md:text-3xl mb-5 flex items-center gap-2 md:gap-3'>
               🏨 <span className="text-black dark:text-white">Hotel Recommendation</span>
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {trip?.TripData?.travelPlan?.hotelOptions?.map((hotel, index) => (
                    <HotelCarditem key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    )
}

export default Hotels;
