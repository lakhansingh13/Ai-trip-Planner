import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { safeRender } from '@/lib/renderUtils';
import { Calendar, Wallet, MapPin, ArrowRight, Compass } from 'lucide-react';

function UserTripCardItem({ trip }) {
  const [PhotoUrl, setPhotoUrl] = useState();
  
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label
    }
    await GetPlaceDetails(data).then(resp => {
      if (resp.data.places[0].photos) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
        setPhotoUrl(PhotoUrl);
      }
    }).catch(err => {
      console.error("Error fetching photo:", err);
    });
  }

  return (
    <Link to={'/view-trip/' + trip?.id} className="block group">
      <div className='glass-card p-4 overflow-hidden flex flex-col gap-4 h-full animate-stagger-in'>
        {/* Image Container with Zoom Effect */}
        <div className="relative w-full h-[200px] overflow-hidden rounded-2xl shadow-inner">
          <img 
            src={PhotoUrl || '/placeholder.jpg'}
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
              e.target.onError = null;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={trip?.userSelection?.location?.label}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {/* Top Location Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
            <Compass size={12} className="text-orange-400 fill-orange-400 animate-pulse" />
            <span className="drop-shadow-sm">
              {safeRender(trip?.userSelection?.location?.label?.split(',')[0])}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 gap-4 text-left">
          <div className="space-y-1">
            <h2 className='font-bold text-xl text-black dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
              {safeRender(trip?.userSelection?.location?.label)}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <Calendar size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                {safeRender(trip?.userSelection?.noOfDays)} Days
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <Wallet size={12} className="text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {safeRender(trip?.userSelection?.budget)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">View Details</span>
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white scale-90 group-hover:scale-100 group-hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                    <ArrowRight size={16} />
                </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default UserTripCardItem;
