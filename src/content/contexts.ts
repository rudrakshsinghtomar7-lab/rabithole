// Per-topic "context layer": what the reel's stage shows above the lesson.
// Map subjects show where events happened or where an idea came from; data subjects
// show an instrument panel. Plain data, kept apart from UI. Coordinates are approximate
// (city level). Figures marked `fictional` belong to the lesson's invented scenarios.

export interface Place {
  id: string
  name: string
  lon: number
  lat: number
  year?: string
  who?: string
  note: string
  kind: 'origin' | 'event' | 'place'
}

export type MapStyle = 'historical' | 'ideas' | 'terrain'

export interface MapContext {
  kind: 'map'
  style: MapStyle
  places: Place[]
  /** Place ids in order: the lineage of an idea or the sequence of events. */
  route?: string[]
  focusByReel: Record<string, string>
  /** Minimum view span in degrees, so single places don't zoom absurdly far in. */
  minSpan?: number
  /** Compare two countries' apparent size under Mercator vs an equal-area projection. */
  projectionCompare?: { a: { id: string; label: string; area: string }; b: { id: string; label: string; area: string } }
  caption?: string
  /** Draw the route line (off when places are unrelated events from different topics). */
  drawRoute?: boolean
}

export type Chart =
  | { type: 'line'; series: number[]; compare?: number[]; highlight?: [number, number]; from?: string; to?: string }
  | { type: 'bars'; bars: { label: string; value: number; display: string; tone?: 'accent' | 'muted' }[] }
  | { type: 'groups'; items: { label: string; note: string; tone?: 'accent' | 'muted' }[] }

export interface InstrumentTab {
  id: string
  label: string
  value: string
  unit?: string
  caption: string
  chart?: Chart
  fictional?: boolean
}

export interface InstrumentContext {
  kind: 'instrument'
  title: string
  /** Where the idea came from, as a one-line credit. */
  origin?: string
  tabs: InstrumentTab[]
  tabByReel?: Record<string, string>
}

export type TopicContext = MapContext | InstrumentContext

const range = (n: number) => Array.from({ length: n }, (_, i) => i)
const round = (x: number) => Math.round(x * 100) / 100

// ───────────── Philosophy: where the ideas came from ─────────────
const london = { lon: -0.13, lat: 51.51 }

// ───────────── Contexts ─────────────
export const topicContexts: Record<string, TopicContext> = {
  'phil-ship': {
    kind: 'map', style: 'ideas', minSpan: 34,
    places: [
      { id: 'athens', name: 'Athens', lon: 23.73, lat: 37.98, kind: 'place', note: 'Plutarch reports the Athenians kept Theseus’s ship, replacing decayed timbers — the case philosophers argued over.' },
      { id: 'chaeronea', name: 'Chaeronea', lon: 22.85, lat: 38.49, year: 'c. 75 CE', who: 'Plutarch', kind: 'origin', note: 'Plutarch, writing from his home town, records the puzzle in his Life of Theseus.' },
      { id: 'london-hobbes', name: 'London', ...london, year: '1655', who: 'Thomas Hobbes', kind: 'origin', note: 'De Corpore adds the twist: what if the old planks are reassembled into a second ship?' },
    ],
    route: ['chaeronea', 'london-hobbes'],
    focusByReel: { 'phil-ship-1': 'athens', 'phil-ship-2': 'chaeronea', 'phil-ship-3': 'chaeronea', 'phil-ship-4': 'london-hobbes', 'phil-ship-5': 'london-hobbes' },
  },
  'phil-memory': {
    kind: 'map', style: 'ideas', minSpan: 14,
    places: [
      { id: 'london-locke', name: 'London', ...london, year: '1694', who: 'John Locke', kind: 'origin', note: 'The second edition of the Essay adds “Of Identity and Diversity”: the person goes where consciousness goes.' },
      { id: 'london-butler', name: 'London', ...london, year: '1736', who: 'Joseph Butler', kind: 'origin', note: 'Butler objects that memory presupposes identity, so it can’t constitute it.' },
      { id: 'edinburgh-reid', name: 'Edinburgh', lon: -3.19, lat: 55.95, year: '1785', who: 'Thomas Reid', kind: 'origin', note: 'Essays on the Intellectual Powers of Man, published here, sets out the brave officer objection.' },
    ],
    route: ['london-locke', 'london-butler', 'edinburgh-reid'],
    focusByReel: { 'phil-memory-1': 'london-locke', 'phil-memory-2': 'london-locke', 'phil-memory-3': 'london-locke', 'phil-memory-4': 'edinburgh-reid', 'phil-memory-5': 'edinburgh-reid' },
  },
  'phil-fission': {
    kind: 'map', style: 'ideas', minSpan: 14,
    places: [
      { id: 'london-locke2', name: 'London', ...london, year: '1694', who: 'John Locke', kind: 'origin', note: 'Locke’s memory criterion — the view Parfit’s cases push to breaking point.' },
      { id: 'oxford-parfit', name: 'Oxford', lon: -1.26, lat: 51.75, year: '1984', who: 'Derek Parfit', kind: 'origin', note: 'Reasons and Persons (Oxford University Press) argues identity isn’t what matters — Relation R is.' },
    ],
    route: ['london-locke2', 'oxford-parfit'],
    focusByReel: { 'phil-fission-1': 'oxford-parfit', 'phil-fission-2': 'oxford-parfit', 'phil-fission-3': 'oxford-parfit', 'phil-fission-4': 'oxford-parfit' },
  },

  // ───────────── History: where it happened ─────────────
  'hist-kadesh': {
    kind: 'map', style: 'historical', minSpan: 16,
    caption: 'Modern coastlines · places as named at the time',
    places: [
      { id: 'kadesh', name: 'Kadesh', lon: 36.52, lat: 34.56, year: 'c. 1274 BCE', kind: 'event', note: 'Ramesses II’s Egyptian army meets Muwatalli II’s Hittites by the Orontes River.' },
      { id: 'thebes', name: 'Thebes (Karnak, Luxor)', lon: 32.66, lat: 25.72, year: 'after 1274 BCE', kind: 'event', note: 'Ramesses has his victory carved on temple walls here and elsewhere in Egypt.' },
      { id: 'abusimbel', name: 'Abu Simbel', lon: 31.63, lat: 22.34, kind: 'place', note: 'Another temple carrying the Egyptian account of the battle.' },
      { id: 'hattusa', name: 'Hattusa', lon: 34.62, lat: 40.02, year: 'c. 1259 BCE', kind: 'event', note: 'The Hittite capital, where clay tablets of the peace treaty were found.' },
    ],
    route: ['kadesh', 'thebes', 'hattusa'],
    focusByReel: { 'hist-kadesh-1': 'kadesh', 'hist-kadesh-2': 'kadesh', 'hist-kadesh-3': 'kadesh', 'hist-kadesh-4': 'thebes', 'hist-kadesh-5': 'hattusa' },
  },
  'hist-causes': {
    kind: 'map', style: 'historical', minSpan: 18,
    caption: 'Modern coastlines · the July Crisis, 1914',
    places: [
      { id: 'sarajevo', name: 'Sarajevo', lon: 18.41, lat: 43.86, year: '28 June', kind: 'event', note: 'Archduke Franz Ferdinand is assassinated.' },
      { id: 'vienna', name: 'Vienna', lon: 16.37, lat: 48.21, year: '23 July', kind: 'event', note: 'Austria-Hungary issues its ultimatum to Serbia.' },
      { id: 'belgrade', name: 'Belgrade', lon: 20.46, lat: 44.82, year: '28 July', kind: 'event', note: 'Austria-Hungary declares war on Serbia.' },
      { id: 'stpetersburg', name: 'St Petersburg', lon: 30.31, lat: 59.94, year: '30 July', kind: 'event', note: 'Russia orders general mobilisation.' },
      { id: 'berlin', name: 'Berlin', lon: 13.4, lat: 52.52, year: '1–3 Aug', kind: 'event', note: 'Germany declares war on Russia, then France.' },
      { id: 'brussels', name: 'Belgium', lon: 4.35, lat: 50.85, year: '4 Aug', kind: 'event', note: 'Germany invades Belgium.' },
      { id: 'london1914', name: 'London', ...london, year: '4 Aug', kind: 'event', note: 'Britain declares war on Germany.' },
    ],
    route: ['sarajevo', 'vienna', 'belgrade', 'stpetersburg', 'berlin', 'brussels', 'london1914'],
    focusByReel: { 'hist-causes-1': 'sarajevo', 'hist-causes-2': 'vienna', 'hist-causes-3': 'belgrade', 'hist-causes-4': 'berlin' },
  },
  'hist-rome': {
    kind: 'map', style: 'historical', minSpan: 20,
    caption: 'Modern coastlines · places as named at the time',
    places: [
      { id: 'ravenna', name: 'Ravenna', lon: 12.2, lat: 44.42, year: '476 CE', kind: 'event', note: 'Odoacer deposes Romulus Augustulus, the last emperor in the West.' },
      { id: 'rome', name: 'Rome', lon: 12.5, lat: 41.9, kind: 'place', note: 'The old capital — and the symbol both “fall” and “transformation” stories are told about.' },
      { id: 'constantinople', name: 'Constantinople', lon: 28.98, lat: 41.01, year: 'to 1453', kind: 'event', note: 'The Eastern Roman Empire continues here for nearly a thousand more years.' },
    ],
    route: ['rome', 'ravenna', 'constantinople'],
    focusByReel: { 'hist-rome-1': 'ravenna', 'hist-rome-2': 'rome', 'hist-rome-3': 'rome', 'hist-rome-4': 'constantinople' },
  },

  // ───────────── Political science: where the ideas came from ─────────────
  'pol-legitimacy': {
    kind: 'map', style: 'ideas', minSpan: 18,
    places: [{ id: 'munich', name: 'Munich', lon: 11.58, lat: 48.14, year: '1919', who: 'Max Weber', kind: 'origin', note: '“Politics as a Vocation”, a lecture to students, defines the state and the three types of legitimate authority.' }],
    focusByReel: { 'pol-legitimacy-1': 'munich', 'pol-legitimacy-2': 'munich', 'pol-legitimacy-3': 'munich', 'pol-legitimacy-4': 'munich', 'pol-legitimacy-5': 'munich' },
  },
  'pol-elections': {
    kind: 'map', style: 'ideas',
    places: [
      { id: 'paris-duverger', name: 'Paris', lon: 2.35, lat: 48.86, year: '1951', who: 'Maurice Duverger', kind: 'origin', note: 'Les Partis politiques links plurality rule to two-party systems.' },
      { id: 'wellington', name: 'Wellington', lon: 174.78, lat: -41.29, year: '1993–96', kind: 'event', note: 'New Zealand votes to replace first-past-the-post with MMP, first used in 1996.' },
    ],
    route: ['paris-duverger', 'wellington'],
    focusByReel: { 'pol-elections-1': 'paris-duverger', 'pol-elections-2': 'paris-duverger', 'pol-elections-3': 'paris-duverger', 'pol-elections-4': 'wellington' },
  },
  'pol-veto': {
    kind: 'map', style: 'ideas', minSpan: 16,
    places: [
      { id: 'sandiego', name: 'San Diego', lon: -117.16, lat: 32.72, year: '1999', who: 'Arend Lijphart', kind: 'origin', note: 'Patterns of Democracy contrasts majoritarian and consensus democracies.' },
      { id: 'losangeles', name: 'Los Angeles', lon: -118.24, lat: 34.05, year: '2002', who: 'George Tsebelis', kind: 'origin', note: 'Veto Players: the more actors who must agree, the harder it is to change policy.' },
    ],
    route: ['sandiego', 'losangeles'],
    focusByReel: { 'pol-veto-1': 'losangeles', 'pol-veto-2': 'losangeles', 'pol-veto-3': 'sandiego', 'pol-veto-4': 'losangeles' },
  },

  // ───────────── Geography: the places themselves ─────────────
  'geo-site': {
    kind: 'map', style: 'terrain',
    places: [
      { id: 'paris-cite', name: 'Île de la Cité, Paris', lon: 2.35, lat: 48.85, kind: 'place', note: 'Site: a defensible island and an easy crossing of the Seine.' },
      { id: 'singapore', name: 'Singapore', lon: 103.82, lat: 1.35, kind: 'place', note: 'Situation: at the southern end of the Strait of Malacca.' },
      { id: 'malacca', name: 'Strait of Malacca', lon: 100.5, lat: 3.5, kind: 'place', note: 'The sea lane linking the Indian Ocean and the South China Sea.' },
    ],
    focusByReel: { 'geo-site-1': 'singapore', 'geo-site-2': 'paris-cite', 'geo-site-3': 'paris-cite', 'geo-site-4': 'malacca' },
  },
  'geo-projection': {
    kind: 'map', style: 'terrain',
    places: [
      { id: 'greenland', name: 'Greenland', lon: -41, lat: 72, kind: 'place', note: 'About 2.17 million km².' },
      { id: 'drc', name: 'DR Congo', lon: 23.6, lat: -2.9, kind: 'place', note: 'About 2.34 million km² — slightly larger than Greenland.' },
      { id: 'duisburg', name: 'Duisburg', lon: 6.76, lat: 51.43, year: '1569', who: 'Gerardus Mercator', kind: 'origin', note: 'Mercator publishes his navigational world map here.' },
    ],
    projectionCompare: { a: { id: '304', label: 'Greenland', area: '2.17M km²' }, b: { id: '180', label: 'DR Congo', area: '2.34M km²' } },
    focusByReel: { 'geo-projection-1': 'greenland', 'geo-projection-2': 'drc', 'geo-projection-3': 'duisburg', 'geo-projection-4': 'greenland' },
  },
  'geo-rainshadow': {
    kind: 'map', style: 'terrain',
    places: [
      { id: 'ghats', name: 'Western Ghats', lon: 74.0, lat: 15.0, kind: 'place', note: 'Windward: monsoon air rises and drops heavy rain.' },
      { id: 'deccan', name: 'Deccan Plateau', lon: 77.5, lat: 17.5, kind: 'place', note: 'Leeward: much drier, in the rain shadow.' },
      { id: 'sierra', name: 'Sierra Nevada', lon: -119.3, lat: 37.6, kind: 'place', note: 'Pacific air rises over the range and waters its western slopes.' },
      { id: 'deathvalley', name: 'Death Valley', lon: -116.9, lat: 36.5, kind: 'place', note: 'In the rain shadow: among the driest places in North America.' },
      { id: 'atacama', name: 'Atacama', lon: -69.3, lat: -24.0, kind: 'place', note: 'Dry for several reasons at once — Andes, cold current, high pressure.' },
    ],
    focusByReel: { 'geo-rainshadow-1': 'ghats', 'geo-rainshadow-2': 'deccan', 'geo-rainshadow-3': 'deathvalley', 'geo-rainshadow-4': 'atacama' },
  },

  // ───────────── Economics: instruments ─────────────
  'ecn-opportunity': {
    kind: 'instrument', title: 'Opportunity cost', origin: 'Bastiat · Paris, 1850',
    tabs: [
      { id: 'evening', label: 'Priya’s evening', value: '€60', caption: 'The “free” concert costs her next-best use of the evening.', fictional: true, chart: { type: 'bars', bars: [{ label: 'Concert ticket', value: 0, display: '€0', tone: 'muted' }, { label: 'Café shift forgone', value: 60, display: '€60', tone: 'accent' }] } },
      { id: 'degree', label: 'A degree', value: '€102,000', caption: 'Illustrative: three years of €9k tuition plus €25k a year of wages not earned.', fictional: true, chart: { type: 'bars', bars: [{ label: 'Tuition', value: 27, display: '€27k' }, { label: 'Wages forgone', value: 75, display: '€75k', tone: 'accent' }] } },
      { id: 'window', label: 'Broken window', value: 'Seen · unseen', caption: 'Bastiat’s point: count what the money would otherwise have bought.', chart: { type: 'groups', items: [{ label: 'Seen', note: 'The glazier is paid to replace the window.' }, { label: 'Unseen', note: 'The shoemaker loses a sale.', tone: 'accent' }, { label: 'Net', note: 'A window instead of a window and shoes.', tone: 'muted' }] } },
    ],
    tabByReel: { 'ecn-opportunity-1': 'evening', 'ecn-opportunity-2': 'evening', 'ecn-opportunity-3': 'degree', 'ecn-opportunity-4': 'window', 'ecn-opportunity-5': 'evening' },
  },
  'ecn-comparative': {
    kind: 'instrument', title: 'Comparative advantage', origin: 'Ricardo · London, 1817',
    tabs: [
      { id: 'cost', label: 'Wine’s real cost', value: '0.89', unit: 'vs 1.2 cloth', caption: 'Cloth given up per unit of wine. Portugal gives up less, so it has the comparative advantage in wine.', chart: { type: 'bars', bars: [{ label: 'Portugal', value: 0.89, display: '0.89', tone: 'accent' }, { label: 'England', value: 1.2, display: '1.20' }] } },
      { id: 'portugal', label: 'Portugal', value: '90 · 80', unit: 'workers', caption: 'Labour for a year to make a fixed quantity of cloth · wine.', chart: { type: 'bars', bars: [{ label: 'Cloth', value: 90, display: '90' }, { label: 'Wine', value: 80, display: '80', tone: 'accent' }] } },
      { id: 'england', label: 'England', value: '100 · 120', unit: 'workers', caption: 'Worse at both — but cloth is relatively cheap here.', chart: { type: 'bars', bars: [{ label: 'Cloth', value: 100, display: '100', tone: 'accent' }, { label: 'Wine', value: 120, display: '120' }] } },
    ],
    tabByReel: { 'ecn-comparative-2': 'cost', 'ecn-comparative-3': 'portugal', 'ecn-comparative-4': 'cost' },
  },
  'ecn-externalities': {
    kind: 'instrument', title: 'Social cost', origin: 'Pigou · Cambridge, 1920',
    tabs: [
      { id: 'fabric', label: 'The fabric', value: '€11', unit: 'per metre', caption: 'Illustrative: €8 private cost plus €3 of harm downstream.', fictional: true, chart: { type: 'bars', bars: [{ label: 'Private cost', value: 8, display: '€8' }, { label: 'Cost to the village', value: 3, display: '€3', tone: 'accent' }, { label: 'Social cost', value: 11, display: '€11', tone: 'muted' }] } },
      { id: 'london', label: 'London', value: 'Feb 2003', caption: 'Central London introduces a congestion charge — drivers pay part of the delay they impose on others.', chart: { type: 'groups', items: [{ label: 'Charge', note: 'A daily fee to drive into the zone.' }, { label: 'Aim', note: 'Price the congestion each trip adds.', tone: 'accent' }] } },
    ],
    tabByReel: { 'ecn-externalities-3': 'london' },
  },

  // ───────────── Finance: instruments ─────────────
  'fin-compound': {
    kind: 'instrument', title: '€1,000 at 5% for 30 years', origin: 'Rule of 72 · Pacioli, Venice, 1494',
    tabs: [
      { id: 'compound', label: 'Compound', value: '€4,322', caption: 'Interest on interest: each year’s gain joins the base.', chart: { type: 'line', series: range(31).map((t) => round(1000 * 1.05 ** t)), compare: range(31).map((t) => 1000 + 50 * t), highlight: [20, 30], from: 'Year 0', to: 'Year 30' } },
      { id: 'simple', label: 'Simple', value: '€2,500', caption: 'Interest only on the original €1,000 — a straight line.', chart: { type: 'line', series: range(31).map((t) => 1000 + 50 * t), compare: range(31).map((t) => round(1000 * 1.05 ** t)), from: 'Year 0', to: 'Year 30' } },
      { id: 'gap', label: 'The gap', value: '€1,822', caption: 'Most of the difference arrives in the last decade.', chart: { type: 'line', series: range(31).map((t) => round(1000 * 1.05 ** t - (1000 + 50 * t))), highlight: [20, 30], from: 'Year 0', to: 'Year 30' } },
    ],
    tabByReel: { 'fin-compound-1': 'compound', 'fin-compound-3': 'simple', 'fin-compound-4': 'compound', 'fin-compound-5': 'gap' },
  },
  'fin-real': {
    kind: 'instrument', title: 'Saving at 4%, prices rising 6%', origin: 'Fisher · New Haven, 1930',
    tabs: [
      { id: 'real', label: 'Real', value: '−1.9%', unit: 'a year', caption: 'What €1,000 can buy, in today’s money, over 10 years.', chart: { type: 'line', series: range(11).map((t) => round(1000 * (1.04 / 1.06) ** t)), highlight: [0, 10], from: 'Now', to: '10 years' } },
      { id: 'nominal', label: 'Nominal', value: '+4%', unit: 'a year', caption: 'The balance in euros keeps rising…', chart: { type: 'line', series: range(11).map((t) => round(1000 * 1.04 ** t)), from: 'Now', to: '10 years' } },
      { id: 'prices', label: 'Prices', value: '+6%', unit: 'a year', caption: '…but prices rise faster.', chart: { type: 'line', series: range(11).map((t) => round(1000 * 1.06 ** t)), compare: range(11).map((t) => round(1000 * 1.04 ** t)), from: 'Now', to: '10 years' } },
    ],
    tabByReel: { 'fin-real-1': 'real', 'fin-real-2': 'nominal', 'fin-real-3': 'real', 'fin-real-4': 'prices' },
  },
  'fin-diversify': {
    kind: 'instrument', title: 'Rain or shine', origin: 'Markowitz · Chicago, 1952',
    tabs: [
      { id: 'both', label: 'Both', value: '±0', caption: 'Opposite swings cancel. Perfect offsets are rare; the principle holds for any imperfect correlation.', fictional: true, chart: { type: 'line', series: range(25).map(() => 100), compare: range(25).map((i) => round(100 + 10 * Math.sin((i * Math.PI) / 4))), from: 'Year 1', to: 'Year 2' } },
      { id: 'umbrella', label: 'Umbrellas', value: '±10', caption: 'Does well in rainy seasons, badly in sunny ones.', fictional: true, chart: { type: 'line', series: range(25).map((i) => round(100 + 10 * Math.sin((i * Math.PI) / 4))), highlight: [10, 14], from: 'Year 1', to: 'Year 2' } },
      { id: 'sunglasses', label: 'Sunglasses', value: '±10', caption: 'The mirror image.', fictional: true, chart: { type: 'line', series: range(25).map((i) => round(100 - 10 * Math.sin((i * Math.PI) / 4))), highlight: [2, 6], from: 'Year 1', to: 'Year 2' } },
    ],
    tabByReel: { 'fin-diversify-1': 'umbrella', 'fin-diversify-2': 'both', 'fin-diversify-3': 'both', 'fin-diversify-4': 'both' },
  },

  // ───────────── Science: instruments ─────────────
  'sci-falsifiable': {
    kind: 'instrument', title: '“All swans are white”', origin: 'Popper · Vienna, 1934',
    tabs: [
      { id: 'confirm', label: 'Confirmations', value: 'Never enough', caption: 'No number of white swans proves a universal claim.', chart: { type: 'groups', items: [{ label: 'White swan', note: 'Consistent with the claim.', tone: 'muted' }, { label: 'White swan', note: 'Still consistent.', tone: 'muted' }, { label: 'Next swan?', note: 'Could always be the exception.' }] } },
      { id: 'refute', label: 'Refutation', value: '1', unit: 'black swan', caption: 'Recorded in Western Australia in 1697 — enough to refute the claim.', chart: { type: 'groups', items: [{ label: 'Black swan', note: 'One counterexample refutes “all swans are white”.', tone: 'accent' }] } },
    ],
    tabByReel: { 'sci-falsifiable-1': 'refute', 'sci-falsifiable-3': 'confirm', 'sci-falsifiable-4': 'confirm' },
  },
  'sci-controls': {
    kind: 'instrument', title: 'HMS Salisbury, 1747', origin: 'Lind · A Treatise of the Scurvy, Edinburgh, 1753',
    tabs: [
      { id: 'pairs', label: '6 pairs', value: '12', unit: 'sailors', caption: 'Same ship, same basic diet — only the remedy differed.', chart: { type: 'groups', items: [{ label: 'Oranges & lemons', note: 'Rapid recovery', tone: 'accent' }, { label: 'Cider', note: 'Some improvement' }, { label: 'Elixir of vitriol', note: 'Little change', tone: 'muted' }, { label: 'Vinegar', note: 'Little change', tone: 'muted' }, { label: 'Seawater', note: 'Little change', tone: 'muted' }, { label: 'Spice paste', note: 'Little change', tone: 'muted' }] } },
      { id: 'variables', label: 'Variables', value: '1', unit: 'thing changed', caption: 'A fair test changes one thing and measures the result.', chart: { type: 'groups', items: [{ label: 'Independent', note: 'The remedy given.', tone: 'accent' }, { label: 'Dependent', note: 'Recovery from scurvy.' }, { label: 'Controlled', note: 'Ship, diet, severity of illness.', tone: 'muted' }] } },
    ],
    tabByReel: { 'sci-controls-2': 'variables', 'sci-controls-3': 'variables' },
  },
  'sci-correlation': {
    kind: 'instrument', title: 'Correlation vs causation', origin: 'Women’s Health Initiative · JAMA, 2002',
    tabs: [
      { id: 'icecream', label: 'Ice cream', value: 'Summer', caption: 'Illustrative: ice-cream sales and drownings both peak in hot months — weather is the confounder.', fictional: true, chart: { type: 'line', series: range(12).map((m) => round(40 + 35 * Math.sin(((m - 3) * Math.PI) / 6))), compare: range(12).map((m) => round(38 + 30 * Math.sin(((m - 3) * Math.PI) / 6))), highlight: [5, 7], from: 'Jan', to: 'Dec' } },
      { id: 'hrt', label: 'HRT trial', value: '1.29', unit: 'hazard ratio', caption: 'Coronary heart disease, estrogen plus progestin vs placebo, in the 2002 randomised trial.', chart: { type: 'groups', items: [{ label: 'Observational studies', note: 'HRT users had less heart disease.', tone: 'muted' }, { label: 'Randomised trial, 2002', note: 'Coronary risk was higher on treatment.', tone: 'accent' }, { label: 'Likely reason', note: 'Women who chose HRT were healthier to begin with.' }] } },
    ],
    tabByReel: { 'sci-correlation-3': 'hrt', 'sci-correlation-4': 'hrt' },
  },

  // ───────────── Marketing: instruments ─────────────
  'mkt-audience': {
    kind: 'instrument', title: 'Segment score', origin: 'Segmentation · Kotler & Keller',
    tabs: [
      { id: 'cyclists', label: 'Cyclists', value: '16', unit: '/ 20', caption: 'Illustrative scores out of 5. Strong fit and cheap reach.', fictional: true, chart: { type: 'bars', bars: [{ label: 'Fit', value: 5, display: '5', tone: 'accent' }, { label: 'Size', value: 3, display: '3' }, { label: 'Reach', value: 4, display: '4' }, { label: 'Room vs rivals', value: 4, display: '4' }] } },
      { id: 'all', label: 'All students', value: '12', unit: '/ 20', caption: 'Big, but most don’t need a waterproof bag.', fictional: true, chart: { type: 'bars', bars: [{ label: 'Fit', value: 2, display: '2', tone: 'muted' }, { label: 'Size', value: 5, display: '5', tone: 'accent' }, { label: 'Reach', value: 3, display: '3' }, { label: 'Room vs rivals', value: 2, display: '2' }] } },
      { id: 'hikers', label: 'Hikers', value: '9', unit: '/ 20', caption: 'Values waterproofing, but specialist brands already own it.', fictional: true, chart: { type: 'bars', bars: [{ label: 'Fit', value: 3, display: '3' }, { label: 'Size', value: 3, display: '3' }, { label: 'Reach', value: 2, display: '2' }, { label: 'Room vs rivals', value: 1, display: '1', tone: 'muted' }] } },
    ],
    tabByReel: { 'mkt-audience-1': 'all', 'mkt-audience-4': 'cyclists', 'mkt-audience-5': 'cyclists' },
  },
  'mkt-message': {
    kind: 'instrument', title: 'From feature to reason', origin: 'Levitt · Harvard, 1983',
    tabs: [
      { id: 'ladder', label: 'The ladder', value: '3', unit: 'steps', caption: 'What it has → what it does → what it means for this person.', chart: { type: 'groups', items: [{ label: 'Feature', note: 'Waterproof coating', tone: 'muted' }, { label: 'Advantage', note: 'Keeps water out' }, { label: 'Benefit', note: 'Your laptop survives the ride', tone: 'accent' }] } },
      { id: 'audiences', label: 'Two audiences', value: '1', unit: 'feature', caption: 'Same reflective strips, different reasons to care.', chart: { type: 'groups', items: [{ label: 'Cycling student', note: 'Be seen on the ride home.', tone: 'accent' }, { label: 'Parent', note: 'Visible on dark walks to school.' }] } },
    ],
    tabByReel: { 'mkt-message-3': 'audiences' },
  },
  'mkt-position': {
    kind: 'instrument', title: 'Positioning statement', origin: 'Ries & Trout · New York, 1981',
    tabs: [
      { id: 'slots', label: 'Four slots', value: '4', unit: 'parts', caption: 'Each part does one job.', chart: { type: 'groups', items: [{ label: 'Target', note: 'Students who cycle in all weather' }, { label: 'Frame', note: 'Everyday campus backpack', tone: 'accent' }, { label: 'Difference', note: 'Dry laptop without a rain cover' }, { label: 'Reason to believe', note: 'Welded seams, roll-top seal', tone: 'muted' }] } },
    ],
  },
}

export function contextFor(topicId: string): TopicContext | undefined {
  return topicContexts[topicId]
}

export function isMapContext(c: TopicContext | undefined): c is MapContext {
  return c?.kind === 'map'
}

/** Focus place for a reel, falling back to the first place. */
export function focusFor(ctx: MapContext, reelId: string | undefined): Place {
  const id = (reelId && ctx.focusByReel[reelId]) || ctx.route?.[0] || ctx.places[0].id
  return ctx.places.find((p) => p.id === id) ?? ctx.places[0]
}

/** All map places across a path, in route order, for the path overview atlas. */
export function pathAtlas(topicIds: string[]): MapContext | undefined {
  const maps = topicIds.map((id) => topicContexts[id]).filter(isMapContext).filter((m) => !m.projectionCompare)
  if (!maps.length) return undefined
  const places: Place[] = []
  const route: string[] = []
  // The same thinker can appear in several topics (e.g. Locke): keep one entry.
  const same = (a: Place, b: Place) => a.id === b.id || (!!a.who && a.who === b.who && a.year === b.year && a.name === b.name)
  for (const m of maps) {
    for (const p of m.places) if (!places.some((q) => same(q, p))) places.push(p)
    for (const id of m.route ?? m.places.map((p) => p.id)) if (!route.includes(id) && places.some((q) => q.id === id)) route.push(id)
  }
  // Historical events from different topics aren't a sequence, so don't join them with a line.
  const drawRoute = maps[0].style !== 'historical'
  return { kind: 'map', style: maps[0].style, places, route, focusByReel: {}, caption: maps[0].caption, drawRoute }
}
