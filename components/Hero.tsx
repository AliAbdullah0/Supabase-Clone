"use client";
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className={cn('bg-dark text-white py-20')}>
      <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            The Open Source <span className='text-[#25a36f]'>Firebase Alternative </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Build secure, scalable apps with Supabase's Postgres database, authentication, storage, and realtime APIs in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/get-started"
              className={cn(
                'bg-main text-white px-6 py-3 rounded-lg hover:bg-transparent hover:border border-[#006239] transition-all duration-200 font-medium text-lg'
              )}
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className={cn(
                'bg-transparent border border-gray-500 text-white px-6 py-3 rounded-lg hover:bg-hover transition-colors duration-200 font-medium text-lg'
              )}
            >
              View Docs
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-hover rounded-lg shadow-lg">
            <video
              src="/supabase-table-editor.webm"
              width={600}
              height={400}
              muted
              autoPlay
              loop
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;