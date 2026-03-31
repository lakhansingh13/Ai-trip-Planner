import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full px-5 mt-28 gap-9 text-center relative overflow-hidden'>
      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center gap-7 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className='font-extrabold text-[30px] md:text-[42px] leading-tight flex flex-col'>
          <span className='text-[#e76f51] drop-shadow-sm'>
            Discover Your Next Adventure With AI:
          </span>
          <span className="text-foreground/90">Personalized Itineraries at Your Fingertips</span>
        </h1>

        <p className='text-xl text-muted-foreground text-center leading-relaxed max-w-3xl'>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your unique interests and budget.
        </p>

        <Link to={'/create-trip'}>
          <Button className="rounded-full px-8 py-6 text-lg font-bold hover:scale-105 transition-all shadow-lg active:scale-95">
            Get Started, It's Free
          </Button>
        </Link>
      </div>

      {/* Decorative Image */}
      <div className="relative w-full max-w-4xl mt-10 animate-in fade-in zoom-in duration-1000 delay-300">
        <img
          src='/landing.png'
          className='w-full h-auto max-h-[500px] object-contain'
          alt="App Preview"
        />
      </div>

    </div>
  )
}

export default Hero
