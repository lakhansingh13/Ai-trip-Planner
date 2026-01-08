import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [PhotoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location.label
    }
    const result = await GetPlaceDetails(data).then(resp => {
      console.log("API Photo Name:", resp.data.places[0].photos[0].name);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
      console.log("Constructed PhotoUrl:", PhotoUrl);
      setPhotoUrl(PhotoUrl);

    })
  }

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className='hover:scale-105 transition-all'>
        <img src={PhotoUrl ? PhotoUrl : '/placeholder.jpg'}
          onError={(e) => {
            console.error("Image failed to load:", PhotoUrl);
            e.target.src = '/placeholder.jpg';
            e.target.onError = null;
          }}
          className="h-[250px] w-full object-cover rounded-xl" />



        <div>
          <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
          <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} days trip with {trip?.userSelection?.budget} Budget</h2>
        </div>
      </div>
    </Link>
  )
}

export default UserTripCardItem;
