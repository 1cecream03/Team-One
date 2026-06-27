import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export interface SpaceListing {
  id: string;
  name: string;
  regionKey: string;
  regionLabel: string;
  capacity: number;
  rate: number;
}

export default function SpaceCard({
  listing,
  index,
}: {
  listing: SpaceListing;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="overflow-hidden rounded-2xl border border-border bg-white/5 backdrop-blur-sm"
    >
      <div className="aspect-video w-full bg-white/10" />
      <div className="p-5">
        <span className="inline-block rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
          {listing.regionLabel}
        </span>
        <h3 className="mt-3 text-base font-semibold">{listing.name}</h3>
        <p className="mt-1 text-sm text-white/60">
          Up to {listing.capacity} people
        </p>
        <p className="mt-1 text-sm text-white/60">S${listing.rate} / hr</p>
        <Link
          to="/book"
          className="mt-4 inline-block w-full rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        >
          Request Access
        </Link>
      </div>
    </motion.div>
  );
}
