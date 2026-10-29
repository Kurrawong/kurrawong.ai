# Deployment

An HTML diagram of the architecture and deploy pipeline is in
[`architecture.html`](architecture.html) — open it directly in a browser
(GitHub renders it as source).

The site deploys to a single Azure Container App (name `website`, resource
group `DEV`) containing two containers:

- `website` (main) - the Nuxt site, serving all ingress traffic on port 3000;
- `kchat` (sidecar) - the chat agent, reached only through the site's
  same-origin `/kchat/*` proxy (see `nuxt.config.ts`).

Two images are built from this repo on every deploy:

- `ghcr.io/kurrawong/kurrawongai` - the site;
- `ghcr.io/kurrawong/kurrawongai-kchat` - the published kchat image plus
  `server/assets/rdf.ttl` baked in at `/rdf` (see `deploy/Dockerfile.kchat`),
  so the agent's knowledge base is a plain image layer, not a mounted file
  share.

Pushes to `main` trigger `.github/workflows/push.yaml`, which builds both
images with an immutable `sha-<commit>` tag and applies
`deploy/containerapp.yaml` with `az containerapp update` (a new revision each
time; the previous revision is kept for rollback).

The commands below are **one-time setup**, run manually with `az` by someone
with Contributor on the container app. The deploy workflow assumes they are
already done and never creates Azure resources itself.

## GHCR package access

- The `kchat` base image is public, so the local compose setup and the
  workflow's wrapper build (`deploy/Dockerfile.kchat`) pull it without any
  credentials.
- The site images (`kurrawongai`, `kurrawongai-kchat`) are pushed with the
  repository's `GITHUB_TOKEN` and are private by default, so the container app
  pulls them using its registry credentials (below). Making both packages
  public too would let you skip that step entirely.

## One-time setup

```bash
# 1. The Mistral API key, as an inline Container App secret.
#    The workflow never reads or writes it; rotate it only with these commands.
az containerapp secret set \
  --name website --resource-group DEV \
  --secrets llm-api-key=<MISTRAL_API_KEY>

# 2. Registry credentials for ghcr.io so the container app can pull the
#    private site images. Needs a GitHub PAT with read:packages.
#    Skip if the kurrawongai packages are public.
az containerapp registry set \
  --name website --resource-group DEV \
  --server ghcr.io --username <GITHUB_USER> --password <PAT>
```

GitHub repository secrets:

- `AZURE_CREDENTIALS` - service principal JSON (already present). It only
  needs Contributor on the `website` container app.

The app's ingress (external, target port 3000) and custom domain
(kurrawong.ai) are managed in the portal or CLI; the deploy template never
touches them.

## Rotating the Mistral API key

1. Create the new key at console.mistral.ai (do not revoke the old one yet).
2. `az containerapp secret set --name website --resource-group DEV --secrets llm-api-key=<NEW_KEY>`
3. `az containerapp revision restart --name website --resource-group DEV`
   (inline secret updates only take effect on a restarted/new revision).
4. Ask the chat widget a question to verify, then revoke the old key.

## Upgrading kchat

Bump `KCHAT_BASE_IMAGE` in `.github/workflows/push.yaml` to the new release
tag and merge to `main`; the next deploy builds the wrapper image against it.

## Rollback

```bash
az containerapp revision list --name website --resource-group DEV -o table
az containerapp revision activate --name <previous revision> --app website --resource-group DEV
```

Each deploy creates a new immutable revision, so rollback is instant and the
old image tags (`sha-<commit>`) remain in GHCR.

## Cost

Consumption plan, always-on single replica (0.75 vCPU / 1.5 Gi total) is
roughly USD 40-60/month at current consumption rates. The first lever if that
matters is lowering the `resources` in `deploy/containerapp.yaml` (e.g.
0.25 vCPU / 0.5 Gi each), which roughly halves the bill.
