export interface RegionStateItem {
  code: string; // e.g. "TX", "ON"
  id: string; // e.g. "US-TX", "CA-ON"
  name: string; // e.g. "Texas", "Ontario"
  countryCode: "US" | "CA";
  flag: string;
  defaultDeliveryTime?: string;
  majorCities?: string[];
}

export const US_STATES: RegionStateItem[] = [
  { code: "AL", id: "US-AL", name: "Alabama", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Montgomery", "Huntsville", "Mobile"] },
  { code: "AK", id: "US-AK", name: "Alaska", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "3-4 weeks", majorCities: ["Anchorage", "Fairbanks", "Juneau"] },
  { code: "AZ", id: "US-AZ", name: "Arizona", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"] },
  { code: "AR", id: "US-AR", name: "Arkansas", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Little Rock", "Fort Smith", "Fayetteville"] },
  { code: "CA", id: "US-CA", name: "California", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno", "Long Beach"] },
  { code: "CO", id: "US-CO", name: "Colorado", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Denver", "Colorado Springs", "Aurora", "Boulder", "Fort Collins"] },
  { code: "CT", id: "US-CT", name: "Connecticut", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Bridgeport", "New Haven", "Hartford", "Stamford"] },
  { code: "DE", id: "US-DE", name: "Delaware", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Wilmington", "Dover", "Newark"] },
  { code: "FL", id: "US-FL", name: "Florida", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", "Fort Lauderdale", "Tallahassee"] },
  { code: "GA", id: "US-GA", name: "Georgia", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Atlanta", "Augusta", "Columbus", "Savannah"] },
  { code: "HI", id: "US-HI", name: "Hawaii", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "3-4 weeks", majorCities: ["Honolulu", "Hilo", "Kailua"] },
  { code: "ID", id: "US-ID", name: "Idaho", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Boise", "Meridian", "Nampa"] },
  { code: "IL", id: "US-IL", name: "Illinois", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Chicago", "Aurora", "Naperville", "Rockford", "Springfield"] },
  { code: "IN", id: "US-IN", name: "Indiana", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"] },
  { code: "IA", id: "US-IA", name: "Iowa", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Des Moines", "Cedar Rapids", "Davenport"] },
  { code: "KS", id: "US-KS", name: "Kansas", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Wichita", "Overland Park", "Kansas City", "Topeka"] },
  { code: "KY", id: "US-KY", name: "Kentucky", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Louisville", "Lexington", "Bowling Green"] },
  { code: "LA", id: "US-LA", name: "Louisiana", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"] },
  { code: "ME", id: "US-ME", name: "Maine", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Portland", "Lewiston", "Bangor"] },
  { code: "MD", id: "US-MD", name: "Maryland", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Baltimore", "Frederick", "Rockville", "Annapolis"] },
  { code: "MA", id: "US-MA", name: "Massachusetts", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Boston", "Worcester", "Springfield"] },
  { code: "MI", id: "US-MI", name: "Michigan", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Detroit", "Grand Rapids", "Warren", "Ann Arbor", "Lansing"] },
  { code: "MN", id: "US-MN", name: "Minnesota", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Minneapolis", "Saint Paul", "Rochester", "Duluth"] },
  { code: "MS", id: "US-MS", name: "Mississippi", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Jackson", "Gulfport", "Southaven", "Biloxi"] },
  { code: "MO", id: "US-MO", name: "Missouri", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Kansas City", "Saint Louis", "Springfield", "Columbia"] },
  { code: "MT", id: "US-MT", name: "Montana", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Billings", "Missoula", "Great Falls", "Bozeman"] },
  { code: "NE", id: "US-NE", name: "Nebraska", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Omaha", "Lincoln", "Bellevue", "Grand Island"] },
  { code: "NV", id: "US-NV", name: "Nevada", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"] },
  { code: "NH", id: "US-NH", name: "New Hampshire", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Nashua", "Concord", "Dover", "Portsmouth"] },
  { code: "NJ", id: "US-NJ", name: "New Jersey", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"] },
  { code: "NM", id: "US-NM", name: "New Mexico", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"] },
  { code: "NY", id: "US-NY", name: "New York", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["New York", "NYC", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"] },
  { code: "NC", id: "US-NC", name: "North Carolina", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"] },
  { code: "ND", id: "US-ND", name: "North Dakota", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Fargo", "Bismarck", "Grand Forks", "Minot"] },
  { code: "OH", id: "US-OH", name: "Ohio", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"] },
  { code: "OK", id: "US-OK", name: "Oklahoma", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"] },
  { code: "OR", id: "US-OR", name: "Oregon", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"] },
  { code: "PA", id: "US-PA", name: "Pennsylvania", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie"] },
  { code: "RI", id: "US-RI", name: "Rhode Island", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Providence", "Warwick", "Cranston", "Pawtucket"] },
  { code: "SC", id: "US-SC", name: "South Carolina", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Greenville"] },
  { code: "SD", id: "US-SD", name: "South Dakota", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Sioux Falls", "Rapid City", "Aberdeen"] },
  { code: "TN", id: "US-TN", name: "Tennessee", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"] },
  { code: "TX", id: "US-TX", name: "Texas", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Plano", "Corpus Christi"] },
  { code: "UT", id: "US-UT", name: "Utah", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"] },
  { code: "VT", id: "US-VT", name: "Vermont", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Burlington", "South Burlington", "Rutland"] },
  { code: "VA", id: "US-VA", name: "Virginia", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"] },
  { code: "WA", id: "US-WA", name: "Washington", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Everett"] },
  { code: "WV", id: "US-WV", name: "West Virginia", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Charleston", "Huntington", "Morgantown", "Parkersburg"] },
  { code: "WI", id: "US-WI", name: "Wisconsin", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Milwaukee", "Madison", "Green Bay", "Kenosha"] },
  { code: "WY", id: "US-WY", name: "Wyoming", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Cheyenne", "Casper", "Laramie", "Gillette"] },
  { code: "DC", id: "US-DC", name: "District of Columbia", countryCode: "US", flag: "🇺🇸", defaultDeliveryTime: "2-3 weeks", majorCities: ["Washington", "Washington DC"] },
];

export const CA_PROVINCES: RegionStateItem[] = [
  { code: "AB", id: "CA-AB", name: "Alberta", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"] },
  { code: "BC", id: "CA-BC", name: "British Columbia", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Kelowna"] },
  { code: "MB", id: "CA-MB", name: "Manitoba", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Winnipeg", "Brandon", "Steinbach"] },
  { code: "NB", id: "CA-NB", name: "New Brunswick", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Moncton", "Saint John", "Fredericton"] },
  { code: "NL", id: "CA-NL", name: "Newfoundland and Labrador", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["St. John's", "Corner Brook", "Mount Pearl"] },
  { code: "NS", id: "CA-NS", name: "Nova Scotia", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Halifax", "Dartmouth", "Truro"] },
  { code: "ON", id: "CA-ON", name: "Ontario", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "Markham", "Vaughan", "Kitchener", "Windsor"] },
  { code: "PE", id: "CA-PE", name: "Prince Edward Island", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Charlottetown", "Summerside"] },
  { code: "QC", id: "CA-QC", name: "Quebec", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke"] },
  { code: "SK", id: "CA-SK", name: "Saskatchewan", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "2-3 weeks", majorCities: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw"] },
  { code: "NT", id: "CA-NT", name: "Northwest Territories", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "3-4 weeks", majorCities: ["Yellowknife", "Inuvik"] },
  { code: "NU", id: "CA-NU", name: "Nunavut", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "3-4 weeks", majorCities: ["Iqaluit", "Rankin Inlet"] },
  { code: "YT", id: "CA-YT", name: "Yukon", countryCode: "CA", flag: "🇨🇦", defaultDeliveryTime: "3-4 weeks", majorCities: ["Whitehorse", "Dawson City"] },
];

/**
 * Intelligent helper to resolve a customer input (city name, state name, or code)
 * to its corresponding US State or Canadian Province.
 */
export function findStateOrProvince(query?: string, countryHint?: string): RegionStateItem | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  if (q.length === 0) return null;

  const checkList =
    countryHint === "CA"
      ? CA_PROVINCES
      : countryHint === "US"
      ? US_STATES
      : [...US_STATES, ...CA_PROVINCES];

  // 1. Direct ID match (e.g. "US-TX", "CA-ON")
  const idMatch = checkList.find((item) => item.id.toLowerCase() === q);
  if (idMatch) return idMatch;

  // 2. Direct 2-letter code match (e.g. "TX", "ON", "FL")
  // Guard against 2-letter codes that collide with countries (DE, CA, NO, IS, IT) or common English words (in, or, me, hi, ok)
  const AMBIGUOUS_2_LETTER_CODES = new Set(["de", "ca", "in", "or", "me", "hi", "ok", "no", "is", "it"]);

  if (countryHint || !AMBIGUOUS_2_LETTER_CODES.has(q)) {
    const directCode = checkList.find(
      (item) => item.code.toLowerCase() === q || item.code.toLowerCase() === q.replace(/^(us-|ca-)/, "")
    );
    if (directCode) return directCode;
  }

  // 3. Exact state/province name match (e.g. "texas", "california", "ontario", "new york")
  const exactName = checkList.find((item) => item.name.toLowerCase() === q);
  if (exactName) return exactName;

  // 4. Prefix match for state name (>= 4 characters, e.g. "connecti" -> "Connecticut")
  if (q.length >= 4) {
    const prefixName = checkList.find((item) => item.name.toLowerCase().startsWith(q));
    if (prefixName) return prefixName;
  }

  // 5. Query contains state name as whole word (e.g. "Austin, Texas", "Toronto, Ontario")
  const containsName = checkList.find((item) => {
    const sName = item.name.toLowerCase();
    return new RegExp(`\\b${sName}\\b`, "i").test(q);
  });
  if (containsName) return containsName;

  // 6. Query contains state 2-letter code preceded by comma or space (e.g. "Houston, TX", "Austin TX", "Toronto, ON")
  const containsCode = checkList.find((item) => {
    const sCode = item.code.toLowerCase();
    if (AMBIGUOUS_2_LETTER_CODES.has(sCode) && !countryHint) return false;
    return new RegExp(`[,\\s]+${sCode}\\b`, "i").test(q);
  });
  if (containsCode) return containsCode;

  // 7. Unambiguous major city match (e.g. "Houston", "Miami", "Chicago", "Montreal", "Toronto")
  // MUST be exact match or whole-word match (NO loose substring matching!)
  const cityMatch = checkList.find((item) =>
    item.majorCities?.some((c) => {
      const cLower = c.toLowerCase();
      return q === cLower || new RegExp(`\\b${cLower}\\b`, "i").test(q);
    })
  );
  if (cityMatch) return cityMatch;

  return null;
}

export interface ResolvedDestination {
  countryCode: string;
  countryName: string;
  regionName?: string;
  flag: string;
  label: string;
  matchedRule: "state" | "city" | "country";
  queryParam: string;
}

export const COUNTRY_DICTIONARY: {
  code: string;
  name: string;
  germanName: string;
  flag: string;
  keywords: string[];
}[] = [
  // ── Deutschland ──
  {
    code: "DE",
    name: "Germany",
    germanName: "Deutschland",
    flag: "🇩🇪",
    keywords: [
      "deutschland", "germany", "allemagne", "de", "deu", "ger",
      "berlin", "münchen", "munich", "hamburg", "köln", "cologne",
      "frankfurt", "stuttgart", "düsseldorf", "dortmund", "essen",
      "leipzig", "bremen", "dresden", "hannover", "nürnberg", "nuremberg",
      "duisburg", "bochum", "wuppertal", "bielefeld", "bonn", "münster",
      "mannheim", "augsburg", "karlsruhe", "wiesbaden", "aachen"
    ],
  },

  // ── United Kingdom ──
  {
    code: "GB",
    name: "United Kingdom",
    germanName: "Großbritannien",
    flag: "🇬🇧",
    keywords: [
      "uk", "gb", "gbr", "united kingdom", "großbritannien", "grossbritannien",
      "england", "scotland", "schottland", "wales", "northern ireland", "nordirland",
      "great britain", "london", "manchester", "birmingham", "liverpool", "glasgow",
      "leeds", "edinburgh", "bristol", "sheffield", "newcastle", "belfast",
      "nottingham", "southampton", "leicester", "coventry", "hull", "bradford",
      "cardiff", "stoke-on-trent", "wolverhampton", "plymouth", "derby", "cambridge", "oxford"
    ],
  },

  // ── USA ──
  {
    code: "US",
    name: "United States",
    germanName: "USA",
    flag: "🇺🇸",
    keywords: [
      "usa", "us", "usa.", "u.s.a.", "u.s.", "united states", "vereinigte staaten",
      "amerika", "america", "united states of america"
    ],
  },

  // ── Canada ──
  {
    code: "CA",
    name: "Canada",
    germanName: "Kanada",
    flag: "🇨🇦",
    keywords: ["canada", "kanada", "ca", "can"],
  },

  // ── France ──
  {
    code: "FR",
    name: "France",
    germanName: "Frankreich",
    flag: "🇫🇷",
    keywords: [
      "france", "frankreich", "fr", "fra", "paris", "lyon", "marseille",
      "toulouse", "nice", "nizza", "strasbourg", "strassburg", "bordeaux",
      "lille", "nantes", "rennes", "montpellier", "toulon", "grenoble", "dijon"
    ],
  },

  // ── Italy ──
  {
    code: "IT",
    name: "Italy",
    germanName: "Italien",
    flag: "🇮🇹",
    keywords: [
      "italy", "italien", "italia", "it", "ita", "rom", "rome", "roma",
      "milan", "milano", "napoli", "naples", "turin", "torino", "florence",
      "firenze", "venice", "venedig", "bologna", "palermo", "genoa", "genua",
      "bari", "catania", "verona", "messina", "padua", "trieste"
    ],
  },

  // ── Spain ──
  {
    code: "ES",
    name: "Spain",
    germanName: "Spanien",
    flag: "🇪🇸",
    keywords: [
      "spain", "spanien", "españa", "es", "esp", "madrid", "barcelona",
      "valencia", "seville", "sevilla", "malaga", "zaragoza", "bilbao",
      "palma", "mallorca", "alicante", "murcia", "cordoba", "granada"
    ],
  },

  // ── Netherlands ──
  {
    code: "NL",
    name: "Netherlands",
    germanName: "Niederlande",
    flag: "🇳🇱",
    keywords: [
      "netherlands", "niederlande", "holland", "nl", "nld", "amsterdam",
      "rotterdam", "utrecht", "den haag", "the hague", "eindhoven", "groningen",
      "tilburg", "almere", "breda", "nijmegen"
    ],
  },

  // ── Austria ──
  {
    code: "AT",
    name: "Austria",
    germanName: "Österreich",
    flag: "🇦🇹",
    keywords: [
      "austria", "österreich", "oesterreich", "at", "aut", "wien", "vienna",
      "salzburg", "graz", "innsbruck", "linz", "klagenfurt", "villach", "wels", "st. pölten"
    ],
  },

  // ── Switzerland ──
  {
    code: "CH",
    name: "Switzerland",
    germanName: "Schweiz",
    flag: "🇨🇭",
    keywords: [
      "switzerland", "schweiz", "suisse", "svizzera", "ch", "che", "zurich",
      "zürich", "geneva", "genf", "bern", "basel", "lausanne", "luzern",
      "lucerne", "lugano", "st. gallen", "winterthur"
    ],
  },

  // ── Greece ──
  {
    code: "GR",
    name: "Greece",
    germanName: "Griechenland",
    flag: "🇬🇷",
    keywords: [
      "greece", "griechenland", "hellas", "ellada", "gr", "grc", "athens",
      "athen", "thessaloniki", "patras", "heraklion", "iraklio", "rhodes",
      "rhodos", "chania", "larissa", "volos", "ioannina"
    ],
  },

  // ── Australia ──
  {
    code: "AU",
    name: "Australia",
    germanName: "Australien",
    flag: "🇦🇺",
    keywords: [
      "australia", "australien", "au", "aus", "sydney", "melbourne",
      "brisbane", "perth", "adelaide", "canberra", "gold coast", "hobart", "darwin"
    ],
  },

  // ── Japan ──
  {
    code: "JP",
    name: "Japan",
    germanName: "Japan",
    flag: "🇯🇵",
    keywords: [
      "japan", "jp", "jpn", "tokyo", "tokio", "osaka", "kyoto",
      "yokohama", "nagoya", "sapporo", "fukuoka", "kobe", "kawasaki"
    ],
  },

  // ── Belgium ──
  {
    code: "BE",
    name: "Belgium",
    germanName: "Belgien",
    flag: "🇧🇪",
    keywords: [
      "belgium", "belgien", "belgique", "belgie", "be", "bel", "brussels",
      "brüssel", "bruxelles", "antwerp", "antwerpen", "gent", "ghent", "charleroi", "liege", "lüttich", "bruges", "brügge"
    ],
  },

  // ── Poland ──
  {
    code: "PL",
    name: "Poland",
    germanName: "Polen",
    flag: "🇵🇱",
    keywords: [
      "poland", "polen", "polska", "pl", "pol", "warsaw", "warschau",
      "warszawa", "krakow", "krakau", "gdansk", "wroclaw", "poznan", "lodz", "szczecin"
    ],
  },

  // ── Sweden ──
  {
    code: "SE",
    name: "Sweden",
    germanName: "Schweden",
    flag: "🇸🇪",
    keywords: [
      "sweden", "schweden", "sverige", "se", "swe", "stockholm",
      "gothenburg", "göteborg", "malmo", "malmö", "uppsala", "västerås"
    ],
  },

  // ── Denmark ──
  {
    code: "DK",
    name: "Denmark",
    germanName: "Dänemark",
    flag: "🇩🇰",
    keywords: [
      "denmark", "dänemark", "danmark", "dk", "dnk", "copenhagen",
      "kopenhagen", "aarhus", "odense", "aalborg"
    ],
  },

  // ── Norway ──
  {
    code: "NO",
    name: "Norway",
    germanName: "Norwegen",
    flag: "🇳🇴",
    keywords: [
      "norway", "norwegen", "norge", "no", "nor", "oslo", "bergen",
      "trondheim", "stavanger", "tromsø"
    ],
  },

  // ── Finland ──
  {
    code: "FI",
    name: "Finland",
    germanName: "Finnland",
    flag: "🇫🇮",
    keywords: [
      "finland", "finnland", "suomi", "fi", "fin", "helsinki",
      "espoo", "tampere", "vantaa", "oulu", "turku"
    ],
  },

  // ── Ireland ──
  {
    code: "IE",
    name: "Ireland",
    germanName: "Irland",
    flag: "🇮🇪",
    keywords: [
      "ireland", "irland", "éire", "ie", "irl", "dublin", "cork",
      "galway", "limerick", "waterford"
    ],
  },

  // ── Portugal ──
  {
    code: "PT",
    name: "Portugal",
    germanName: "Portugal",
    flag: "🇵🇹",
    keywords: [
      "portugal", "pt", "prt", "lisbon", "lissabon", "lisboa", "porto",
      "braga", "coimbra", "funchal", "faro"
    ],
  },

  // ── Czech Republic ──
  {
    code: "CZ",
    name: "Czech Republic",
    germanName: "Tschechien",
    flag: "🇨🇿",
    keywords: [
      "czech", "czech republic", "tschechien", "cesko", "cz", "cze",
      "prague", "prag", "praha", "brno", "ostrava", "plzen", "pilsen"
    ],
  },

  // ── Hungary ──
  {
    code: "HU",
    name: "Hungary",
    germanName: "Ungarn",
    flag: "🇭🇺",
    keywords: [
      "hungary", "ungarn", "magyarország", "hu", "hun", "budapest",
      "debrecen", "szeged", "miskolc", "pecs"
    ],
  },

  // ── Romania ──
  {
    code: "RO",
    name: "Romania",
    germanName: "Rumänien",
    flag: "🇷🇴",
    keywords: [
      "romania", "rumänien", "românia", "ro", "rou", "bucharest",
      "bukarest", "cluj", "timisoara", "iasi", "constanta"
    ],
  },

  // ── Croatia ──
  {
    code: "HR",
    name: "Croatia",
    germanName: "Kroatien",
    flag: "🇭🇷",
    keywords: [
      "croatia", "kroatien", "hrvatska", "hr", "hrv", "zagreb",
      "split", "dubrovnik", "rijeka", "osijek", "zadar"
    ],
  },

  // ── Slovakia ──
  {
    code: "SK",
    name: "Slovakia",
    germanName: "Slowakei",
    flag: "🇸🇰",
    keywords: [
      "slovakia", "slowakei", "slovensko", "sk", "svk", "bratislava",
      "kosice", "zilina", "presov"
    ],
  },

  // ── Slovenia ──
  {
    code: "SI",
    name: "Slovenia",
    germanName: "Slowenien",
    flag: "🇸🇮",
    keywords: [
      "slovenia", "slowenien", "slovenija", "si", "svn", "ljubljana", "maribor", "celje", "kranj"
    ],
  },

  // ── Bulgaria ──
  {
    code: "BG",
    name: "Bulgaria",
    germanName: "Bulgarien",
    flag: "🇧🇬",
    keywords: [
      "bulgaria", "bulgarien", "bg", "bgr", "sofia", "plovdiv", "varna", "burgas", "ruse"
    ],
  },

  // ── Lithuania ──
  {
    code: "LT",
    name: "Lithuania",
    germanName: "Litauen",
    flag: "🇱🇹",
    keywords: ["lithuania", "litauen", "lietuva", "lt", "ltu", "vilnius", "kaunas", "klaipeda"],
  },

  // ── Latvia ──
  {
    code: "LV",
    name: "Latvia",
    germanName: "Lettland",
    flag: "🇱🇻",
    keywords: ["latvia", "lettland", "latvija", "lv", "lva", "riga", "daugavpils", "liepaja"],
  },

  // ── Estonia ──
  {
    code: "EE",
    name: "Estonia",
    germanName: "Estland",
    flag: "🇪🇪",
    keywords: ["estonia", "estland", "eesti", "ee", "est", "tallinn", "tartu", "narva"],
  },

  // ── Luxembourg ──
  {
    code: "LU",
    name: "Luxembourg",
    germanName: "Luxemburg",
    flag: "🇱🇺",
    keywords: ["luxembourg", "luxemburg", "lu", "lux"],
  },

  // ── Cyprus ──
  {
    code: "CY",
    name: "Cyprus",
    germanName: "Zypern",
    flag: "🇨🇾",
    keywords: ["cyprus", "zypern", "cy", "cyp", "nicosia", "nikosia", "limassol", "larnaca", "paphos"],
  },

  // ── Malta ──
  {
    code: "MT",
    name: "Malta",
    germanName: "Malta",
    flag: "🇲🇹",
    keywords: ["malta", "mt", "mlt", "valletta", "sliema", "st. julians"],
  },

  // ── Iceland ──
  {
    code: "IS",
    name: "Iceland",
    germanName: "Island",
    flag: "🇮🇸",
    keywords: ["iceland", "island", "is", "isl", "reykjavik", "akureyri"],
  },

  // ── Turkey ──
  {
    code: "TR",
    name: "Turkey",
    germanName: "Türkei",
    flag: "🇹🇷",
    keywords: ["turkey", "türkei", "türkiye", "tr", "tur", "istanbul", "ankara", "izmir", "bursa", "antalya"],
  },

  // ── Liechtenstein ──
  {
    code: "LI",
    name: "Liechtenstein",
    germanName: "Liechtenstein",
    flag: "🇱🇮",
    keywords: ["liechtenstein", "li", "lie", "vaduz", "schaan"],
  },

  // ── Monaco ──
  {
    code: "MC",
    name: "Monaco",
    germanName: "Monaco",
    flag: "🇲🇨",
    keywords: ["monaco", "mc", "mco", "monte carlo"],
  },

  // ── Andorra ──
  {
    code: "AD",
    name: "Andorra",
    germanName: "Andorra",
    flag: "🇦🇩",
    keywords: ["andorra", "ad", "and", "andorra la vella"],
  },

  // ── San Marino ──
  {
    code: "SM",
    name: "San Marino",
    germanName: "San Marino",
    flag: "🇸🇲",
    keywords: ["san marino", "sm", "smr"],
  },

  // ── Vatican ──
  {
    code: "VA",
    name: "Vatican City",
    germanName: "Vatikanstadt",
    flag: "🇻🇦",
    keywords: ["vatican", "vatikan", "vatikanstadt", "va", "vat"],
  },

  // ── Albania ──
  {
    code: "AL",
    name: "Albania",
    germanName: "Albanien",
    flag: "🇦🇱",
    keywords: ["albania", "albanien", "shqipëria", "al", "alb", "tirana", "durres", "vlore"],
  },

  // ── Bosnia ──
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    germanName: "Bosnien und Herzegowina",
    flag: "🇧🇦",
    keywords: ["bosnia", "bosnien", "herzegowina", "ba", "bih", "sarajevo", "banja luka", "mostar"],
  },

  // ── Montenegro ──
  {
    code: "ME",
    name: "Montenegro",
    germanName: "Montenegro",
    flag: "🇲🇪",
    keywords: ["montenegro", "me", "mne", "podgorica", "kotor", "budva"],
  },

  // ── North Macedonia ──
  {
    code: "MK",
    name: "North Macedonia",
    germanName: "Nordmazedonien",
    flag: "🇲🇰",
    keywords: ["north macedonia", "nordmazedonien", "macedonia", "mazedonien", "mk", "mkd", "skopje", "bitola"],
  },

  // ── Serbia ──
  {
    code: "RS",
    name: "Serbia",
    germanName: "Serbien",
    flag: "🇷🇸",
    keywords: ["serbia", "serbien", "srbija", "rs", "srb", "belgrade", "belgrad", "beograd", "novi sad", "nis"],
  },

  // ── Ukraine ──
  {
    code: "UA",
    name: "Ukraine",
    germanName: "Ukraine",
    flag: "🇺🇦",
    keywords: ["ukraine", "ua", "ukr", "kyiv", "kiew", "lviv", "odesa", "odessa", "kharkiv", "dnipro"],
  },

  // ── Moldova ──
  {
    code: "MD",
    name: "Moldova",
    germanName: "Moldawien",
    flag: "🇲🇩",
    keywords: ["moldova", "moldawien", "md", "mda", "chisinau"],
  },

  // ── Kosovo ──
  {
    code: "XK",
    name: "Kosovo",
    germanName: "Kosovo",
    flag: "🇽🇰",
    keywords: ["kosovo", "xk", "kosova", "pristina", "prishtina"],
  },
];

export function resolveDestination(query?: string, cityRates?: any[]): ResolvedDestination | null {
  if (!query) return null;
  const raw = query.trim();
  const q = raw.toLowerCase();
  if (q.length < 2) return null;

  // ── 1. Check custom city / postal rates configured in Admin ──
  if (cityRates && Array.isArray(cityRates) && cityRates.length > 0) {
    const matchedCity = cityRates.find((cr) => {
      const cityName = (cr.cityName || "").trim().toLowerCase();
      const postCode = (cr.postalCode || "").trim().toLowerCase();
      if (!cityName && !postCode) return false;

      const nameMatch =
        cityName &&
        (q === cityName ||
          (cityName.length >= 3 && (new RegExp(`\\b${cityName}\\b`, "i").test(q) || q.startsWith(cityName))));
      const postMatch = postCode && (q === postCode || q.startsWith(postCode));
      return Boolean(nameMatch || postMatch);
    });

    if (matchedCity) {
      const cCode = (matchedCity.countryCode || "DE").toUpperCase();
      const entry = COUNTRY_DICTIONARY.find((c) => c.code === cCode);
      const flag = entry ? entry.flag : "📍";
      const cName = entry ? entry.germanName : cCode;
      const target = matchedCity.cityName || matchedCity.postalCode;
      return {
        countryCode: cCode,
        countryName: cName,
        regionName: target,
        flag,
        label: `${cName} (${target})`,
        matchedRule: "city",
        queryParam: target || q,
      };
    }
  }

  // ── 2. Handle Multi-Part Queries with Delimiters (e.g. "Manchester, UK", "Houston, TX", "London, ON", "Paris, France") ──
  const delimiterParts = q.split(/[,;\/]+/).map((p) => p.trim()).filter(Boolean);
  if (delimiterParts.length >= 2) {
    const cityPart = delimiterParts[0];
    const regionOrCountryPart = delimiterParts[delimiterParts.length - 1];

    // Check if the region part explicitly specifies a US/CA state or province (e.g. "Houston, TX", "London, Ontario")
    const explicitState = findStateOrProvince(regionOrCountryPart);
    if (explicitState) {
      const cName = explicitState.countryCode === "US" ? "USA" : "Kanada";
      return {
        countryCode: explicitState.countryCode,
        countryName: cName,
        regionName: explicitState.name,
        flag: explicitState.flag,
        label: `${cName} (${explicitState.name})`,
        matchedRule: "state",
        queryParam: explicitState.id,
      };
    }

    // Check if the region part specifies a country (e.g. "Manchester, UK", "Miami, USA", "Toronto, Canada")
    const matchedCountry = COUNTRY_DICTIONARY.find(
      (c) => c.code.toLowerCase() === regionOrCountryPart || c.keywords.some((k) => k === regionOrCountryPart)
    );

    if (matchedCountry) {
      // If country is US or CA, check if the city part is a state or city in that country
      if (matchedCountry.code === "US" || matchedCountry.code === "CA") {
        const stateInCountry = findStateOrProvince(cityPart, matchedCountry.code);
        if (stateInCountry) {
          const cName = matchedCountry.code === "US" ? "USA" : "Kanada";
          return {
            countryCode: stateInCountry.countryCode,
            countryName: cName,
            regionName: stateInCountry.name,
            flag: stateInCountry.flag,
            label: `${cName} (${stateInCountry.name})`,
            matchedRule: "state",
            queryParam: stateInCountry.id,
          };
        }
      }

      const formattedCity = cityPart.charAt(0).toUpperCase() + cityPart.slice(1);
      return {
        countryCode: matchedCountry.code,
        countryName: matchedCountry.germanName,
        regionName: formattedCity,
        flag: matchedCountry.flag,
        label: `${matchedCountry.germanName} (${formattedCity})`,
        matchedRule: "country",
        queryParam: cityPart,
      };
    }
  }

  // ── 3. Handle Space-Separated Suffixes (e.g. "Manchester UK", "Houston TX", "Berlin Germany") ──
  const spaceParts = q.split(/\s+/).filter(Boolean);
  if (spaceParts.length >= 2) {
    const lastWord = spaceParts[spaceParts.length - 1];
    const prefixWords = spaceParts.slice(0, -1).join(" ");

    // Check if ends with a known state code (e.g. "Houston TX", "Toronto ON")
    const KNOWN_STATE_CODES = new Set([
      "tx", "fl", "ny", "il", "pa", "oh", "mi", "nc", "nj", "va", "wa", "az", "tn",
      "mo", "md", "wi", "co", "mn", "sc", "al", "la", "ky", "or", "ok", "ct", "ut",
      "ia", "nv", "ar", "ms", "ks", "nm", "ne", "wv", "id", "nh", "mt", "ri", "sd",
      "nd", "ak", "dc", "vt", "wy", "ab", "bc", "mb", "nb", "nl", "ns", "nt", "nu",
      "on", "pe", "qc", "sk", "yt",
    ]);

    if (KNOWN_STATE_CODES.has(lastWord)) {
      const stateBySuffix = findStateOrProvince(lastWord);
      if (stateBySuffix) {
        const cName = stateBySuffix.countryCode === "US" ? "USA" : "Kanada";
        return {
          countryCode: stateBySuffix.countryCode,
          countryName: cName,
          regionName: stateBySuffix.name,
          flag: stateBySuffix.flag,
          label: `${cName} (${stateBySuffix.name})`,
          matchedRule: "state",
          queryParam: stateBySuffix.id,
        };
      }
    }

    // Check if ends with a country indicator (e.g. "Manchester UK", "Berlin Germany", "Paris France")
    const countryByLastWord = COUNTRY_DICTIONARY.find(
      (c) =>
        c.code.toLowerCase() === lastWord ||
        c.keywords.some((k) => k === lastWord && k.length <= 4)
    );
    if (countryByLastWord) {
      const formattedCity = prefixWords.charAt(0).toUpperCase() + prefixWords.slice(1);
      return {
        countryCode: countryByLastWord.code,
        countryName: countryByLastWord.germanName,
        regionName: formattedCity,
        flag: countryByLastWord.flag,
        label: `${countryByLastWord.germanName} (${formattedCity})`,
        matchedRule: "country",
        queryParam: prefixWords,
      };
    }
  }

  // ── 4. Major World & European Cities / Country Keywords in COUNTRY_DICTIONARY ──
  // (Crucial: Matches major world cities like "Manchester", "London", "Paris", "Berlin" BEFORE US/CA small towns!)
  for (const item of COUNTRY_DICTIONARY) {
    // Check exact code (e.g. "GB", "DE", "FR")
    if (q === item.code.toLowerCase()) {
      return {
        countryCode: item.code,
        countryName: item.germanName,
        flag: item.flag,
        label: item.germanName,
        matchedRule: "country",
        queryParam: item.code,
      };
    }

    // Check keywords (exact match or whole-word match)
    const matchedKeyword = item.keywords.find((k) => {
      const kLower = k.toLowerCase();
      if (q === kLower) return true;
      if (kLower.length >= 3 && new RegExp(`^${kLower}\\b`, "i").test(q)) return true;
      return false;
    });

    if (matchedKeyword) {
      const isCityName =
        !["uk", "gb", "de", "fr", "it", "es", "at", "ch", "pl", "nl", "be", "gr", "us", "usa", "ca"].includes(
          matchedKeyword
        ) &&
        matchedKeyword !== item.name.toLowerCase() &&
        matchedKeyword !== item.germanName.toLowerCase();

      const label = isCityName
        ? `${item.germanName} (${matchedKeyword.charAt(0).toUpperCase() + matchedKeyword.slice(1)})`
        : item.germanName;

      return {
        countryCode: item.code,
        countryName: item.germanName,
        regionName: isCityName ? matchedKeyword : undefined,
        flag: item.flag,
        label,
        matchedRule: isCityName ? "city" : "country",
        queryParam: q,
      };
    }
  }

  // ── 5. Check US States & Canadian Provinces (or major North American cities) ──
  const stateMatch = findStateOrProvince(q);
  if (stateMatch) {
    const cName = stateMatch.countryCode === "US" ? "USA" : "Kanada";
    return {
      countryCode: stateMatch.countryCode,
      countryName: cName,
      regionName: stateMatch.name,
      flag: stateMatch.flag,
      label: `${cName} (${stateMatch.name})`,
      matchedRule: "state",
      queryParam: stateMatch.id,
    };
  }

  // ── 6. Check SHIPPING_COUNTRIES list (Fallback for any country in the 51-country shipping list) ──
  const matchedShippingCountry = SHIPPING_COUNTRIES.find((c) => {
    const cLower = c.code.toLowerCase();
    const nameLower = c.name.toLowerCase();
    const germanLower = c.germanName.toLowerCase();
    const localLower = c.localName.toLowerCase();

    return (
      q === cLower ||
      q === nameLower ||
      q === germanLower ||
      q === localLower ||
      (q.length >= 4 && (nameLower.startsWith(q) || germanLower.startsWith(q) || localLower.startsWith(q)))
    );
  });

  if (matchedShippingCountry && matchedShippingCountry.code !== "WORLD") {
    return {
      countryCode: matchedShippingCountry.code,
      countryName: matchedShippingCountry.germanName,
      flag: matchedShippingCountry.flag,
      label: matchedShippingCountry.germanName,
      matchedRule: "country",
      queryParam: matchedShippingCountry.code,
    };
  }

  // ── 7. Postal Code Heuristics ──
  // UK Postal Code Heuristic (e.g. "SW1A 1AA", "M1 1AD", "EC1A 1BB")
  if (/^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i.test(q)) {
    return {
      countryCode: "GB",
      countryName: "Großbritannien",
      flag: "🇬🇧",
      label: `Großbritannien (${raw.toUpperCase()})`,
      matchedRule: "city",
      queryParam: raw.toUpperCase(),
    };
  }

  // German 5-digit PLZ Heuristic (e.g. "10115", "80331", "20095")
  if (/^[0-9]{5}$/.test(q)) {
    return {
      countryCode: "DE",
      countryName: "Deutschland",
      flag: "🇩🇪",
      label: `Deutschland (${raw})`,
      matchedRule: "city",
      queryParam: raw,
    };
  }

  // ── 8. No recognized rate configuration -> Fallback to Worldwide delivery available ──
  return null;
}

export interface ShippingCountryItem {
  code: string;
  name: string;
  germanName: string;
  localName: string;
  flag: string;
  region: "DE" | "EU" | "GB" | "NA" | "OTHER_EUROPE" | "OTHER_WORLD";
  regionLabel: string;
  defaultDeliveryTime: string;
}

export const SHIPPING_COUNTRIES: ShippingCountryItem[] = [
  // ── 1. DEUTSCHLAND (Inland) ──
  {
    code: "DE",
    name: "Germany",
    germanName: "Deutschland",
    localName: "Deutschland",
    flag: "🇩🇪",
    region: "DE",
    regionLabel: "Deutschland (Inland)",
    defaultDeliveryTime: "Within 1 week",
  },

  // ── 2. NORDAMERIKA (USA & KANADA) ──
  {
    code: "US",
    name: "United States",
    germanName: "Vereinigte Staaten (USA)",
    localName: "United States",
    flag: "🇺🇸",
    region: "NA",
    regionLabel: "Nordamerika (USA)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "CA",
    name: "Canada",
    germanName: "Kanada",
    localName: "Canada",
    flag: "🇨🇦",
    region: "NA",
    regionLabel: "Nordamerika (Kanada)",
    defaultDeliveryTime: "2-3 weeks",
  },

  // ── 3. VEREINIGTES KÖNIGREICH (UK) ──
  {
    code: "GB",
    name: "United Kingdom",
    germanName: "Großbritannien (UK)",
    localName: "United Kingdom",
    flag: "🇬🇧",
    region: "GB",
    regionLabel: "Großbritannien (UK)",
    defaultDeliveryTime: "1-2 weeks",
  },

  // ── 4. EUROPÄISCHE UNION (EU-MITGLIEDSTAATEN) ──
  {
    code: "AT",
    name: "Austria",
    germanName: "Österreich",
    localName: "Österreich",
    flag: "🇦🇹",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "Within 1 week",
  },
  {
    code: "FR",
    name: "France",
    germanName: "Frankreich",
    localName: "France",
    flag: "🇫🇷",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "NL",
    name: "Netherlands",
    germanName: "Niederlande",
    localName: "Nederland",
    flag: "🇳🇱",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "Within 1 week",
  },
  {
    code: "BE",
    name: "Belgium",
    germanName: "Belgien",
    localName: "Belgique / België",
    flag: "🇧🇪",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "Within 1 week",
  },
  {
    code: "IT",
    name: "Italy",
    germanName: "Italien",
    localName: "Italia",
    flag: "🇮🇹",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "ES",
    name: "Spain",
    germanName: "Spanien",
    localName: "España",
    flag: "🇪🇸",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "PT",
    name: "Portugal",
    germanName: "Portugal",
    localName: "Portugal",
    flag: "🇵🇹",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "GR",
    name: "Greece",
    germanName: "Griechenland",
    localName: "Ελλάδα",
    flag: "🇬🇷",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "PL",
    name: "Poland",
    germanName: "Polen",
    localName: "Polska",
    flag: "🇵🇱",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "SE",
    name: "Sweden",
    germanName: "Schweden",
    localName: "Sverige",
    flag: "🇸🇪",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "DK",
    name: "Denmark",
    germanName: "Dänemark",
    localName: "Danmark",
    flag: "🇩🇰",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "FI",
    name: "Finland",
    germanName: "Finnland",
    localName: "Suomi",
    flag: "🇫🇮",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "IE",
    name: "Ireland",
    germanName: "Irland",
    localName: "Éire / Ireland",
    flag: "🇮🇪",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "CZ",
    name: "Czech Republic",
    germanName: "Tschechien",
    localName: "Česko",
    flag: "🇨🇿",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "LU",
    name: "Luxembourg",
    germanName: "Luxemburg",
    localName: "Lëtzebuerg / Luxembourg",
    flag: "🇱🇺",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "Within 1 week",
  },
  {
    code: "HU",
    name: "Hungary",
    germanName: "Ungarn",
    localName: "Magyarország",
    flag: "🇭🇺",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "RO",
    name: "Romania",
    germanName: "Rumänien",
    localName: "România",
    flag: "🇷🇴",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "SK",
    name: "Slovakia",
    germanName: "Slowakei",
    localName: "Slovensko",
    flag: "🇸🇰",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "HR",
    name: "Croatia",
    germanName: "Kroatien",
    localName: "Hrvatska",
    flag: "🇭🇷",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "SI",
    name: "Slovenia",
    germanName: "Slowenien",
    localName: "Slovenija",
    flag: "🇸🇮",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "BG",
    name: "Bulgaria",
    germanName: "Bulgarien",
    localName: "България",
    flag: "🇧🇬",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "CY",
    name: "Cyprus",
    germanName: "Zypern",
    localName: "Κύπρος",
    flag: "🇨🇾",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "MT",
    name: "Malta",
    germanName: "Malta",
    localName: "Malta",
    flag: "🇲🇹",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "EE",
    name: "Estonia",
    germanName: "Estland",
    localName: "Eesti",
    flag: "🇪🇪",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "LV",
    name: "Latvia",
    germanName: "Lettland",
    localName: "Latvija",
    flag: "🇱🇻",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "LT",
    name: "Lithuania",
    germanName: "Litauen",
    localName: "Lietuva",
    flag: "🇱🇹",
    region: "EU",
    regionLabel: "Europäische Union",
    defaultDeliveryTime: "1-2 weeks",
  },

  // ── 5. WEITERE EUROPÄISCHE LÄNDER (EFTA, MIKROSTAATEN & BALKAN) ──
  {
    code: "CH",
    name: "Switzerland",
    germanName: "Schweiz",
    localName: "Schweiz / Suisse",
    flag: "🇨🇭",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (EFTA)",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "NO",
    name: "Norway",
    germanName: "Norwegen",
    localName: "Norge",
    flag: "🇳🇴",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (EFTA)",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "IS",
    name: "Iceland",
    germanName: "Island",
    localName: "Ísland",
    flag: "🇮🇸",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (EFTA)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "LI",
    name: "Liechtenstein",
    germanName: "Liechtenstein",
    localName: "Liechtenstein",
    flag: "🇱🇮",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (EFTA)",
    defaultDeliveryTime: "Within 1 week",
  },
  {
    code: "MC",
    name: "Monaco",
    germanName: "Monaco",
    localName: "Monaco",
    flag: "🇲🇨",
    region: "OTHER_EUROPE",
    regionLabel: "Europa",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "AD",
    name: "Andorra",
    germanName: "Andorra",
    localName: "Andorra",
    flag: "🇦🇩",
    region: "OTHER_EUROPE",
    regionLabel: "Europa",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "SM",
    name: "San Marino",
    germanName: "San Marino",
    localName: "San Marino",
    flag: "🇸🇲",
    region: "OTHER_EUROPE",
    regionLabel: "Europa",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "VA",
    name: "Vatican City",
    germanName: "Vatikanstadt",
    localName: "Città del Vaticano",
    flag: "🇻🇦",
    region: "OTHER_EUROPE",
    regionLabel: "Europa",
    defaultDeliveryTime: "1-2 weeks",
  },
  {
    code: "AL",
    name: "Albania",
    germanName: "Albanien",
    localName: "Shqipëria",
    flag: "🇦🇱",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Südost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    germanName: "Bosnien und Herzegowina",
    localName: "Bosna i Hercegovina",
    flag: "🇧🇦",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Südost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "ME",
    name: "Montenegro",
    germanName: "Montenegro",
    localName: "Crna Gora",
    flag: "🇲🇪",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Südost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "MK",
    name: "North Macedonia",
    germanName: "Nordmazedonien",
    localName: "Северна Македонија",
    flag: "🇲🇰",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Südost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "RS",
    name: "Serbia",
    germanName: "Serbien",
    localName: "Srbija",
    flag: "🇷🇸",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Südost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "TR",
    name: "Turkey",
    germanName: "Türkei",
    localName: "Türkiye",
    flag: "🇹🇷",
    region: "OTHER_EUROPE",
    regionLabel: "Europa / Eurasien",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "UA",
    name: "Ukraine",
    germanName: "Ukraine",
    localName: "Україна",
    flag: "🇺🇦",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Ost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "MD",
    name: "Moldova",
    germanName: "Moldawien",
    localName: "Moldova",
    flag: "🇲🇩",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Ost)",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "XK",
    name: "Kosovo",
    germanName: "Kosovo",
    localName: "Kosova",
    flag: "🇽🇰",
    region: "OTHER_EUROPE",
    regionLabel: "Europa (Südost)",
    defaultDeliveryTime: "2-3 weeks",
  },

  // ── 6. WEITERE REGIONEN & WELTWEIT ──
  {
    code: "AU",
    name: "Australia",
    germanName: "Australien",
    localName: "Australia",
    flag: "🇦🇺",
    region: "OTHER_WORLD",
    regionLabel: "Ozeanien",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "JP",
    name: "Japan",
    germanName: "Japan",
    localName: "日本",
    flag: "🇯🇵",
    region: "OTHER_WORLD",
    regionLabel: "Asien",
    defaultDeliveryTime: "2-3 weeks",
  },
  {
    code: "WORLD",
    name: "Worldwide",
    germanName: "Weltweit (Andere Länder)",
    localName: "Worldwide (Other Countries)",
    flag: "🌍",
    region: "OTHER_WORLD",
    regionLabel: "Weltweit",
    defaultDeliveryTime: "2-4 weeks",
  },
];
