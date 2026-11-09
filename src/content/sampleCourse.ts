import type { Path } from './types'

/** A clearly labelled sample course, shipped with its own source documents so citations resolve. */

export const SAMPLE_COURSE_ID = 'sample-econ'

export interface BundledDoc {
  id: string
  name: string
  kind: 'syllabus' | 'lecture' | 'reading' | 'practice'
  pages: string[]
}

export const sampleCourseDocs: BundledDoc[] = [
  {
    id: 'sample-syllabus',
    name: 'ECON 101 (sample) — Syllabus',
    kind: 'syllabus',
    pages: [
      `ECON 101 — Principles of Microeconomics (SAMPLE COURSE)\n\nThis is a sample course written for Rudra so you can try course study. It is not a real university syllabus.\n\nWeek 1 — Scarcity, choice and opportunity cost\nWeek 2 — Demand: the law of demand, determinants of demand\nWeek 3 — Supply: the law of supply, determinants of supply\nWeek 4 — Market equilibrium; shortages and surpluses; shifts\nWeek 5 — Elasticity\n\nAssessment: weekly problem sets (20%), midterm (30%), final exam (50%).`,
      `Learning outcomes for Weeks 2–4\n\nBy the end of Week 4, students should be able to:\n1. Distinguish a movement along a demand curve from a shift of the curve.\n2. Identify the determinants of demand and supply.\n3. Find equilibrium price and quantity from a schedule or diagram.\n4. Predict the effect of a shift in demand or supply on equilibrium price and quantity.\n5. Explain shortages and surpluses and how prices adjust.`,
    ],
  },
  {
    id: 'sample-lecture-demand',
    name: 'Lecture 2 notes — Demand (sample)',
    kind: 'lecture',
    pages: [
      `Lecture 2: Demand\n\nQuantity demanded is the amount of a good buyers are willing and able to purchase at a given price, holding other factors constant.\n\nThe law of demand: other things equal, when the price of a good rises, the quantity demanded falls; when the price falls, quantity demanded rises.\n\nA demand schedule lists quantities demanded at each price. A demand curve plots it, sloping downward.`,
      `Movement along vs shift of the curve\n\nA change in the good's own price causes a movement ALONG the demand curve (a change in quantity demanded).\n\nA change in any other determinant SHIFTS the whole curve (a change in demand):\n- Income (normal goods: demand rises with income; inferior goods: demand falls)\n- Prices of related goods (substitutes and complements)\n- Tastes and preferences\n- Expectations about future prices or income\n- Number of buyers`,
      `Worked example\n\nCoffee price rises from $3 to $4: quantity of coffee demanded falls — a movement along coffee's demand curve.\n\nBecause tea is a substitute, the higher coffee price shifts the demand curve for TEA to the right.\n\nBecause milk is a complement to coffee, the demand curve for milk shifts left.`,
    ],
  },
  {
    id: 'sample-lecture-supply',
    name: 'Lecture 3 notes — Supply and equilibrium (sample)',
    kind: 'lecture',
    pages: [
      `Lecture 3: Supply\n\nQuantity supplied is the amount sellers are willing and able to sell at a given price.\n\nThe law of supply: other things equal, when price rises, quantity supplied rises.\n\nDeterminants that SHIFT supply: input prices, technology, expectations, number of sellers, prices of related goods in production, taxes and subsidies.`,
      `Equilibrium\n\nEquilibrium is the price at which quantity demanded equals quantity supplied.\n\nAbove equilibrium: surplus (quantity supplied > quantity demanded); sellers cut prices.\nBelow equilibrium: shortage (quantity demanded > quantity supplied); prices are bid up.\n\nExample schedule (cups per day):\nPrice $2: Qd 500, Qs 200\nPrice $3: Qd 400, Qs 400\nPrice $4: Qd 300, Qs 600\nEquilibrium: $3, 400 cups.`,
      `Analysing changes in equilibrium\n\nThree steps:\n1. Decide whether the event shifts demand, supply, or both.\n2. Decide the direction of the shift.\n3. Use the diagram to see how equilibrium price and quantity change.\n\nExample: a frost destroys part of the coffee harvest. Supply shifts left; equilibrium price rises and equilibrium quantity falls.`,
    ],
  },
  {
    id: 'sample-practice',
    name: 'Problem set 2 — Practice questions (sample)',
    kind: 'practice',
    pages: [
      `Problem set 2 (sample)\n\n1. The price of movie tickets falls. Explain what happens to quantity demanded of movie tickets and to demand for streaming subscriptions.\n\n2. A new machine halves the cost of producing bicycles. Show the effect on the bicycle market.\n\n3. At a price of $5, 800 units are demanded and 1,100 supplied. Is there a shortage or surplus? Predict what happens to price.`,
    ],
  },
]

export const sampleCoursePath: Path = {
  id: 'sample-econ-path',
  title: 'Supply and demand',
  origin: 'sample-course',
  courseId: SAMPLE_COURSE_ID,
  description:
    'A sample course module built from the sample syllabus and lecture notes. Each reel cites the page it came from; supplementary explanations are marked.',
  sources: sampleCourseDocs.map((d) => ({ id: d.id, title: d.name, kind: 'course-doc' as const })),
  modules: [
    {
      id: 'sample-econ-m1',
      title: 'Weeks 2–4: Markets',
      summary: 'Demand, supply and equilibrium — mapped to the sample syllabus learning outcomes.',
      topics: [
        {
          id: 'econ-demand',
          title: 'Moving along vs shifting demand',
          objective: 'Distinguish a change in quantity demanded (movement along the curve) from a change in demand (shift of the curve). — Learning outcome 1',
          prerequisite: 'A demand curve plots quantity demanded against price.',
          nextStep: 'Next: the supply side, and where the two curves meet.',
          reels: [
            {
              id: 'econ-demand-1', kind: 'hook', title: 'Coffee gets pricier', origin: 'course',
              body: ['The price of coffee rises from $3 to $4. You buy less coffee. Does that mean your demand for coffee fell?', 'In economics, no — and the difference matters on every exam.'],
              visual: { motif: 'curve', caption: '$3 → $4' },
              interaction: { type: 'reveal', prompt: 'What changed: quantity demanded, or demand?', answer: 'Quantity demanded. The coffee price itself changed, so you move along the existing demand curve.' },
              sources: [{ sourceId: 'sample-lecture-demand', page: 3 }],
            },
            {
              id: 'econ-demand-2', kind: 'explain', title: 'Two kinds of change', origin: 'course',
              body: [
                'A change in the good’s own price causes a movement along the demand curve: a change in quantity demanded.',
                'A change in anything else that affects buyers — income, related goods’ prices, tastes, expectations, number of buyers — shifts the whole curve: a change in demand.',
              ],
              visual: { motif: 'curve', caption: 'Along vs shift' },
              sources: [{ sourceId: 'sample-lecture-demand', page: 2 }],
            },
            {
              id: 'econ-demand-3', kind: 'example', title: 'Substitutes and complements', origin: 'course',
              body: [
                'When coffee gets pricier, demand for tea — a substitute — shifts right. Demand for milk — a complement — shifts left.',
                'The coffee price change moves you along coffee’s curve but shifts the curves of related goods.',
              ],
              visual: { motif: 'branch', caption: 'Tea ↑ · Milk ↓' },
              interaction: {
                type: 'compare',
                left: { label: 'Substitute (tea)', text: 'Coffee price ↑ → demand for tea shifts right.' },
                right: { label: 'Complement (milk)', text: 'Coffee price ↑ → demand for milk shifts left.' },
              },
              sources: [{ sourceId: 'sample-lecture-demand', page: 3 }],
            },
            {
              id: 'econ-demand-4', kind: 'complication', title: 'Normal and inferior goods', origin: 'supplementary',
              body: [
                'Supplementary explanation (not from your course material). Income shifts demand, but the direction depends on the good. For normal goods, higher income raises demand. For inferior goods — think instant noodles for some students — higher income can lower demand as people switch to alternatives.',
                'Your lecture notes list both; this example is added to make the distinction concrete.',
              ],
              visual: { motif: 'stack', caption: 'Income ↑ — which way?' },
              sources: [{ sourceId: 'sample-lecture-demand', page: 2, note: 'Lists normal and inferior goods' }],
            },
          ],
          quiz: [
            {
              id: 'econ-demand-q1', type: 'choice', conceptId: 'econ-along-vs-shift', skill: 'recognise', reelId: 'econ-demand-2',
              prompt: 'Which event causes a movement along the demand curve for pizza?',
              options: [
                { id: 'a', text: 'The price of pizza falls.', feedback: 'Correct — a change in the good’s own price.' },
                { id: 'b', text: 'Students’ incomes rise.', feedback: 'Income is another determinant, so it shifts the curve.' },
                { id: 'c', text: 'The price of burgers (a substitute) rises.', feedback: 'A related good’s price shifts pizza demand.' },
                { id: 'd', text: 'A food blog makes pizza trendy.', feedback: 'A change in tastes shifts the curve.' },
              ],
              correctId: 'a',
              explanation: 'Only the good’s own price moves you along its demand curve; every other determinant shifts the curve.',
              altExample: 'Concert tickets go on sale at a discount: more are bought — a movement along the curve. A band goes viral: the whole curve shifts.',
              fresh: {
                id: 'econ-demand-q1f', type: 'choice', conceptId: 'econ-along-vs-shift', skill: 'recognise', reelId: 'econ-demand-2',
                prompt: 'Bus fares rise and people take fewer bus trips. This is…',
                options: [
                  { id: 'a', text: 'a decrease in quantity demanded of bus trips.', feedback: 'Yes — own price changed.' },
                  { id: 'b', text: 'a decrease in demand for bus trips.', feedback: 'Demand (the curve) didn’t shift; the price moved along it.' },
                  { id: 'c', text: 'an increase in supply of bus trips.', feedback: 'This is about buyers’ response to price.' },
                ],
                correctId: 'a',
                explanation: 'Own-price change → change in quantity demanded.',
              },
            },
            {
              id: 'econ-demand-q2', type: 'choice', conceptId: 'econ-substitutes-complements', skill: 'apply', reelId: 'econ-demand-3',
              prompt: 'Movie ticket prices fall. What happens to demand for streaming subscriptions, if they are substitutes?',
              options: [
                { id: 'a', text: 'It shifts left.', feedback: 'Right: cheaper movies draw people away from a substitute.' },
                { id: 'b', text: 'It shifts right.', feedback: 'That would be true for a complement, like cinema popcorn.' },
                { id: 'c', text: 'Movement along the streaming demand curve.', feedback: 'Streaming’s own price didn’t change, so its curve shifts.' },
                { id: 'd', text: 'No change.', feedback: 'Prices of substitutes are a determinant of demand.' },
              ],
              correctId: 'a',
              explanation: 'A fall in a substitute’s price shifts demand for the other good left.',
            },
            {
              id: 'econ-demand-q3', type: 'choice', conceptId: 'econ-inferior-goods', skill: 'reason', reelId: 'econ-demand-4',
              prompt: 'After graduating and getting a job, Sam buys fewer instant noodles. What does this suggest, and what assumption does it rely on?',
              options: [
                { id: 'a', text: 'Noodles are an inferior good for Sam — assuming the noodle price and other factors stayed the same.', feedback: 'Yes, with the “other things equal” assumption stated.' },
                { id: 'b', text: 'Noodles are a normal good, because Sam’s income rose.', feedback: 'For a normal good, demand would rise with income.' },
                { id: 'c', text: 'The noodle price must have risen.', feedback: 'Possible, but the scenario points to income; that’s why the assumption matters.' },
                { id: 'd', text: 'Sam’s demand curve stayed the same.', feedback: 'Buying less at the same price means the curve shifted left.' },
              ],
              correctId: 'a',
              explanation: 'Demand falling as income rises indicates an inferior good — holding other factors constant.',
            },
          ],
        },
        {
          id: 'econ-supply',
          title: 'What shifts supply',
          objective: 'Identify determinants of supply and predict the direction of a supply shift. — Learning outcome 2',
          prerequisite: 'Movement along vs shift (previous topic).',
          nextStep: 'Next: put supply and demand together to find equilibrium.',
          reels: [
            {
              id: 'econ-supply-1', kind: 'hook', title: 'A cheaper machine', origin: 'course',
              body: ['A new machine halves the cost of making bicycles. Nothing has happened to buyers. What happens to the bicycle market?'],
              visual: { motif: 'arrow', caption: 'Costs halve' },
              interaction: { type: 'reveal', prompt: 'Supply shifts which way?', answer: 'Right: at every price, producers are willing to sell more because each bike is cheaper to make.' },
              sources: [{ sourceId: 'sample-practice', page: 1 }],
            },
            {
              id: 'econ-supply-2', kind: 'explain', title: 'The law of supply and its shifters', origin: 'course',
              body: [
                'Law of supply: other things equal, a higher price raises quantity supplied — a movement along the supply curve.',
                'Supply shifters: input prices, technology, expectations, number of sellers, related goods in production, taxes and subsidies.',
              ],
              visual: { motif: 'curve', caption: 'Upward-sloping supply' },
              sources: [{ sourceId: 'sample-lecture-supply', page: 1 }],
            },
            {
              id: 'econ-supply-3', kind: 'complication', title: 'Price is not a shifter', origin: 'supplementary',
              body: [
                'Supplementary explanation. A common exam slip: “the price rose, so supply increased.” The good’s own price never shifts its own supply curve; it moves along it.',
                'If the question says supply shifted, look for one of the listed determinants.',
              ],
              visual: { motif: 'scales', caption: 'Along, not shift' },
              sources: [{ sourceId: 'sample-lecture-supply', page: 1 }],
            },
          ],
          quiz: [
            {
              id: 'econ-supply-q1', type: 'choice', conceptId: 'econ-supply-shifters', skill: 'recognise', reelId: 'econ-supply-2',
              prompt: 'Which event shifts the supply curve for wheat to the left?',
              options: [
                { id: 'a', text: 'Fertiliser prices rise sharply.', feedback: 'Correct — higher input prices reduce supply.' },
                { id: 'b', text: 'The price of wheat falls.', feedback: 'That’s a movement along the supply curve.' },
                { id: 'c', text: 'Consumers want more bread.', feedback: 'That shifts demand, not supply.' },
                { id: 'd', text: 'A new seed variety raises yields.', feedback: 'Better technology shifts supply right.' },
              ],
              correctId: 'a',
              explanation: 'Input prices are a supply shifter: higher costs shift supply left.',
              fresh: {
                id: 'econ-supply-q1f', type: 'choice', conceptId: 'econ-supply-shifters', skill: 'recognise', reelId: 'econ-supply-2',
                prompt: 'The government gives solar-panel makers a per-unit subsidy. Supply of solar panels…',
                options: [
                  { id: 'a', text: 'shifts right.', feedback: 'Yes — subsidies lower effective costs.' },
                  { id: 'b', text: 'shifts left.', feedback: 'That would be a tax or cost increase.' },
                  { id: 'c', text: 'doesn’t move; only price matters.', feedback: 'Subsidies are listed supply shifters.' },
                ],
                correctId: 'a',
                explanation: 'Subsidies shift supply right; taxes shift it left.',
              },
            },
            {
              id: 'econ-supply-q2', type: 'choice', conceptId: 'econ-supply-shifters', skill: 'apply', reelId: 'econ-supply-1',
              prompt: 'Five new coffee shops open on campus. What happens to the supply of campus coffee?',
              options: [
                { id: 'a', text: 'Shifts right — more sellers.', feedback: 'Right — number of sellers is a shifter.' },
                { id: 'b', text: 'Shifts left — more competition.', feedback: 'More sellers increase total supply at each price.' },
                { id: 'c', text: 'Moves along the curve.', feedback: 'Price didn’t change first; a determinant did.' },
                { id: 'd', text: 'Demand shifts right.', feedback: 'New shops are sellers, affecting supply.' },
              ],
              correctId: 'a',
              explanation: 'More sellers shift market supply right.',
            },
            {
              id: 'econ-supply-q3', type: 'choice', conceptId: 'econ-price-not-shifter', skill: 'reason', reelId: 'econ-supply-3',
              prompt: 'A student writes: “Strawberry prices rose, so the supply of strawberries increased.” What is wrong?',
              options: [
                { id: 'a', text: 'A price rise increases quantity supplied (a movement along the curve), not supply (a shift).', feedback: 'Exactly.' },
                { id: 'b', text: 'Prices rising always reduces supply.', feedback: 'Higher prices increase quantity supplied.' },
                { id: 'c', text: 'Nothing; the statement is correct.', feedback: 'It confuses supply with quantity supplied.' },
                { id: 'd', text: 'Strawberries don’t follow the law of supply.', feedback: 'They do.' },
              ],
              correctId: 'a',
              explanation: 'Own price → movement along; determinants → shift.',
            },
          ],
        },
        {
          id: 'econ-equilibrium',
          title: 'Where the curves meet',
          objective: 'Find equilibrium from a schedule and predict how shifts change equilibrium price and quantity. — Learning outcomes 3–5',
          prerequisite: 'Demand and supply shifts (previous topics).',
          nextStep: 'You’ve covered Weeks 2–4. Try the module challenge with mixed problems.',
          reels: [
            {
              id: 'econ-eq-1', kind: 'explain', title: 'Reading a schedule', origin: 'course',
              body: ['Equilibrium is where quantity demanded equals quantity supplied. In the lecture schedule, at $3 both are 400 cups.'],
              visual: { motif: 'curve', caption: '$3 · 400 cups' },
              interaction: {
                type: 'timeline',
                events: [
                  { when: '$2', what: 'Demanded 500 · Supplied 200 → shortage' },
                  { when: '$3', what: 'Demanded 400 · Supplied 400 → equilibrium' },
                  { when: '$4', what: 'Demanded 300 · Supplied 600 → surplus' },
                ],
              },
              sources: [{ sourceId: 'sample-lecture-supply', page: 2 }],
            },
            {
              id: 'econ-eq-2', kind: 'explain', title: 'Shortages and surpluses', origin: 'course',
              body: [
                'Below equilibrium, buyers want more than sellers offer: a shortage. Prices get bid up.',
                'Above equilibrium, sellers offer more than buyers want: a surplus. Sellers cut prices.',
              ],
              visual: { motif: 'scales', caption: 'Pressure toward equilibrium' },
              sources: [{ sourceId: 'sample-lecture-supply', page: 2 }],
            },
            {
              id: 'econ-eq-3', kind: 'example', title: 'Three steps', origin: 'course',
              body: [
                '1. Does the event shift demand, supply or both? 2. Which direction? 3. Read the new equilibrium.',
                'A frost destroys part of the coffee harvest: supply shifts left, so price rises and quantity falls.',
              ],
              visual: { motif: 'stack', caption: 'Shift · direction · result' },
              sources: [{ sourceId: 'sample-lecture-supply', page: 3 }],
            },
          ],
          quiz: [
            {
              id: 'econ-eq-q1', type: 'choice', conceptId: 'econ-shortage-surplus', skill: 'recognise', reelId: 'econ-eq-2',
              prompt: 'At $5, 800 units are demanded and 1,100 supplied. What is the situation and what happens next?',
              options: [
                { id: 'a', text: 'A surplus of 300; price tends to fall.', feedback: 'Correct.' },
                { id: 'b', text: 'A shortage of 300; price tends to rise.', feedback: 'Supplied exceeds demanded, so it’s a surplus.' },
                { id: 'c', text: 'Equilibrium at $5.', feedback: 'At equilibrium the two quantities would be equal.' },
                { id: 'd', text: 'A surplus; price tends to rise.', feedback: 'Surpluses push prices down.' },
              ],
              correctId: 'a',
              explanation: 'Quantity supplied > quantity demanded is a surplus; sellers cut prices.',
              fresh: {
                id: 'econ-eq-q1f', type: 'choice', conceptId: 'econ-shortage-surplus', skill: 'recognise', reelId: 'econ-eq-2',
                prompt: 'Using the lecture schedule, what happens at $2?',
                options: [
                  { id: 'a', text: 'A shortage of 300 cups; price is bid up.', feedback: 'Yes — 500 demanded vs 200 supplied.' },
                  { id: 'b', text: 'A surplus of 300 cups.', feedback: 'Demanded exceeds supplied at $2.' },
                  { id: 'c', text: 'Equilibrium.', feedback: 'Equilibrium is at $3.' },
                ],
                correctId: 'a',
                explanation: 'Below equilibrium → shortage → upward price pressure.',
              },
            },
            {
              id: 'econ-eq-q2', type: 'choice', conceptId: 'econ-equilibrium-shift', skill: 'apply', reelId: 'econ-eq-3',
              prompt: 'Bicycle production costs halve. What happens to equilibrium price and quantity of bicycles?',
              options: [
                { id: 'a', text: 'Price falls, quantity rises.', feedback: 'Correct — supply shifts right.' },
                { id: 'b', text: 'Price rises, quantity falls.', feedback: 'That’s a leftward supply shift.' },
                { id: 'c', text: 'Price rises, quantity rises.', feedback: 'That’s a rightward demand shift.' },
                { id: 'd', text: 'No change, since demand didn’t move.', feedback: 'A supply shift alone changes equilibrium.' },
              ],
              correctId: 'a',
              explanation: 'Supply right → lower price, higher quantity.',
            },
            {
              id: 'econ-eq-q3', type: 'choice', conceptId: 'econ-equilibrium-shift', skill: 'reason', reelId: 'econ-eq-3',
              prompt: 'A frost cuts the coffee harvest AND a health study makes coffee more popular. What can you say for certain?',
              options: [
                { id: 'a', text: 'Price rises; the change in quantity is ambiguous without knowing which shift is larger.', feedback: 'Exactly — both shifts push price up but quantity in opposite directions.' },
                { id: 'b', text: 'Price and quantity both rise.', feedback: 'The supply shift lowers quantity; the net effect depends on sizes.' },
                { id: 'c', text: 'Price falls.', feedback: 'Both shifts push price up.' },
                { id: 'd', text: 'Nothing can be said.', feedback: 'Price direction is certain.' },
              ],
              correctId: 'a',
              explanation: 'With two shifts, one variable is determined and the other depends on relative magnitudes.',
            },
          ],
        },
      ],
      challenge: {
        id: 'sample-econ-m1-ch',
        title: 'Exam-style problem',
        scenario:
          'Sample exam problem. Campus bubble tea: a new shop opens (more sellers) while tapioca prices spike (higher input costs). At the same time, a viral video boosts popularity.',
        questions: [
          {
            id: 'econ-ch-q1', type: 'choice', conceptId: 'econ-supply-shifters', skill: 'apply', reelId: 'econ-supply-2',
            prompt: 'Which events affect supply?',
            options: [
              { id: 'a', text: 'The new shop and the tapioca price spike.', feedback: 'Correct — sellers and input prices.' },
              { id: 'b', text: 'Only the viral video.', feedback: 'The video affects demand.' },
              { id: 'c', text: 'All three.', feedback: 'The video shifts demand, not supply.' },
            ],
            correctId: 'a',
            explanation: 'Sellers and input prices are supply shifters; tastes shift demand.',
          },
          {
            id: 'econ-ch-q2', type: 'choice', conceptId: 'econ-along-vs-shift', skill: 'apply', reelId: 'econ-demand-2',
            prompt: 'The viral video causes…',
            options: [
              { id: 'a', text: 'a rightward shift in demand.', feedback: 'Yes — tastes changed.' },
              { id: 'b', text: 'a movement along the demand curve.', feedback: 'Price didn’t cause it; tastes did.' },
              { id: 'c', text: 'a shift in supply.', feedback: 'It affects buyers.' },
            ],
            correctId: 'a',
            explanation: 'Taste changes shift demand.',
          },
          {
            id: 'econ-ch-q3', type: 'choice', conceptId: 'econ-equilibrium-shift', skill: 'reason', reelId: 'econ-eq-3',
            prompt: 'Why can’t you predict the price change without more information?',
            options: [
              { id: 'a', text: 'Supply shifts in opposing directions (more sellers vs higher costs), so its net direction is unknown.', feedback: 'Right — identify what’s ambiguous before concluding.' },
              { id: 'b', text: 'Because demand didn’t change.', feedback: 'Demand did shift right.' },
              { id: 'c', text: 'Because bubble tea isn’t a normal good.', feedback: 'Normal/inferior is about income, not relevant here.' },
            ],
            correctId: 'a',
            explanation: 'When forces conflict, state which outcome is ambiguous and why.',
          },
        ],
      },
    },
  ],
}
