import type { Path } from './types'

export const geographyWhereAndWhy: Path = {
  id: 'geo-where-why',
  title: 'Why here?',
  origin: 'prepared',
  subjectId: 'geography',
  description:
    'Reading the world spatially: why cities grow where they do, how maps quietly distort what we see, and how mountains decide who gets rain.',
  familiarityNote: 'New to geography? We add a short primer on thinking in place and space. With some background, it is skipped.',
  sources: [
    { id: 'natgeo-site', title: 'Site and situation', author: 'National Geographic Education', kind: 'web' },
    { id: 'brit-paris', title: 'Paris: history (Île de la Cité and the Seine crossing)', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/place/Paris' },
    { id: 'brit-malacca', title: 'Strait of Malacca', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/place/Strait-of-Malacca' },
    { id: 'brit-mercator', title: 'Mercator projection', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/science/Mercator-projection' },
    { id: 'monmonier', title: 'How to Lie with Maps', author: 'Mark Monmonier', year: '3rd ed., 2018', kind: 'book' },
    { id: 'brit-rainshadow', title: 'Rain shadow', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/science/rain-shadow' },
  ],
  modules: [
    {
      id: 'geo-where-why-m1',
      title: 'Place, maps and climate',
      summary: 'Three ways geographers explain why things are where they are.',
      topics: [
        {
          id: 'geo-site',
          title: 'Site and situation',
          objective: 'Distinguish a settlement’s site from its situation, and use both to explain why a city grew where it did.',
          prerequisite: 'None.',
          nextStep: 'Next: to talk about situation you need maps — and every flat map distorts the round Earth somehow.',
          reels: [
            {
              id: 'geo-site-1', kind: 'hook', title: 'An island in a river',
              body: [
                'Paris began on a small island in the Seine, the Île de la Cité. Singapore is a small island at the tip of the Malay Peninsula.',
                'Both became major cities. Was it the island itself, or what was around it?',
              ],
              visual: { motif: 'globe', caption: 'Island cities' },
              interaction: {
                type: 'poll', prompt: 'Read the map: what mattered most for Singapore?',
                options: [
                  { id: 'land', text: 'The island’s land', response: 'Singapore’s land is small, with few natural resources. Look at where it sits instead.' },
                  { id: 'location', text: 'Where it sits', response: 'That’s its situation: beside one of the world’s busiest shipping routes.' },
                ],
              },
              sources: [{ sourceId: 'brit-paris' }, { sourceId: 'brit-malacca' }],
            },
            {
              id: 'geo-site-2', kind: 'context', title: 'Place and space', onlyFor: 'new',
              body: [
                'Geographers ask two kinds of question about a place: what is it like (its physical and human characteristics), and how is it connected to other places?',
                'Most explanations of why people settle somewhere need both.',
              ],
              visual: { motif: 'grid', caption: 'Here · and in relation' },
            },
            {
              id: 'geo-site-3', kind: 'explain', title: 'Two kinds of location',
              body: [
                'Site: the physical characteristics of the place itself — terrain, water supply, soil, defensibility, flood risk.',
                'Situation: the place’s location relative to other places — trade routes, neighbouring regions, resources nearby.',
                'Paris’s early site offered a defensible island and an easy river crossing. Singapore’s situation, beside the Strait of Malacca linking the Indian Ocean and the South China Sea, made it a natural port.',
              ],
              visual: { motif: 'mountain', caption: 'The spot vs its connections' },
              sources: [{ sourceId: 'natgeo-site' }, { sourceId: 'brit-paris' }, { sourceId: 'brit-malacca' }],
            },
            {
              id: 'geo-site-4', kind: 'complication', title: 'Situations change',
              body: [
                'A site stays mostly the same; a situation can change overnight. A new railway, canal or border can make a town central — or leave it stranded.',
                'Cities whose original advantage has faded often survive because their accumulated people, infrastructure and institutions become a new advantage of their own.',
              ],
              visual: { motif: 'timeline', caption: 'Routes move' },
              interaction: { type: 'reveal', prompt: 'A river port’s trade collapses after a new motorway bypasses it. Which changed — site or situation?', answer: 'Situation. The physical place is the same; its connections to other places changed.' },
            },
          ],
          quiz: [
            {
              id: 'geo-site-q1', type: 'choice', conceptId: 'site-vs-situation', skill: 'recognise', reelId: 'geo-site-3',
              prompt: 'Which describes a city’s situation rather than its site?',
              options: [
                { id: 'a', text: 'It lies halfway along a major trade route between two capitals.', feedback: 'Correct — that’s about its relationship to other places.' },
                { id: 'b', text: 'It is built on a hill above the flood plain.', feedback: 'That’s site — the physical character of the spot.' },
                { id: 'c', text: 'It has a natural spring for fresh water.', feedback: 'Site — a feature of the location itself.' },
                { id: 'd', text: 'It sits on fertile soil.', feedback: 'Site again.' },
              ],
              correctId: 'a',
              explanation: 'Situation = location relative to other places; site = the place itself.',
              fresh: {
                id: 'geo-site-q1f', type: 'choice', conceptId: 'site-vs-situation', skill: 'recognise', reelId: 'geo-site-3',
                prompt: '“The town grew on a sheltered, deep-water bay.” Site or situation?',
                options: [
                  { id: 'a', text: 'Site.', feedback: 'Yes — a physical feature of the location.' },
                  { id: 'b', text: 'Situation.', feedback: 'It describes the place itself, not its connections.' },
                  { id: 'c', text: 'Neither.', feedback: 'It’s a classic site factor.' },
                ],
                correctId: 'a',
                explanation: 'Physical features of the spot are site factors.',
              },
            },
            {
              id: 'geo-site-q2', type: 'choice', conceptId: 'site-vs-situation', skill: 'apply', reelId: 'geo-site-3',
              passage: 'Fictional exercise. Two villages are 20 km apart. Village A has excellent farmland. Village B has poor soil but sits where two roads and a river meet.',
              prompt: 'Village B grows into a market town while A stays small. What’s the best explanation?',
              options: [
                { id: 'a', text: 'B’s situation at a meeting of routes made it a natural place to trade.', feedback: 'Exactly.' },
                { id: 'b', text: 'B’s site was better.', feedback: 'Its soil was worse; the advantage was its connections.' },
                { id: 'c', text: 'Farmland never matters.', feedback: 'It does — but trade routes favoured B for a market town.' },
                { id: 'd', text: 'It was random.', feedback: 'Route junctions are a well-known driver of market towns.' },
              ],
              correctId: 'a',
              explanation: 'Market towns often grow at route junctions — a situation factor.',
            },
            {
              id: 'geo-site-q3', type: 'choice', conceptId: 'situation-change', skill: 'reason', reelId: 'geo-site-4',
              prompt: 'Why might a city keep growing after its original situational advantage disappears?',
              options: [
                { id: 'a', text: 'Its accumulated people, infrastructure and institutions become advantages in their own right.', feedback: 'Right — success can become self-reinforcing.' },
                { id: 'b', text: 'Its site physically moves.', feedback: 'Sites don’t move.' },
                { id: 'c', text: 'Situation never matters after a city is founded.', feedback: 'It often keeps mattering, but other advantages can replace it.' },
                { id: 'd', text: 'Cities never decline.', feedback: 'Many have.' },
              ],
              correctId: 'a',
              explanation: 'Agglomeration — clusters of people and firms — can outlast the original reason for a city.',
            },
          ],
        },
        {
          id: 'geo-projection',
          title: 'Every map lies a little',
          objective: 'Explain why flat maps must distort the globe, and identify what the Mercator projection preserves and what it distorts.',
          prerequisite: 'None — but it helps to have thought about how places relate to each other (previous topic).',
          nextStep: 'Next: from how we draw the world to how the world works — mountains and rain.',
          reels: [
            {
              id: 'geo-projection-1', kind: 'hook', title: 'Greenland vs Africa',
              body: [
                'On many classroom wall maps, Greenland looks about the size of Africa.',
                'Greenland is roughly 2.2 million km². Africa is about 30 million km² — around fourteen times larger.',
              ],
              visual: { motif: 'globe', caption: '≈ 14 ×' },
              interaction: {
                type: 'poll', prompt: 'Read the map: why would a map get this so wrong?',
                options: [
                  { id: 'error', text: 'A mistake', response: 'Not a mistake — a trade-off. The map was designed to get something else right.' },
                  { id: 'bias', text: 'Deliberate bias', response: 'Projections can carry political meaning, but the distortion here comes from the maths of flattening a sphere.' },
                  { id: 'maths', text: 'Flattening a sphere', response: 'Exactly. You can’t flatten a globe without stretching or tearing something.' },
                ],
              },
              sources: [{ sourceId: 'brit-mercator' }],
            },
            {
              id: 'geo-projection-2', kind: 'explain', title: 'Projections are choices',
              body: [
                'A map projection is a method of representing the curved Earth on a flat surface. No projection can preserve area, shape, distance and direction all at once.',
                'Equal-area projections keep sizes correct but distort shapes. Conformal projections keep local shapes and angles correct but distort sizes.',
              ],
              visual: { motif: 'grid', caption: 'Pick what to keep' },
              sources: [{ sourceId: 'monmonier' }],
            },
            {
              id: 'geo-projection-3', kind: 'example', title: 'Why sailors loved Mercator',
              body: [
                'Gerardus Mercator published his projection in 1569. It is conformal: a line of constant compass bearing is a straight line on the map, which made it extremely useful for navigation.',
                'The cost: scale increases toward the poles. Greenland, Canada and Russia look far larger than they are, while equatorial regions look smaller.',
              ],
              visual: { motif: 'curve', caption: 'Straight bearings, swollen poles' },
              interaction: {
                type: 'compare',
                left: { label: 'Mercator keeps', text: 'Local shapes and compass directions — great for navigation.' },
                right: { label: 'Mercator distorts', text: 'Area, increasingly toward the poles.' },
              },
              sources: [{ sourceId: 'brit-mercator' }],
            },
            {
              id: 'geo-projection-4', kind: 'complication', title: 'Right map, right job',
              body: [
                'Web maps use a variant of Mercator because it keeps streets at right angles when you zoom in. That’s ideal for directions and misleading for comparing countries.',
                'The skill isn’t finding the “true” map — there isn’t one. It’s choosing a projection that fits the question and noticing when a map’s choice shapes your impression.',
              ],
              visual: { motif: 'target', caption: 'Fit for purpose' },
              sources: [{ sourceId: 'monmonier' }],
            },
          ],
          quiz: [
            {
              id: 'geo-projection-q1', type: 'choice', conceptId: 'projection-tradeoff', skill: 'recognise', reelId: 'geo-projection-2',
              prompt: 'Why must every flat world map distort something?',
              options: [
                { id: 'a', text: 'A sphere’s surface can’t be flattened without stretching or tearing, so area, shape, distance or direction must give.', feedback: 'Correct.' },
                { id: 'b', text: 'Because cartographers lack accurate data.', feedback: 'Data quality isn’t the issue; geometry is.' },
                { id: 'c', text: 'Only old maps distort; modern ones don’t.', feedback: 'Every flat projection distorts something.' },
                { id: 'd', text: 'Because the Earth is flat in most places.', feedback: 'Locally it looks flat, but the globe as a whole can’t be flattened without distortion.' },
              ],
              correctId: 'a',
              explanation: 'Projection is a geometric trade-off.',
              fresh: {
                id: 'geo-projection-q1f', type: 'choice', conceptId: 'projection-tradeoff', skill: 'recognise', reelId: 'geo-projection-2',
                prompt: 'An equal-area projection preserves…',
                options: [
                  { id: 'a', text: 'the relative sizes of regions, at the cost of distorting shapes.', feedback: 'Yes — sizes stay comparable, which is why equal-area maps suit comparisons of area.' },
                  { id: 'b', text: 'both shapes and sizes perfectly.', feedback: 'No flat projection can do both.' },
                  { id: 'c', text: 'compass bearings as straight lines.', feedback: 'That’s Mercator, which is conformal.' },
                ],
                correctId: 'a',
                explanation: 'Equal-area keeps size; conformal keeps local shape.',
              },
            },
            {
              id: 'geo-projection-q2', type: 'choice', conceptId: 'mercator', skill: 'apply', reelId: 'geo-projection-3',
              prompt: 'A news site wants to show which countries have the most forest area using shaded countries. Why is a Mercator map a poor choice?',
              options: [
                { id: 'a', text: 'It inflates high-latitude countries, so their forests would look larger than they are relative to tropical countries.', feedback: 'Exactly — area comparisons need an equal-area projection.' },
                { id: 'b', text: 'Mercator can’t show forests.', feedback: 'It can show anything; it just distorts area.' },
                { id: 'c', text: 'Mercator distorts compass directions.', feedback: 'It preserves them — that’s its strength.' },
                { id: 'd', text: 'There’s no problem.', feedback: 'Area-based comparisons are exactly where Mercator misleads.' },
              ],
              correctId: 'a',
              explanation: 'Use equal-area projections when comparing sizes.',
            },
            {
              id: 'geo-projection-q3', type: 'choice', conceptId: 'map-purpose', skill: 'reason', reelId: 'geo-projection-4',
              prompt: 'Someone says: “We should ban Mercator maps because they’re wrong.” What’s the most balanced response?',
              options: [
                { id: 'a', text: 'Every projection is wrong about something; Mercator suits navigation and street maps but shouldn’t be used to compare sizes.', feedback: 'Right — choose by purpose.' },
                { id: 'b', text: 'Mercator is the only correct projection.', feedback: 'It’s correct about angles, not area.' },
                { id: 'c', text: 'Maps don’t affect how people see the world.', feedback: 'They clearly shape impressions of size and importance.' },
                { id: 'd', text: 'Equal-area maps have no distortion.', feedback: 'They distort shapes instead.' },
              ],
              correctId: 'a',
              explanation: 'The question is fitness for purpose, not truth.',
            },
          ],
        },
        {
          id: 'geo-rainshadow',
          title: 'The wet side and the dry side',
          objective: 'Explain how mountains create orographic rainfall and rain shadows, and predict which side of a range will be wetter.',
          prerequisite: 'Basic idea that air carries moisture; no prior geography needed.',
          nextStep: 'You’ve finished this module’s core. The challenge asks you to combine place, maps and climate.',
          reels: [
            {
              id: 'geo-rainshadow-1', kind: 'hook', title: 'Two sides of one range',
              body: [
                'The western slopes of India’s Western Ghats receive some of the heaviest monsoon rain in the country. A short distance east, on the Deccan Plateau, it is far drier.',
                'Same latitude, same monsoon. What happened to the rain?',
              ],
              visual: { motif: 'mountain', caption: 'Windward · leeward' },
              interaction: {
                type: 'poll', prompt: 'Read the map: where did the rain go?',
                options: [
                  { id: 'mountain', text: 'It fell on the mountains', response: 'Yes — most of it fell as the air was forced up the windward slopes.' },
                  { id: 'sea', text: 'It stayed over the sea', response: 'The moist air did come inland — the mountains wrung it out on the way.' },
                ],
              },
              sources: [{ sourceId: 'brit-rainshadow' }],
            },
            {
              id: 'geo-rainshadow-2', kind: 'explain', title: 'Orographic lift',
              body: [
                'When moist air meets a mountain range, it is forced upward. As it rises it expands and cools, and cooler air holds less water vapour, so clouds form and rain or snow falls on the windward side.',
                'By the time the air crosses the top and descends the far side, it has lost much of its moisture. Sinking air warms and dries further. The leeward side sits in a rain shadow.',
              ],
              visual: { motif: 'arrow', caption: 'Rise, cool, rain' },
              sources: [{ sourceId: 'brit-rainshadow' }],
            },
            {
              id: 'geo-rainshadow-3', kind: 'example', title: 'The same pattern elsewhere',
              body: [
                'In the western United States, Pacific air rises over the Sierra Nevada, watering its western slopes. East of the range lie the Great Basin and Death Valley, among the driest places in North America.',
                'Recognising the pattern lets you predict climate from a map: find the prevailing wind, find the mountains, and the dry side follows.',
              ],
              visual: { motif: 'globe', caption: 'Sierra Nevada → Death Valley' },
              interaction: {
                type: 'timeline',
                events: [
                  { when: 'Over the ocean', what: 'Air picks up moisture' },
                  { when: 'Windward slope', what: 'Air rises, cools, rain falls' },
                  { when: 'Summit', what: 'Air has lost much of its water' },
                  { when: 'Leeward side', what: 'Air sinks, warms, stays dry' },
                ],
              },
              sources: [{ sourceId: 'brit-rainshadow' }],
            },
            {
              id: 'geo-rainshadow-4', kind: 'complication', title: 'Mountains aren’t the whole story',
              body: [
                'Rain shadows explain a lot, but not everything. The Atacama Desert’s extreme dryness, for example, comes from several factors together: the Andes, a cold offshore current and persistent high pressure.',
                'Good geographical explanation layers causes and checks each against the map, rather than reaching for one factor.',
              ],
              visual: { motif: 'stack', caption: 'Layered causes' },
            },
          ],
          quiz: [
            {
              id: 'geo-rainshadow-q1', type: 'choice', conceptId: 'orographic-rain', skill: 'recognise', reelId: 'geo-rainshadow-2',
              prompt: 'Why does rain fall on the windward side of a mountain range?',
              options: [
                { id: 'a', text: 'Air is forced up, cools as it rises, and can hold less water vapour, so it condenses into rain.', feedback: 'Correct.' },
                { id: 'b', text: 'Mountains attract clouds magnetically.', feedback: 'There’s no magnetic effect; it’s about rising, cooling air.' },
                { id: 'c', text: 'Air warms as it rises.', feedback: 'Rising air expands and cools.' },
                { id: 'd', text: 'The leeward side is closer to the sea.', feedback: 'Which side is windward depends on the prevailing wind, not distance alone.' },
              ],
              correctId: 'a',
              explanation: 'Rising air cools; cool air holds less moisture; rain falls.',
              fresh: {
                id: 'geo-rainshadow-q1f', type: 'choice', conceptId: 'orographic-rain', skill: 'recognise', reelId: 'geo-rainshadow-2',
                prompt: 'Why is the leeward side drier?',
                options: [
                  { id: 'a', text: 'The air has already lost much of its moisture, and it warms as it descends.', feedback: 'Yes — a rain shadow.' },
                  { id: 'b', text: 'It is always at higher altitude.', feedback: 'Altitude isn’t the cause.' },
                  { id: 'c', text: 'Mountains block the sun.', feedback: 'It’s about moisture, not sunlight.' },
                ],
                correctId: 'a',
                explanation: 'Descending air is dry and warming.',
              },
            },
            {
              id: 'geo-rainshadow-q2', type: 'choice', conceptId: 'orographic-rain', skill: 'apply', reelId: 'geo-rainshadow-3',
              passage: 'Fictional exercise. On the island of Kavo, the prevailing wind blows from the east off a warm sea. A mountain ridge runs north–south down the middle of the island.',
              prompt: 'Where would you expect the wettest and driest areas?',
              options: [
                { id: 'a', text: 'Wettest on the eastern slopes; driest in the west, in the rain shadow.', feedback: 'Exactly — east is windward here.' },
                { id: 'b', text: 'Wettest in the west; driest in the east.', feedback: 'That would be true if the wind came from the west.' },
                { id: 'c', text: 'Evenly wet everywhere.', feedback: 'The ridge forces uneven rainfall.' },
                { id: 'd', text: 'Wettest at sea level in the west.', feedback: 'The west is leeward and should be drier.' },
              ],
              correctId: 'a',
              explanation: 'Find the prevailing wind; the windward side is wet, the leeward side dry.',
            },
            {
              id: 'geo-rainshadow-q3', type: 'choice', conceptId: 'layered-causes', skill: 'reason', reelId: 'geo-rainshadow-4',
              prompt: 'A student explains a desert entirely by a nearby mountain range. Why might that be incomplete?',
              options: [
                { id: 'a', text: 'Aridity often has several causes — ocean currents, pressure systems, distance from the sea — that should be checked too.', feedback: 'Right — layer and test explanations.' },
                { id: 'b', text: 'Mountains never cause deserts.', feedback: 'Rain shadows are real and common.' },
                { id: 'c', text: 'Deserts are caused only by sand.', feedback: 'Deserts are defined by low precipitation, not sand.' },
                { id: 'd', text: 'Single causes are always correct.', feedback: 'Climate usually has multiple interacting causes.' },
              ],
              correctId: 'a',
              explanation: 'Good explanation considers several factors against the evidence.',
            },
          ],
        },
      ],
      challenge: {
        id: 'geo-where-why-m1-ch',
        title: 'Planning Port Varan',
        scenario:
          'Fictional scenario. A government is choosing a site for a new port city on a coast backed by a mountain range. Winds blow onshore from the sea. Option 1: a sheltered bay on the coast. Option 2: a high inland valley beyond the mountains. A planning report uses a Mercator map to compare the size of the two regions.',
        questions: [
          {
            id: 'geo-ch-q1', type: 'choice', conceptId: 'orographic-rain', skill: 'apply', reelId: 'geo-rainshadow-2',
            prompt: 'Which option is likely to have more reliable rainfall?',
            options: [
              { id: 'a', text: 'The coastal bay, on the windward side of the mountains.', feedback: 'Yes — onshore winds rise over the range and drop rain on this side.' },
              { id: 'b', text: 'The inland valley beyond the mountains.', feedback: 'It sits in the rain shadow.' },
              { id: 'c', text: 'Both equally.', feedback: 'The range creates a wet side and a dry side.' },
            ],
            correctId: 'a',
            explanation: 'Windward coast = wetter; beyond the range = rain shadow.',
          },
          {
            id: 'geo-ch-q2', type: 'choice', conceptId: 'site-vs-situation', skill: 'apply', reelId: 'geo-site-3',
            prompt: '“The bay is sheltered with deep water” is a statement about…',
            options: [
              { id: 'a', text: 'Site.', feedback: 'Correct — physical features of the spot.' },
              { id: 'b', text: 'Situation.', feedback: 'Situation would describe its connections to other places.' },
              { id: 'c', text: 'Projection.', feedback: 'Projection is about maps, not places.' },
            ],
            correctId: 'a',
            explanation: 'Physical characteristics are site factors.',
          },
          {
            id: 'geo-ch-q3', type: 'choice', conceptId: 'mercator', skill: 'reason', reelId: 'geo-projection-3',
            prompt: 'Why should the planners be cautious about comparing region sizes on the Mercator map?',
            options: [
              { id: 'a', text: 'Mercator distorts area, so size comparisons need an equal-area map.', feedback: 'Exactly.' },
              { id: 'b', text: 'Mercator distorts compass directions.', feedback: 'It preserves directions.' },
              { id: 'c', text: 'There’s no issue at local scales ever.', feedback: 'Distortion is small locally but matters when comparing distant regions.' },
            ],
            correctId: 'a',
            explanation: 'Choose projections by purpose.',
          },
        ],
      },
    },
  ],
}
