// invariant: every answer is a coarse bucket chosen from this list; there is no free text, birth date, e-mail, phone or position
export const PROFILE_QUESTIONS = {
  origin: ['ilheus', 'bahia', 'brazil', 'abroad'],
  reason: ['leisure', 'culture', 'food', 'sports', 'work', 'family'],
  party: ['alone', 'couple', 'family', 'friends', 'group'],
  stay: ['day', 'short', 'week', 'long'],
  age: ['a18', 'a30', 'a45', 'a60'],
  channel: ['qr', 'referral', 'social', 'institution'],
} as const
