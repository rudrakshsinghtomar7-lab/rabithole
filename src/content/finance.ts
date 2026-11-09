import type { Path } from './types'

export const financeMoneyOverTime: Path = {
  id: 'fin-money-time',
  title: 'Money over time',
  origin: 'prepared',
  subjectId: 'finance',
  description:
    'The core ideas behind saving, borrowing and investing: compounding, inflation and real returns, and why spreading risk works. Educational, not financial advice.',
  familiarityNote: 'New to finance? We add a short primer on interest. With some background, it is skipped.',
  sources: [
    { id: 'investor-gov', title: 'Compound interest calculator and explanation', author: 'U.S. Securities and Exchange Commission — Investor.gov', kind: 'web', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { id: 'fisher', title: 'The Theory of Interest', author: 'Irving Fisher', year: '1930', kind: 'book' },
    { id: 'markowitz', title: '“Portfolio Selection”, The Journal of Finance 7(1), 77–91', author: 'Harry Markowitz', year: '1952', kind: 'article' },
    { id: 'bodie', title: 'Investments (chapters on risk, return and diversification)', author: 'Zvi Bodie, Alex Kane & Alan J. Marcus', year: '12th ed., 2021', kind: 'book' },
  ],
  modules: [
    {
      id: 'fin-money-time-m1',
      title: 'Growth, erosion and risk',
      summary: 'Three ideas that underpin almost every financial decision. Numbers are illustrative.',
      topics: [
        {
          id: 'fin-compound',
          title: 'Interest on interest',
          objective: 'Calculate and explain compound growth, compare it with simple interest, and estimate doubling time with the rule of 72.',
          prerequisite: 'Percentages.',
          nextStep: 'Next: a growing balance isn’t the same as growing buying power. You’ll separate nominal from real returns.',
          reels: [
            {
              id: 'fin-compound-1', kind: 'hook', title: 'Same rate, very different results', fictional: true,
              body: [
                'Fictional example. Two people each put €1,000 aside at 5% a year for 30 years. One is paid interest only on the original €1,000. The other earns interest on the interest too.',
                'The first ends with €2,500. The second ends with about €4,322.',
              ],
              visual: { motif: 'chart', caption: '€2,500 vs €4,322' },
              interaction: {
                type: 'poll', prompt: 'Run the numbers: where does the extra €1,822 come from?',
                options: [
                  { id: 'rate', text: 'A higher rate', response: 'Same 5% rate. The difference is what the interest is paid on.' },
                  { id: 'compound', text: 'Interest on interest', response: 'Yes — compounding. Each year’s interest joins the base that earns next year’s interest.' },
                ],
              },
            },
            {
              id: 'fin-compound-2', kind: 'context', title: 'What interest is', onlyFor: 'new',
              body: [
                'Interest is the price of using money over time. A saver earns it for lending money to a bank; a borrower pays it for using someone else’s money.',
                'A rate like 5% a year means 5% of the balance is added (or charged) each year.',
              ],
              visual: { motif: 'coins', caption: 'The price of time' },
            },
            {
              id: 'fin-compound-3', kind: 'explain', title: 'Simple vs compound',
              body: [
                'Simple interest: interest is paid only on the original amount. €1,000 at 5% earns €50 every year: €1,000 + 30 × €50 = €2,500 after 30 years.',
                'Compound interest: interest is added to the balance, so next year’s interest is calculated on a larger amount. The formula is P × (1 + r)ⁿ. €1,000 × 1.05³⁰ ≈ €4,322.',
                'Compounding works the same way on debt — an unpaid credit card balance grows on its own interest.',
              ],
              visual: { motif: 'curve', caption: 'P × (1 + r)ⁿ' },
              sources: [{ sourceId: 'investor-gov' }],
            },
            {
              id: 'fin-compound-4', kind: 'example', title: 'The rule of 72',
              body: [
                'A quick estimate: divide 72 by the annual percentage rate to get the approximate number of years to double. At 6%, about 12 years. At 9%, about 8.',
                'It’s an approximation that works well for typical rates. It also reveals why time matters so much: a balance that doubles every 12 years quadruples in 24.',
              ],
              visual: { motif: 'stack', caption: '72 ÷ rate' },
              interaction: { type: 'reveal', prompt: 'Roughly how long does money take to double at 4% a year?', answer: 'About 18 years (72 ÷ 4). The exact figure is about 17.7 years.' },
            },
            {
              id: 'fin-compound-5', kind: 'complication', title: 'Compounding assumes a lot',
              body: [
                'The tidy curve assumes the same rate every year, no withdrawals and no fees. Real returns vary, and a 1% annual fee also compounds — against you.',
                'The lesson isn’t a promise of growth; it’s that rates, fees and time interact multiplicatively, so small differences add up over decades.',
              ],
              visual: { motif: 'scales', caption: 'Fees compound too' },
            },
          ],
          quiz: [
            {
              id: 'fin-compound-q1', type: 'choice', conceptId: 'compound-vs-simple', skill: 'recognise', reelId: 'fin-compound-3',
              prompt: 'What makes compound interest different from simple interest?',
              options: [
                { id: 'a', text: 'Interest is earned on previously earned interest as well as the original amount.', feedback: 'Correct.' },
                { id: 'b', text: 'It always uses a higher rate.', feedback: 'The rate can be identical; the base differs.' },
                { id: 'c', text: 'It only applies to loans.', feedback: 'It applies to savings and debts alike.' },
                { id: 'd', text: 'Interest is paid only once at the end.', feedback: 'Compounding adds interest periodically to the balance.' },
              ],
              correctId: 'a',
              explanation: 'Compounding = interest on interest.',
              fresh: {
                id: 'fin-compound-q1f', type: 'choice', conceptId: 'compound-vs-simple', skill: 'recognise', reelId: 'fin-compound-3',
                prompt: '€500 at 10% simple interest for 3 years ends at €650. With annual compounding it ends at…',
                options: [
                  { id: 'a', text: '€665.50', feedback: 'Yes — 500 × 1.1³.' },
                  { id: 'b', text: '€650', feedback: 'That’s the simple-interest result.' },
                  { id: 'c', text: '€800', feedback: 'Too high — that would be 20% a year simple.' },
                ],
                correctId: 'a',
                explanation: '500 × 1.1 × 1.1 × 1.1 = 665.50.',
              },
            },
            {
              id: 'fin-compound-q2', type: 'choice', conceptId: 'rule-of-72', skill: 'apply', reelId: 'fin-compound-4',
              prompt: 'Using the rule of 72, roughly how long would it take a debt growing at 18% a year to double if nothing is repaid?',
              options: [
                { id: 'a', text: 'About 4 years.', feedback: 'Correct — 72 ÷ 18 = 4.' },
                { id: 'b', text: 'About 18 years.', feedback: 'That would be the doubling time at 4%.' },
                { id: 'c', text: 'About 12 years.', feedback: 'That’s the doubling time at 6%.' },
                { id: 'd', text: 'It never doubles.', feedback: 'Unpaid interest compounds, so it does.' },
              ],
              correctId: 'a',
              explanation: 'Doubling time ≈ 72 ÷ rate.',
              fresh: {
                id: 'fin-compound-q2f', type: 'choice', conceptId: 'rule-of-72', skill: 'apply', reelId: 'fin-compound-4',
                prompt: 'A balance doubles in about 8 years. Roughly what annual rate is it growing at?',
                options: [
                  { id: 'a', text: 'About 9%.', feedback: 'Yes — 72 ÷ 8.' },
                  { id: 'b', text: 'About 8%.', feedback: 'At 8% it would take about 9 years.' },
                  { id: 'c', text: 'About 72%.', feedback: 'Divide 72 by the years, not the other way round.' },
                ],
                correctId: 'a',
                explanation: 'Rate ≈ 72 ÷ doubling time.',
              },
            },
            {
              id: 'fin-compound-q3', type: 'choice', conceptId: 'fees-compound', skill: 'reason', reelId: 'fin-compound-5',
              prompt: 'Two savings products have the same growth before fees, but one charges 1% a year more. Why can this matter a lot over 30 years?',
              options: [
                { id: 'a', text: 'Fees reduce the balance that compounds each year, so the gap grows multiplicatively over time.', feedback: 'Right — fees compound against you.' },
                { id: 'b', text: 'It doesn’t; 1% is always trivial.', feedback: 'Over decades, small differences compound into large ones.' },
                { id: 'c', text: 'Fees only matter in the first year.', feedback: 'They’re charged every year on a growing balance.' },
                { id: 'd', text: 'Higher fees always mean higher returns.', feedback: 'There’s no such guarantee.' },
              ],
              correctId: 'a',
              explanation: 'Anything that reduces the yearly growth rate compounds over time.',
            },
          ],
        },
        {
          id: 'fin-real',
          title: 'Nominal isn’t real',
          objective: 'Distinguish nominal from real returns and estimate real returns by adjusting for inflation.',
          prerequisite: 'Compound growth (previous topic).',
          nextStep: 'Next: higher expected returns usually come with more risk. Diversification is how investors manage it.',
          reels: [
            {
              id: 'fin-real-1', kind: 'hook', title: 'More money, less to buy', fictional: true,
              body: [
                'Fictional example. Leila’s savings account pays 4% a year. Over the same year, prices rise by 6%.',
                'Her balance went up. Can she buy more with it?',
              ],
              visual: { motif: 'coins', caption: '+4% · prices +6%' },
              interaction: {
                type: 'poll', prompt: 'Run the numbers: is Leila better off?',
                options: [
                  { id: 'yes', text: 'Yes, she has more euros', response: 'More euros, but each buys less. What matters is what the money can buy.' },
                  { id: 'no', text: 'No, she can buy less', response: 'Right — her purchasing power fell by roughly 2%.' },
                ],
              },
            },
            {
              id: 'fin-real-2', kind: 'explain', title: 'Nominal and real',
              body: [
                'The nominal return is the percentage change in money. The real return is the change in purchasing power — what that money can buy.',
                'A good approximation, associated with Irving Fisher: real return ≈ nominal return − inflation. The exact version is (1 + nominal) ÷ (1 + inflation) − 1.',
              ],
              visual: { motif: 'scales', caption: 'Euros vs what they buy' },
              sources: [{ sourceId: 'fisher' }],
            },
            {
              id: 'fin-real-3', kind: 'example', title: 'Working it through',
              body: [
                'Leila: 4% nominal, 6% inflation. Approximation: 4 − 6 = −2%. Exact: 1.04 ÷ 1.06 − 1 ≈ −1.9%.',
                'A loan at 5% when inflation is 3% has a real cost of roughly 2%: the borrower repays in euros that are each worth a little less.',
              ],
              visual: { motif: 'chart', caption: '≈ −2% real' },
              interaction: {
                type: 'compare',
                left: { label: 'Saver at 4%, inflation 6%', text: 'Real return ≈ −2%: purchasing power falls.' },
                right: { label: 'Borrower at 5%, inflation 3%', text: 'Real cost ≈ 2%: cheaper than it looks.' },
              },
              sources: [{ sourceId: 'fisher' }],
            },
            {
              id: 'fin-real-4', kind: 'complication', title: 'Whose inflation?',
              body: [
                'Official inflation is an average across a basket of goods. Your own experience depends on what you buy — rent, food or fuel may rise faster or slower than the average.',
                'Real-return calculations are only as good as the inflation figure you use, so it’s worth asking which prices matter for the goal.',
              ],
              visual: { motif: 'grid', caption: 'Your basket' },
            },
          ],
          quiz: [
            {
              id: 'fin-real-q1', type: 'choice', conceptId: 'nominal-vs-real', skill: 'recognise', reelId: 'fin-real-2',
              prompt: 'What does a real return measure?',
              options: [
                { id: 'a', text: 'The change in purchasing power after accounting for inflation.', feedback: 'Correct.' },
                { id: 'b', text: 'The change in the number of euros.', feedback: 'That’s the nominal return.' },
                { id: 'c', text: 'The return before fees.', feedback: 'Fees are a separate adjustment.' },
                { id: 'd', text: 'The highest possible return.', feedback: '“Real” refers to inflation adjustment, not maximum.' },
              ],
              correctId: 'a',
              explanation: 'Real = adjusted for inflation.',
              fresh: {
                id: 'fin-real-q1f', type: 'choice', conceptId: 'nominal-vs-real', skill: 'recognise', reelId: 'fin-real-2',
                prompt: 'An account pays 3% while inflation is 3%. The real return is about…',
                options: [
                  { id: 'a', text: '0% — purchasing power is unchanged.', feedback: 'Yes — the balance grows exactly as fast as prices, so it buys the same amount as before.' },
                  { id: 'b', text: '3%.', feedback: 'That’s the nominal return.' },
                  { id: 'c', text: '6%.', feedback: 'Inflation is subtracted, not added.' },
                ],
                correctId: 'a',
                explanation: 'Real ≈ nominal − inflation.',
              },
            },
            {
              id: 'fin-real-q2', type: 'choice', conceptId: 'nominal-vs-real', skill: 'apply', reelId: 'fin-real-3',
              prompt: 'An investment returns 7% nominal in a year with 2% inflation. What is the approximate real return?',
              options: [
                { id: 'a', text: 'About 5%.', feedback: 'Correct — 7 − 2 (exactly ≈ 4.9%).' },
                { id: 'b', text: 'About 9%.', feedback: 'Inflation reduces the real return.' },
                { id: 'c', text: 'About 7%.', feedback: 'That ignores inflation.' },
                { id: 'd', text: 'About 3.5%.', feedback: 'Subtract inflation; don’t divide the return in half.' },
              ],
              correctId: 'a',
              explanation: 'Approximate real return = nominal − inflation.',
            },
            {
              id: 'fin-real-q3', type: 'choice', conceptId: 'personal-inflation', skill: 'reason', reelId: 'fin-real-4',
              prompt: 'A student’s savings beat official inflation, but rent rose much faster. Why might they still feel worse off?',
              options: [
                { id: 'a', text: 'Their personal inflation — weighted by what they actually buy — was higher than the average used officially.', feedback: 'Right.' },
                { id: 'b', text: 'Official inflation is always wrong.', feedback: 'It’s an average, not wrong — it just may not match one person.' },
                { id: 'c', text: 'Real returns can’t be negative.', feedback: 'They can, when prices rise faster than returns.' },
                { id: 'd', text: 'Rent isn’t a real cost.', feedback: 'For many students it’s the largest cost.' },
              ],
              correctId: 'a',
              explanation: 'Use the inflation that matches the spending you care about.',
            },
          ],
        },
        {
          id: 'fin-diversify',
          title: 'Don’t put it all in one basket',
          objective: 'Explain why combining assets that don’t move together reduces risk, and distinguish risk that can be diversified away from risk that cannot.',
          prerequisite: 'Returns (previous topics). No maths beyond averages.',
          nextStep: 'You’ve finished this module’s core. The challenge combines compounding, inflation and risk.',
          reels: [
            {
              id: 'fin-diversify-1', kind: 'hook', title: 'Umbrellas and sunglasses', fictional: true,
              body: [
                'Fictional example. One company sells umbrellas, another sells sunglasses. In a rainy year the first does well and the second badly; in a sunny year, the reverse.',
                'Owning only one is a bet on the weather. What happens if you own half of each?',
              ],
              visual: { motif: 'grid', caption: 'Rain or shine' },
              interaction: {
                type: 'poll', prompt: 'Run the numbers: what does owning both do?',
                options: [
                  { id: 'smooth', text: 'Smooths the results', response: 'Yes — when one does badly, the other tends to do well, so the combined result swings less.' },
                  { id: 'double', text: 'Doubles the risk', response: 'Owning two things that move in opposite directions reduces the overall swing.' },
                ],
              },
            },
            {
              id: 'fin-diversify-2', kind: 'explain', title: 'Why diversification works',
              body: [
                'In finance, risk usually means how much returns vary. Harry Markowitz showed in 1952 that a portfolio’s risk depends not just on each asset’s risk but on how the assets move relative to each other — their correlation.',
                'Combining assets that aren’t perfectly correlated can reduce overall variability without necessarily reducing the average expected return.',
              ],
              visual: { motif: 'curve', caption: 'It’s the correlation' },
              sources: [{ sourceId: 'markowitz' }, { sourceId: 'bodie' }],
            },
            {
              id: 'fin-diversify-3', kind: 'example', title: 'Two kinds of risk',
              body: [
                'Specific (idiosyncratic) risk belongs to one company or sector: a failed product, a scandal, a bad harvest. Holding many unrelated assets dilutes it.',
                'Systematic (market) risk affects almost everything at once: a recession, a financial crisis, a sharp change in interest rates. Diversification can’t remove it.',
              ],
              visual: { motif: 'stack', caption: 'Specific vs systematic' },
              interaction: { type: 'reveal', prompt: 'Is a global recession specific or systematic risk?', answer: 'Systematic — it hits most assets together, so holding more of them doesn’t remove it.' },
              sources: [{ sourceId: 'bodie' }],
            },
            {
              id: 'fin-diversify-4', kind: 'complication', title: 'When correlations jump',
              body: [
                'Assets that usually move independently can fall together in a crisis, just when diversification is needed most.',
                'Diversification reduces risk; it doesn’t eliminate it, and past patterns of correlation are not guarantees. This is a concept to understand, not a recommendation to buy anything.',
              ],
              visual: { motif: 'chart', caption: 'Crises connect' },
            },
          ],
          quiz: [
            {
              id: 'fin-diversify-q1', type: 'choice', conceptId: 'diversification', skill: 'recognise', reelId: 'fin-diversify-2',
              prompt: 'Why does combining assets reduce a portfolio’s overall risk?',
              options: [
                { id: 'a', text: 'Because assets that don’t move perfectly together partly offset each other’s ups and downs.', feedback: 'Correct.' },
                { id: 'b', text: 'Because owning more assets guarantees higher returns.', feedback: 'Diversification is about risk, not guaranteed returns.' },
                { id: 'c', text: 'Because each asset becomes less risky individually.', feedback: 'The assets don’t change; the combination does.' },
                { id: 'd', text: 'It doesn’t reduce risk.', feedback: 'With imperfect correlation, it does.' },
              ],
              correctId: 'a',
              explanation: 'Imperfect correlation lets swings partly cancel.',
              fresh: {
                id: 'fin-diversify-q1f', type: 'choice', conceptId: 'diversification', skill: 'recognise', reelId: 'fin-diversify-2',
                prompt: 'Which pair offers the least diversification benefit?',
                options: [
                  { id: 'a', text: 'Two companies in the same industry that rise and fall together.', feedback: 'Yes — highly correlated assets barely offset each other.' },
                  { id: 'b', text: 'An umbrella maker and a sunglasses maker.', feedback: 'These tend to move in opposite directions — good diversification.' },
                  { id: 'c', text: 'Assets from unrelated sectors and countries.', feedback: 'Those usually offer more diversification.' },
                ],
                correctId: 'a',
                explanation: 'High correlation = little diversification.',
              },
            },
            {
              id: 'fin-diversify-q2', type: 'choice', conceptId: 'specific-vs-systematic', skill: 'apply', reelId: 'fin-diversify-3',
              prompt: 'Which risk can be reduced by holding many unrelated investments?',
              options: [
                { id: 'a', text: 'One company’s product recall.', feedback: 'Correct — specific risk diversifies away.' },
                { id: 'b', text: 'A worldwide recession.', feedback: 'That’s systematic risk.' },
                { id: 'c', text: 'A global rise in interest rates.', feedback: 'That affects most assets — systematic.' },
                { id: 'd', text: 'None of them.', feedback: 'Specific risk can be reduced.' },
              ],
              correctId: 'a',
              explanation: 'Diversification removes specific, not systematic, risk.',
            },
            {
              id: 'fin-diversify-q3', type: 'choice', conceptId: 'diversification-limits', skill: 'reason', reelId: 'fin-diversify-4',
              prompt: 'A friend says: “I own 20 different shares, so I can’t lose much.” What’s the best response?',
              options: [
                { id: 'a', text: 'Diversification reduces specific risk, but systematic risk remains — and correlations can rise in a crisis.', feedback: 'Right.' },
                { id: 'b', text: 'Twenty shares eliminates all risk.', feedback: 'Market-wide risk remains.' },
                { id: 'c', text: 'Owning more shares increases risk.', feedback: 'Usually it reduces specific risk.' },
                { id: 'd', text: 'Risk only matters for large investors.', feedback: 'Risk matters at any size.' },
              ],
              correctId: 'a',
              explanation: 'Diversification has limits.',
            },
          ],
        },
      ],
      challenge: {
        id: 'fin-money-time-m1-ch',
        title: 'Two plans',
        scenario:
          'Fictional scenario for learning only. Plan A: a savings account paying 3% a year, with inflation at 4%. Plan B: an investment expected (not guaranteed) to grow 7% a year on average, spread across many unrelated assets, with a 1% annual fee. Both are compared over 20 years.',
        questions: [
          {
            id: 'fin-ch-q1', type: 'choice', conceptId: 'nominal-vs-real', skill: 'apply', reelId: 'fin-real-2',
            prompt: 'What is Plan A’s approximate real return?',
            options: [
              { id: 'a', text: 'About −1% a year.', feedback: 'Yes — 3 − 4.' },
              { id: 'b', text: 'About 3% a year.', feedback: 'That’s nominal.' },
              { id: 'c', text: 'About 7% a year.', feedback: 'That’s inflation plus nominal, which isn’t meaningful.' },
            ],
            correctId: 'a',
            explanation: 'Real ≈ nominal − inflation.',
          },
          {
            id: 'fin-ch-q2', type: 'choice', conceptId: 'fees-compound', skill: 'apply', reelId: 'fin-compound-5',
            prompt: 'How should the 1% fee in Plan B be treated?',
            options: [
              { id: 'a', text: 'Subtract it from the growth rate each year — it compounds, so expect roughly 6% before inflation.', feedback: 'Correct.' },
              { id: 'b', text: 'Ignore it; 1% is negligible.', feedback: 'Over 20 years it compounds into a meaningful difference.' },
              { id: 'c', text: 'Subtract 1% once at the end.', feedback: 'The fee is charged every year.' },
            ],
            correctId: 'a',
            explanation: 'Fees reduce the compounding rate.',
          },
          {
            id: 'fin-ch-q3', type: 'choice', conceptId: 'diversification-limits', skill: 'reason', reelId: 'fin-diversify-4',
            prompt: 'What is the most accurate statement about Plan B’s risk?',
            options: [
              { id: 'a', text: 'Spreading across many assets reduces specific risk, but returns can still vary widely and fall in a market-wide downturn.', feedback: 'Exactly — higher expected return comes with risk that diversification can’t remove.' },
              { id: 'b', text: 'Diversification guarantees the 7%.', feedback: 'Nothing guarantees an expected return.' },
              { id: 'c', text: 'Plan B has no risk because it is diversified.', feedback: 'Systematic risk remains.' },
            ],
            correctId: 'a',
            explanation: 'Understanding the trade-off is the goal — this isn’t advice about which plan to choose.',
          },
        ],
      },
    },
  ],
}
