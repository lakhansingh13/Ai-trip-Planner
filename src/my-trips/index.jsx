import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetUsertrips();
    }, [])

    const GetUsertrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigate('/');
            return;
        }

        setLoading(true);
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push(doc.data());
        });
        // Sort by ID (timestamp) in descending order to show recent first
        const sortedTrips = trips.sort((a, b) => b.id - a.id);
        setUserTrips(sortedTrips);
        setLoading(false);
    }

    return (
        <div className='py-12 sm:px-10 md:px-10 lg:px-20 xl:px-24 px-5 mt-20 w-full max-w-full mx-auto'>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 animate-stagger-in px-4">
                <div>
                    <h2 className='font-bold text-4xl bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent'>
                        My Trips
                    </h2>
                    <p className="text-muted-foreground mt-2 text-lg">Your collection of AI-crafted adventures</p>
                </div>
            </div>

            {loading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                        <div key={index} className='glass-card p-4 overflow-hidden h-[380px] flex flex-col gap-4 border-slate-200/50 dark:border-white/5 opacity-80'>
                            {/* Shape of Image */}
                            <div className="relative w-full h-[200px] bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 animate-shimmer"></div>
                            </div>
                            
                            {/* Shape of Details */}
                            <div className="flex flex-col flex-1 gap-4">
                                <div className="space-y-2">
                                    <div className="relative h-6 w-3/4 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer"></div>
                                    </div>
                                    <div className="relative h-4 w-1/2 bg-slate-200/40 dark:bg-slate-800/40 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer"></div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    <div className="relative h-8 w-20 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer"></div>
                                    </div>
                                    <div className="relative h-8 w-20 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                                    <div className="relative h-3 w-20 bg-slate-200/40 dark:bg-slate-800/40 rounded overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer"></div>
                                    </div>
                                    <div className="relative h-8 w-8 rounded-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : userTrips?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4'>
                    {userTrips.map((trip, index) => (
                        <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                            <UserTripCardItem trip={trip} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center glass-card p-12 mt-10 mx-4">
                    <div className="w-24 h-24 bg-orange-50 dark:bg-orange-950/20 rounded-full flex items-center justify-center text-orange-500 mb-6 border border-orange-100 dark:border-orange-900/30 shadow-inner">
                        <FolderOpen size={48} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No trips found</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm">
                        You haven't planned any trips yet. Start your next adventure with our AI trip planner!
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/create-trip')}
                        className="rounded-full px-8 py-6 h-auto"
                    >
                        Plan Your First Trip
                    </Button>
                </div>
            )}
        </div>
    )
}

export default MyTrips;
