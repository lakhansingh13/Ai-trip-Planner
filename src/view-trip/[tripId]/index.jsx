import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../../service/firebaseConfig"
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";
import { HotelCardSkeleton, InfoSectionSkeleton, PlaceCardSkeleton, SkeletonLine } from "../../components/custom/Skeleton";

function Viewtrip() {

    const { tripId } = useParams();
    const [trip, setTrip] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId]);

    const GetTripData = async () => {
        setLoading(true);
        if (tripId === "local") {
            const localData = localStorage.getItem("last_trip");
            if (localData) {
                setTrip(JSON.parse(localData));
                setLoading(false);
                return;
            }
        }

        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setTrip(docSnap.data());
        }
        else {
            toast('No trip Found!')
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className='p-4 md:px-20 lg:px-44 xl:px-56 mt-28 flex flex-col gap-2'>
                <InfoSectionSkeleton />
                <div className='mt-12 space-y-8'>
                    <div className='flex items-center gap-3 mb-8'>
                        <SkeletonLine className='h-10 w-48' />
                    </div>
                    <div className='space-y-12'>
                        <PlaceCardSkeleton />
                        <PlaceCardSkeleton />
                        <PlaceCardSkeleton />
                    </div>
                </div>
                <div className='mt-12'>
                    <SkeletonLine className='h-10 w-64 mb-8' />
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                        <HotelCardSkeleton />
                        <HotelCardSkeleton />
                        <HotelCardSkeleton />
                        <HotelCardSkeleton />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='p-4 md:px-20 lg:px-44 xl:px-56 mt-28 flex flex-col gap-2'>
            {/*Information Section*/}
            <InfoSection trip={trip} />
            
            {/*Daily Plan (Itinerary)*/}
            <PlacesToVisit trip={trip} />

            {/*Recommended Hotels (Moved to bottom)*/}
            <Hotels trip={trip} />

            {/* Footer*/}
            <Footer trip={trip} />

        </div>
    )
}
export default Viewtrip;


