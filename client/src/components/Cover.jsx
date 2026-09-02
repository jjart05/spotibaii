import { Music2 } from 'lucide-react';

export function Cover({ src, alt, className = '', rounded = 'rounded-md' }) {
  if (src) {
    return <img src={src} alt={alt || ''} className={`${rounded} object-cover ${className}`} />;
  }
  return (
    <div className={`${rounded} flex items-center justify-center bg-raised text-faint ${className}`}>
      <Music2 className="h-1/3 w-1/3" />
    </div>
  );
}
