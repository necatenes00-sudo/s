export default function Arrow({ direction = 'up-right', className = '' }: { direction?: 'up-right' | 'right' | 'down' | 'down-left'; className?: string }) {
  const path = direction === 'down-left' ? 'M19 5 5 19M5 5v14h14' : direction === 'right' ? 'M3 12h18M14 5l7 7-7 7' : direction === 'down' ? 'M12 3v18m-7-7 7 7 7-7' : 'M5 19 19 5M5 5h14v14';
  return <svg className={`arrow-icon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.4" /></svg>;
}
