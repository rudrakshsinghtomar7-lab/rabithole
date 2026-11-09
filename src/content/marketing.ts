import type { Path } from './types'

export const marketingPositioning: Path = {
  id: 'mkt-positioning',
  title: 'A product. A person. A reason.',
  origin: 'prepared',
  subjectId: 'marketing',
  description:
    'Practical marketing decisions: choosing who to serve, turning features into reasons to care, and positioning against the alternatives your audience already has.',
  familiarityNote:
    'New to marketing? We add primers on key terms. With some background, those are skipped.',
  sources: [
    { id: 'ries-trout', title: 'Positioning: The Battle for Your Mind', author: 'Al Ries & Jack Trout', year: '1981', kind: 'book' },
    { id: 'kotler', title: 'Marketing Management (segmentation, targeting and positioning chapters)', author: 'Philip Kotler & Kevin Lane Keller', year: '15th ed., 2016', kind: 'book' },
    { id: 'levitt', title: 'The Marketing Imagination (the “quarter-inch hole” passage)', author: 'Theodore Levitt', year: '1983', kind: 'book' },
    { id: 'christensen', title: 'Competing Against Luck: The Story of Innovation and Customer Choice', author: 'Clayton M. Christensen et al.', year: '2016', kind: 'book' },
    { id: 'kohavi', title: 'Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing', author: 'Ron Kohavi, Diane Tang & Ya Xu', year: '2020', kind: 'book' },
  ],
  modules: [
    {
      id: 'mkt-positioning-m1',
      title: 'From product to positioning',
      summary: 'Audience, message and position — the three decisions behind every campaign. Scenarios are fictional; the reasoning is real.',
      topics: [
        {
          id: 'mkt-audience',
          title: 'Who is it for?',
          objective: 'Choose a target segment by matching a product’s strengths to a group’s specific situation, and explain why “everyone” is a weak target.',
          prerequisite: 'None.',
          nextStep: 'Next: once you know who, you need to know what to say. You’ll turn features into benefits.',
          reels: [
            {
              id: 'mkt-audience-1', kind: 'hook', title: 'A product. A person. A reason.', fictional: true,
              body: [
                'Fictional scenario. A small company makes a fully waterproof backpack with a padded laptop sleeve and reflective strips. It costs more than a basic bag.',
                'They can afford one campaign this term. Who should it speak to?',
              ],
              visual: { motif: 'target', caption: 'One bag, many people' },
              interaction: {
                type: 'poll', prompt: 'Make your move: pick the first audience.',
                options: [
                  { id: 'all', text: 'All students', response: 'Big reach, but a weak reason: most students don’t need waterproofing, and the price is higher. The message gets diluted.' },
                  { id: 'cyclists', text: 'Students who cycle', response: 'Strong fit: rain, laptops and visibility at dusk are their real problems. Every feature has a reason to exist for them.' },
                  { id: 'hikers', text: 'Weekend hikers', response: 'They value waterproofing, but the laptop sleeve is wasted and they compare against specialist outdoor brands.' },
                ],
              },
            },
            {
              id: 'mkt-audience-2', kind: 'context', title: 'Segment, target, position', onlyFor: 'new',
              body: [
                'Segmentation splits a market into groups with different needs or situations. Targeting chooses which groups to serve. Positioning decides how you want those people to think of you compared with alternatives.',
                'These three choices come before writing a single ad.',
              ],
              visual: { motif: 'grid', caption: 'S · T · P' },
              sources: [{ sourceId: 'kotler' }],
            },
            {
              id: 'mkt-audience-3', kind: 'explain', title: 'Segments by situation, not just demographics',
              body: [
                'Age and income are easy to measure but often say little about why someone buys. “Students aged 18–24” includes people who drive, walk, take the bus and cycle — with very different problems.',
                'Segmenting by situation (“rides to class in all weather with a laptop”) points directly at a need your product can meet. Christensen calls this the “job” a customer hires a product to do.',
              ],
              visual: { motif: 'figure', caption: 'Same age, different day' },
              sources: [{ sourceId: 'christensen' }, { sourceId: 'kotler' }],
            },
            {
              id: 'mkt-audience-4', kind: 'example', title: 'Scoring a segment',
              body: [
                'A quick way to compare segments: fit (do our strengths solve their problem?), size (are there enough of them?), reach (can we get the message to them affordably?) and competition (who already serves them?).',
                'Cycling students score high on fit and reach — bike racks, campus cycling clubs and student media make them easy to find — even if the segment is smaller.',
              ],
              visual: { motif: 'stack', caption: 'Fit · size · reach · rivals' },
              interaction: { type: 'reveal', prompt: 'Why might a smaller segment beat a bigger one?', answer: 'A strong fit means a higher share will buy and pay the premium, and a focused message costs less to deliver. A small segment you win can be worth more than a big one you barely reach.' },
            },
            {
              id: 'mkt-audience-5', kind: 'complication', title: 'The cost of choosing',
              body: [
                'Targeting means accepting that some people won’t feel spoken to. That feels risky — but a message for everyone tends to give no one a strong reason.',
                'The choice is a hypothesis: “Cycling students will value this enough to pay more.” Treat it as something to test, not a fact.',
              ],
              visual: { motif: 'arrow', caption: 'Choose, then test' },
            },
          ],
          quiz: [
            {
              id: 'mkt-audience-q1', type: 'choice', conceptId: 'segmentation-targeting', skill: 'recognise', reelId: 'mkt-audience-3',
              prompt: 'Which is the most useful segment for the waterproof backpack?',
              options: [
                { id: 'a', text: 'Students who commute by bike in all weather while carrying a laptop.', feedback: 'Right — defined by the situation the product solves.' },
                { id: 'b', text: 'People aged 18–24.', feedback: 'Easy to measure, but mixes drivers, walkers and cyclists with different needs.' },
                { id: 'c', text: 'Anyone who owns a backpack.', feedback: 'That’s the whole market, not a segment.' },
                { id: 'd', text: 'Students with high incomes.', feedback: 'Income affects willingness to pay, but doesn’t tie to why waterproofing matters.' },
              ],
              correctId: 'a',
              explanation: 'Segments defined by situation and need point directly to why your product matters.',
              altExample: 'A noise-cancelling headset: “people who take calls in open-plan offices” beats “professionals aged 25–40.”',
              fresh: {
                id: 'mkt-audience-q1f', type: 'choice', conceptId: 'segmentation-targeting', skill: 'recognise', reelId: 'mkt-audience-3',
                prompt: 'A meal-prep kit takes 10 minutes and needs only a microwave. Which segment fits best?',
                options: [
                  { id: 'a', text: 'Students in shared housing with limited kitchen access and little time.', feedback: 'Yes — their situation matches every feature.' },
                  { id: 'b', text: 'Home cooks who enjoy elaborate recipes.', feedback: 'They value cooking itself; a 10-minute microwave kit removes what they enjoy.' },
                  { id: 'c', text: 'Everyone who eats.', feedback: 'Too broad to give anyone a specific reason.' },
                ],
                correctId: 'a',
                explanation: 'Match product strengths to a specific situation.',
              },
            },
            {
              id: 'mkt-audience-q2', type: 'choice', conceptId: 'segment-scoring', skill: 'apply', reelId: 'mkt-audience-4',
              passage: 'Fictional scenario. A language-learning app is choosing between (A) all university students — large, but already crowded with free competitors; and (B) international students in their first semester — smaller, reachable through orientation week, with an urgent need to follow lectures.',
              prompt: 'Which choice is better supported, and why?',
              options: [
                { id: 'a', text: 'B: stronger fit, urgent need and cheap reach outweigh the smaller size.', feedback: 'Yes — fit, reach and competition all favour B.' },
                { id: 'b', text: 'A: a larger segment always produces more revenue.', feedback: 'Size alone ignores fit, reach and competition. Winning a small segment can beat losing a big one.' },
                { id: 'c', text: 'A: free competitors prove there is demand.', feedback: 'They also mean you must out-compete free products — a weak position for a new app.' },
                { id: 'd', text: 'Neither; the app should target everyone.', feedback: 'Targeting everyone usually means no one feels it’s for them.' },
              ],
              correctId: 'a',
              explanation: 'Weigh fit, size, reach and competition together rather than size alone.',
            },
            {
              id: 'mkt-audience-q3', type: 'choice', conceptId: 'targeting-as-hypothesis', skill: 'reason', reelId: 'mkt-audience-5',
              prompt: 'Why should a targeting decision be treated as a hypothesis?',
              options: [
                { id: 'a', text: 'It rests on assumptions about what people need and will pay for, which may be wrong and can be tested.', feedback: 'Exactly — state it, then look for evidence.' },
                { id: 'b', text: 'Because marketing decisions can’t be evaluated.', feedback: 'They can — through tests, sales and feedback.' },
                { id: 'c', text: 'Because the target should change every week.', feedback: 'Testing doesn’t mean constant change; it means updating when evidence warrants it.' },
                { id: 'd', text: 'Because the best segment is always the largest.', feedback: 'That’s an assumption too — and often false.' },
              ],
              correctId: 'a',
              explanation: 'Targeting encodes assumptions. Making them explicit lets you test them.',
            },
          ],
        },
        {
          id: 'mkt-message',
          title: 'Features tell, benefits sell',
          objective: 'Translate product features into audience-specific benefits and select the message that best serves a stated objective.',
          prerequisite: 'Choosing a target segment (previous topic).',
          nextStep: 'Next: your audience compares you with alternatives. You’ll write a positioning statement.',
          reels: [
            {
              id: 'mkt-message-1', kind: 'hook', title: 'Which line connects?', fictional: true,
              body: [
                'Fictional scenario. The backpack company is targeting students who cycle to class. Objective: get them to try the bag at the campus bike-repair day.',
                'Which headline would you put on the stand?',
              ],
              visual: { motif: 'arrow', caption: 'One line, one reason' },
              interaction: {
                type: 'poll', prompt: 'Make your move: choose the headline.',
                options: [
                  { id: 'spec', text: '“600D TPU-coated fabric, IPX6 rated”', response: 'Accurate, but it makes the reader do the translation. Most people don’t know what IPX6 means for their day.' },
                  { id: 'benefit', text: '“Ride through the rain. Arrive with a dry laptop.”', response: 'That ties the feature to their exact situation and the outcome they care about.' },
                  { id: 'vague', text: '“Premium quality for modern life”', response: 'It could describe any product. Nothing connects to a cyclist’s morning.' },
                ],
              },
            },
            {
              id: 'mkt-message-2', kind: 'explain', title: 'Feature → advantage → benefit',
              body: [
                'A feature is what the product has: a waterproof coating. An advantage is what that does: keeps water out. A benefit is what that means for this person: “your laptop survives the ride.”',
                'Theodore Levitt popularised the point with the line that people don’t want a quarter-inch drill; they want a quarter-inch hole.',
                'Benefits are audience-specific. The same feature produces different benefits for different segments.',
              ],
              visual: { motif: 'stack', caption: 'Has → does → means' },
              sources: [{ sourceId: 'levitt' }],
            },
            {
              id: 'mkt-message-3', kind: 'example', title: 'Same feature, two audiences',
              body: [
                'Reflective strips, for a cycling student: “Be seen on the ride home after evening lectures.”',
                'Reflective strips, for a parent buying for a teenager: “More visible on dark winter walks to school.”',
                'Same fact, different reason to care. The segment decides which benefit leads.',
              ],
              visual: { motif: 'grid', caption: 'One feature, two reasons' },
              interaction: {
                type: 'compare',
                left: { label: 'Cycling student', text: 'Be seen on the ride home after evening lectures.' },
                right: { label: 'Parent', text: 'More visible on dark winter walks to school.' },
              },
            },
            {
              id: 'mkt-message-4', kind: 'complication', title: 'The objective decides',
              body: [
                'There is no single best message — only the best message for an objective. To drive a trial at a stand, lead with a vivid, immediate benefit. To justify a premium price online, proof (“survived 200 test rides in rain”) may matter more.',
                'And when two messages both seem good, run a controlled test rather than relying on the loudest opinion in the room.',
              ],
              visual: { motif: 'target', caption: 'Message follows objective' },
              sources: [{ sourceId: 'kohavi' }],
            },
          ],
          quiz: [
            {
              id: 'mkt-message-q1', type: 'choice', conceptId: 'feature-vs-benefit', skill: 'recognise', reelId: 'mkt-message-2',
              prompt: 'Which statement is a benefit rather than a feature?',
              options: [
                { id: 'a', text: '“Your notes stay dry on the wettest commute.”', feedback: 'Correct: it expresses what the feature means for the person.' },
                { id: 'b', text: '“Made with TPU-coated 600D fabric.”', feedback: 'That’s a feature — a property of the product.' },
                { id: 'c', text: '“IPX6 water-resistance rating.”', feedback: 'That’s a technical specification, a feature.' },
                { id: 'd', text: '“Sealed, welded seams.”', feedback: 'That’s a feature; its benefit is what the seams mean for the user.' },
              ],
              correctId: 'a',
              explanation: 'Features describe the product. Benefits describe the outcome for a specific person.',
              altExample: 'A phone’s 5,000 mAh battery is a feature; “gets you through a festival weekend” is the benefit.',
              fresh: {
                id: 'mkt-message-q1f', type: 'choice', conceptId: 'feature-vs-benefit', skill: 'recognise', reelId: 'mkt-message-2',
                prompt: 'Turn this feature into a benefit for commuting students: “Weighs 700 g.”',
                options: [
                  { id: 'a', text: '“Light enough that you forget it’s on your back on the way up the hill.”', feedback: 'Yes — the weight translated into their experience.' },
                  { id: 'b', text: '“Only 700 grams.”', feedback: 'That restates the feature.' },
                  { id: 'c', text: '“Lightest bag in the world.”', feedback: 'An unsupported claim, and still about the bag, not the person.' },
                ],
                correctId: 'a',
                explanation: 'Benefits connect a property to the audience’s situation.',
              },
            },
            {
              id: 'mkt-message-q2', type: 'choice', conceptId: 'audience-specific-benefit', skill: 'apply', reelId: 'mkt-message-3',
              prompt: 'The backpack’s padded laptop sleeve, for a design student who carries a tablet to studio sessions. Which message fits best?',
              options: [
                { id: 'a', text: '“Your tablet arrives at studio as safe as it left home.”', feedback: 'Yes — the benefit framed for this person’s situation.' },
                { id: 'b', text: '“Fits laptops up to 15 inches.”', feedback: 'True, but that’s a feature and not about their tablet.' },
                { id: 'c', text: '“The choice of serious cyclists.”', feedback: 'That message was built for a different segment.' },
                { id: 'd', text: '“Padded with 10 mm foam.”', feedback: 'A feature; it doesn’t say what that means for them.' },
              ],
              correctId: 'a',
              explanation: 'The same feature yields different benefits for different audiences.',
            },
            {
              id: 'mkt-message-q3', type: 'choice', conceptId: 'objective-drives-message', skill: 'reason', reelId: 'mkt-message-4',
              prompt: 'Two headlines tested well in a team discussion. The objective is online sales at a premium price. What is the most defensible next step?',
              options: [
                { id: 'a', text: 'Run a controlled test of both against the actual objective — completed purchases — before committing.', feedback: 'Right: test against the objective, not opinions.' },
                { id: 'b', text: 'Use the one the most senior person prefers.', feedback: 'Seniority isn’t evidence about customers.' },
                { id: 'c', text: 'Use both headlines in the same ad.', feedback: 'That muddles the message and tells you nothing about which works.' },
                { id: 'd', text: 'Pick the one with more clicks in a different campaign.', feedback: 'Clicks in another context may not predict purchases at a premium price.' },
              ],
              correctId: 'a',
              explanation: 'Messages are hypotheses. Test them against the outcome you actually care about.',
            },
          ],
        },
        {
          id: 'mkt-position',
          title: 'Against what?',
          objective: 'Write a positioning statement that names the target, frame of reference, point of difference and reason to believe.',
          prerequisite: 'Targeting and benefits (previous topics).',
          nextStep: 'You’ve finished this module’s core. Try the challenge to combine audience, message and position.',
          reels: [
            {
              id: 'mkt-position-1', kind: 'hook', title: 'Compared to what?', fictional: true,
              body: [
                'Fictional scenario. A cycling student sees the backpack. In their head, it’s instantly compared to something: their current bag plus a plastic rain cover? A cheaper supermarket bag? A specialist courier bag?',
                'Whatever they compare it to decides whether the price looks fair.',
              ],
              visual: { motif: 'scales', caption: 'The silent comparison' },
              interaction: {
                type: 'poll', prompt: 'Make your move: what should they compare it to?',
                options: [
                  { id: 'cover', text: 'Bag + rain cover', response: 'Smart: the bag wins on convenience and reliability, and the combined cost isn’t far off.' },
                  { id: 'cheap', text: 'Cheap backpacks', response: 'Risky: next to cheap bags, the premium looks like a cost rather than a benefit.' },
                  { id: 'courier', text: 'Courier bags', response: 'Possible, but those brands own credibility with serious cyclists — a hard fight to start with.' },
                ],
              },
            },
            {
              id: 'mkt-position-2', kind: 'explain', title: 'Positioning lives in the mind',
              body: [
                'Ries and Trout argued that positioning isn’t what you do to a product — it’s what you do to the mind of the prospect: the place your product occupies relative to alternatives.',
                'A positioning statement makes the choice explicit: For [target] who [need], [brand] is the [frame of reference] that [point of difference], because [reason to believe].',
              ],
              visual: { motif: 'target', caption: 'A place in the mind' },
              sources: [{ sourceId: 'ries-trout' }, { sourceId: 'kotler' }],
            },
            {
              id: 'mkt-position-3', kind: 'example', title: 'Filling in the template',
              body: [
                'For students who cycle to class in all weather, Dryline is the everyday campus backpack that keeps a laptop completely dry without a separate rain cover, because its welded seams and roll-top seal passed 200 rain-ride tests.',
                'Each part does a job: target (who), frame of reference (what category they compare in), point of difference (why us), reason to believe (why trust it).',
              ],
              visual: { motif: 'grid', caption: 'Four slots' },
              interaction: { type: 'reveal', prompt: 'Which part sets the price comparison?', answer: 'The frame of reference — “everyday campus backpack” — determines which alternatives the buyer weighs it against.' },
            },
            {
              id: 'mkt-position-4', kind: 'complication', title: 'Different, but does it matter?',
              body: [
                'A point of difference only counts if the target cares about it and believes it. “Comes in 12 colours” is different but may not matter to a cyclist worried about rain.',
                'And claims must be supportable. An unbacked “most waterproof bag ever” invites distrust — and in many places breaches advertising rules.',
              ],
              visual: { motif: 'curve', caption: 'Relevant · credible · different' },
            },
          ],
          quiz: [
            {
              id: 'mkt-position-q1', type: 'choice', conceptId: 'positioning-parts', skill: 'recognise', reelId: 'mkt-position-2',
              prompt: 'In a positioning statement, what does the “frame of reference” do?',
              options: [
                { id: 'a', text: 'It names the category of alternatives the target will compare the product with.', feedback: 'Correct.' },
                { id: 'b', text: 'It names the audience.', feedback: 'That’s the target.' },
                { id: 'c', text: 'It gives evidence for the claim.', feedback: 'That’s the reason to believe.' },
                { id: 'd', text: 'It states the price.', feedback: 'Price isn’t part of the template, though the frame of reference strongly affects how it’s perceived.' },
              ],
              correctId: 'a',
              explanation: 'The frame of reference sets the comparison — and so how value and price are judged.',
              fresh: {
                id: 'mkt-position-q1f', type: 'choice', conceptId: 'positioning-parts', skill: 'recognise', reelId: 'mkt-position-2',
                prompt: 'In “…because its welded seams passed 200 rain-ride tests,” which part is this?',
                options: [
                  { id: 'a', text: 'Reason to believe.', feedback: 'Yes — evidence supporting the claim.' },
                  { id: 'b', text: 'Point of difference.', feedback: 'The difference is staying dry without a cover; this sentence supports it.' },
                  { id: 'c', text: 'Frame of reference.', feedback: 'The frame is the category it competes in.' },
                ],
                correctId: 'a',
                explanation: 'The reason to believe makes the point of difference credible.',
              },
            },
            {
              id: 'mkt-position-q2', type: 'choice', conceptId: 'frame-of-reference-choice', skill: 'apply', reelId: 'mkt-position-1',
              passage: 'Fictional scenario. A premium reusable coffee cup costs €25. It keeps drinks hot for 3 hours and fits under café machines.',
              prompt: 'Which frame of reference best supports its price with commuting students?',
              options: [
                { id: 'a', text: 'Daily disposable cups and the café discounts a reusable cup earns over a term.', feedback: 'Yes — against that comparison, €25 can pay for itself.' },
                { id: 'b', text: 'Basic €5 plastic tumblers.', feedback: 'That comparison makes €25 look expensive.' },
                { id: 'c', text: 'Luxury designer homeware.', feedback: 'Wrong category for a commuting student’s decision.' },
                { id: 'd', text: 'No frame; let customers decide.', feedback: 'Customers will choose a frame anyway — often the least flattering one.' },
              ],
              correctId: 'a',
              explanation: 'Choose a frame where your difference is meaningful and your price looks justified.',
            },
            {
              id: 'mkt-position-q3', type: 'choice', conceptId: 'relevant-credible-difference', skill: 'reason', reelId: 'mkt-position-4',
              prompt: 'Why is “the most stylish waterproof bag” a weak point of difference for cycling students worried about rain?',
              options: [
                { id: 'a', text: 'It isn’t clearly tied to their main concern and is hard to prove, so it’s neither strongly relevant nor credible.', feedback: 'Right — relevance and credibility both matter.' },
                { id: 'b', text: 'Style never matters in marketing.', feedback: 'Style can matter a lot — just not as the lead reason for this segment’s main need.' },
                { id: 'c', text: 'It’s too specific.', feedback: 'Specificity usually helps; the problem is relevance and proof.' },
                { id: 'd', text: 'It mentions waterproofing.', feedback: 'Waterproofing is relevant; the weak part is “most stylish.”' },
              ],
              correctId: 'a',
              explanation: 'A strong point of difference is relevant, credible and distinctive.',
            },
          ],
        },
      ],
      challenge: {
        id: 'mkt-positioning-m1-ch',
        title: 'Launch week',
        scenario:
          'Fictional scenario. A startup sells a compact, quiet desk fan that clips to a laptop screen and runs from USB. It costs €29. Possible audiences: (1) students in hot shared libraries; (2) office workers with air conditioning; (3) gamers. The goal is 300 sales in the first month with a small budget.',
        questions: [
          {
            id: 'mkt-ch-q1', type: 'choice', conceptId: 'segment-scoring', skill: 'apply', reelId: 'mkt-audience-4',
            prompt: 'Which audience is the strongest first target?',
            options: [
              { id: 'a', text: 'Students in hot shared libraries — clear need, quiet matters there, reachable on campus.', feedback: 'Yes — fit and reach align.' },
              { id: 'b', text: 'Office workers with air conditioning.', feedback: 'Air conditioning weakens the need.' },
              { id: 'c', text: 'Gamers, because they spend the most.', feedback: 'Spending power doesn’t create a need for a clip-on fan.' },
            ],
            correctId: 'a',
            explanation: 'Fit and reach outweigh assumptions about spending.',
          },
          {
            id: 'mkt-ch-q2', type: 'choice', conceptId: 'audience-specific-benefit', skill: 'apply', reelId: 'mkt-message-3',
            prompt: 'Which headline best serves that audience?',
            options: [
              { id: 'a', text: '“Stay cool in the library — quiet enough that no one notices.”', feedback: 'Yes — benefit plus the specific constraint.' },
              { id: 'b', text: '“5V USB, 2,400 RPM brushless motor.”', feedback: 'Features without a reason to care.' },
              { id: 'c', text: '“The ultimate gaming accessory.”', feedback: 'Wrong segment.' },
            ],
            correctId: 'a',
            explanation: 'Lead with the benefit that fits the segment’s situation.',
          },
          {
            id: 'mkt-ch-q3', type: 'choice', conceptId: 'targeting-as-hypothesis', skill: 'reason', reelId: 'mkt-audience-5',
            prompt: 'After two weeks, sales are 40 — far below target. What is the most useful first question?',
            options: [
              { id: 'a', text: 'Which assumption failed — the need, the message, the reach or the price? Check the evidence for each.', feedback: 'Right: diagnose which hypothesis broke.' },
              { id: 'b', text: 'Should we switch immediately to gamers?', feedback: 'Changing target without diagnosis risks repeating the problem.' },
              { id: 'c', text: 'Should we halve the price?', feedback: 'Maybe — but only if evidence points to price.' },
            ],
            correctId: 'a',
            explanation: 'Treat the plan as linked hypotheses and test which one failed.',
          },
        ],
      },
    },
  ],
}
