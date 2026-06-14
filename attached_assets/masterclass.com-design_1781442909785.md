---
version: alpha
name: MasterClass Dark Editorial
description: A cinematic, high-contrast learning platform with bold editorial type and restrained neon-accented calls to action.
colors:
  primary: "#E32652"
  primary-strong: "#C91F47"
  secondary: "#FFFFFF"
  tertiary: "#374151"
  neutral: "#000000"
  surface: "#1F2125"
  on-surface: "#FFFFFF"
  muted: "#B8BCC4"
  border: "#374151"
  error: "#E32652"
typography:
  headline-display:
    fontFamily: "Sohne Schmal"
    fontSize: "66px"
    fontWeight: 500
    lineHeight: "79px"
    letterSpacing: "0.66px"
  headline-lg:
    fontFamily: "Sohne Schmal"
    fontSize: "46px"
    fontWeight: 500
    lineHeight: "55px"
    letterSpacing: "0.28px"
  headline-md:
    fontFamily: "Sohne"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: "38px"
    letterSpacing: "0.54px"
  headline-sm:
    fontFamily: "Sohne"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: "28px"
  body-lg:
    fontFamily: "Sohne"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0.32px"
  body-md:
    fontFamily: "Sohne"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "Sohne"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label-lg:
    fontFamily: "Sohne"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  label-md:
    fontFamily: "Sohne"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  label-sm:
    fontFamily: "Sohne"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.04em"
  overline:
    fontFamily: "Sohne"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "0.08em"
  button:
    fontFamily: "Sohne"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "16px"
  caption:
    fontFamily: "Sohne"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 52px
  xl: 80px
  gutter: 24px
  margin: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "42px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "42px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
---

# MasterClass Dark Editorial

## Overview

MasterClass feels cinematic, premium, and highly curated, with a strong editorial voice aimed at ambitious learners. The experience is dense with content and imagery, but the layout uses large type, strong contrast, and disciplined spacing to keep it readable. The emotional tone is confident and motivating rather than playful, with a polished luxury edge.

## Colors

- **Primary (#E32652):** A vivid magenta-red used for the brand mark, key CTAs, promotional messages, and active accents. It provides the only strong warm highlight against the black interface.
- **Secondary (#FFFFFF):** Pure white used for main text, navigation, and button labels. It creates the sharp, high-contrast editorial look that defines the brand.
- **Neutral (#000000):** Deep black is the dominant canvas for the entire interface, letting photography and typography feel theatrical and intentional.
- **Surface (#1F2125):** A dark charcoal surface for search fields, selection rows, and elevated UI containers. It softens the black background without breaking the dark theme.
- **Tertiary (#374151):** A muted slate used for borders, dividers, and subtle framing around cards and inputs. It keeps structure visible without adding visual noise.
- **Muted (#B8BCC4):** A cooler gray for secondary text and supporting UI details. It helps hierarchy stay clear when white would feel too strong.
- **On-surface (#FFFFFF):** The primary foreground color for any dark surface or card. It ensures legibility and maintains the stark monochrome base.
- **Border (#374151):** A restrained structural color for outlined components and separators, especially within list-style choices and cards.
- **Error (#E32652):** The system uses the same accent red for destructive or attention-grabbing states, keeping the palette compact and brand-consistent.

## Typography

Typography is the brand’s strongest signature. Headlines use **Sohne Schmal** for a tall, condensed, cinematic presence, especially at the hero level where the copy feels poster-like and urgent. Supporting headings and body copy use **Sohne**, which keeps the system modern, clean, and highly legible.

The hierarchy is intentionally compact but bold: `headline-display` and `headline-lg` are dramatic and tightly set, `headline-md` and `headline-sm` handle sectional emphasis, while `body-lg`, `body-md`, and `body-sm` support dense content and controls. Labels and buttons are mostly semi-bold, with `label-sm` and `overline` using added letter spacing to create an editorial, premium feel. Uppercase is used sparingly, mainly for promotional lines and microcopy where a clipped, high-impact voice is needed.

## Layout

The layout is a fixed, centered editorial composition rather than a fluid marketing grid. Large left-aligned text anchors the main content column, while a photo mosaic on the right adds visual rhythm and celebrity-driven storytelling. Generous empty space around the hero keeps the page from feeling overcrowded despite the number of elements.

Spacing follows a simple, readable rhythm built around 8px increments with larger jumps at 24px, 52px, and 80px for section separation. Cards and list rows use compact internal padding so the interface feels efficient and content-forward. Inputs, buttons, and promo bars keep consistent horizontal padding to align with the grid and preserve the crisp, disciplined structure.

## Elevation & Depth

The interface is mostly flat, relying on contrast and layering instead of heavy shadows. Depth is created by tonal separation: black background, charcoal surfaces, thin borders, and image cropping with rounded corners. The few soft shadows that appear are subtle and atmospheric rather than material-heavy.

This restrained approach supports the premium editorial mood. Interactive controls stand out through fill color, border treatment, and typography weight instead of pronounced elevation.

## Shapes

The shape language is controlled and modestly rounded. Most containers use `rounded.md` at 8px, which keeps the interface approachable without becoming soft or playful. Secondary buttons are slightly sharper with `rounded.sm`, reinforcing their less-prominent status.

Overall, the shapes feel architectural and restrained. Large media tiles and cards retain clean corners, which helps the page maintain a sleek, luxury-media aesthetic.

## Components

Buttons are highly legible and compact. Use `button-primary` for the main conversion action: bright red fill, white text, 12px vertical padding, 20px horizontal padding, and a 42px minimum height. It should feel assertive and unmistakable. Use `button-secondary` for outlined or neutral actions against dark backgrounds; keep it transparent with a white border and slightly smaller radius. `button-link` should be reserved for low-emphasis navigation or legal actions and remain text-only with underline styling.

Cards and panels use the `card` style: black or near-black background, 1px border, 8px radius, and 16px padding. They should feel contained but not lifted. Lists of choices, like the onboarding question items in the screenshot, should follow this same dark surface logic with thin separators and generous text padding for readability.

Inputs should use the `input` style with a charcoal fill, white text, 8px radius, and clear left padding so icons and text breathe. Search bars need to feel present but understated, with strong contrast and no heavy shadow. Placeholder text should be muted rather than bright white.

Chips and compact pills should use `chip` styling: dark surface, white text, full rounding, and modest horizontal padding. These are best for filters, tags, or status indicators. Checkboxes and other selection controls should remain minimal, using thin outlines and a quiet gray stroke until active.

Promotional bars and nav items should stay typographically dominant, with no decorative chrome beyond color and spacing. Imagery is part of the component system here: celebrity portraits, rounded media tiles, and tight crops are core visual building blocks, not just decorative assets.

## Do's and Don'ts

- Do keep the page dark, high-contrast, and editorial.
- Do use the primary red only for conversion, highlights, and brand-critical emphasis.
- Do rely on typography weight and scale for hierarchy more than shadows or gradients.
- Do keep component corners consistently rounded, with 8px as the default.
- Don't introduce bright background colors or playful pastel accents.
- Don't use large drop shadows or glossy effects; the system should feel mostly flat.
- Don't overcomplicate button styles with multiple colors or ornate borders.
- Don't make body text thin or overly decorative; readability should stay strong in a dense layout.