import { cn, getInitials, gradientFromId } from '@/lib/utils';
import type { User } from '@/types';

interface AvatarProps {
  user?: User;
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

export default function Avatar({ user, src, name, size = 'md', className, onClick }: AvatarProps) {
  const displayName = user?.displayName ?? name ?? 'User';
  const imgSrc = src ?? user?.avatar;
  const gradient = gradientFromId(user?.id ?? displayName);

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden select-none',
        SIZES[size],
        onClick && 'cursor-pointer hover:opacity-90 transition-opacity',
        className
      )}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={displayName} className="w-full h-full object-cover" />
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center', gradient)}>
          <span className="text-white font-semibold font-sans">{getInitials(displayName)}</span>
        </div>
      )}
    </div>
  );
}
