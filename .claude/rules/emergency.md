---
description: Rules for emergency features (level 1 vital and level 2 daily urgencies)
paths:
  - 'src/features/emergency/**'
---

# Emergency features

- **Level 1** (190 PM, 192 SAMU, 193 Bombeiros, 180 violência contra a mulher, 199 Defesa Civil) lives in code, not behind a network call, so it works offline and with a weak signal.
- Level 1 is never sponsored, never reordered by payment, and never behind signup.
- "Perto de mim" (police station, hospital/UPA, fire station) shows distance, phone and route. Data must be verified by the team or partners; no open editing.
- Level 2 (locksmith, mechanic, tow, tire repair, 24h pharmacy, electrician, plumber): verified providers sorted by proximity, with no bought ordering.
- Never fabricate a phone, address or coordinate. Use a `// TODO(verify):` marker and leave the field out until a source confirms it.
- Location is used at request time only: no persistence, no logging, no analytics event carrying coordinates.
- Every new emergency number or place needs a test.
