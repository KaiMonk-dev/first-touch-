// A/B test variant system
// Usage: const variant = useVariant()
// URL: ?variant=b or ?variant=c
// Returns 'a' (default), 'b', or 'c'

// Variant definitions — swap hero copy, CTA text, etc.
const variants = {
  a: {
    heroHeadline: ['Every Call Answered.', 'Every Lead Booked.'],
    heroSubtext: 'Alex picks up in under one second, books 3–5 extra jobs per week, and follows up while the moment is still warm.',
    heroCTA: 'Book a Free Strategy Call',
    heroSecondaryCTA: 'Talk to Alex Live',
  },
  b: {
    heroHeadline: ['Your Customers Deserve', 'A Better First Impression.'],
    heroSubtext: 'First Touch answers every call instantly, books appointments live, and follows up in under 60 seconds — 24/7, 365 days a year.',
    heroCTA: 'See How It Works',
    heroSecondaryCTA: 'Experience Alex Now',
  },
  c: {
    heroHeadline: ['Your Phone Rings.', 'Alex Answers.'],
    heroSubtext: 'A dedicated team member trained for your business, booking jobs in real-time, and making every caller feel like your most important customer.',
    heroCTA: 'Meet Alex',
    heroSecondaryCTA: 'Ask Alex Anything',
  },
}

export function useVariant() {
  if (typeof window === 'undefined') return variants.a
  const params = new URLSearchParams(window.location.search)
  const v = params.get('variant')
  return variants[v] || variants.a
}

export function getVariantName() {
  if (typeof window === 'undefined') return 'a'
  return new URLSearchParams(window.location.search).get('variant') || 'a'
}
