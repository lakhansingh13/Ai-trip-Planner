import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { FaMapMarkerAlt, FaClock, FaTicketAlt, FaInfoCircle, FaShieldAlt, FaMap } from "react-icons/fa";
import { getDetailedAIInfo } from '@/service/AIModal';
import { Sparkles, Loader2, Info, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { safeRender } from '@/lib/renderUtils';

function PlaceCarditem({ place }) {

  const [PhotoUrl, setPhotoUrl] = useState();
  const [open, setOpen] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place])

  useEffect(() => {
    if (open && !aiData) {
      fetchAIDetails();
    }
  }, [open]);

  const fetchAIDetails = async () => {
    setLoadingAI(true);
    const query = `${place?.placeName} ${place?.placeDetails || ""}`;
    const data = await getDetailedAIInfo(query);

    if (data?.isRateLimit) {
      setAiData({ errorType: 'RATE_LIMIT' });
    } else if (data) {
      setAiData(data);
    }
    setLoadingAI(false);
  };

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName
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

  const openInMaps = () => {
    const url = 'https://www.google.com/maps/search/?api=1&query=' + place?.placeName;
    window.open(url, '_blank');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='glass-card p-4 h-full flex flex-col sm:flex-row gap-5 group animate-stagger-in cursor-pointer'>
          <div className="relative w-full sm:w-[140px] h-[140px] shrink-0 overflow-hidden rounded-2xl">
            <img
              src={PhotoUrl || '/placeholder.jpg'}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
                e.target.onError = null;
              }}
              className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
              alt={place.placeName}
            />
          </div>

          <div className='flex flex-col flex-1 justify-between gap-3'>
            <div>
              <h2 className='font-bold text-lg text-black dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-left'>
                {safeRender(place.placeName)}
              </h2>
              <p className='text-sm text-muted-foreground line-clamp-2 mt-1 text-left'>
                {safeRender(place.placeDetails)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              <div className='flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-900/30'>
                <span className='text-xs'>🕒</span>
                <span className='text-xs font-semibold text-blue-700 dark:text-blue-300'>{safeRender(place.travelTime)}</span>
              </div>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-100 dark:border-amber-900/30'>
                <span className='text-xs'>🎫</span>
                <span className='text-xs font-semibold text-amber-700 dark:text-amber-300'>{safeRender(place.ticketPricing)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[94%] sm:max-w-2xl p-0 overflow-hidden border-none glass-card animate-in zoom-in-95 duration-300 h-fit max-h-[90vh] flex flex-col rounded-3xl outline-none shadow-2xl shadow-indigo-500/10">
        <div className="sr-only">
          <DialogTitle>{safeRender(place.placeName)} Details</DialogTitle>
          <DialogDescription>Detailed information about {safeRender(place.placeName)} including AI insights, timings, and rules.</DialogDescription>
        </div>



        <div className="relative h-64 md:h-80">
          <img
            src={PhotoUrl || '/placeholder.jpg'}
            className="w-full h-full object-cover"
            alt={place.placeName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-orange-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                {safeRender(place.bestTimeToVisit) || "Recommended"}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{safeRender(place?.placeName)}</h2>
            <p className="text-gray-200 text-sm flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-400" /> {safeRender(place?.placeDetails?.split(',')[0])}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 group hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FaClock className="text-base" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground font-bold uppercase block">Travel Time</span>
                <span className="text-sm font-bold text-black dark:text-white leading-tight">{safeRender(place.travelTime)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 group hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <FaTicketAlt className="text-base" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground font-bold uppercase block">Pricing</span>
                <span className="text-sm font-bold text-black dark:text-white leading-tight">{safeRender(place.ticketPricing)}</span>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                <Sparkles className="text-orange-500 size-5 animate-pulse" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">AI Deep Dive</span>
              </h3>
              {loadingAI && <Loader2 className="animate-spin text-orange-500 size-5" />}
            </div>

            {loadingAI ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-24 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                  <div className="h-40 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                </div>
              </div>
            ) : aiData?.errorType === 'RATE_LIMIT' ? (
              <div className="p-8 text-center border-2 border-dashed border-orange-200 dark:border-orange-900/30 rounded-3xl bg-orange-50/30 dark:bg-orange-950/10">
                <Clock className="mx-auto text-orange-500 mb-2 size-8 animate-pulse" />
                <h4 className="font-bold text-orange-700 dark:text-orange-400 font-outfit uppercase tracking-wider">AI Limit Reached</h4>
                <p className="text-sm text-orange-600/70 dark:text-orange-400/60 mt-1 italic">Free tier allows 20 requests/min. Please wait 1 minute to load more deep insights.</p>
                <Button variant="outline" className="mt-4 rounded-xl border-orange-200 hover:bg-orange-100 dark:border-orange-800 dark:hover:bg-orange-900/20" onClick={fetchAIDetails}>Try Again</Button>
              </div>
            ) : aiData && !aiData.errorType ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Detailed Description */}
                <div className="p-6 bg-white/60 dark:bg-white/5 rounded-3xl border border-white/40 dark:border-white/10 italic text-sm text-gray-700 dark:text-zinc-300 leading-relaxed shadow-sm">
                  "{safeRender(aiData.description)}"
                </div>

                {/* Timings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Clock className="text-blue-500 size-4" /> Timings
                  </h4>
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Open</p>
                        <p className="text-sm font-bold">{safeRender(aiData.timing?.open) || "9:00 AM"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Close</p>
                        <p className="text-sm font-bold">{safeRender(aiData.timing?.close) || "6:00 PM"}</p>
                      </div>
                    </div>
                    {aiData.timing?.special_note && (
                      <p className="mt-3 text-[10px] text-blue-500 font-medium border-t border-blue-200 dark:border-blue-800 pt-2">
                        Note: {safeRender(aiData.timing.special_note)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 w-full">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <FaShieldAlt className="text-orange-500 scale-110" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">Rules & Entry</span>
                  </h4>
                  <div className="flex flex-col gap-3 w-full">
                    {aiData.rules?.slice(0, 4).map((rule, index) => (
                      <div key={index} className="w-full flex gap-3 p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group/rule">
                        <CheckCircle2 className="size-4 text-orange-500 mt-0.5 shrink-0 group-hover/rule:scale-110 transition-transform" />
                        <span className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{safeRender(rule)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Things to experience - Insights & Chips */}
                <div className="space-y-5 pt-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Sparkles className="text-amber-500 size-4 animate-pulse" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">Insights & Chips</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {aiData.amenities?.map((tip, index) => (
                      <div
                        key={index}
                        className="px-3 py-2.5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-900/5 text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-300 rounded-xl border border-amber-200/30 dark:border-amber-900/40 text-center flex items-center justify-center shadow-sm hover:scale-[1.02] hover:bg-amber-100/80 dark:hover:bg-amber-900/20 hover:border-amber-400/30 transition-all cursor-default"
                      >
                        {safeRender(tip)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
                <Info className="mx-auto text-gray-400 mb-2 size-8" />
                <p className="text-sm text-muted-foreground">Click to load AI-powered insights</p>
                <Button variant="outline" className="mt-4 rounded-xl" onClick={fetchAIDetails}>Retry AI Fetch</Button>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              onClick={openInMaps}
              className="flex-1 h-14 rounded-2xl text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <FaMapMarkerAlt /> View on Google Maps
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlaceCarditem;
