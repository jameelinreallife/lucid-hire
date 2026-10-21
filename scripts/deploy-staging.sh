#!/usr/bin/env bash
# Deploys both Workers to the shared staging environment and waits until it answers.
# Workers Builds runs this as its deploy command, so its GitHub check run (the event the
# TestSprite PR trigger listens for) only succeeds once https://staging.lucidhire.io is live.
set -euo pipefail

cd "$(dirname "$0")/.."
message="${WORKERS_CI_BRANCH:-local} ${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD)}"

# The web Worker's service binding needs the API Worker, so the API goes first.
(cd apps/api && pnpm exec cf deploy --mode staging --message "$message")
(cd apps/web && pnpm exec cf deploy --mode staging --message "$message")

curl -fsS --retry 30 --retry-delay 5 --retry-all-errors --max-time 10 \
	https://staging.lucidhire.io/api/health | tee /dev/stderr | grep -q '"ok":true'
curl -fsS --retry 10 --retry-delay 3 --retry-all-errors --max-time 10 -o /dev/null \
	-w 'home page: %{http_code}\n' https://staging.lucidhire.io/
