'use client';

import Image from 'next/image';
import type { MetricType } from '@/lib/enums';
import ArrowRightSmallIcon from './icons/ArrowRightSmallIcon';
import ArrowUpTrendIcon from './icons/ArrowUpTrendIcon';
import ArrowDownTrendIcon from './icons/ArrowDownTrendIcon';

interface MetricCardData {
  type: MetricType;
  value: number;
  changePercent: number;
  isPositive: boolean;
}

interface HeroSectionProps {
  metrics: MetricCardData[];
}

export default function HeroSection({ metrics }: HeroSectionProps) {
  return (
    <div 
      className="relative rounded-[20px] overflow-hidden mb-6"
      style={{
        background: 'linear-gradient(135deg, oklch(95% 0.02 50) 0%, oklch(92% 0.03 220) 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/images/hero-background.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative flex items-center justify-between p-12">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-[41.30px] font-bold tracking-[-1.24px] leading-[50px] text-[#1d1d1d] mb-6">
            Create <span className="text-[#0198ff]">AI Chatbot</span>
            <br />
            in No Time
          </h1>
          
          <button className="btn btn-md bg-[#1d1d1d] text-white rounded-xl border-none hover:bg-[#2d2d2d] flex items-center gap-2">
            <span className="text-base font-bold tracking-[-0.13px]">Create AI Agent</span>
            <ArrowRightSmallIcon width={5} height={9} color="white" />
          </button>
        </div>

        {/* Robot Image */}
        <div className="relative w-[306px] h-[274px]">
          <Image
            src="/images/robot-hero.png"
            alt="AI Robot"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="relative bg-white rounded-[20px] mx-6 mb-6 p-8 grid grid-cols-4 gap-8">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <p className="text-lg font-medium tracking-[-0.14px] text-[#676767]">
              {metric.type}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[2.25rem] font-extrabold tracking-[-0.0675rem] text-[#1d1d1d]">
                {metric.value}
              </span>
              <div className="flex items-center gap-1">
                {metric.isPositive ? (
                  <ArrowUpTrendIcon width={12} height={11} color="#33a36a" />
                ) : (
                  <ArrowDownTrendIcon width={12} height={11} color="#fd3b3b" />
                )}
                <span 
                  className={`text-[0.835rem] font-extrabold tracking-[-0.0069rem] ${
                    metric.isPositive ? 'text-[#33a36a]' : 'text-[#fd3b3b]'
                  }`}
                >
                  {Math.abs(metric.changePercent)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}