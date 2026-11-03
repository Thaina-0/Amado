---
description: Privacy and data-collection rules for any code that touches user data, location or analytics
paths:
  - 'src/**/analytics/**'
  - 'src/**/location/**'
  - 'src/**/consent/**'
  - 'src/**/reports/**'
---

# Privacy and data

- On first open the app explains what it collects and asks for permission. Refusing means the user keeps full use of the app and simply is not counted in the data.
- Reports show **group data only**, aggregated and anonymous. Never expose or join anything that identifies a person.
- Do not store raw coordinates; if a place-level signal is needed, aggregate it before it leaves the device.
- Emergency flows bypass analytics entirely.
- No third-party trackers without an explicit decision recorded in `docs/CONTEXT.md`.
