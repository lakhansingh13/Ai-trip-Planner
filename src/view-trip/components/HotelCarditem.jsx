import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { FaMapMarkerAlt, FaStar, FaMoneyBillWave, FaExternalLinkAlt, FaWalking, FaChevronRight, FaRegClock, FaShieldAlt, FaCoffee } from "react-icons/fa";
import { getDetailedAIInfo } from '@/service/AIModal';
import { Sparkles, Loader2, Info, Clock, CheckCircle2 } from 'lucide-react';
import { safeRender } from '@/lib/renderUtils';

function HotelCarditem({ hotel }) {

    const [PhotoUrl, setPhotoUrl] = useState();
    const [open, setOpen] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    useEffect(() => {
        hotel && GetPlacePhoto();
    }, [hotel])

    useEffect(() => {
        if (open && !aiData) {
            fetchAIDetails();
        }
    }, [open]);

    const fetchAIDetails = async () => {
        setLoadingAI(true);
        const query = `${hotel?.hotelName}, ${hotel?.address || hotel?.hotelAddress}`;
        const data = await getDetailedAIInfo(query);

        if (data?.isRateLimit) {
            // Keep aiData null but maybe show a specific state in UI
            setAiData({ errorType: 'RATE_LIMIT' });
        } else if (data) {
            setAiData(data);
        }
        setLoadingAI(false);
    };

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: hotel?.hotelName
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
        const url = 'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + "," + (hotel?.address || hotel?.hotelAddress);
        window.open(url, '_blank');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='glass-card p-4 h-full flex flex-col gap-3 group animate-stagger-in cursor-pointer'>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                        <img
                            src={PhotoUrl || '/placeholder.jpg'}
                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                            alt={hotel?.hotelName}
                            onError={(e) => { e.target.src = '/placeholder.jpg'; e.target.onError = null; }}
                        />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                            ⭐ {safeRender(hotel?.rating)}
                        </div>
                    </div>

                    <div className='flex flex-col flex-1 gap-2'>
                        <h2 className='font-bold text-lg text-black dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
                            {safeRender(hotel?.hotelName)}
                        </h2>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <h2 className='text-xs text-muted-foreground flex items-center gap-1 line-clamp-2'>
                                <span className="text-orange-500">📍</span> {safeRender(hotel?.address || hotel?.hotelAddress)}
                            </h2>
                            <h2 className='text-sm font-semibold text-black dark:text-gray-200 mt-auto pt-2 border-t border-black/5 dark:border-white/5'>
                                💰 {safeRender(hotel?.price || hotel?.priceRange)} <span className="text-[10px] font-normal text-muted-foreground">/ night</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[94%] sm:max-w-2xl p-0 overflow-hidden border-none glass-card animate-in zoom-in-95 duration-300 h-fit max-h-[90vh] flex flex-col rounded-3xl outline-none">
                <div className="sr-only">
                    <DialogTitle>{safeRender(hotel?.hotelName)} Details</DialogTitle>
                    <DialogDescription>Detailed information about {safeRender(hotel?.hotelName)} including AI insights, rules, and amenities.</DialogDescription>
                </div>


                <div className="relative h-64 md:h-80">
                    <img
                        src={PhotoUrl || '/placeholder.jpg'}
                        className="w-full h-full object-cover"
                        alt={hotel?.hotelName}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{safeRender(hotel?.hotelName)}</h2>
                        <p className="text-gray-200 text-sm flex items-center gap-2">
                            <FaMapMarkerAlt className="text-orange-400" /> {safeRender(hotel?.address || hotel?.hotelAddress)}
                        </p>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-2.5 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 group hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all">
                            <FaStar className="text-orange-500 text-lg mb-0.5" />
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Rating</span>
                            <span className="text-base font-bold text-black dark:text-white">{safeRender(hotel?.rating)}</span>
                        </div>
                        <div className="flex flex-col items-center p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 group hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                            <FaMoneyBillWave className="text-blue-500 text-lg mb-0.5" />
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Price</span>
                            <span className="text-base font-bold text-black dark:text-white truncate max-w-full px-2">
                                {safeRender(hotel?.price || hotel?.priceRange)}
                            </span>
                        </div>
                        <div className="hidden md:flex flex-col items-center p-2.5 bg-purple-50 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30 group hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all">
                            <Clock className="text-purple-500 text-lg mb-0.5" />
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Check-in</span>
                            <span className="text-base font-bold text-black dark:text-white">{safeRender(aiData?.timing?.check_in) || "2:00 PM"}</span>
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
                                <div className="h-20 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                                    <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                                </div>
                            </div>
                        ) : aiData?.errorType === 'RATE_LIMIT' ? (
                            <div className="p-8 text-center border-2 border-dashed border-orange-200 dark:border-orange-900/30 rounded-3xl bg-orange-50/30 dark:bg-orange-950/10">
                                <Clock className="mx-auto text-orange-500 mb-2 size-8 animate-pulse" />
                                <h4 className="font-bold text-orange-700 dark:text-orange-400">AI Limit Reached</h4>
                                <p className="text-sm text-orange-600/70 dark:text-orange-400/60 mt-1">Free tier allows 20 requests/min. Please wait 1 minute to load more deep insights.</p>
                                <Button variant="outline" className="mt-4 rounded-xl border-orange-200 hover:bg-orange-100 dark:border-orange-800 dark:hover:bg-orange-900/20" onClick={fetchAIDetails}>Try Again</Button>
                            </div>
                        ) : aiData && !aiData.errorType ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="p-5 bg-gradient-to-br from-white/50 to-white/30 dark:from-white/5 dark:to-white/[0.02] rounded-2xl border border-white/20 backdrop-blur-md shadow-sm">
                                    <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed italic">
                                        "{safeRender(aiData.description)}"
                                    </p>
                                </div>

                                {/* Rules & Policies */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <FaShieldAlt className="text-orange-500 scale-110" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">Rules & Policies</span>
                                    </h4>
                                    <div className="flex flex-col gap-2.5 w-full">
                                        {aiData.rules?.slice(0, 4).map((rule, index) => (
                                            <div key={index} className="w-full flex gap-3 p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group/rule">
                                                <div className="size-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0 group-hover/rule:scale-125 transition-transform" />
                                                <span className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{safeRender(rule)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Amenities - MOVED BELOW RULES */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <FaCoffee className="text-blue-500 scale-110" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">Amenities</span>
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                                        {aiData.amenities?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2.5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/5 text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200/30 dark:border-blue-900/40 text-center flex items-center justify-center shadow-sm hover:scale-[1.02] hover:bg-blue-100/80 dark:hover:bg-blue-900/20 hover:border-blue-400/30 transition-all cursor-default"
                                            >
                                                {safeRender(item)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Nearby Attractions */}
                                <div className="p-5 bg-gradient-to-br from-purple-50/80 to-purple-100/40 dark:from-purple-900/10 dark:to-purple-900/5 rounded-2xl border border-purple-200/50 dark:border-purple-900/20 shadow-sm relative overflow-hidden group/nearby">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/nearby:scale-110 transition-transform">
                                        <FaMapMarkerAlt className="size-16 text-purple-600" />
                                    </div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2 relative z-10">
                                        📍 Nearby Attractions
                                    </h4>
                                    <div className="flex flex-wrap gap-2 relative z-10">
                                        {aiData.nearbyPlaces?.map((place, index) => (
                                            <div key={index} className="px-3 py-1.5 bg-white/60 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-700 dark:text-zinc-300 border border-purple-200/30 dark:border-purple-900/30 shadow-sm hover:shadow-md transition-all cursor-default">
                                                {safeRender(place)}
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

export default HotelCarditem
