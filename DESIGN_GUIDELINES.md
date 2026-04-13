# STREET FRAMES MILANO — DESIGN SYSTEM CONTEXT
> Paste this document as context when asking Claude to design screens, write UI copy, generate code, or create assets for the Street Frames Milano app.

---

## BRAND IDENTITY

**App:** Street Frames Milano — community platform for street photography enthusiasts.
**Personality:** Playful yet Intelligent. Warm, creative, culturally aware. Never cold or corporate.
**Values:** Inclusivity, Community, Empowerment, Curiosity.
**Community self-image:** Nurturing, Flexible, Down to earth, Approachable.
**User feeling:** Curious, Welcome.
**Core features:** Photowalks, Aperiphotos (social photo events), Community Gallery, Group Chats.

---

## COLOR SYSTEM

### Brand Colors
| Token | HEX | Name | Use |
|---|---|---|---|
| `color-black` | `#212226` | Darkroom Black | Primary background (dark surfaces), text on light |
| `color-cream` | `#F2DCC2` | Gelatin Cream | Text on dark, warm surfaces, selected states |
| `color-orange` | `#BF5B21` | Shutter Orange | Primary CTA, active states, links, highlights |
| `color-orange-dark` | `#BF522A` | Copper Dark | CTA hover and pressed state |
| `color-rust` | `#A6432D` | Rust | Deep accent, destructive confirmation |

### Neutrals
| Token | HEX | Use |
|---|---|---|
| `color-white` | `#FAFAF8` | App background (light mode) — never pure white |
| `color-gray-light` | `#EBEBEB` | Dividers, card borders, input borders |
| `color-gray-mid` | `#B0B0B0` | Placeholder text, disabled states (decorative only) |
| `color-gray-dark` | `#7A7A7A` | Secondary text, metadata, captions |
| `color-surface-dark` | `#2E2F34` | Cards and surfaces on dark backgrounds |

### Semantic Colors
| State | HEX | Use |
|---|---|---|
| Success | `#4A8C5C` | Upload complete, RSVP confirmed, joined event |
| Warning | `#D49B37` | Pending review, offline mode |
| Error | `#C0392B` | Upload failed, form errors, destructive actions |
| Info | `#3A6EA5` | Tips, announcements, new features |

### Color Rules
- Use `#212226` for: bottom nav, photo viewer backgrounds, modals, hero sections. NOT for standard feed cards.
- Use `#BF5B21` for ONE primary CTA per screen only. Never as a large background fill.
- Use `#F2DCC2` for text-on-dark and warm tints. Prefer `#FAFAF8` over pure white everywhere.
- `#B0B0B0` is for placeholder text and decorative only — never for readable content.
- Semantic colors must always be paired with an icon or label, never convey state by color alone.

---

## TYPOGRAPHY

### Typefaces
- **DM Serif Display** — Headlines, section titles, empty states, feature callouts, onboarding taglines. Use italic sparingly for emotive moments only.
- **Inter** — All UI text: body, labels, buttons, metadata, captions.
- **DM Mono** — Technical metadata only: GPS coordinates, EXIF data (f/stop, shutter, ISO).

### Type Scale
| Level | Font | Size / Line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| Display / H1 | DM Serif Display | 40px / 44px | Regular | -0.5px | Screen heroes, onboarding |
| H2 | DM Serif Display | 32px / 38px | Regular | -0.3px | Section titles |
| H3 | DM Serif Display | 24px / 30px | Regular | 0 | Subsection titles |
| H4 | Inter | 18px / 24px | SemiBold 600 | 0 | Card titles, list headers |
| H5 | Inter | 15px / 22px | SemiBold 600 | +0.1px | Filter headers, form labels |
| H6 / Label | Inter | 12px / 16px | Bold 700 | +0.08em | Uppercase section labels |
| Body Large | Inter | 16px / 26px | Regular 400 | 0 | Onboarding body, descriptions |
| Body Default | Inter | 14px / 22px | Regular 400 | 0 | Feed copy, event descriptions |
| Caption | Inter | 12px / 18px | Regular 400 | +0.01em | Metadata, timestamps, likes |
| Button | Inter | 14px / 20px | SemiBold 600 | +0.01em | All button labels |
| Micro / Tag | Inter | 11px / 16px | Medium 500 | +0.04em | Chips, tags (uppercase) |
| Mono | DM Mono | 12px / 18px | Regular 400 | 0 | EXIF, coordinates |

### Typography Rules
- Never use italic Inter anywhere in the UI.
- H6/Label is always uppercase.
- DM Serif Display italic only for taglines and emotive empty states.
- All text must support Dynamic Type up to 200% scale — never use fixed-height text containers.

---

## ICONOGRAPHY

- **Style:** Outlined, 2px stroke, round line caps, 2px corner radius on paths.
- **Active/selected state only:** Use filled variant (not outlined).
- **Sizes:** S=16pt, M=24pt (default), L=32pt, XL=48pt.
- **Library:** Lucide Icons or Phosphor Icons (outlined set).
- **Custom brand icons:** Aperture, Film Roll, Shutter — always use custom SVGs for these.
- **Touch target:** Every tappable icon must have a minimum 44×44pt touch area, regardless of visual size.

---

## SPACING & LAYOUT

### Spacing Scale (base-4)
| Token | Value | Primary Use |
|---|---|---|
| `space-1` | 4px | Micro gaps, icon inner padding |
| `space-2` | 8px | Text-to-icon, chip inner gap |
| `space-3` | 12px | Small card padding |
| `space-4` | 16px | Standard padding, list gaps |
| `space-5` | 20px | Standard card internal padding |
| `space-6` | 24px | Section inner padding, input fields |
| `space-8` | 32px | Card-to-card gap, modal padding |
| `space-10` | 40px | Section headers, screen top padding |
| `space-12` | 48px | Section-to-section gap |
| `space-16` | 64px | Hero sections, page-level padding |

### Grid
- **Mobile (375–413px):** 4 columns, 16px gutter, 16px margin.
- **Mobile Large (414px+):** 4 columns, 16px gutter, 20px margin.
- **Tablet (768px+):** 8 columns, 20px gutter, 32px margin, max-width 720px.

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8px | Tags, chips, small pills |
| `radius-md` | 12px | Input fields, small cards, dropdowns |
| `radius-lg` | 16px | Standard cards, photo thumbnails |
| `radius-xl` | 20px | Modals, bottom sheets, hero cards |
| `radius-full` | 100px | Buttons (always pill), avatars, badges |

---

## COMPONENT LIBRARY

### Buttons
| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `#BF5B21` | `#F2DCC2` | — | Main CTA — ONE per screen |
| Secondary | Transparent | `#BF5B21` | 2px `#BF5B21` | Secondary action alongside primary |
| Ghost | Transparent | `#212226` | 2px `#EBEBEB` | Tertiary, cancel, dismiss |
| Dark | `#212226` | `#F2DCC2` | — | Actions on light cards needing weight |
| Disabled | `#EBEBEB` | `#B0B0B0` | — | Any variant when unavailable |

- Heights: S=36px, M=48px (default), L=56px.
- Shape: always `radius-full` (pill).
- Min width: 88px.
- Pressed: darken background 8% (`#BF522A` for primary).

### Input Fields
- Default: `1.5px #EBEBEB` border, white background.
- Focused: `1.5px #BF5B21` border.
- Error: `1.5px #C0392B` border + `#FFF8F8` background + error icon + message text.
- Disabled: `1.5px #EBEBEB` border + `#F5F5F5` background.
- Border radius: `radius-md` (12px). Height: 48px. Padding: 14px 16px.

### Photo Card (dark surface)
- Background: `#212226`.
- Image area: gradient overlay — `linear-gradient(to top, rgba(33,34,38,0.85) 0%, transparent 55%)`.
- Title: Inter SemiBold 14px, `#F2DCC2`.
- Metadata: Inter Regular 12px, `rgba(242,220,194,0.55)`.
- Like count: top-right badge with `rgba(33,34,38,0.7)` backdrop-blur pill.
- Border radius: `radius-lg` (16px).

### Event Card (light surface)
- Background: white, `1.5px #EBEBEB` border.
- Category chip: `rgba(191,91,33,0.12)` background, `#BF5B21` text, `radius-full`.
- Title: DM Serif Display 18px.
- Metadata: Inter 12px `#7A7A7A`.
- Footer: avatar stack (overlapping, 28px) + attendee count + action button.
- Border radius: `radius-lg` (16px).

### Filter Chips / Tags
- Default: `#EBEBEB` background, `#212226` text.
- Active: `#BF5B21` background, white text, with ✕ dismiss.
- Outline: transparent background, `1.5px #EBEBEB` border, `#7A7A7A` text.
- Height: min 36px. Padding: 6px 14px. Shape: `radius-full`.

### Bottom Navigation Bar
- Background: `#212226`.
- Active icon: filled, `#BF5B21` background circle.
- Active label: `#BF5B21`, 10px Inter Medium.
- Inactive icon + label: `rgba(242,220,194,0.50)`.
- 5 tabs: Discover (map), Gallery, Upload (camera), Groups (chat), Profile.
- Icon touch target: 44×44pt minimum.

### Modals / Bottom Sheets
- Background: white, `radius-xl` (20px) — top corners only for bottom sheets.
- Backdrop: `#212226` at 60% opacity.
- Padding: 32px.
- Structure: icon → title (DM Serif 22px) → body (Inter 14px `#7A7A7A`) → action buttons.

### Avatars
- Shape: always circular (`radius-full`).
- Sizes: XL=64px, L=48px, M=36px, S=28px.
- Fallback: uppercase initials in Inter Bold, color from rotation: Orange → Rust → Black → Green → Blue.
- In stacks: -6px left margin, 2px white border between avatars.

---

## PHOTOGRAPHY STYLE

### Aspect Ratios
| Context | Ratio | Crop | Overlay |
|---|---|---|---|
| Grid thumbnail | 1:1 | Center | None in grid; hover: 40% dark gradient |
| Feed card | 3:4 | Center | Bottom gradient `#212226` 0→70% |
| Hero / Featured | 16:9 or 3:2 | Center (subject priority) | Bottom-left vignette |
| Full-screen viewer | Native | No crop — letterbox with `#212226` | None |
| Profile banner | 16:5 | Center | Bottom 60% gradient to black |
| Event card banner | 16:7 | Center | 40% dark overlay full image |

### Image Rules
- Minimum display resolution: 1080px on longest edge.
- Formats: JPEG, HEIC, PNG, RAW (converted server-side). Display format: WebP.
- **No app-applied filters.** Street Frames never modifies the photographer's image.
- **B&W photos:** Never apply warm overlays. Detect grayscale and preserve neutrality in all contexts.

---

## MOTION & MICROINTERACTIONS

### Principles
- Warm, not snappy. Ease-out curves, unhurried. Feels like a photo developing.
- Purposeful only. No decorative motion.
- Subtle — felt, not noticed.
- Respect `prefers-reduced-motion`: collapse all transitions to simple opacity fades at max 150ms, no transforms.

### Animation Reference
| Pattern | Duration | Easing | Notes |
|---|---|---|---|
| Page / shared element transition | 320ms | `cubic-bezier(0.25,0.1,0.25,1.0)` | Photo expands from grid position |
| Bottom sheet entrance | 280ms | `cubic-bezier(0.0,0.0,0.2,1.0)` | Slide up + backdrop fade |
| Bottom sheet exit | 220ms | ease-in | |
| Card press state | 100ms in / 150ms out | ease-in-out | `scale(0.97)` — never opacity flicker |
| Like / heart animation | 400ms | spring | scale 1→1.4→1, fill orange, optional particle burst |
| Feed item entrance | 240ms | ease-out | `translateY(16px)→0` + opacity, stagger 60ms, max 5 items |
| Skeleton loading shimmer | 1400ms loop | linear | `#EBEBEB → #F5F5F5`, left-to-right |
| Tab switch | 180ms | ease-out | Icon scale 0.85→1.0 + color shift |

---

## ACCESSIBILITY

### Contrast Minimums
| Pair | Ratio | WCAG Level |
|---|---|---|
| `#212226` on `#F2DCC2` | 13.7:1 | AAA ✓ |
| `#F2DCC2` on `#BF5B21` | 3.8:1 | AA Large ✓ (min 18px or bold 14px) |
| `#BF5B21` on `#212226` | 5.2:1 | AA ✓ |
| `#7A7A7A` on `#FAFAF8` | 4.6:1 | AA ✓ |
| `#B0B0B0` on `#FAFAF8` | 2.3:1 | Fail — decorative/placeholder only |

### Touch Targets
- All interactive elements: minimum **44×44pt** touch area.
- List items: full row width × min 48pt height.
- Inline text links: full line height × min 44pt width.

### Inclusive Design
- All user photos require `accessibilityLabel`. Fallback: "[title] by [author]".
- Upload flow prompts for image description (optional, friendly copy).
- Never use color alone to convey state — always pair with icon + text.
- Dynamic Type: support up to 200%. No fixed-height text containers.
- Dark mode: `#212226` base surfaces, `#F2DCC2` primary text, `#BF5B21` accent unchanged.

---

## TONE OF VOICE

### Voice Principles
- **Warm:** Friendly, uses "you", acknowledges real moments. Not saccharine.
- **Playful:** Light wordplay and city metaphors, used sparingly. No jokes in error states.
- **Intelligent:** Assumes the user knows what they're doing. No condescension.
- **Inclusive:** Welcomes beginners and experts. No gear snobbery.
- **Local:** References Milan specifically — neighbourhoods, culture, aperitivo.

### Microcopy Patterns
| Context | ❌ Don't write | ✓ Write instead |
|---|---|---|
| Onboarding welcome | "Please create your account to get started." | "Milan is full of frames waiting to be found. Let's get you started." |
| Empty state — no photos | "No photos found. Upload your first photo." | "Your gallery is waiting. Share your first frame and start the conversation." |
| Empty state — no events | "No events available in your area." | "Quiet streets for now — but new photowalks appear every week. Check back soon." |
| Upload error | "Error 503. Upload failed. Please try again." | "Your photo didn't make it through. Check your connection and give it another try — it's worth it." |
| Invalid email | "Invalid email address." | "That doesn't look like a valid email — double-check and try again." |
| Join button | "Register / Sign Up / Click Here" | "Join this walk / Count me in / I'm coming" |
| Cancel RSVP | "Cancel Registration / Delete" | "Can't make it / Leave this walk" |
| Photo description prompt | "Add alt text (required for accessibility)" | "Help others picture your frame — describe what you captured. (Optional, but appreciated.)" |
| Push notification — like | "User123 liked your post." | "Marco liked your frame from Navigli. 📸" |
| Profile saved | "Changes saved successfully." | "Looks great — your profile is updated." |

### Words to Avoid
- Amazing! Incredible! Awesome! → use specific, genuine acknowledgement
- "Please note that…" → say the thing directly
- Submit / Register → Share / Join / Add
- User / End User → you / photographer / member
- "Are you sure?" → describe the actual consequence
- "Error occurred" → what happened + what to do
- "Click here" → Tap / Open / View / Go to

---

*Street Frames Milano · Design System v1.0 · March 2026*
*For use as Claude context when designing screens, writing UI copy, generating code, or creating assets for the app.*