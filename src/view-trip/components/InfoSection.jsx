import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";


// const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY
function InfoSection({ trip }) {


    const [PhotoUrl, setPhotoUrl] = useState();
    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.userSelection?.location.label
        }
        const result = await GetPlaceDetails(data).then(resp => {
            console.log(resp.data.places[0].photos[0].name)
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
            setPhotoUrl(PhotoUrl);

        })
    }
    return (
        <div>
            <div className='relative'>
                <img src={PhotoUrl ? PhotoUrl : '/placeholder.jpg'} className="h-[200px] md:h-[300px] w-full object-cover rounded-xl"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; e.target.onError = null; }} />
                <div className='absolute top-5 right-5'>
                    <Button className="rounded-full h-10 w-10 p-0"><IoIosSend className="text-lg" /></Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-2xl my-5">{trip?.userSelection?.location.label || "Location not available "}</h2>
                <div className="flex gap-5 flex-wrap">
                    <h2 className="p-1 px-3 bg-muted rounded-full text-gray-500 text-xs md:text-md">🗓️ {trip.userSelection?.noOfDays} Days</h2>
                    <h2 className="p-1 px-3 bg-muted rounded-full text-gray-500 text-xs md:text-md">💸 {trip.userSelection?.budget} Budget</h2>
                    <h2 className="p-1 px-3 bg-muted rounded-full text-gray-500 text-xs md:text-md">🫂 No. Of Traveler: {trip.userSelection?.traveler}</h2>
                </div>
            </div>

        </div>
    );
}

export default InfoSection;
