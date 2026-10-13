# Casanova Med

Casanova Med currently presents one primary service: a physician-reviewed Second Opinion for people considering consequential care decisions abroad.

Public navigation is intentionally limited to:

- Second Opinion
- Doctor Visit Prep
- The Brief
- About and How We Are Paid

Doctor Visit Prep remains a preparation-only holding page until the Second Opinion payment-to-private-intake workflow is verified end to end. Legacy travel programs, CPP, sponsors, caregivers, and country pages are retained as parked source files but are removed from navigation and marked `noindex`.

## Launch gate

The intake requires both a product tier and a Stripe checkout session reference. It does not persist medical intake data in browser local storage and fails closed if secure submission is unavailable.

Before accepting live orders, confirm the Stripe Payment Link success redirect supplies `tier` and `{CHECKOUT_SESSION_ID}`, verify the corresponding database column and row-level security, confirm private file storage, and complete a paid/refunded end-to-end test.
