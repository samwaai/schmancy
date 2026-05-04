# @mhmo91/schmancy-lab

Advanced, opinionated components that aren't part of the schmancy primitives
surface but are reusable across multiple apps.

This package is a sibling to `@mhmo91/schmancy` (same git repo, same CI,
independent npm version, peer-depends on schmancy at any version). Install
both when you need any of the components below.

## What belongs here

A component qualifies for Lab iff:

- it is **complex** (multiple primitives composed, or carries non-trivial
  domain-shaped logic), AND
- it has **≥2 consumers** (real or imminent).

A complex component with one consumer lives in that consumer's repo, not
Lab. The single-consumer test is the discipline that prevents Lab from
becoming a graveyard.

## Lifecycle

**Quarterly review** (next: 2026-08-02). Each component in this package is
either:

- promoted to `@mhmo91/schmancy` (it stabilized; fits the primitives
  surface), or
- deleted from this package (it never proved its keep).

There is no third option. A component without a quarterly verdict is
deleted by default.

## Current contents

| Tag(s) | Notes |
|---|---|
| `<schmancy-qr-scanner>` | QR code scanner; pulls `jsqr` |
| `<schmancy-area-chart>`, `<schmancy-pills>` | Visualization primitives |
| `extra/countries`, `extra/timezone` | Country + timezone data sets |
| `<schmancy-select-countries>`, `<schmancy-select-timezones>` | Selects backed by `extra/` |
| `<schmancy-map>` | Map embed |

## Versioning

Lab versions independently from `@mhmo91/schmancy`. Lab peer-depends on
`@mhmo91/schmancy` at `*` so consumers always have both — Lab does not
pin a particular schmancy version, but breakages between them are caught
in the shared CI.

## Install

```bash
npm install @mhmo91/schmancy @mhmo91/schmancy-lab
```

```ts
import { } from '@mhmo91/schmancy-lab'         // registers every <schmancy-*> tag from Lab
import { } from '@mhmo91/schmancy-lab/qr-scanner'   // single-domain entry
```
