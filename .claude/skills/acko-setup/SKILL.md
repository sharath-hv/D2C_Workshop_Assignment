---
name: acko-setup
description: Detect and bootstrap the ACKO component package boilerplate for this project (D2C_Workshop_Assignment) — clones the ACKO source repo, wires up the Nexus registry, installs @acko/* packages, and checks/updates versions. Trigger on "set up ACKO", "install ACKO", "update ACKO", mentions of "ACKO components" / "ACKO design system" / "@acko", a request to build a UI or page in an Acko/insurance context, or a specific ACKO component name (Button, Card, Badge, Typography, etc.).
---

# ACKO Design System — Setup & Package Management

Project-scoped skill (lives under this project's `.claude/skills/`, not `~/.claude/skills/`). It governs *installing and updating* the `@acko/*` packages. For the actual design rules (tokens, layout, cards, typography, motion, etc.) see the sibling skills — **[acko-design-system](../acko-design-system/SKILL.md)** and **[acko-motion-system](../acko-motion-system/SKILL.md)** — which are read separately in Step 3a below.

## When to trigger

- User mentions "ACKO components", "ACKO design system", or "@acko"
- User asks to build a UI or page in an Acko/insurance context
- User mentions a specific component name: Button, Card, Badge, Typography, etc.
- User says "set up ACKO", "install ACKO", "update ACKO", "check for ACKO updates", "reinstall ACKO"

---

## Step 1 — Detect existing setup

Before doing anything, check whether this project already has ACKO wired up:

1. Look for `package.json` in the project root.
2. Check whether it contains any `@acko/*` dependencies.
3. Check whether `.npmrc` exists with the Acko registry line (see **Registry Configuration** below).

**If both exist →** skip to Step 3 (use existing setup).
**If missing →** proceed to Step 2 (fresh setup).

---

## Step 2 — Fresh setup (files not present)

This clones a boilerplate and overwrites root config files (`package.json`, `.npmrc`, `vite.config.ts`, `tsconfig*.json`, `index.html`) and the `src/`/`public/` trees. Before running it:

- Run `git status` (if this becomes a git repo) or otherwise check for existing uncommitted work under those paths. If the project already has meaningful content there that isn't just scaffolding, stop and confirm with the user before overwriting rather than clobbering it silently.
- Otherwise, this is standard project bootstrap and can proceed directly:

```bash
# 1. Clone the boilerplate (files only, into a temp dir — not a nested git repo)
git clone --depth=1 https://github.com/ramnan10118/ACKO-component-source.git .acko-tmp

# 2. Copy required files into the current project
cp .acko-tmp/package.json ./package.json
cp .acko-tmp/.npmrc ./.npmrc
cp .acko-tmp/vite.config.ts ./vite.config.ts
cp .acko-tmp/tsconfig.json ./tsconfig.json
cp .acko-tmp/tsconfig.app.json ./tsconfig.app.json
cp .acko-tmp/tsconfig.node.json ./tsconfig.node.json
cp .acko-tmp/index.html ./index.html
cp -r .acko-tmp/src ./src
cp -r .acko-tmp/public ./public

# 3. Clean up temp folder
rm -rf .acko-tmp

# 4. Install packages from the Nexus registry
npm install
```

After install, tell the user:
> "ACKO design system is set up and ready. All 24+ components are available."

---

## Step 3 — Use existing setup

If setup already exists, proceed directly with the user's request using the available ACKO components. Do not re-clone or reinstall unless the user asks.

---

## Step 3a — Read all skill files before starting any UI work

**Before writing any UI code**, always read every reference file in both project-scoped skills — they live under this project's own `.claude/skills/`:

```
.claude/skills/acko-design-system/SKILL.md
.claude/skills/acko-design-system/cards.md
.claude/skills/acko-design-system/components.md
.claude/skills/acko-design-system/forms-controls.md
.claude/skills/acko-design-system/iconography.md
.claude/skills/acko-design-system/layout.md
.claude/skills/acko-design-system/performance.md
.claude/skills/acko-design-system/primitives.md
.claude/skills/acko-design-system/radii.md
.claude/skills/acko-design-system/responsiveness.md
.claude/skills/acko-design-system/scales.md
.claude/skills/acko-design-system/semantics.md
.claude/skills/acko-design-system/shadows.md
.claude/skills/acko-design-system/touch-accessibility.md
.claude/skills/acko-design-system/typography.md
.claude/skills/acko-design-system/ui-polish.md

.claude/skills/acko-motion-system/SKILL.md
.claude/skills/acko-motion-system/references/curves.md
.claude/skills/acko-motion-system/references/animation-principles.md
.claude/skills/acko-motion-system/references/physics.md
.claude/skills/acko-motion-system/references/transitions.md
.claude/skills/acko-motion-system/references/home.md
.claude/skills/acko-motion-system/references/output-templates.md
.claude/skills/acko-motion-system/references/pattern-library.md
```

Do not skip any file. `acko-design-system/SKILL.md` is the orchestrator and lists the full layer model (Primitives → Semantics → Components, plus scales/radii/shadows/typography/iconography) — reading only `SKILL.md` is not enough. All rules in those files (tokens, color roles, motion, forms, cards, layout, accessibility, performance, polish) apply to every UI task in this project.

---

## Step 4 — Handling version updates

### Check for updates

When the user says "check for ACKO updates" or "are there new ACKO versions":

```bash
# Fetch latest package.json from GitHub without cloning
curl -s https://raw.githubusercontent.com/ramnan10118/ACKO-component-source/main/package.json -o .acko-latest.json
```

Compare versions of all `@acko/*` packages between the local `package.json` and `.acko-latest.json`. Report any differences to the user. Then delete `.acko-latest.json`.

### Update to latest

When the user says "update ACKO packages" or "upgrade ACKO to latest":

1. Pull the latest `package.json` from GitHub:
   ```bash
   curl -s https://raw.githubusercontent.com/ramnan10118/ACKO-component-source/main/package.json -o package.json
   ```
2. Run `npm install`.
3. Confirm to the user which packages were updated.

### Update to a specific version

When the user says "update ACKO to version X.X.X":

1. Update all `@acko/*` entries in `package.json` to the specified version.
2. Run `npm install`.
3. Confirm success.

### Reinstall packages

When the user says "reinstall ACKO" or "npm install":

```bash
npm install
```

This fetches the versions declared in `package.json` from the Nexus registry.

---

## Registry configuration

`.npmrc` must always contain:

```
@acko:registry=http://nexus-dev.acko.in:8080/repository/quark-skill/
```

Without this, `npm install` will fail to find `@acko/*` packages. If `.npmrc` is missing or incorrect, restore it before running `npm install`.

---

## Available ACKO components (v1.0.0+)

| Package | Component |
|---|---|
| `@acko/accordion` | Accordion |
| `@acko/alert` | Alert |
| `@acko/avatar` | Avatar |
| `@acko/badge` | Badge |
| `@acko/breadcrumb` | Breadcrumb |
| `@acko/button` | Button |
| `@acko/calendar` | Calendar |
| `@acko/card` | Card, CardHeader, CardContent, CardFooter |
| `@acko/checkbox` | Checkbox |
| `@acko/css` | Global CSS tokens |
| `@acko/dropdown` | Dropdown |
| `@acko/field` | Field |
| `@acko/input-group` | InputGroup |
| `@acko/label` | Label |
| `@acko/navigation-wizard` | NavigationWizard |
| `@acko/pagination` | Pagination |
| `@acko/progress` | Progress |
| `@acko/radio` | RadioGroup |
| `@acko/scroll-area` | ScrollArea |
| `@acko/separator` | Separator |
| `@acko/skeleton` | Skeleton |
| `@acko/switch` | Switch |
| `@acko/table` | Table, TableHeader, TableBody, TableRow, TableHead, TableCell |
| `@acko/tabs` | Tabs |
| `@acko/text-input` | TextInput |
| `@acko/textarea` | Textarea |
| `@acko/toggle` | Toggle |
| `@acko/tokens` | Design tokens |
| `@acko/tooltip` | Tooltip |
| `@acko/typography` | Typography |

---

## Import convention

Always import from the specific package:

```tsx
import { Button } from "@acko/button";
import { Typography } from "@acko/typography";
import { Card, CardHeader, CardContent, CardFooter } from "@acko/card";
import { TextInput } from "@acko/text-input";
import { Dropdown } from "@acko/dropdown";
```

Never use a barrel import like `import { Button } from "@acko/ui"` — that package does not exist.
