'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

interface StatItem {
  value: string;
  label: string;
  icon: string;
}

interface StatisticsCounterProps {
  stats: StatItem[];
}

export default function StatisticsCounter({ stats }: StatisticsCounterProps) {
  const [animated, setAnimated] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.9,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView && !animated) {
      setAnimated(true);
    }
  }, [inView, animated]);

  return (
    <div 
      ref={ref}
      className="relative w-full overflow-hidden py-8"
      style={{ 
        backgroundColor: '#9E1B32',
        backgroundAttachment: 'fixed',
        minHeight: '200px'
      }}
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 h-full">
        <div className="h-full flex items-center justify-center">
          <div className="w-full">
            <div className="stats-container">
              {stats.map((stat, index) => (
                <StatItemComponent
                  key={index}
                  stat={stat}
                  animated={animated}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="stats-since text-white text-sm">
        Since 2013
      </p>
    </div>
  );
}

function StatItemComponent({ 
  stat, 
  animated, 
  delay 
}: { 
  stat: StatItem; 
  animated: boolean; 
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [animated, delay]);

  return (
    <div 
      className={`text-center transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(80px)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div 
        className="stat-value flex items-center justify-center text-white" 
        style={{ 
          fontFamily: '"Sanchez", times, serif'
        }}
      >
        <Image 
          src={stat.icon} 
          alt={stat.label}
          width={70}
          height={70}
          className="stat-icon"
          style={{ backgroundColor: '#9E1B32' }}
        />
        <span className="ml-2">{stat.value}</span>
      </div>
      <div 
        className="stat-label text-white uppercase block"
        style={{ 
          fontFamily: '"Montserrat", arial, sans-serif'
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

