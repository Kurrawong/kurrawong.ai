# KurrawongAI Website
Available at [kurrawong.ai](https://kurrawong.ai).

Written in [Nuxt](https://nuxt.com/), [Nuxt Content](https://content.nuxt.com/), [Shadcn-vue](https://www.shadcn-vue.com/) and [Tailwind](https://tailwindcss.com/).

## Contents
- [Install & Run](#install--run)
  - [Windows](#windows)
- [Markdown Content](#markdown-content)
    - [Front Matter](#front-matter)
    - [Content Components](#content-components)
    - [Available Content Components to Use](#available-content-components-to-use)
    - [Images](#images)
- [Styling & Tailwind](#styling--tailwind)

## Install & Run
To install, ensure [pnpm](https://pnpm.io/) is installed, then run:

```bash
pnpm install
```

Then to run locally, run:
```bash
pnpm dev
```

### Windows
Windows users may experience slow install & dev times or other issues. Add pnpm to Defender's list by running the following command in PowerShell as admin:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

This should help improve the speed of installing packages. See https://pnpm.io/installation#on-windows for details.

The Nuxt dev server may also take a long time to start and load in browsers. Instead of going to http://localhost:3000, try [http://[::1]:3000](http://[::1]:3000). If your computer doesn't support that, try http://127.0.0.1:3000 instead.

## Chat Agent (kchat)
The website includes an AI chat agent, [kchat](https://github.com/Kurrawong/kchat), which answers questions about KurrawongAI's people, products, services and projects. The agent is a separate container: this repo provides its data and interface.

### RDF data
The agent's answers are grounded in [`server/assets/rdf.ttl`](server/assets/rdf.ttl), a schema.org model of the important website content (organisation, people, products, services, projects). This same file is served as Turtle at the site root via content negotiation (see [`server/middleware/rdf.ts`](server/middleware/rdf.ts)), so the RDF is both the agent's knowledge base and the site's own linked data. Update it when website content changes.

### Run locally
Requires Docker; the kchat agent is pulled from GHCR (`ghcr.io/kurrawong/kchat`, public).

```bash
cp .env.example .env  # set LLM_API_KEY and NUXT_PUBLIC_KCHAT_URL
docker compose up     # kchat on http://localhost:8000
pnpm dev              # website on http://localhost:3000
```

Open http://localhost:3000 and use the "Ask KurrawongAI" button in the bottom-right corner. The kchat API docs are at http://localhost:8000/docs.

The chat widget (`app/components/KChat.vue`) is enabled by setting `NUXT_PUBLIC_KCHAT_URL` to the kchat service's base URL; when unset, the widget is not rendered.

### Landing page
The landing page hero (see `app/components/content/KHero.vue`) keeps the site minimal: a headline and a concise company summary derived from the RDF (no chat request needed) sit over a fullscreen d3.js network diagram of the RDF, lightly blurred as a backdrop. Key nodes (entities with website page links, such as products and services) are drawn larger and outlined. The chat bar sits in the top-left corner (see `app/components/KChat.vue`) with suggested-question pills; after you ask a question, the chat window expands out of the bar. The "Explore the graph" button in the bottom-right un-blurs the diagram and hides the rest of the site so the graph can be explored (drag nodes, zoom, hover to highlight connections, click a node for its details and page link). A chevron at the bottom of the hero indicates more content below.

### Guardrails
Two protections are configured through the kchat container (see `compose.yaml` and `.env.example`):
- `RATE_LIMIT_QUESTIONS` / `RATE_LIMIT_WINDOW_SECONDS` limit the number of questions each user may ask per time window (enforced server-side by kchat; exceeded requests get a friendly 429 message in the widget).
- `AGENT_EXTRA_INSTRUCTIONS` appends instructions to the agent telling it to answer concisely in plain English without jargon (explaining any technical term it must use), help users find website content, only answer questions about KurrawongAI, and politely refuse off-topic questions.

### Deployment
The site deploys automatically to Azure from pushes to `main` (see `.github/workflows/push.yaml`, [`deploy/README.md`](deploy/README.md), and the architecture diagram [`deploy/architecture.html`](deploy/architecture.html)):

- one Container App with two containers: the site (main, serving all traffic) and kchat (sidecar); both images are built by CI, the kchat one being the published agent image plus this site's RDF baked in ([`deploy/Dockerfile.kchat`](deploy/Dockerfile.kchat));
- the site proxies `/kchat/*` to the sidecar (see `nuxt.config.ts`), so the agent is only reachable via the site's own origin, with `NUXT_PUBLIC_KCHAT_URL=/kchat`;
- `LLM_API_KEY` is an inline Container App secret (rotation runbook in `deploy/README.md`).

One-time Azure setup commands (storage, secret, registry credentials) are in [`deploy/README.md`](deploy/README.md); the workflow never creates Azure resources. Chat sessions are ephemeral (single replica, SQLite on EmptyDir). For multi-instance deployments, set `SESSION_DATABASE_URL` to a PostgreSQL database (see the [kchat README](https://github.com/Kurrawong/kchat)).

## Markdown Content
See [Nuxt Content docs](https://content.nuxt.com/usage/markdown) for more info.

Pages are written in Markdown in the `content/` folder.

The navbar content is dynamic with the pages file structure, meaning you don't need to update the nav when adding/removing pages.

You can specify the order of pages that appear in the nav by prefixing page titles/folders with numbers, e.g.:

```
4.tools/
    1.index.md
    2.prez.md
2.about.md
3.contact.md
1.index.md
```

### Front Matter
Meta information and other data, defined in YAML, goes above the markdown seperated by `---`, e.g.:

```yaml
---
title: Page title
description: Meta description of the page
---
Markdown content
```

### Content Components
Vue components to be used in Markdown pages are located in `components/content/`. To use them in Markdown pages, simply have a colon `:` before the name of the component, e.g.:

```
...

:MyComponent

or

:my-component

...
```

For components with slots, use two colons before the component name and two colons after the slot content. Named slots are prefixed with `#` and must go after the default slot. For example:

```
...

::ComponentDefaultSlot
Slot content goes here
::

::ComponentNamedSlot
Default slot content

#slotName
Named slot content
::

...
```

You can provide props to components by space-separating them in curly braces `{}`:

```
:MyComponent{prop1="value1" prop2="value2"}
```

#### Available Content Components to use:

##### KButton
For easily adding styled buttons in Markdown with the option of also being a link.

![KButton component example](/docs/kbutton.png)

Usage:

```
::KButton{to="/"}
A button
::
```

| Prop    | Type                                                                        | Required | Default   | Description                                                                                                              |
|---------|-----------------------------------------------------------------------------|:--------:|-----------|--------------------------------------------------------------------------------------------------------------------------|
| to      | string                                                                      |          |           | The link for the button to point to. Can be an internal or external URL                                                  |
| variant | "default" \| "secondary" \| "outline" \| "destructive" \| "ghost" \| "link" |          | "default" | The type or style of the button (see [shadcn-vue](https://www.shadcn-vue.com/docs/components/button.html) for more info) |
| size    | "default" \| "sm" \| "lg" \| "icon"                                         |          | "default" | The size of the button (see [shadcn-vue](https://www.shadcn-vue.com/docs/components/button.html) for more info)          |
| class   | string                                                                      |          |           | HTML classes, which can include Tailwind styling classes for convenience                                                 |

<!-- &check; -->

Slot|Description
-|-
default|The button's contents

##### KCard
For containers with borders, or "cards", with an optional title, subtitle, footer and image.

![KCard component example](/docs/kcard.png)

Usage:

```
::KCard{imgPosition="right" imgHalf}
Card content

#title
Card title

#description
Card description

#footer
Card footer

#img
![KurrawongAI Logo](/img/KurrawongAI_350.png)
::
```

| Prop        | Type                                   | Required | Default | Description                                                                |
|-------------|----------------------------------------|:--------:|---------|----------------------------------------------------------------------------|
| imgPosition | "top" \| "right" \| "bottom" \| "left" |          | "right" | The position of the image if included                                      |
| imgHalf     | boolean                                |          | false   | Whether the image should take up exactly half the width/height of the card |
| class       | string                                 |          |         | HTML classes, which can include Tailwind styling classes for convenience   |

<!-- &check; -->

| Slot        | Description                                                 |
|-------------|-------------------------------------------------------------|
| default     | The card's body                                             |
| title       | The title of the card                                       |
| description | A smaller subtitle for the card                             |
| footer      | A footer that goes below the card main body                 |
| img         | An image that can be positioned with the `imgPosition` prop |

##### KGrid
A simple utility component for easily wrapping other components in a CSS grid. You can configure the grid by using Tailwind classes on this component in Markdown.

Usage:
```
::KGrid{class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}
...
::
```

##### KCaseStudy
For making case study cards. Uses the KCard component underneath.

![KCard component example](/docs/kcasestudy.png)

Usage:

```
::KCaseStudy{logo}
Card content

#title
Case Study: Title

#description
Card description

#img
![KurrawongAI Logo](/img/KurrawongAI_350.png){height="60"}
::
```

| Prop | Type    | Required | Default | Description                                                                                                                                 |
|------|---------|:--------:|---------|---------------------------------------------------------------------------------------------------------------------------------------------|
| logo | boolean |          | false   | Whether the image (if provided) should be in line with the title, for use with logos, instead of the image taking up half the card's width. |

<!-- &check; -->

| Slot        | Description                     |
|-------------|---------------------------------|
| default     | The card's body                 |
| title       | The title of the card           |
| description | A smaller subtitle for the card |
| img         | An image                        |

##### KHero
The hero component for the home page. Includes the graph diagram rendering.

##### KPerson
For listing staff, including their position, bio and profile picture.

![KPerson component example](/docs/kperson.png)

Usage:

```
::KPerson
The person's bio

#name
### Name

#position
_Position_

#img
![Nick's profile picture](/img/nick.jpg){width="220"}
::
```

Slot|Description
-|-
default|The person's bio
name|The person's name
position|The person's position
img|The profile picture

### Images
See the [NuxtImage docs](https://image.nuxt.com/usage/nuxt-img) for how to include images in Markdown files. The syntax is the same as regular Markdown, but you can provide extra props to be passed to the underlying `<NuxtImg />` component, such as placeholder info, provider, quality, densities, etc.

## Serving RDF
The home page does content negotiation and also accepts the `_mediatype` query parameter like Prez to optionally serve RDF, e.g. `https://kurrawong.ai/?_mediatype=text/turtle` or with the header `"Accept": "text/turtle"`.

The RDF is a Turtle file in [`server/assets/rdf.ttl`](server/assets/rdf.ttl). This RDF is also rendered as a graph diagram in the hero component on the home page.

## Styling & Tailwind
Variables to be used in Tailwind classes must be defined as CSS variables in `assets/css/tailwind.css`. For colours, define them in HSL values without commas. You can also define dark mode-specific values inside the `.dark` class in that file.

For referencing colour variables elsewhere in CSS, use the convention `var(--color-<variable>)`.