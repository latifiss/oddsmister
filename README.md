# OddsMister

OddsMister is a football match intelligence and analytics platform. It brings fixtures, live scores, bookmaker odds, match statistics, and football predictions into one responsive interface.

## Product capabilities

- Fixture discovery by date and competition
- Live match scores and match detail views
- Odds and bookmaker information
- Match predictions and prediction feeds
- Match analytics visualisations
- Redis-backed API response caching
- Responsive desktop and mobile experience

## Technology

- **Application:** Next.js App Router, React, TypeScript
- **UI:** Styled Components, CSS Modules
- **Data fetching:** SWR
- **Football data:** API-Football (API-Sports)
- **Caching:** Upstash Redis
- **Visualisation:** D3 and Recharts
- **Testing:** Cypress
- **Deployment:** Vercel

## Requirements

- Node.js 20
- npm 10
- API-Sports API key
- Upstash Redis REST database (recommended for shared production caching)

## Local development

```bash
git clone https://github.com/latifiss/oddsmister.git
cd oddsmister
npm ci
cp .env.example .env.local
npm run dev
```

Create `.env.local` and configure:

```env
API_FOOTBALL_KEY=your_api_sports_key
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
CRON_SECRET=your_random_cron_secret
```

The Redis credentials are recommended for shared caching across serverless instances. Without them, the API client continues to work but requests are not cached between invocations.

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run cypress:run` | Run Cypress tests |

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/matches?date=YYYY-MM-DD` | Fixtures for a date |
| `GET /api/matches?live=true` | Live fixtures |
| `GET /api/matches?fixtureId=123` | A fixture by ID |
| `GET /api/odds?fixtureId=123` | Odds for a fixture |
| `GET /api/predictions?fixtureId=123` | Predictions for a fixture |
| `GET /api/leagues` | Available leagues |
| `GET /api/bookmakers` | Available bookmakers |

## Architecture notes

The API-Sports client centralises outbound requests, enforces request timeouts, retries transient upstream failures with bounded backoff, and coalesces identical in-flight requests. Cache keys are normalised so equivalent query parameter objects share a cache entry.

Cache TTLs are deliberately endpoint-specific: live fixtures use short freshness windows, while less volatile reference data can be cached longer. Cache failures are non-fatal and fall back to the upstream API.

## Deployment

Deploy the repository to Vercel and configure the environment variables above in the project settings. Configure scheduled jobs to call protected maintenance endpoints using the `CRON_SECRET` bearer token. Never expose API keys or Redis tokens through `NEXT_PUBLIC_*` variables.

## Data and predictions disclaimer

OddsMister presents football data and statistical predictions for informational and analytical purposes. Predictions are estimates, not guarantees of match outcomes. Always verify current data with the relevant provider.

## License

All rights reserved. No license has been granted for redistribution or commercial reuse.
