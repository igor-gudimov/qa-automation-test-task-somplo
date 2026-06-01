# Test task for QA Automation Engineer 

## Overview

This is a Playwright + TypeScript test framework for a web application. It has intentional bugs and gaps.

The app under test: `http://manualqatestapp-env.eba-m5fbuh33.us-east-1.elasticbeanstalk.com`

---

## Setup

**Prerequisites:** Node.js `>=20.x`

```bash
npm install
npx playwright install chromium
```

---

## Running Tests

```bash
npx playwright test

# Headed mode
npx playwright test --headed

# Single file
npx playwright test tests/profile.spec.ts
```
---

## Your Task

### Part 1 - Fix the bugs

There are a number of issues in the existing code. Find and fix as much as you could and add comment why it was changed.

### Part 2 - Write profile page tests

Add **3–5 tests** for the profile page to `tests/profile.spec.ts`

Requirements:
- All tests should pass;
- Cover regression-critical flows;
- Use existing code when possible;
---

## Submission

Fork or clone this repo to your personal GitHub (public visibility) and send us the link.

> Do not open a PR against this repo. Do not send a zip file.
