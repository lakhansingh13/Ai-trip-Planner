import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCarditem({ place }) {

  const [PhotoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    place && GetPlacePhoto();
  }, [place])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName
    }
    const result = await GetPlaceDetails(data).then(resp => {
      console.log("API Photo Name:", resp.data.places[0].photos[0].name)

      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
      setPhotoUrl(PhotoUrl);

    })
  }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName} target='_blank'>
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        <img src={PhotoUrl ? PhotoUrl : '/placeholder.jpg'}
          onError={(e) => {
            console.error("Image failed to load:", PhotoUrl);
            e.target.src = '/placeholder.jpg';
            e.target.onError = null;
          }}
          className='w-[130px] h-[130px] rounded-xl object-cover'
        />

        <div className='flex-1'>
          <h2 className='font-bold text-lg text-black dark:text-white'>{place.placeName}</h2>
          <p className='text-sm text-muted-foreground'>{place.details}</p>
          <h2 className='m-2'>🕙 {place.travelTimeFromPrevious}</h2>
          {/* <Button ><FaMapLocationDot /></Button> */}
        </div>
      </div>
    </Link>
  )
}

export default PlaceCarditem;
