# KurrawongAI Website
Available at [kurrawong.ai](https://kurrawong.ai).

Written in [Nuxt](https://nuxt.com/), [Nuxt Content](https://content.nuxt.com/), [Shadcn-vue](https://www.shadcn-vue.com/) and [Tailwind](https://tailwindcss.com/).

## Contents
- [Install & Run](#install--run)
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

Prop|Type|Required|Default|Description
-|-|:-:|-|-
to|string|||The link for the button to point to. Can be an internal or external URL
variant|"default" \| "secondary" \| "outline" \| "destructive" \| "ghost" \| "link"||"default"|The type or style of the button (see [shadcn-vue](https://www.shadcn-vue.com/docs/components/button.html) for more info)
size|"default" \| "sm" \| "lg" \| "icon" ||"default"|The size of the button (see [shadcn-vue](https://www.shadcn-vue.com/docs/components/button.html) for more info)
class|string|||HTML classes, which can include Tailwind styling classes for convenience
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
![KurrawongAI Logo](/img/kai-logo.png)
::
```

Prop|Type|Required|Default|Description
-|-|:-:|-|-
imgPosition|"top" \| "right" \| "bottom" \| "left"||"right"|The position of the image if included
imgHalf|boolean||false|Whether the image should take up exactly half the width/height of the card
class|string|||HTML classes, which can include Tailwind styling classes for convenience
<!-- &check; -->

Slot|Description
-|-
default|The card's body
title|The title of the card
description|A smaller subtitle for the card
footer|A footer that goes below the card main body
img|An image that can be positioned with the `imgPosition` prop

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
![KurrawongAI Logo](/img/kai-logo.png){height="60"}
::
```

Prop|Type|Required|Default|Description
-|-|:-:|-|-
logo|boolean||false|Whether the image (if provided) should be in line with the title, for use with logos, instead of the image taking up half the card's width.
<!-- &check; -->

Slot|Description
-|-
default|The card's body
title|The title of the card
description|A smaller subtitle for the card
img|An image

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
The home page does content negotiation and also accepts the `_mediatype` query parameter like Prez to optionally serve RDF, e.g. `https://dev.kurrawong.ai/?_mediatype=text/turtle` or with the header `"Accept": "text/turtle"`.

The RDF is a Turtle file in `server/assets/rdf.ttl`. This RDF is also rendered as a graph diagram in the hero component on the home page.

## Styling & Tailwind
Variables to be used in Tailwind classes must be defined as CSS variables in `assets/css/tailwind.css`. For colours, define them in HSL values ***without*** the `hsl()` function. You can also define dark mode-specific values inside the `.dark` class in that file.

These variables should then be listed in `tailwind.config.js`. For colours, call the `hsl()` function here.
