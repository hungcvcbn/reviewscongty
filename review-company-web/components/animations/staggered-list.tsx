'use client';

import { ReactNode, Children, isValidElement, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface StaggeredListProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  itemClassName?: string;
  triggerOnce?: boolean;
}

export const StaggeredList = ({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  duration = 500,
  direction = 'up',
  className,
  itemClassName,
  triggerOnce = true,
}: StaggeredListProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [triggerOnce]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(30px)';
      case 'down':
        return 'translateY(-30px)';
      case 'left':
        return 'translateX(30px)';
      case 'right':
        return 'translateX(-30px)';
      default:
        return 'translateY(30px)';
    }
  };

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={cn(className)}>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        const delay = initialDelay + index * staggerDelay;

        return (
          <div
            key={index}
            className={cn(itemClassName)}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : getInitialTransform(),
              transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default StaggeredList;
