import React from 'react'
import PlaceCarditem from './PlaceCarditem';
import { safeRender } from '@/lib/renderUtils';

function PlacesToVisit({ trip }) {
  return (
    <div className='mt-12'>
      <h2 className='font-bold text-3xl mb-8 flex items-center gap-3'>
         📍 <span className="text-black dark:text-white">Places To Visit</span>
      </h2>
      
      <div className='space-y-12'>
        {trip?.TripData?.travelPlan?.itinerary?.map((item, index) => (
          <div key={index} className='relative pl-8 border-l-2 border-orange-200 dark:border-orange-900/30'>
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            
            <h2 className='font-bold text-xl mb-6 flex items-center gap-2'>
               Day {item.day} <span className="text-sm font-normal text-muted-foreground ml-2">— Discovering new horizons</span>
            </h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {item.activities.map((place, idx) => (
                <div key={idx} className='flex flex-col h-full'>
                  <h3 className='font-semibold text-sm text-orange-600 dark:text-orange-400 mb-2 px-1 flex items-center gap-1.5'>
                     ✨ {safeRender(place.bestTimeToVisit)}
                  </h3>
                  <div className="flex-1">
                    <PlaceCarditem place={place} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default PlacesToVisit;
