import type { Path } from './types'

export const economicsHiddenCosts: Path = {
  id: 'ecn-hidden-costs',
  title: 'The costs you don’t see',
  origin: 'prepared',
  subjectId: 'economics',
  description:
    'Economic thinking beyond prices: what a choice really costs, why trade helps even the less productive side, and why markets misprice pollution.',
  familiarityNote: 'New to economics? We add a short primer on thinking at the margin. With some background, it is skipped.',
  sources: [
    { id: 'bastiat', title: '“What Is Seen and What Is Not Seen” (Ce qu’on voit et ce qu’on ne voit pas)', author: 'Frédéric Bastiat', year: '1850', kind: 'primary', url: 'https://www.econlib.org/library/Bastiat/basEss1.html' },
    { id: 'ricardo', title: 'On the Principles of Political Economy and Taxation, ch. 7 “On Foreign Trade”', author: 'David Ricardo', year: '1817', kind: 'primary', url: 'https://www.econlib.org/library/Ricardo/ricP.html' },
    { id: 'pigou', title: 'The Economics of Welfare', author: 'Arthur C. Pigou', year: '1920', kind: 'book' },
    { id: 'mankiw', title: 'Principles of Economics (chapters on opportunity cost, trade and externalities)', author: 'N. Gregory Mankiw', year: '9th ed., 2020', kind: 'book' },
    { id: 'tfl-cc', title: 'Congestion Charge (introduced in central London, February 2003)', author: 'Transport for London', kind: 'web', url: 'https://tfl.gov.uk/modes/driving/congestion-charge' },
  ],
  modules: [
    {
      id: 'ecn-hidden-costs-m1',
      title: 'Trade-offs, trade and spillovers',
      summary: 'Three ideas that separate economic reasoning from everyday accounting.',
      topics: [
        {
          id: 'ecn-opportunity',
          title: 'What a choice really costs',
          objective: 'Identify the opportunity cost of a decision and explain why it, not just the money spent, is the true cost.',
          prerequisite: 'None.',
          nextStep: 'Next: opportunity cost explains why two countries can both gain from trade — even when one is better at everything.',
          reels: [
            {
              id: 'ecn-opportunity-1', kind: 'hook', title: 'The free concert', fictional: true,
              body: [
                'Fictional scenario. Priya has a free ticket to a concert tonight. Her café shift that evening would pay €60, and she enjoys working there.',
                'The ticket cost nothing. Is going to the concert free?',
              ],
              visual: { motif: 'coins', caption: 'Free isn’t free' },
              interaction: {
                type: 'poll', prompt: 'Count the cost: what does the concert cost Priya?',
                options: [
                  { id: 'zero', text: '€0', response: 'That’s the accounting answer. Economists ask what she gives up by going.' },
                  { id: 'sixty', text: '€60', response: 'Closer: the €60 she won’t earn is part of the cost — her next-best use of the evening.' },
                  { id: 'more', text: '€60 and more', response: 'Sharp: the full cost is the value of her best alternative, including anything else she’d get from that shift.' },
                ],
              },
            },
            {
              id: 'ecn-opportunity-2', kind: 'context', title: 'Scarcity and choice', onlyFor: 'new',
              body: [
                'Economics starts from scarcity: time, money and resources are limited, so choosing one thing means not choosing another.',
                'That’s why economists talk about trade-offs rather than “costs” in the everyday sense of a price tag.',
              ],
              visual: { motif: 'scales', caption: 'Limited means' },
              sources: [{ sourceId: 'mankiw' }],
            },
            {
              id: 'ecn-opportunity-3', kind: 'explain', title: 'Opportunity cost',
              body: [
                'The opportunity cost of a choice is the value of the best alternative you give up. Not every alternative — just the next best one.',
                'Money spent is often part of it, but not all of it. A university degree costs tuition plus the wages you could have earned in those years. Time spent queuing costs whatever else you could have done with it.',
              ],
              visual: { motif: 'branch', caption: 'The road not taken' },
              sources: [{ sourceId: 'mankiw' }],
            },
            {
              id: 'ecn-opportunity-4', kind: 'example', title: 'The broken window',
              body: [
                'In 1850, Frédéric Bastiat told the story of a boy who breaks a shop window. Onlookers console the shopkeeper: at least the glazier gets work, and that money circulates.',
                'Bastiat’s point: that’s only what is seen. What is not seen is what the shopkeeper would have bought with that money instead — new shoes, say. The town isn’t richer; it has a window instead of a window and shoes.',
              ],
              visual: { motif: 'grid', caption: 'Seen · unseen' },
              interaction: { type: 'reveal', prompt: 'Who loses in Bastiat’s story, even though nobody sees it?', answer: 'The shoemaker who would have made the sale, and the shopkeeper who ends up with the same window instead of a window plus shoes.' },
              sources: [{ sourceId: 'bastiat' }],
            },
            {
              id: 'ecn-opportunity-5', kind: 'complication', title: 'Sunk costs don’t count',
              body: [
                'Money already spent and unrecoverable — a sunk cost — isn’t an opportunity cost of future choices. If you paid for a film and it’s terrible, the ticket is gone whether you stay or leave.',
                'The rational question is only: from here, is staying better than my next-best use of the next hour? People often find this hard, which is why “sunk cost fallacy” has a name.',
              ],
              visual: { motif: 'stack', caption: 'Look forward' },
            },
          ],
          quiz: [
            {
              id: 'ecn-opportunity-q1', type: 'choice', conceptId: 'ecn-opportunity-cost', skill: 'recognise', reelId: 'ecn-opportunity-3',
              prompt: 'Which best defines opportunity cost?',
              options: [
                { id: 'a', text: 'The value of the best alternative given up when you make a choice.', feedback: 'Correct.' },
                { id: 'b', text: 'The price you pay for something.', feedback: 'Price can be part of it, but it ignores time and forgone alternatives.' },
                { id: 'c', text: 'The total value of all the alternatives you didn’t choose.', feedback: 'Only the next-best alternative counts — you couldn’t have had all of them.' },
                { id: 'd', text: 'Money you have already spent.', feedback: 'That’s a sunk cost, which doesn’t affect future choices.' },
              ],
              correctId: 'a',
              explanation: 'Opportunity cost = value of the next-best alternative forgone.',
              altExample: 'An hour spent scrolling costs the hour of sleep, study or exercise you’d otherwise have chosen.',
              fresh: {
                id: 'ecn-opportunity-q1f', type: 'choice', conceptId: 'ecn-opportunity-cost', skill: 'recognise', reelId: 'ecn-opportunity-3',
                prompt: 'Sam can either tutor for €40 or babysit for €30 on Saturday, and instead goes hiking. What is the opportunity cost of hiking?',
                options: [
                  { id: 'a', text: '€40 — the best alternative given up (plus any non-money value of tutoring).', feedback: 'Yes — only the next-best option counts.' },
                  { id: 'b', text: '€70 — both jobs.', feedback: 'Sam couldn’t have done both at once.' },
                  { id: 'c', text: '€0, because hiking is free.', feedback: 'Free to enter, but not free in what’s given up.' },
                ],
                correctId: 'a',
                explanation: 'Count the next-best alternative, not the sum of all alternatives.',
              },
            },
            {
              id: 'ecn-opportunity-q2', type: 'choice', conceptId: 'ecn-seen-unseen', skill: 'apply', reelId: 'ecn-opportunity-4',
              passage: 'Fictional scenario. A city spends €5 million rebuilding a stadium after a storm. A councillor says: “The rebuilding created jobs, so the storm was good for the economy.”',
              prompt: 'What would Bastiat say?',
              options: [
                { id: 'a', text: 'The €5 million would otherwise have been spent on something else; the city is poorer by the stadium the storm destroyed.', feedback: 'Exactly the broken-window reasoning.' },
                { id: 'b', text: 'The councillor is right; destruction creates wealth.', feedback: 'That counts only what is seen.' },
                { id: 'c', text: 'Jobs never matter in economics.', feedback: 'They do — the point is that the alternative spending would also have created work.' },
                { id: 'd', text: 'The storm had no economic effect.', feedback: 'It destroyed something of value; that’s a real loss.' },
              ],
              correctId: 'a',
              explanation: 'Spending to replace what was destroyed diverts resources from other uses; it doesn’t create net wealth.',
            },
            {
              id: 'ecn-opportunity-q3', type: 'choice', conceptId: 'ecn-sunk-cost', skill: 'reason', reelId: 'ecn-opportunity-5',
              prompt: 'A company has spent €2 million on a project that now looks unprofitable. A manager says: “We must finish it, or the €2 million is wasted.” What’s the flaw?',
              options: [
                { id: 'a', text: 'The €2 million is sunk; the decision should compare only future costs and benefits of finishing versus stopping.', feedback: 'Right — that’s the sunk cost fallacy.' },
                { id: 'b', text: 'There’s no flaw; past spending should guide future spending.', feedback: 'Past spending is gone either way.' },
                { id: 'c', text: 'They should spend more to recover the €2 million.', feedback: 'Throwing good money after bad is the fallacy in action.' },
                { id: 'd', text: 'Opportunity cost doesn’t apply to companies.', feedback: 'It applies to any choice under scarcity.' },
              ],
              correctId: 'a',
              explanation: 'Only costs and benefits that the decision can still change are relevant.',
            },
          ],
        },
        {
          id: 'ecn-comparative',
          title: 'Better at everything, still better off trading',
          objective: 'Distinguish absolute from comparative advantage and show, with Ricardo’s example, why specialisation and trade can benefit both sides.',
          prerequisite: 'Opportunity cost (previous topic).',
          nextStep: 'Next: markets are powerful — but they misprice costs that fall on people outside the deal.',
          reels: [
            {
              id: 'ecn-comparative-1', kind: 'hook', title: 'The lawyer who types', fictional: true,
              body: [
                'Fictional scenario. A lawyer types twice as fast as any assistant she could hire. Should she do her own typing?',
                'Most people say no — but she’s better at it. Why does hiring someone slower make sense?',
              ],
              visual: { motif: 'scales', caption: 'Better ≠ best use' },
              interaction: {
                type: 'poll', prompt: 'Count the cost: should she type her own documents?',
                options: [
                  { id: 'yes', text: 'Yes, she’s faster', response: 'Faster, but every hour typing is an hour not billed at a lawyer’s rate. Check the opportunity cost.' },
                  { id: 'no', text: 'No, hire someone', response: 'Right instinct: her time has a higher-value use, even though she types better.' },
                ],
              },
            },
            {
              id: 'ecn-comparative-2', kind: 'explain', title: 'Absolute vs comparative',
              body: [
                'Absolute advantage: you can produce something using fewer resources than someone else.',
                'Comparative advantage: you can produce it at a lower opportunity cost — you give up less of other things to make it.',
                'Everyone has a comparative advantage in something, even if they have an absolute advantage in nothing. Gains from trade come from comparative advantage.',
              ],
              visual: { motif: 'grid', caption: 'Fewer resources vs lower sacrifice' },
              sources: [{ sourceId: 'mankiw' }],
            },
            {
              id: 'ecn-comparative-3', kind: 'example', title: 'Ricardo’s wine and cloth',
              body: [
                'In 1817 David Ricardo imagined England and Portugal. Producing a set quantity of cloth took England the labour of 100 men for a year and Portugal 90. A set quantity of wine took England 120 and Portugal 80.',
                'Portugal is better at both. But for Portugal, wine costs 80/90 ≈ 0.89 units of cloth forgone; for England it costs 120/100 = 1.2. Portugal has the comparative advantage in wine, England in cloth.',
                'If each specialises and they trade, both can end up with more of both goods than if each made everything itself.',
              ],
              visual: { motif: 'branch', caption: 'Wine · cloth' },
              interaction: {
                type: 'compare',
                left: { label: 'Portugal', text: 'Cloth 90 · Wine 80 → wine is relatively cheap.' },
                right: { label: 'England', text: 'Cloth 100 · Wine 120 → cloth is relatively cheap.' },
              },
              sources: [{ sourceId: 'ricardo' }],
            },
            {
              id: 'ecn-comparative-4', kind: 'complication', title: 'Gains overall, losers within',
              body: [
                'Comparative advantage shows that trade raises total output. It doesn’t say everyone gains. Workers in an industry that shrinks under trade can lose jobs and income, often concentrated in particular towns.',
                'That’s why debates about trade are rarely about whether gains exist, and usually about who bears the costs and whether winners compensate losers.',
              ],
              visual: { motif: 'stack', caption: 'Total vs distribution' },
              sources: [{ sourceId: 'mankiw' }],
            },
          ],
          quiz: [
            {
              id: 'ecn-comparative-q1', type: 'choice', conceptId: 'ecn-comparative-advantage', skill: 'recognise', reelId: 'ecn-comparative-2',
              prompt: 'What does it mean to have a comparative advantage in producing a good?',
              options: [
                { id: 'a', text: 'You can produce it at a lower opportunity cost than others.', feedback: 'Correct.' },
                { id: 'b', text: 'You can produce more of it than anyone else.', feedback: 'That’s absolute advantage.' },
                { id: 'c', text: 'You are the only producer.', feedback: 'That’s a monopoly, not comparative advantage.' },
                { id: 'd', text: 'Your government subsidises it.', feedback: 'Subsidies distort prices; comparative advantage is about real opportunity costs.' },
              ],
              correctId: 'a',
              explanation: 'Comparative advantage = lower opportunity cost.',
              fresh: {
                id: 'ecn-comparative-q1f', type: 'choice', conceptId: 'ecn-comparative-advantage', skill: 'recognise', reelId: 'ecn-comparative-2',
                prompt: 'Ana can cook a meal in 1 hour or fix a bike in 2. Ben takes 2 hours to cook and 3 to fix a bike. Who has the comparative advantage in fixing bikes?',
                options: [
                  { id: 'a', text: 'Ben — a bike costs him 1.5 meals; it costs Ana 2.', feedback: 'Yes — Ben gives up less cooking per bike.' },
                  { id: 'b', text: 'Ana — she is faster at both.', feedback: 'That’s absolute advantage in both; comparative advantage differs.' },
                  { id: 'c', text: 'Neither.', feedback: 'Their opportunity costs differ, so one has the comparative advantage.' },
                ],
                correctId: 'a',
                explanation: 'Compare the opportunity costs, not the raw speeds.',
              },
            },
            {
              id: 'ecn-comparative-q2', type: 'choice', conceptId: 'ecn-comparative-advantage', skill: 'apply', reelId: 'ecn-comparative-3',
              prompt: 'In Ricardo’s example, why should Portugal import cloth from England even though Portugal makes cloth more cheaply in labour?',
              options: [
                { id: 'a', text: 'Because every unit of labour Portugal moves from cloth to wine produces relatively more value — wine has the lower opportunity cost there.', feedback: 'Exactly.' },
                { id: 'b', text: 'Because England has an absolute advantage in cloth.', feedback: 'It doesn’t — Portugal needs fewer workers for cloth too.' },
                { id: 'c', text: 'Because Portugal can’t produce cloth.', feedback: 'It can; it’s just relatively better at wine.' },
                { id: 'd', text: 'Because trade always helps the poorer country only.', feedback: 'Both countries gain in the example.' },
              ],
              correctId: 'a',
              explanation: 'Specialising by comparative advantage raises total output, which trade can share.',
            },
            {
              id: 'ecn-comparative-q3', type: 'choice', conceptId: 'ecn-trade-distribution', skill: 'reason', reelId: 'ecn-comparative-4',
              prompt: 'A politician says: “Trade made our country richer, so nobody here was harmed.” What’s wrong with this reasoning?',
              options: [
                { id: 'a', text: 'Aggregate gains can coexist with concentrated losses for specific workers and regions.', feedback: 'Right — total and distribution are different questions.' },
                { id: 'b', text: 'Trade never makes countries richer.', feedback: 'The theory and much evidence show aggregate gains.' },
                { id: 'c', text: 'Comparative advantage only applies to individuals.', feedback: 'It applies to people, firms and countries.' },
                { id: 'd', text: 'Nothing; richer means everyone is better off.', feedback: 'An average can rise while some people fall.' },
              ],
              correctId: 'a',
              explanation: 'Gains from trade are real but unevenly shared.',
            },
          ],
        },
        {
          id: 'ecn-externalities',
          title: 'Costs that land on someone else',
          objective: 'Identify negative externalities and explain how a Pigouvian tax tries to make prices reflect the full social cost.',
          prerequisite: 'Opportunity cost (topic 1).',
          nextStep: 'You’ve finished this module’s core. The challenge combines all three ideas.',
          reels: [
            {
              id: 'ecn-externalities-1', kind: 'hook', title: 'The factory upstream', fictional: true,
              body: [
                'Fictional scenario. A factory makes cheap fabric and discharges dye into a river. Downstream, a fishing village loses its catch. The fabric’s price reflects the factory’s costs — not the village’s.',
                'Who is paying for the fabric?',
              ],
              visual: { motif: 'arrow', caption: 'Upstream, downstream' },
              interaction: {
                type: 'poll', prompt: 'Count the cost: is the fabric’s price “right”?',
                options: [
                  { id: 'yes', text: 'Yes, the market set it', response: 'The market set a price — but only for costs the buyer and seller bear.' },
                  { id: 'no', text: 'No, it’s too low', response: 'That’s the externality insight: part of the cost is pushed onto people outside the deal.' },
                ],
              },
            },
            {
              id: 'ecn-externalities-2', kind: 'explain', title: 'Externalities',
              body: [
                'An externality is a cost or benefit that falls on people who aren’t part of a transaction. Negative: pollution, noise, congestion. Positive: vaccination protecting others, a neighbour’s garden.',
                'With a negative externality, the price is lower than the full social cost, so the market produces too much of the good. Arthur Pigou set out this logic in 1920.',
              ],
              visual: { motif: 'curve', caption: 'Private vs social cost' },
              sources: [{ sourceId: 'pigou' }, { sourceId: 'mankiw' }],
            },
            {
              id: 'ecn-externalities-3', kind: 'example', title: 'Pricing the traffic',
              body: [
                'A Pigouvian tax adds roughly the external cost to the price, so buyers and sellers face the full cost of their choices.',
                'London introduced a congestion charge for driving into the centre in February 2003. Each driver adds to delays for everyone else; the charge makes drivers pay part of that cost and nudges some trips to other times, routes or modes.',
              ],
              visual: { motif: 'grid', caption: 'Charge the spillover' },
              interaction: { type: 'reveal', prompt: 'Why tax pollution instead of banning it outright?', answer: 'A tax lets those who can cut pollution cheaply do so, while those for whom it is very costly can pay instead — reducing pollution at lower total cost than a uniform ban.' },
              sources: [{ sourceId: 'tfl-cc' }, { sourceId: 'pigou' }],
            },
            {
              id: 'ecn-externalities-4', kind: 'complication', title: 'Measuring the unmeasured',
              body: [
                'Pigouvian taxes need an estimate of the external cost, and those estimates are contested — how do you price lost fish, health effects or carbon decades from now?',
                'Set the tax too low and the problem continues; too high and you lose valuable activity. Economists often debate the number while agreeing on the logic.',
              ],
              visual: { motif: 'scales', caption: 'What’s the number?' },
            },
          ],
          quiz: [
            {
              id: 'ecn-externalities-q1', type: 'choice', conceptId: 'ecn-externality', skill: 'recognise', reelId: 'ecn-externalities-2',
              prompt: 'Which is a negative externality?',
              options: [
                { id: 'a', text: 'Late-night construction noise that keeps neighbours awake.', feedback: 'Correct — a cost on people outside the transaction.' },
                { id: 'b', text: 'A shop raising its prices.', feedback: 'That affects buyers inside the transaction.' },
                { id: 'c', text: 'Paying tax on your income.', feedback: 'A tax is a transfer, not a spillover from a transaction.' },
                { id: 'd', text: 'A neighbour planting flowers you enjoy.', feedback: 'That’s a positive externality.' },
              ],
              correctId: 'a',
              explanation: 'Externalities fall on third parties.',
              fresh: {
                id: 'ecn-externalities-q1f', type: 'choice', conceptId: 'ecn-externality', skill: 'recognise', reelId: 'ecn-externalities-2',
                prompt: 'Why does a negative externality lead to overproduction?',
                options: [
                  { id: 'a', text: 'Because the price doesn’t include the cost borne by third parties, so the good seems cheaper than it really is.', feedback: 'Yes — buyers respond to a price that leaves out part of the true cost, so they buy more than they would at the full cost.' },
                  { id: 'b', text: 'Because producers are always greedy.', feedback: 'It’s about prices, not motives.' },
                  { id: 'c', text: 'Because demand falls.', feedback: 'Underpricing raises the quantity demanded.' },
                ],
                correctId: 'a',
                explanation: 'Underpriced goods get overused.',
              },
            },
            {
              id: 'ecn-externalities-q2', type: 'choice', conceptId: 'ecn-pigouvian-tax', skill: 'apply', reelId: 'ecn-externalities-3',
              prompt: 'A city wants fewer single-use plastic bags. Which policy is most clearly Pigouvian?',
              options: [
                { id: 'a', text: 'A small charge per bag reflecting the litter and clean-up cost.', feedback: 'Yes — pricing the external cost into each bag.' },
                { id: 'b', text: 'An advertising campaign.', feedback: 'Persuasion, not pricing.' },
                { id: 'c', text: 'A subsidy for bag manufacturers.', feedback: 'That would increase bag use.' },
                { id: 'd', text: 'Doing nothing; markets handle it.', feedback: 'Markets don’t price costs that fall outside the transaction.' },
              ],
              correctId: 'a',
              explanation: 'A Pigouvian tax adds the external cost to the price.',
            },
            {
              id: 'ecn-externalities-q3', type: 'choice', conceptId: 'ecn-pigou-measurement', skill: 'reason', reelId: 'ecn-externalities-4',
              prompt: 'Two economists agree pollution should be taxed but recommend very different rates. What best explains their disagreement?',
              options: [
                { id: 'a', text: 'They estimate the external cost differently — the logic is shared, the number is uncertain.', feedback: 'Right.' },
                { id: 'b', text: 'One of them doesn’t understand externalities.', feedback: 'Disagreement about measurement isn’t ignorance.' },
                { id: 'c', text: 'Pigouvian taxes don’t depend on the external cost.', feedback: 'The tax is supposed to match it.' },
                { id: 'd', text: 'Taxes can never reduce pollution.', feedback: 'Evidence shows prices change behaviour.' },
              ],
              correctId: 'a',
              explanation: 'Valuing external costs involves contested assumptions.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ecn-hidden-costs-m1-ch',
        title: 'The airport question',
        scenario:
          'Fictional scenario. A region debates a €1 billion airport expansion. Supporters say construction creates 3,000 jobs. The land could instead host housing. Nearby towns would face more noise and air pollution. Exports of the region’s flowers by air could double.',
        questions: [
          {
            id: 'ecn-ch-q1', type: 'choice', conceptId: 'ecn-opportunity-cost', skill: 'apply', reelId: 'ecn-opportunity-3',
            prompt: 'What is the main opportunity cost of using the land for the airport?',
            options: [
              { id: 'a', text: 'The value of the housing that could have been built there.', feedback: 'Yes — the best alternative use of the land.' },
              { id: 'b', text: 'The 3,000 jobs.', feedback: 'Jobs are a claimed benefit, not the forgone alternative.' },
              { id: 'c', text: 'Nothing, if the land is currently empty.', feedback: 'Empty land still has alternative uses.' },
            ],
            correctId: 'a',
            explanation: 'Opportunity cost is the best alternative given up.',
          },
          {
            id: 'ecn-ch-q2', type: 'choice', conceptId: 'ecn-externality', skill: 'apply', reelId: 'ecn-externalities-2',
            prompt: 'Which part of the scenario is a negative externality?',
            options: [
              { id: 'a', text: 'Noise and pollution for nearby towns.', feedback: 'Correct — costs on third parties.' },
              { id: 'b', text: 'The construction cost.', feedback: 'That’s paid by the project itself.' },
              { id: 'c', text: 'Flower exports doubling.', feedback: 'That’s a benefit to producers.' },
            ],
            correctId: 'a',
            explanation: 'Spillovers onto people outside the deal are externalities.',
          },
          {
            id: 'ecn-ch-q3', type: 'choice', conceptId: 'ecn-seen-unseen', skill: 'reason', reelId: 'ecn-opportunity-4',
            prompt: 'Why is “it creates 3,000 jobs” a weak argument on its own?',
            options: [
              { id: 'a', text: 'The €1 billion spent elsewhere would also create jobs; the question is which use creates more value overall.', feedback: 'Exactly Bastiat’s “unseen”.' },
              { id: 'b', text: 'Jobs are never relevant.', feedback: 'They are relevant — but alternatives create jobs too.' },
              { id: 'c', text: 'Airports never create jobs.', feedback: 'They do; the issue is the comparison.' },
            ],
            correctId: 'a',
            explanation: 'Compare against the next-best use of the same resources.',
          },
        ],
      },
    },
  ],
}
