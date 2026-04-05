import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { IoIosSend } from "react-icons/io";
import { getUnsplashPhoto, getPexelsPhoto, getWikimediaPhoto } from "@/service/GlobalApi";


// const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY
function InfoSection({ trip }) {


    const [PhotoUrl, setPhotoUrl] = useState();
    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip])

    const GetPlacePhoto = async () => {
        const query = trip?.userSelection?.location?.label;
        const lat = trip?.userSelection?.location?.location?.lat;
        const lng = trip?.userSelection?.location?.location?.lng;
        
        if (!query) return;

        let photo = null;
        const cleanQuery = query?.split(',')[0] || query;

        // 1. Try Wikimedia First (User Request: Best for Landmarks/Geography)
        try {
            photo = await getWikimediaPhoto(cleanQuery);
        } catch (e) { console.error("Wikimedia error", e); }

        // 2. Try Unsplash (Better aesthetics)
        if (!photo) {
            try {
                photo = await getUnsplashPhoto(cleanQuery + " travel");
            } catch (e) { console.error("Unsplash error", e); }
        }

        // 3. Try Pexels
        if (!photo) {
            try {
                photo = await getPexelsPhoto(cleanQuery);
            } catch (e) { console.error("Pexels error", e); }
        }

        if (photo) {
            setPhotoUrl(photo);
        }
    }
    return (
        <div className="animate-stagger-in">
            <div className='relative group'>
                <img
                    src={PhotoUrl || '/placeholder.jpg'}
                    className="h-[300px] md:h-[400px] w-full object-cover rounded-3xl shadow-none transition-transform duration-1000 group-hover:scale-[1.01]"
                    alt="Travel Location"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; e.target.onError = null; }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl opacity-60' />
                <div className='absolute bottom-8 left-8 right-8 flex justify-between items-end text-white'>
                    <div>
                        <h1 className="font-bold text-3xl md:text-5xl drop-shadow-lg font-serif italic tracking-tight">
                            {trip?.userSelection?.location?.label || "Your Adventure"}
                        </h1>
                    </div>
                </div>
                <div className='absolute top-6 right-6'>
                    <Button className="rounded-full h-12 w-12 p-0 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 shadow-none transition-all duration-300">
                        <IoIosSend className="text-xl" />
                    </Button>
                </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-4 justify-start overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1 sm:py-2.5 glass-card !rounded-full border-orange-200 dark:border-orange-900/30 shrink-0 shadow-none">
                    <span className="text-sm sm:text-xl">🗓️</span>
                    <div className="flex flex-col">
                        <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">Duration</span>
                        <span className="text-[10px] sm:text-sm font-bold text-black dark:text-white mt-0.5">{trip.userSelection?.noOfDays} Days</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1 sm:py-2.5 glass-card !rounded-full border-blue-200 dark:border-blue-900/30 shrink-0 shadow-none">
                    <span className="text-sm sm:text-xl">💸</span>
                    <div className="flex flex-col">
                        <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">Budget</span>
                        <span className="text-[10px] sm:text-sm font-bold text-black dark:text-white mt-0.5">{trip.userSelection?.budget}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1 sm:py-2.5 glass-card !rounded-full border-purple-200 dark:border-purple-900/30 shrink-0 shadow-none">
                    <span className="text-sm sm:text-xl">🫂</span>
                    <div className="flex flex-col">
                        <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">Travelers</span>
                        <span className="text-[10px] sm:text-sm font-bold text-black dark:text-white mt-0.5">{trip.userSelection?.traveler}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoSection;
