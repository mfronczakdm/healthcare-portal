import { readFileSync } from "fs";

function loadEnv() {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const query = `
  query GetMobileCollege($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      PromoText: field(name: "PromoText") { value }
      PromoText2: field(name: "PromoText2") { value }
      PromoLink: field(name: "PromoLink") { value }
      PromoImage: field(name: "PromoIcon") { value }
    }
  }
`;

const variables = {
  path: "/sitecore/content/rockland/rockland/Data/Promos/Monitor accounts on the go",
  language: "en",
};

const endpoint =
  process.env.SITECORE_EDGE_ENDPOINT ??
  "https://edge.sitecorecloud.io/api/graphql/v1";
const contextId =
  process.env.SITECORE_EDGE_CONTEXT_ID ??
  process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID;

console.log("endpoint:", endpoint);
console.log("contextId:", contextId ?? "(missing)");

const headers = {
  "Content-Type": "application/json",
  "X-EXPERIENCE-EDGE-CONTEXT": contextId ?? "",
};
if (process.env.SITECORE_API_KEY) {
  headers.sc_apikey = process.env.SITECORE_API_KEY;
}

const res = await fetch(endpoint, {
  method: "POST",
  headers,
  body: JSON.stringify({ query, variables }),
});

console.log("status:", res.status, res.statusText);
const json = await res.json();
console.log(JSON.stringify(json, null, 2));
