# Sitecore GraphQL Query Library

Query **documents** and **default variables** live here. Connection settings (endpoint, API key, Edge context) stay in `.env.local`.

## Layout

```
queries/
  _defaults.ts       # shared language/site defaults
  registry.ts        # registered queries by id
  home/
    promo.query.ts   # GQL_HOME_PROMO_QUERY + variables
loaders/
  home/
    promo.ts         # loadHomePromo() — maps response to UI model
```

## Customize the home promo

Edit `queries/home/promo.query.ts`:

- `GQL_HOME_PROMO_QUERY` — GraphQL document
- `homePromoQueryVariables.path` — Sitecore item path
- `homePromoQueryVariables.language` — language code

Field markup from Sitecore is cleaned in `parse-field-values.ts`.

## Add another query later

1. Add `queries/<page>/<slot>.query.ts`
2. Register in `registry.ts`
3. Add `loaders/<page>/<slot>.ts`
4. Compose loaders on the page
