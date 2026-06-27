import { useState } from "react";

const faqs = [
  {
    question: "Who can actually use Rift?",
    answer:
      "Only companies backed by a participating VC fund. We verify portfolio membership before any account goes live, so every host and guest on the platform shares the same investor — there are no open marketplace listings and no public sign-ups.",
  },
  {
    question: "How does payment work?",
    answer:
      "Hosts set an hourly or daily rate (or let us suggest one based on comparable spaces in their network). Invoicing happens directly between the two companies — Rift facilitates the introduction and terms, but never touches the money.",
  },
  {
    question: "Who's liable if something goes wrong in the space?",
    answer:
      "Liability stays between the host and guest companies, the same way it would if you let a portfolio sibling use a conference room informally. We strongly recommend hosts confirm their existing commercial insurance covers occasional outside use before listing.",
  },
  {
    question: "Can we cancel or reschedule a booking?",
    answer:
      "Yes. Cancellations and reschedules are handled directly between host and guest once a match is made. Our concierge team can help mediate if plans change within 48 hours of a booking.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="py-5">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-medium text-ink">{faq.question}</span>
              <span
                className={`ml-4 shrink-0 text-accent transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
