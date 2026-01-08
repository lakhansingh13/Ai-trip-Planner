import React from 'react'
import { Link } from 'react-router-dom';
import HotelCarditem from './HotelCarditem';

function Hotels({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-2'>
                {trip?.TripData?.travelPlan?.hotelOptions?.map((hotel, index) => (
                    <HotelCarditem key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    )
}

export default Hotels;
