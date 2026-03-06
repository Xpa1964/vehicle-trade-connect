

## Plan: Add inline flag language selector to the Messages page

### What you want
Add a row of clickable flag buttons (identical style to the ones on the MessagingInfoPage) directly into the Messages hero section, so users can switch language without going to the navbar menu.

### What I'll do

**1. Create `src/components/messages/InlineLanguageSelector.tsx`**

A compact horizontal row of flag buttons reusing the exact same flag gradient definitions from `MessagingInfoPage.tsx`. Each button:
- Shows the flag circle + language name (e.g. `ES Español`)
- Highlights the currently active language with `bg-muted/80` border
- Calls `changeLanguage()` from `LanguageContext` on click
- Wraps responsively on mobile

**2. Modify `src/components/messages/MessagesHero.tsx`**

Add the `InlineLanguageSelector` component below the title/description text, inside the hero card. Layout:

```text
┌──────────────────────────────────────┐
│ ← Back to Dashboard                 │
│                                      │
│ Mensajería                           │
│ Gestiona tus conversaciones...       │
│                                      │
│ 🇪🇸 Español  🇬🇧 English  🇫🇷 Français │
│ 🇮🇹 Italiano  🇩🇪 Deutsch  🇳🇱 Nederlands│
│ 🇵🇹 Português  🇵🇱 Polski  🇩🇰 Dansk   │
└──────────────────────────────────────┘
```

The flag selector will be placed **below the hero image card** (same position as in the screenshot reference), inside a `bg-card rounded-lg border` container with `flex-wrap gap-3 p-3`, matching the exact style from `MessagingInfoPage`.

### No translation changes needed
The component uses `LANGUAGE_NAMES` from `src/config/languages.ts` and the existing `changeLanguage` function -- no new translation keys required.

