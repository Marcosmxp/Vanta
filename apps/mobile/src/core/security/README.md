# Mobile security boundary

The Vanta mobile application is an untrusted presentation client.

Do not place the following in this package:

- RNG outcome generation
- canonical balance calculations
- bet settlement rules
- database credentials
- server signing secrets
- administrative tokens
- payment-provider secrets
- KYC-provider secrets

Sensitive tokens that must exist on-device will later use platform secure storage and short-lived server-issued credentials.
