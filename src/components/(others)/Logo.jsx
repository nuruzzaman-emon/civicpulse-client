import Image from "next/image";
import Link from "next/link";

const Logo = ({ size = 48, className = "" }) => {
  return (
    <Link
      href="/"
      aria-label="CivicPulse Home"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <Image
        src="/civicpulse.png"
        alt="CivicPulse Logo"
        width={size}
        height={size}
        priority
        className="object-contain shrink-0"
      />

      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Civic<span className="text-cyan-500">Pulse</span>
        </span>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Report. Track. Improve.
        </span>
      </div>
    </Link>
  );
};

export default Logo;
