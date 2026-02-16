# Compliance Pack

## Objective

Standardize legal and policy controls required for managed WhatsApp campaign launch.

## Core controls

- Explicit user opt-in capture with channel and timestamp.
- Data retention policy for messages, notes, and user PII.
- Opt-out enforcement in outbound workflows.
- Auditability for template approval and campaign dispatch.
- Abuse and complaint handling SOP for tenant misuse.

## Compliance checklist

- [ ] Privacy policy published and linked in onboarding docs.
- [ ] Terms of service includes messaging and consent clauses.
- [ ] Opt-in evidence retained for every contact segment.
- [ ] Unsubscribe keywords mapped and tested end-to-end.
- [ ] DPA (if required) signed for pilot tenants.
- [ ] Incident reporting path documented for data leaks.

## Record retention matrix

| Record Type | Retention | Owner | Storage |
| --- | --- | --- | --- |
| Consent logs | 24 months | Compliance | DB + secure backup |
| Campaign sends | 12 months | Ops | DB analytics tables |
| Support incidents | 18 months | Support lead | Incident tracker |
| OBA review notes | 12 months | Ops manager | Onboarding channel metadata |

## Compliance review cadence

- Weekly: sample 10 outbound sends for opt-in and opt-out handling.
- Bi-weekly: review tenant abuse reports and policy exceptions.
- Monthly: refresh risk register and confirm remediation status.
