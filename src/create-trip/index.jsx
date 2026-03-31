import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelersList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const LOADING_MESSAGES = [
  "Analyzing your travel style... 🧠",
  "Finding perfect hotel options... 🏨",
  "Planning each day with care... 🗺️",
  "Optimizing travel routes... 🚗",
  "Finalizing your dream trip... ✨"
];

const SUBTITLE_TEXTS = [
  "Share your style with us, and our AI will craft a personalized itinerary that turns your travel dreams into reality.",
  "Tell us where you want to go, and let our intelligent engine build a budget-friendly adventure just for you.",
  "Ready for a family getaway? Our AI creates child-friendly plans that make every moment of your trip memorable.",
  "Looking for luxury? Experience world-class stays and exclusive activities designed by our smart travel assistant.",
  "For the thrill-seekers: discover hidden gems and epic trails with a custom-built route tailored to your spirit.",
  "Plan your romantic escape with ease. We weave together intimate dinners and scenic spots for the perfect honeymoon.",
  "Explore like a local. Our AI uncovers authentic experiences and neighborhood favorites for an immersive journey."
];

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormdata] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  useEffect(() => {
    let interval;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[index]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLE_TEXTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if google maps is loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        fields: ['address_components', 'geometry', 'name'],
      });

      autocomplete.addListener('place_changed', () => {
        const selectedPlace = autocomplete.getPlace();
        console.log("Selected Place from standard Autocomplete:", selectedPlace);

        const locationLabel = selectedPlace.formatted_address || selectedPlace.name || "Selected Location";

        if (selectedPlace.geometry && selectedPlace.geometry.location) {
          setFormdata((prev) => ({
            ...prev,
            location: {
              label: locationLabel,
              location: {
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng()
              }
            }
          }));
        } else {
          toast.error("Please select a location from the dropdown!");
        }
      });
    } else {
      console.error("Google Maps Places library not loaded yet.");
    }
  }, []);

  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  const handleInputChange = (name, value) => {
    setFormdata({
      ...formData,
      [name]: value
    })
  }

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      toast.success("Login successful!");
      setOpenDialog(false);
      OnGenerateTrip();
    }).catch((err) => {
      console.error("Failed to fetch user", err);
      toast.error("Login failed.");
    });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => {
      console.log("Login error:", error);
      toast.error("Google login failed.");
    }
  });

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      TripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId

    });
    setLoading(false);
    navigate('/view-trip/' + docId)
  }

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }

    console.log("Current Form Data during validation:", formData);

    // Ensure all fields are filled
    if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays) {
      const missing = [];
      if (!formData?.location) missing.push("Location");
      if (!formData?.budget) missing.push("Budget");
      if (!formData?.traveler) missing.push("Traveler");
      if (!formData?.noOfDays) missing.push("No. of Days");

      toast("Please fill all details: " + missing.join(", "));
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{travelers}', formData?.traveler)
      .replace('{budget}', formData?.budget);

    // Replace all remaining occurrences
    const CLEAN_PROMPT = FINAL_PROMPT
      .replaceAll('{location}', formData?.location?.label)
      .replaceAll('{totalDays}', formData?.noOfDays)
      .replaceAll('{travelers}', formData?.traveler)
      .replaceAll('{budget}', formData?.budget);



    try {
      const result = await chatSession.sendMessage(CLEAN_PROMPT);
      console.log(await result?.response?.text());
      setLoading(false);
      SaveAiTrip(result?.response?.text())
    } catch (err) {
      toast.error("Failed to generate trip.");
      console.error("AI error:", err);
    }
  }

  return (
    <div className='py-10 md:py-12 px-5 sm:px-10 md:px-20 lg:px-32 xl:px-48 mt-20 w-full animate-in fade-in transition-all duration-500'>
      <div className="flex flex-col gap-2">
        <h2 className='font-bold text-2xl md:text-3xl tracking-tight'>
          Tell us your travel preferences 🏕️🌴
        </h2>
        <div
          key={subtitleIndex}
          className='text-gray-500 text-base md:text-lg font-medium leading-relaxed w-full'
        >
          {SUBTITLE_TEXTS[subtitleIndex].split(" ").map((word, index) => (
            <span
              key={index}
              className="inline-block mr-1 opacity-0 animate-word-fade-in"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className='mt-10 md:mt-8 flex flex-col gap-8'>
        <div className="glass-card p-6">
          <h2 className='text-xl my-3 font-bold'>What is your destination of choice?</h2>
          <div className="mt-2">
            <Input
              ref={autocompleteRef}
              placeholder="Search destination"
              className="w-full"
            />
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className='text-xl my-3 font-bold'>How many days are you planning your trip?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            className="w-full"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 md:mt-6">
        <h2 className='text-xl my-3 font-bold md:pt-8'>What is your Budget?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('budget', item.title)}
              className={`glass-card p-5 cursor-pointer transition-all duration-300
                ${formData?.budget === item.title ?
                  'border-black dark:border-white ring-2 dark:ring-1 ring-black dark:ring-white scale-[1.02] shadow-xl bg-white/90 dark:bg-slate-900/60' :
                  'hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-slate-800/40'}
              `}>
              <h2 className='text-4xl transition-transform duration-300 group-hover:scale-110'>{item.icon}</h2>
              <h2 className='font-bold text-lg mt-2'>{item.title}</h2>
              <h2 className='text-sm text-gray-500 dark:text-white/60 leading-snug'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-6">
        <h2 className='text-xl my-3 font-bold md:pt-8'>Who are you traveling with?</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mt-5'>
          {SelectTravelersList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('traveler', item.people)}
              className={`glass-card p-5 cursor-pointer transition-all duration-300
                ${formData?.traveler === item.people ?
                  'border-black dark:border-white ring-2 dark:ring-1 ring-black dark:ring-white scale-[1.02] shadow-xl bg-white/90 dark:bg-slate-900/60' :
                  'hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-slate-800/40'}
              `}>
              <h2 className='text-4xl transition-transform duration-300 group-hover:scale-110'>{item.icon}</h2>
              <h2 className='font-bold text-lg mt-2'>{item.title}</h2>
              <h2 className='text-sm text-gray-500 dark:text-white/60 leading-snug'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 md:justify-end flex justify-center'>
        <Button
          disabled={loading}
          onClick={OnGenerateTrip}
          className="w-full md:w-auto px-8 py-6 md:py-4 text-lg md:text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-lg rounded-xl md:rounded-md">
          {loading ?
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> :
            'Generate Trip'
          }
        </Button>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" className="h-10 w-auto" alt="Logo" />
              <h2 className='font-bold text-lg mt-7 transition-all duration-300'>Sign In With Google</h2>
              <p className="text-muted-foreground">Sign in to the app securely with Google to save your personalized trips.</p>
              <Button onClick={login} className="w-full mt-5 flex gap-2 items-center justify-center py-6 text-lg hover:scale-[1.02] transition-all">
                <FcGoogle className="text-2xl" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog open={loading} onOpenChange={setLoading}>
        <DialogContent className="max-w-md border-none bg-transparent shadow-none p-0 outline-none">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 p-5 sm:p-10 glass-card overflow-hidden relative">
            <div className="relative h-48 sm:h-64 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-black/10 border border-white/20">
              <img
                src="/loading.gif"
                alt="AI Travel Planner"
                className="w-full h-full object-cover transition-all duration-700"
                onError={(e) => {
                  e.target.src = "https://cdn.pixabay.com/animation/2023/10/24/13/50/13-50-31-309_512.gif";
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-4 z-10 w-full px-2">
              <h2
                key={loadingMessage}
                className="text-xl sm:text-2xl font-bold text-center text-black dark:text-white tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-700 break-words sm:whitespace-nowrap w-full"
              >
                {loadingMessage}
              </h2>
              <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full animate-[progress_15s_ease-in-out_infinite]" />
              </div>
              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 text-center font-medium leading-relaxed sm:whitespace-nowrap">
                We're weaving your itinerary. It usually takes 10-15 seconds ✨
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default CreateTrip
