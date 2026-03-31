import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { toast } from 'sonner';
import axios from 'axios';
import { Menu, LogOut, UserCircle, Plus, Briefcase, Download } from "lucide-react";
import { ModeToggle } from '../mode-toggle';

function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log('beforeinstallprompt event was fired');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => {
      console.log(error);
      toast.error('Google login failed.');
    }
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    })
  }


  return (
    <div className="glass-nav p-3 flex justify-between items-center w-full fixed top-0 left-0 right-0 bg-background/50 px-5 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
        <img src="/logo.svg" className="h-7 sm:h-9 md:h-10 w-auto dark:invert" alt="Logo" />
      </div>

      <div className='flex items-center gap-3'>
        <ModeToggle />

        {/* Desktop View */}
        <div className='hidden md:flex items-center gap-5'>
          {deferredPrompt && (
            <Button
              variant="outline"
              className="rounded-full border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-slate-600 dark:active:border-slate-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm flex items-center gap-2"
              onClick={handleInstallClick}
            >
              <Download className="h-4 w-4" />
              Install App
            </Button>
          )}
          {user ?
            <>
              <a href='/create-trip'>
                <Button variant="outline" className="rounded-full border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-slate-600 dark:active:border-slate-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">+ Create Trip</Button>
              </a>
              <a href='/my-trips'>
                <Button variant="outline" className="rounded-full border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-slate-600 dark:active:border-slate-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">My Trips</Button>
              </a>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <img src={user?.picture} className='relative h-[38px] w-[38px] rounded-full border-transparent group-hover:border-[1px] group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-all shadow-sm' />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="glass-card mt-3 p-0 w-64 border-white/20 overflow-hidden shadow-2xl backdrop-blur-xl">
                  <div className='flex flex-col'>
                    <div className="p-4 bg-primary/5 dark:bg-white/5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <img src={user?.picture} className='h-10 w-10 rounded-full border border-white/20' />
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-bold truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        className='flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all group'
                        onClick={() => {
                          googleLogout();
                          localStorage.clear();
                          window.location.reload();
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
            :
            <Button variant="outline" className="rounded-full border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-slate-600 dark:active:border-slate-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm" onClick={() => setOpenDialog(true)}>Sign In</Button>
          }
        </div>

        {/* Mobile View */}
        <div className='md:hidden'>
          {user ?
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-[1px] active:border-slate-600 dark:active:border-slate-400 shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="glass-card w-auto mt-2" sideOffset={10}>
                <div className='flex flex-col gap-1'>
                  <div className="px-4 py-3 bg-primary/5 dark:bg-white/5 border-b border-white/10 mb-2 rounded-t-2xl">
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <a href='/create-trip' className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium">Create Trip</span>
                  </a>
                  <a href='/my-trips' className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">My Trips</span>
                  </a>
                  {deferredPrompt && (
                    <button
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-500/5 text-indigo-500 transition-all text-left"
                      onClick={handleInstallClick}
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <Download className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Install App</span>
                    </button>
                  )}
                  <div className="h-px bg-white/10 my-1 mx-2"></div>
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/5 text-red-500 transition-all text-left group"
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            :
            <Button variant="outline" className="rounded-full border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-slate-600 dark:active:border-slate-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm" onClick={() => setOpenDialog(true)}>Sign In</Button>
          }
        </div>
      </div>

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
  )
}

export default Header
