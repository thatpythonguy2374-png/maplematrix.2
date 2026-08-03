import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  scale?: number;
  blur?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 800,
  direction = 'up',
  distance = 40,
  scale = 0.98,
  blur = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation();

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `translateY(${distance}px) scale(${scale})`;
        case 'down':
          return `translateY(-${distance}px) scale(${scale})`;
        case 'left':
          return `translateX(${distance}px) scale(${scale})`;
        case 'right':
          return `translateX(-${distance}px) scale(${scale})`;
        case 'none':
          return `scale(${scale})`;
        default:
          return `translateY(${distance}px) scale(${scale})`;
      }
    }
    return 'translateY(0) translateX(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: blur && !isVisible ? 'blur(4px)' : 'blur(0px)',
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}
