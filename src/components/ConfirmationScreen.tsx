export default function ConfirmationScreen() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-2xl text-accent">
        ✓
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">
        Thanks — a concierge will reach out within 24 hours.
      </h1>
      <p className="mt-3 text-white/60">
        We're matching you against verified companies in your portfolio
        network now.
      </p>
    </div>
  );
}
