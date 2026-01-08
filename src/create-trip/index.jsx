import React, { useState, useEffect } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelersList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AI_PROMPT } from '@/constants/options'
import { chatSession } from '@/service/AIModal';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';


function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormdata] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setFormdata((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((resp) => {
      localStorage.setItem("user", JSON.stringify(resp.data));
      toast.success("Login successful!");
      setOpenDialog(false);
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
    const docId = Date.now().toString()
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

    // Ensure all fields are filled
    if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays) {
      toast("Please fill all details.");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);



    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(await result?.response?.text());
      setLoading(false);
      SaveAiTrip(result?.response?.text())
    } catch (err) {
      toast.error("Failed to generate trip.");
      console.error("AI error:", err);
    }
  }

  return (
    <div className='py-10 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-20 w-full'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}>
            <GeoapifyGeocoderAutocomplete
              placeholder="Search Destination"
              placeSelect={(value) => {
                setPlace(value);
                handleInputChange('location', { label: value?.properties?.formatted, value: value });
              }}
            />
          </GeoapifyContext>
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium pt-8'>What is your Budget?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-xl hover:scale-105 transition-all ${formData?.budget === item.title && 'shadow-xl border-primary border-2'}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium pt-8'>Who are you traveling with?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          {SelectTravelersList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('traveler', item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-xl hover:scale-105 transition-all ${formData?.traveler === item.people && 'shadow-xl border-primary border-2'}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex'>
        <Button
          disabled={loading}
          onClick={OnGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
          }
        </Button>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" className="h-10 w-auto" alt="Logo" />
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the app securely with Google</p>
              <Button onClick={login} className="w-full mt-5 flex gap-2 items-center justify-center">
                <FcGoogle className="text-xl" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default CreateTrip;
