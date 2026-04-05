import React from 'react'

export const SkeletonLine = ({ className = "" }) => (
  <div className={`animate-shimmer rounded-lg bg-gray-200 dark:bg-zinc-800 ${className}`}></div>
)

export const HotelCardSkeleton = () => (
  <div className='glass-card p-4 h-full flex flex-col gap-3'>
    <div className='aspect-[16/10] w-full rounded-2xl animate-shimmer bg-gray-200 dark:bg-zinc-800'></div>
    <div className='flex flex-col gap-2 mt-2'>
      <SkeletonLine className='h-5 w-3/4' />
      <SkeletonLine className='h-3 w-1/2' />
      <div className='mt-auto pt-2 border-t border-black/5 dark:border-white/5'>
        <SkeletonLine className='h-4 w-1/4' />
      </div>
    </div>
  </div>
)

export const PlaceCardSkeleton = () => (
  <div className='glass-card p-4 h-full flex flex-col sm:flex-row gap-5'>
    <div className='w-full sm:w-[140px] h-[140px] rounded-2xl animate-shimmer bg-gray-200 dark:bg-zinc-800 shrink-0'></div>
    <div className='flex flex-col flex-1 gap-4 py-1'>
      <div className='space-y-2'>
        <SkeletonLine className='h-6 w-3/4' />
        <SkeletonLine className='h-4 w-full' />
      </div>
      <div className='flex gap-3 mt-auto'>
        <SkeletonLine className='h-7 w-20 rounded-full' />
        <SkeletonLine className='h-7 w-20 rounded-full' />
      </div>
    </div>
  </div>
)

export const InfoSectionSkeleton = () => (
    <div className='reveal active'>
        <div className='relative w-full h-[340px] md:h-[440px] rounded-3xl animate-shimmer bg-gray-200 dark:bg-zinc-800 mb-8'></div>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2'>
            <div className='space-y-4 w-full md:w-1/2'>
                <SkeletonLine className='h-12 w-3/4' />
                <div className='flex flex-wrap gap-3'>
                    <SkeletonLine className='h-8 w-24 rounded-full' />
                    <SkeletonLine className='h-8 w-24 rounded-full' />
                    <SkeletonLine className='h-8 w-24 rounded-full' />
                </div>
            </div>
        </div>
    </div>
)
