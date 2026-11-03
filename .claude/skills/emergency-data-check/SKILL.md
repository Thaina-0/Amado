---
name: emergency-data-check
description: Checklist for adding or changing an emergency place or provider (hospital, UPA, police station, fire station, locksmith, tow, pharmacy). Use when editing emergency data, adding a provider, or reviewing emergency-related content.
---

Emergency data in Amado must be verified. Before accepting an entry, confirm each item and list any that are missing instead of guessing:

1. **Source**: who verified it (team member or partner) and when. No source, no entry.
2. **Name and category**: level 1 (vital) or level 2 (daily urgency).
3. **Phone**: a real number in a format `tel:` accepts. Never invented.
4. **Address and coordinates**: inside Ilhéus (centro, orla, bairros, distritos). Out of scope otherwise.
5. **Level 2 only**: opening hours (24h providers flagged), and no paid ordering. If the provider is a paying advertiser, it still must not affect emergency ordering.
6. **Level 1 only**: never sponsored, never behind signup, available offline.

Mark anything unconfirmed with `// TODO(verify):` and leave the field out. Add or update a test for every new entry. The real list of Ilhéus places is still pending (see `docs/CONTEXT.md`, "Emergência").
