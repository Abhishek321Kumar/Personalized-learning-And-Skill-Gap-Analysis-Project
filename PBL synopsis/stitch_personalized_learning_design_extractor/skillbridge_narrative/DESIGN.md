---
name: SkillBridge Narrative
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#434656'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ced'
  primary: '#003ec7'
  on-primary: '#ffffff'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#474e5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f6674'
  on-tertiary-container: '#dee4f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.15em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  card-padding: 32px
  stack-gap: 12px
---

## Brand & Style

This design system embodies a professional, mission-driven aesthetic tailored for educational and career-advancement platforms. It prioritizes clarity and institutional trust, aligning with the values of Sustainable Development Goal 4 (Quality Education). 

The visual style is **Minimalist / Corporate Modern**, utilizing a structured "bento-style" card layout to organize complex data into digestible chunks. The interface is characterized by generous whitespace, a light-neutral foundation, and precise, utilitarian accents. It avoids decorative flourishes in favor of functional clarity, ensuring that the user’s "readiness journey" remains focused and undistracted.

## Colors

The color palette is anchored by a high-energy primary blue, specifically chosen for its association with technology and professional reliability.

- **Primary (#0052FF):** Used exclusively for primary calls-to-action, active navigation states, and critical brand highlights.
- **Secondary (#000000):** Reserved for high-contrast text, primary headings, and the "Get Started" button to create immediate visual hierarchy.
- **Neutral Background (#F9F9F8):** An off-white, light gray tint that reduces eye strain compared to pure white, providing a sophisticated canvas for the bento cards.
- **Surface (#FFFFFF):** Pure white is used for card backgrounds and input fields to differentiate interactive and content areas from the base page.
- **Accents:** Success and error states should use standard semantic green/red, but with restrained application to maintain the professional tone.

## Typography

The system utilizes **Inter** as its primary typeface for its exceptional legibility and neutral, modern character. This is contrasted with **Courier Prime** for labels and technical metadata, evoking a sense of "data-driven" precision and referencing the NLP/coding nature of the platform.

- **Headlines:** Set in Inter with tight letter spacing and medium weights to appear authoritative yet accessible.
- **Labels:** Use monospaced Courier Prime in all-caps with wide tracking. These are often paired with thin horizontal rules to delineate sections (e.g., "MODULE M7").
- **Body:** Standardized on a 16px grid for readability. Text color should rarely be pure black; use a dark gray (#374151) to improve long-form reading comfort.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a "Bento Box" philosophy. Content is organized into clear, rectangular modules that stack vertically on mobile and reflow into multi-column arrangements on desktop.

- **Grid:** A 12-column grid system is used for desktop. Bento cards typically span 4, 6, or 12 columns.
- **Section Headers:** Large headlines are often left-aligned, preceded by a monospaced label and a thin divider.
- **Bento Modules:** Cards should have consistent internal padding (32px) and are separated by thin gray borders (#E5E7EB) rather than heavy shadows.
- **Split Screens:** For authentication and high-impact landing areas, use a 50/50 split between imagery/abstract art and functional forms.

## Elevation & Depth

This design system uses a **Flat / Tonal Layering** approach. Depth is created through containment and color rather than physical simulation.

- **Borders over Shadows:** Modules are defined by 1px solid borders (#E5E7EB). Shadows are avoided to maintain a clean, "architectural" feel.
- **Surface Hierarchy:** The background uses the Neutral (#F9F9F8) color, while active content areas (cards) use white (#FFFFFF). 
- **Interactive States:** Buttons use solid color fills for primary actions and ghost styles (border only) for secondary actions. On hover, primary buttons may subtly shift in saturation or brightness, but should not "lift" off the page.

## Shapes

The shape language is strictly **Sharp (0px)**. All containers, buttons, and input fields utilize square corners. This reinforces the institutional, serious, and professional nature of the platform.

Abstract graphics or photography used within the UI may feature organic or geometric shapes (circles, triangles), but the structural UI components themselves must remain rectilinear to maintain the grid-based "bento" aesthetic.

## Components

- **Buttons:** Rectangular with no border-radius. Primary buttons are #0052FF with white text and a right-pointing arrow icon (→). Secondary buttons are white with a 1px #000000 border.
- **Input Fields:** 1px #E5E7EB border, sharp corners. Labels are placed above the field in monospaced Courier Prime caps, separated by a thin horizontal rule.
- **Bento Cards:** White backgrounds, 1px light gray borders. Use monospaced labels at the top-left to categorize the card's data (e.g., "JOB READINESS").
- **Navigation:** Simple text-based links in Inter. The "Sign In" link is standard text, while "Get Started" is a high-contrast black button.
- **Progress Indicators:** Large, high-contrast numerals (Inter Medium) paired with percentage symbols for "Job Readiness" or "Quiz Scores," centered within their respective bento modules.
- **Footer:** Minimalist, using small-scale Inter for the bio and Courier Prime for the SDG target references, maintaining a three-column structure.