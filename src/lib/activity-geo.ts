import { COUNTRY_CENTROIDS } from "./activity-geo-centroids";
import {
  type ActivityGlobeConfig,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
  markerSizeFromCount,
} from "./activity-globe-config";

/**
 * Country / region display names for activity visit summaries.
 * Safe to import from client components (no Redis / Node crypto).
 */

const COUNTRY_RE = /^[A-Z]{2}$/;
const REGIONAL_INDICATOR_A = 0x1f1e6;

export function normalizeCountryCode(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const code = value.trim().toUpperCase();
  if (!COUNTRY_RE.test(code)) return undefined;
  if (code === "XX" || code === "T1") return undefined;
  return code;
}

/** ISO 3166-1 alpha-2 → flag emoji via regional indicator symbols. */
export function countryCodeToFlag(value: string | null | undefined): string {
  const code = normalizeCountryCode(value);
  if (!code) return "";
  return String.fromCodePoint(
    REGIONAL_INDICATOR_A + (code.charCodeAt(0) - 65),
    REGIONAL_INDICATOR_A + (code.charCodeAt(1) - 65),
  );
}

export type ActivityGeo = {
  country?: string;
  countryName?: string;
  region?: string;
  regionName?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

export type ActivityLatLng = {
  lat: number;
  lng: number;
};

export type ActivityGlobeMarker = {
  id: string;
  location: [number, number];
  size: number;
};

export type ActivityRecentGlobeMarker = ActivityGlobeMarker & {
  eventId: string;
  age: number;
};

/** 0.1° bucket used to merge nearby visits into one globe marker. */
export function activityGlobeLocationKey(lat: number, lng: number): string {
  return `${lat.toFixed(1)},${lng.toFixed(1)}`;
}

/** Stable CSS-safe id for COBE bindable markers (`--cobe-{id}`). */
export function activityGlobeMarkerId(lat: number, lng: number): string {
  const encode = (value: number): string =>
    value.toFixed(1).replaceAll("-", "n").replaceAll(".", "d");
  return `g${encode(lat)}x${encode(lng)}`;
}

export function activityGlobeMarkerIdForLocation(
  location: ActivityLatLng,
  markers: readonly ActivityGlobeMarker[],
): string | undefined {
  const key = activityGlobeLocationKey(location.lat, location.lng);
  return markers.find(
    (marker) => activityGlobeLocationKey(marker.location[0], marker.location[1]) === key,
  )?.id;
}

/** Persist the same snake_case keys first-party visits store on event.meta. */
export function activityGeoToMeta(geo: ActivityGeo): Record<string, string | number> {
  const country = geo.country?.trim() || undefined;
  const countryName = geo.countryName?.trim() || (country ? countryCodeToName(country) : undefined);
  const region = geo.region?.trim() || undefined;
  const regionName = geo.regionName?.trim() || undefined;
  const city = geo.city?.trim() || undefined;
  const coords = pairCoordinates(geo.latitude, geo.longitude);

  return {
    ...(country ? { country } : {}),
    ...(countryName && countryName !== country ? { country_name: countryName } : {}),
    ...(region ? { region } : {}),
    ...(regionName ? { region_name: regionName } : {}),
    ...(city ? { city } : {}),
    ...(coords ?? {}),
  };
}

/** ISO 3166-1 alpha-2 → English short name. */
const COUNTRY_NAMES: Record<string, string> = {
  AD: "Andorra",
  AE: "United Arab Emirates",
  AF: "Afghanistan",
  AG: "Antigua and Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antarctica",
  AR: "Argentina",
  AS: "American Samoa",
  AT: "Austria",
  AU: "Australia",
  AW: "Aruba",
  AX: "Åland Islands",
  AZ: "Azerbaijan",
  BA: "Bosnia and Herzegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgium",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Caribbean Netherlands",
  BR: "Brazil",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Bouvet Island",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Canada",
  CC: "Cocos Islands",
  CD: "Democratic Republic of the Congo",
  CF: "Central African Republic",
  CG: "Republic of the Congo",
  CH: "Switzerland",
  CI: "Côte d'Ivoire",
  CK: "Cook Islands",
  CL: "Chile",
  CM: "Cameroon",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Cape Verde",
  CW: "Curaçao",
  CX: "Christmas Island",
  CY: "Cyprus",
  CZ: "Czechia",
  DE: "Germany",
  DJ: "Djibouti",
  DK: "Denmark",
  DM: "Dominica",
  DO: "Dominican Republic",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egypt",
  EH: "Western Sahara",
  ER: "Eritrea",
  ES: "Spain",
  ET: "Ethiopia",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falkland Islands",
  FM: "Micronesia",
  FO: "Faroe Islands",
  FR: "France",
  GA: "Gabon",
  GB: "United Kingdom",
  GD: "Grenada",
  GE: "Georgia",
  GF: "French Guiana",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Greenland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Equatorial Guinea",
  GR: "Greece",
  GS: "South Georgia",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hong Kong",
  HM: "Heard Island and McDonald Islands",
  HN: "Honduras",
  HR: "Croatia",
  HT: "Haiti",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IM: "Isle of Man",
  IN: "India",
  IO: "British Indian Ocean Territory",
  IQ: "Iraq",
  IR: "Iran",
  IS: "Iceland",
  IT: "Italy",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kyrgyzstan",
  KH: "Cambodia",
  KI: "Kiribati",
  KM: "Comoros",
  KN: "Saint Kitts and Nevis",
  KP: "North Korea",
  KR: "South Korea",
  KW: "Kuwait",
  KY: "Cayman Islands",
  KZ: "Kazakhstan",
  LA: "Laos",
  LB: "Lebanon",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libya",
  MA: "Morocco",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MF: "Saint Martin",
  MG: "Madagascar",
  MH: "Marshall Islands",
  MK: "North Macedonia",
  ML: "Mali",
  MM: "Myanmar",
  MN: "Mongolia",
  MO: "Macao",
  MP: "Northern Mariana Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldives",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mozambique",
  NA: "Namibia",
  NC: "New Caledonia",
  NE: "Niger",
  NF: "Norfolk Island",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Netherlands",
  NO: "Norway",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "French Polynesia",
  PG: "Papua New Guinea",
  PH: "Philippines",
  PK: "Pakistan",
  PL: "Poland",
  PM: "Saint Pierre and Miquelon",
  PN: "Pitcairn Islands",
  PR: "Puerto Rico",
  PS: "Palestine",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  RW: "Rwanda",
  SA: "Saudi Arabia",
  SB: "Solomon Islands",
  SC: "Seychelles",
  SD: "Sudan",
  SE: "Sweden",
  SG: "Singapore",
  SH: "Saint Helena",
  SI: "Slovenia",
  SJ: "Svalbard and Jan Mayen",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Suriname",
  SS: "South Sudan",
  ST: "São Tomé and Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Syria",
  SZ: "Eswatini",
  TC: "Turks and Caicos Islands",
  TD: "Chad",
  TF: "French Southern Territories",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tajikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Turkey",
  TT: "Trinidad and Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraine",
  UG: "Uganda",
  UM: "U.S. Outlying Islands",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Vatican City",
  VC: "Saint Vincent and the Grenadines",
  VE: "Venezuela",
  VG: "British Virgin Islands",
  VI: "U.S. Virgin Islands",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis and Futuna",
  WS: "Samoa",
  YE: "Yemen",
  YT: "Mayotte",
  ZA: "South Africa",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

const US_REGIONS: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const CA_REGIONS: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

const AU_REGIONS: Record<string, string> = {
  ACT: "Australian Capital Territory",
  NSW: "New South Wales",
  NT: "Northern Territory",
  QLD: "Queensland",
  SA: "South Australia",
  TAS: "Tasmania",
  VIC: "Victoria",
  WA: "Western Australia",
};

const GB_REGIONS: Record<string, string> = {
  ENG: "England",
  SCT: "Scotland",
  WLS: "Wales",
  NIR: "Northern Ireland",
};

const REGION_NAMES: Record<string, Record<string, string>> = {
  US: US_REGIONS,
  CA: CA_REGIONS,
  AU: AU_REGIONS,
  GB: GB_REGIONS,
};

const REGION_RE = /^[A-Z0-9]{1,3}$/;
const PLACEHOLDER_REGION_RE = /^0+$/;
const ALL_DIGITS_SHORT_RE = /^\d{1,3}$/;

export function countryCodeToName(value: string | null | undefined): string {
  const code = value?.trim().toUpperCase() ?? "";
  if (!code) return "";
  return COUNTRY_NAMES[code] ?? code;
}

export function normalizeRegionCode(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const code = value.trim().toUpperCase();
  if (!REGION_RE.test(code)) return undefined;
  if (PLACEHOLDER_REGION_RE.test(code)) return undefined;
  return code;
}

export function regionCodeToName(
  country: string | null | undefined,
  region: string | null | undefined,
): string {
  const countryCode = normalizeCountryCode(country);
  const regionCode = normalizeRegionCode(region);
  if (!regionCode) return "";
  if (countryCode) {
    const mapped = REGION_NAMES[countryCode]?.[regionCode];
    if (mapped) return mapped;
  }
  return "";
}

/** Skip empty, all-zero, all-digit short codes, and unmapped 2-char ISO codes. */
function isUsableRegionLabel(
  label: string | undefined,
  country: string | undefined,
): label is string {
  if (!label) return false;
  const code = label.trim().toUpperCase();
  if (!code) return false;
  if (PLACEHOLDER_REGION_RE.test(code)) return false;
  if (ALL_DIGITS_SHORT_RE.test(code)) return false;
  if (code.length === 2 && !regionCodeToName(country, code)) return false;
  return true;
}

export function decodeHeaderText(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    return decodeURIComponent(trimmed.replace(/\+/g, " ")).trim() || undefined;
  } catch {
    return trimmed;
  }
}

function firstHeader(headers: Headers, names: string[]): string | undefined {
  for (const name of names) {
    const value = headers.get(name);
    if (value) return value;
  }
  return undefined;
}

function parseCoordinate(value: unknown, min: number, max: number): number | undefined {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number.parseFloat(String(value).trim());
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

export function parseLatitude(value: unknown): number | undefined {
  return parseCoordinate(value, -90, 90);
}

export function parseLongitude(value: unknown): number | undefined {
  return parseCoordinate(value, -180, 180);
}

/** Require a finite lat/lng pair in range. One missing/invalid coordinate drops both. */
export function pairCoordinates(
  latitude: unknown,
  longitude: unknown,
): { latitude: number; longitude: number } | undefined {
  const lat = parseLatitude(latitude);
  const lng = parseLongitude(longitude);
  if (lat === undefined || lng === undefined) return undefined;
  return { latitude: lat, longitude: lng };
}

export function countryCentroid(country: string | null | undefined): ActivityLatLng | undefined {
  const code = normalizeCountryCode(country);
  if (!code) return undefined;
  const point = COUNTRY_CENTROIDS[code];
  if (!point) return undefined;
  return { lat: point[0], lng: point[1] };
}

export function getRequestGeo(headers: Headers): ActivityGeo {
  const country = normalizeCountryCode(
    firstHeader(headers, ["cf-ipcountry", "CF-IPCountry", "x-vercel-ip-country", "x-country"]),
  );
  const countryName = country ? countryCodeToName(country) : undefined;
  const region = normalizeRegionCode(
    firstHeader(headers, ["cf-region-code", "x-vercel-ip-country-region"]),
  );
  const regionFromNameHeader = decodeHeaderText(firstHeader(headers, ["cf-region"]));
  const mappedRegionName = country && region ? regionCodeToName(country, region) : "";
  const regionNameCandidate = regionFromNameHeader || mappedRegionName || undefined;
  const regionName = isUsableRegionLabel(regionNameCandidate, country)
    ? regionNameCandidate
    : undefined;
  const city = decodeHeaderText(firstHeader(headers, ["cf-ipcity", "x-vercel-ip-city"]));
  const coords = pairCoordinates(
    firstHeader(headers, ["cf-iplatitude", "CF-IPLatitude", "x-vercel-ip-latitude"]),
    firstHeader(headers, ["cf-iplongitude", "CF-IPLongitude", "x-vercel-ip-longitude"]),
  );

  return {
    ...(country ? { country } : {}),
    ...(countryName && countryName !== country ? { countryName } : {}),
    ...(region ? { region } : {}),
    ...(regionName ? { regionName } : {}),
    ...(city ? { city } : {}),
    ...(coords ?? {}),
  };
}

/** Visit copy when country/geo is missing. Globe icon stays; no flag. */
export const ANONYMOUS_VISIT_SUMMARY = "Someone visited from a mysterious place on earth";

export function formatVisitSummary(geo: {
  country?: string | null;
  countryName?: string | null;
  region?: string | null;
  regionName?: string | null;
  city?: string | null;
}): string {
  const rawCountry = geo.country?.trim() || undefined;
  const country = normalizeCountryCode(rawCountry);
  const countryLabel =
    decodeHeaderText(geo.countryName) ||
    (country ? countryCodeToName(country) : undefined) ||
    rawCountry;
  const rawRegionName = decodeHeaderText(geo.regionName);
  const rawRegion = decodeHeaderText(geo.region);
  const mappedRegion = regionCodeToName(country, rawRegion);
  const regionLabel =
    (isUsableRegionLabel(rawRegionName, country) ? rawRegionName : undefined) ||
    mappedRegion ||
    (isUsableRegionLabel(rawRegion, country) ? rawRegion : undefined);
  const city = decodeHeaderText(geo.city);

  let location: string | undefined;
  if (city && regionLabel && countryLabel) {
    location = `${city}, ${regionLabel}, ${countryLabel}`;
  } else if (city && countryLabel) {
    location = `${city}, ${countryLabel}`;
  } else if (countryLabel) {
    location = countryLabel;
  }

  const flag = countryCodeToFlag(country ?? rawCountry);
  if (!location) return ANONYMOUS_VISIT_SUMMARY;
  return flag ? `${flag} Visit from ${location}` : `Visit from ${location}`;
}

function isRegionalIndicator(char: string): boolean {
  const code = char.codePointAt(0);
  return code !== undefined && code >= 0x1f1e6 && code <= 0x1f1ff;
}

export function splitVisitSummaryFlag(summary: string): { flag?: string; text: string } {
  const chars = [...summary];
  if (
    chars.length >= 2 &&
    isRegionalIndicator(chars[0] ?? "") &&
    isRegionalIndicator(chars[1] ?? "")
  ) {
    const rest = chars.slice(2).join("").replace(/^\s+/, "");
    return { flag: `${chars[0]}${chars[1]}`, text: rest };
  }
  return { text: summary };
}

/** Display-only: drop a leading flag emoji. Ingest may still store one. */
export function visitDisplaySummary(summary: string): string {
  return splitVisitSummaryFlag(summary).text.trim();
}

export function geoFromVisitMeta(meta: Record<string, unknown> | undefined): ActivityGeo {
  if (!meta) return {};
  const country = typeof meta.country === "string" ? meta.country : undefined;
  const region = normalizeRegionCode(
    typeof meta.region === "string" ? decodeHeaderText(meta.region) : undefined,
  );
  const regionNameRaw =
    typeof meta.region_name === "string" ? decodeHeaderText(meta.region_name) : undefined;
  const regionName = isUsableRegionLabel(regionNameRaw, country) ? regionNameRaw : undefined;
  const coords = pairCoordinates(meta.latitude, meta.longitude);
  return {
    country,
    countryName:
      typeof meta.country_name === "string" ? decodeHeaderText(meta.country_name) : undefined,
    ...(region ? { region } : {}),
    ...(regionName ? { regionName } : {}),
    city: typeof meta.city === "string" ? decodeHeaderText(meta.city) : undefined,
    ...(coords ?? {}),
  };
}

/** Brian's home pin — GitHub work and Notion publishes land here. */
export const ACTIVITY_HOME_LOCATION: ActivityLatLng = { lat: 37.77, lng: -122.42 };

const HOME_ORIGIN_TYPES = new Set([
  "pr_opened",
  "pr_merged",
  "writing_published",
  "til_published",
  "stack_added",
  "site_added",
  "design_details_added",
  "app_dissection_published",
  "ama_answered",
]);

export function isHomeOriginActivity(event: { type?: string; source?: string }): boolean {
  if (event.source === "github") return true;
  return typeof event.type === "string" && HOME_ORIGIN_TYPES.has(event.type);
}

/** GitHub + Notion publishes always pin to SF. Visits use stored coords, then country centroid. */
export function activityEventLocation(event: {
  type?: string;
  source?: string;
  meta?: Record<string, unknown>;
}): ActivityLatLng | undefined {
  if (isHomeOriginActivity(event)) return ACTIVITY_HOME_LOCATION;
  const geo = geoFromVisitMeta(event.meta);
  if (geo.latitude !== undefined && geo.longitude !== undefined) {
    return { lat: geo.latitude, lng: geo.longitude };
  }
  return countryCentroid(geo.country);
}

export function activityGlobeMarkers(
  events: Array<{ type?: string; source?: string; meta?: Record<string, unknown> }>,
  sizeConfig?: Pick<ActivityGlobeConfig, "markerBaseSize" | "markerSizePerLog" | "markerMaxSize">,
): ActivityGlobeMarker[] {
  const sizing = sizeConfig ?? DEFAULT_ACTIVITY_GLOBE_CONFIG;
  const buckets = new Map<string, { lat: number; lng: number; count: number }>();
  for (const event of events) {
    const loc = activityEventLocation(event);
    if (!loc) continue;
    const key = activityGlobeLocationKey(loc.lat, loc.lng);
    const existing = buckets.get(key);
    if (existing) existing.count += 1;
    else buckets.set(key, { lat: loc.lat, lng: loc.lng, count: 1 });
  }
  return [...buckets.values()].map((bucket) => ({
    id: activityGlobeMarkerId(bucket.lat, bucket.lng),
    location: [bucket.lat, bucket.lng] as [number, number],
    size: markerSizeFromCount(bucket.count, sizing),
  }));
}

/** Newest-first unique locations, capped so the globe stays a trail instead of a pile. */
export function activityRecentGlobeMarkers(
  events: Array<{ id?: string; type?: string; source?: string; meta?: Record<string, unknown> }>,
  limit: number,
): ActivityRecentGlobeMarker[] {
  const cap = Math.max(0, Math.floor(limit));
  const seen = new Set<string>();
  const markers: ActivityRecentGlobeMarker[] = [];
  for (const event of events) {
    if (markers.length >= cap) break;
    const loc = activityEventLocation(event);
    if (!loc) continue;
    const key = activityGlobeLocationKey(loc.lat, loc.lng);
    if (seen.has(key)) continue;
    seen.add(key);
    markers.push({
      id: activityGlobeMarkerId(loc.lat, loc.lng),
      eventId: typeof event.id === "string" && event.id ? event.id : key,
      location: [loc.lat, loc.lng],
      size: 0,
      age: markers.length,
    });
  }
  return markers;
}
