import type { Path } from './types'

export const politicsWhoDecides: Path = {
  id: 'pol-who-decides',
  title: 'Who decides?',
  origin: 'prepared',
  subjectId: 'politics',
  description:
    'How political power becomes authority, how voting rules shape who wins, and why some systems make change hard. Concepts and evidence, not party positions.',
  familiarityNote: 'New to political science? We add a short primer on power and authority. With some background, it is skipped.',
  sources: [
    { id: 'weber', title: '“Politics as a Vocation” (Politik als Beruf), lecture', author: 'Max Weber', year: '1919', kind: 'primary' },
    { id: 'duverger', title: 'Political Parties: Their Organization and Activity in the Modern State', author: 'Maurice Duverger', year: '1951 (English 1954)', kind: 'book' },
    { id: 'lijphart', title: 'Patterns of Democracy: Government Forms and Performance in Thirty-Six Countries', author: 'Arend Lijphart', year: '1999', kind: 'book' },
    { id: 'tsebelis', title: 'Veto Players: How Political Institutions Work', author: 'George Tsebelis', year: '2002', kind: 'book' },
    { id: 'brit-electoral', title: 'Electoral system', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/topic/electoral-system' },
    { id: 'nz-mmp', title: 'MMP voting system (history of New Zealand’s 1993 referendum and change from FPP)', author: 'Electoral Commission, New Zealand', kind: 'web' },
  ],
  modules: [
    {
      id: 'pol-who-decides-m1',
      title: 'Authority, elections and veto points',
      summary: 'Three ideas that explain a surprising amount of politics anywhere in the world.',
      topics: [
        {
          id: 'pol-legitimacy',
          title: 'Why do people obey?',
          objective: 'Distinguish power from authority, and classify claims to legitimacy using Weber’s traditional, charismatic and legal-rational types.',
          prerequisite: 'None.',
          nextStep: 'Next: once authority is accepted, how are leaders chosen? You’ll see how voting rules change the winner.',
          reels: [
            {
              id: 'pol-legitimacy-1', kind: 'hook', title: 'A uniform and a whistle', fictional: true,
              body: [
                'Fictional scenario. A stranger in a hi-vis vest blows a whistle and tells a crowd to leave a square. Most people go. The next day, someone in ordinary clothes says the same thing. Almost nobody moves.',
                'Same words. Different result. What changed?',
              ],
              visual: { motif: 'pillars', caption: 'Why we comply' },
              interaction: {
                type: 'poll', prompt: 'Make the call: why did people leave the first time?',
                options: [
                  { id: 'fear', text: 'Fear of punishment', response: 'Maybe for some. But fear alone is expensive — no state can watch everyone. Most compliance rests on something cheaper.' },
                  { id: 'right', text: 'It seemed rightful', response: 'That’s legitimacy: people comply because they accept the instruction as rightful, not just forceful.' },
                  { id: 'habit', text: 'Habit', response: 'Habit is part of it — and habits of obedience are often how legitimacy shows up in practice.' },
                ],
              },
            },
            {
              id: 'pol-legitimacy-2', kind: 'context', title: 'Power and authority', onlyFor: 'new',
              body: [
                'Power is the ability to make others do what they otherwise would not. Authority is power that people accept as rightful.',
                'Political scientists care about the difference because authority is stable and cheap, while naked power is fragile and costly to maintain.',
              ],
              visual: { motif: 'scales', caption: 'Force vs consent' },
            },
            {
              id: 'pol-legitimacy-3', kind: 'explain', title: 'Weber’s three sources',
              body: [
                'In 1919, Max Weber defined the state as a community that successfully claims a monopoly on the legitimate use of physical force within a territory.',
                'He identified three ideal types of legitimate authority. Traditional: “it has always been so” — inherited monarchy, customary chiefs. Charismatic: devotion to an exceptional individual. Legal-rational: obedience to rules and offices, whoever holds them.',
                'Real regimes mix all three. The types are lenses, not boxes.',
              ],
              visual: { motif: 'columns', caption: 'Tradition · charisma · rules' },
              sources: [{ sourceId: 'weber' }],
            },
            {
              id: 'pol-legitimacy-4', kind: 'example', title: 'Reading a claim',
              body: [
                'A constitutional monarch opening parliament draws on tradition. A revolutionary leader whose followers believe they alone can save the nation draws on charisma. A tax inspector you’ve never met draws on legal-rational authority — you comply with the office, not the person.',
                'Weber noticed a pattern: charismatic authority is unstable after its founder is gone, so movements tend to “routinise” it into rules or traditions.',
              ],
              visual: { motif: 'figure', caption: 'Office, person, custom' },
              interaction: { type: 'reveal', prompt: 'A new government says “we won the election under the constitution”. Which type is it claiming?', answer: 'Legal-rational: its right to rule comes from following agreed rules and procedures.' },
              sources: [{ sourceId: 'weber' }],
            },
            {
              id: 'pol-legitimacy-5', kind: 'complication', title: 'Legitimate to whom?',
              body: [
                'Legitimacy is a belief held by people, so it can differ across groups in the same country. A government can be legal and still lack legitimacy for a minority who see the rules as rigged against them.',
                'This is why political scientists study perceptions — trust surveys, protest, compliance — rather than only what the law says.',
              ],
              visual: { motif: 'branch', caption: 'One state, many views' },
            },
          ],
          quiz: [
            {
              id: 'pol-legitimacy-q1', type: 'choice', conceptId: 'power-vs-authority', skill: 'recognise', reelId: 'pol-legitimacy-3',
              prompt: 'What distinguishes authority from power?',
              options: [
                { id: 'a', text: 'Authority is power that the people subject to it accept as rightful.', feedback: 'Correct — acceptance is what turns power into authority.' },
                { id: 'b', text: 'Authority always comes from elections.', feedback: 'Elections are one source (legal-rational), but tradition and charisma can also confer authority.' },
                { id: 'c', text: 'Authority means more force than power.', feedback: 'It’s the reverse in a sense: authority needs less force because people comply willingly.' },
                { id: 'd', text: 'There is no meaningful difference.', feedback: 'The difference explains why some regimes are stable at low cost and others need constant coercion.' },
              ],
              correctId: 'a',
              explanation: 'Power is the capacity to compel; authority is power accepted as legitimate.',
              altExample: 'A mugger has power over you for a moment. A referee has authority: players accept their calls as part of the game.',
              fresh: {
                id: 'pol-legitimacy-q1f', type: 'choice', conceptId: 'power-vs-authority', skill: 'recognise', reelId: 'pol-legitimacy-3',
                prompt: 'An occupying army controls a city, and residents obey only when soldiers are present. This best illustrates…',
                options: [
                  { id: 'a', text: 'power without authority.', feedback: 'Yes — compliance depends on presence of force, not acceptance.' },
                  { id: 'b', text: 'legal-rational authority.', feedback: 'That would require people to accept the rules as rightful.' },
                  { id: 'c', text: 'charismatic authority.', feedback: 'Nothing here rests on devotion to a leader.' },
                ],
                correctId: 'a',
                explanation: 'Obedience that disappears when force does is power, not authority.',
              },
            },
            {
              id: 'pol-legitimacy-q2', type: 'choice', conceptId: 'weber-types', skill: 'apply', reelId: 'pol-legitimacy-4',
              prompt: 'A movement’s founder dies. Its followers write a constitution with term limits and elected leadership. In Weber’s terms, what is happening?',
              options: [
                { id: 'a', text: 'Charismatic authority is being routinised into legal-rational authority.', feedback: 'Exactly — the classic succession problem of charisma, solved with rules.' },
                { id: 'b', text: 'Traditional authority is replacing charisma.', feedback: 'Tradition rests on custom and inheritance; a newly written constitution with elections is rule-based.' },
                { id: 'c', text: 'The movement has lost all legitimacy.', feedback: 'Not necessarily — it’s shifting its basis of legitimacy.' },
                { id: 'd', text: 'Charismatic authority is growing stronger.', feedback: 'The founder is gone; the new structure relies on offices, not a person.' },
              ],
              correctId: 'a',
              explanation: 'Charisma is personal and unstable over succession, so it tends to be converted into rules or traditions.',
              fresh: {
                id: 'pol-legitimacy-q2f', type: 'choice', conceptId: 'weber-types', skill: 'apply', reelId: 'pol-legitimacy-4',
                prompt: 'A village elder’s rulings are followed because elders in that family have always settled disputes. Which type of authority?',
                options: [
                  { id: 'a', text: 'Traditional.', feedback: 'Yes — legitimacy from custom and inheritance.' },
                  { id: 'b', text: 'Legal-rational.', feedback: 'No written rule or office is doing the work here.' },
                  { id: 'c', text: 'Charismatic.', feedback: 'It’s about the family role, not exceptional personal qualities.' },
                ],
                correctId: 'a',
                explanation: '“It has always been so” is the signature of traditional authority.',
              },
            },
            {
              id: 'pol-legitimacy-q3', type: 'choice', conceptId: 'legitimacy-perception', skill: 'reason', reelId: 'pol-legitimacy-5',
              prompt: 'Why might a government that followed every legal procedure still face a legitimacy problem?',
              options: [
                { id: 'a', text: 'Legitimacy depends on whether people believe the rules and outcomes are rightful, and some groups may not.', feedback: 'Right — legality and legitimacy can come apart.' },
                { id: 'b', text: 'Because legal procedures are never legitimate.', feedback: 'Too strong; legal-rational legitimacy is common and often robust.' },
                { id: 'c', text: 'Because legitimacy only comes from charisma.', feedback: 'Weber described three sources, not one.' },
                { id: 'd', text: 'It can’t; legal means legitimate.', feedback: 'That assumes everyone accepts the rules — which is exactly what can fail.' },
              ],
              correctId: 'a',
              explanation: 'Legitimacy is a belief held by the governed; legality is a property of procedures.',
            },
          ],
        },
        {
          id: 'pol-elections',
          title: 'Same votes, different winners',
          objective: 'Explain how first-past-the-post and proportional representation translate the same votes into different seat outcomes, and state Duverger’s tendency with its limits.',
          prerequisite: 'Legal-rational authority (previous topic) helps: elections are a rule-based route to authority.',
          nextStep: 'Next: winning an election isn’t the same as being able to change things. Veto players explain why.',
          reels: [
            {
              id: 'pol-elections-1', kind: 'hook', title: 'Forty percent, all the seats', fictional: true,
              body: [
                'Fictional exercise. A country has five districts. In every district Party A gets 40% of the vote, Party B 35% and Party C 25%.',
                'Under one set of rules, A wins all five seats. Under another, A wins two, B two and C one. Nothing about the voters changed.',
              ],
              visual: { motif: 'ballot', caption: '40 · 35 · 25' },
              interaction: {
                type: 'compare',
                left: { label: 'First past the post', text: 'A wins each district with a plurality: A 5 seats, B 0, C 0.' },
                right: { label: 'Proportional', text: 'Seats roughly follow vote share: A 2, B 2, C 1.' },
                prompt: 'Make the call: which result better represents these voters? Notice what you mean by “better”.',
              },
            },
            {
              id: 'pol-elections-2', kind: 'explain', title: 'Two families of rules',
              body: [
                'First-past-the-post (FPTP, also called plurality): the country is divided into single-member districts, and whoever gets the most votes in a district wins it — even without a majority.',
                'Proportional representation (PR): parties win seats in proportion to their vote share, usually in multi-member districts or nationwide lists. Many systems mix the two.',
                'Each serves different values. FPTP tends to produce single-party majorities and a clear local representative. PR tends to produce parliaments that mirror the vote, often with coalitions.',
              ],
              visual: { motif: 'grid', caption: 'Districts vs shares' },
              sources: [{ sourceId: 'brit-electoral' }, { sourceId: 'lijphart' }],
            },
            {
              id: 'pol-elections-3', kind: 'example', title: 'Duverger’s tendency',
              body: [
                'In 1951 Maurice Duverger argued that plurality rule in single-member districts tends toward two-party systems, while PR tends toward multiparty systems.',
                'Two mechanisms: a mechanical effect (third parties win few seats for their votes) and a psychological effect (voters and donors desert parties they think can’t win).',
                'It’s a tendency, not a law. India and Canada use FPTP and have several significant parties, often because support is concentrated regionally.',
              ],
              visual: { motif: 'branch', caption: 'Mechanical · psychological' },
              sources: [{ sourceId: 'duverger' }],
            },
            {
              id: 'pol-elections-4', kind: 'complication', title: 'Countries do switch',
              body: [
                'New Zealand used FPTP for decades. After a 1993 referendum it adopted mixed-member proportional representation (MMP), first used in the 1996 election. Single-party majority governments became rare and coalitions normal.',
                'Choosing an electoral system is itself a political decision — parties that benefit from current rules rarely rush to change them.',
              ],
              visual: { motif: 'timeline', caption: 'FPP → MMP' },
              interaction: {
                type: 'timeline',
                events: [
                  { when: '1993', what: 'New Zealand referendum chooses MMP' },
                  { when: '1996', what: 'First general election under MMP' },
                  { when: 'After', what: 'Coalition and minority governments become the norm' },
                ],
              },
              sources: [{ sourceId: 'nz-mmp' }],
            },
          ],
          quiz: [
            {
              id: 'pol-elections-q1', type: 'choice', conceptId: 'fptp-vs-pr', skill: 'recognise', reelId: 'pol-elections-2',
              prompt: 'Which statement describes first-past-the-post?',
              options: [
                { id: 'a', text: 'Each district elects one representative: the candidate with the most votes, even without a majority.', feedback: 'Correct.' },
                { id: 'b', text: 'Parties receive seats in proportion to their national vote share.', feedback: 'That describes proportional representation.' },
                { id: 'c', text: 'A candidate must win more than 50% or face a runoff.', feedback: 'That’s a majoritarian two-round system, not plurality.' },
                { id: 'd', text: 'Voters rank every candidate in order.', feedback: 'That’s ranked-choice voting, a different family.' },
              ],
              correctId: 'a',
              explanation: 'FPTP: single-member districts, plurality wins.',
              fresh: {
                id: 'pol-elections-q1f', type: 'choice', conceptId: 'fptp-vs-pr', skill: 'recognise', reelId: 'pol-elections-2',
                prompt: 'A party wins 20% of the national vote and about 20% of the seats. Which system most likely produced this?',
                options: [
                  { id: 'a', text: 'Proportional representation.', feedback: 'Yes — seats tracking votes is PR’s defining feature.' },
                  { id: 'b', text: 'First-past-the-post.', feedback: 'Under FPTP a spread-out 20% party often wins far fewer seats.' },
                  { id: 'c', text: 'Either, equally likely.', feedback: 'The close match points strongly to PR.' },
                ],
                correctId: 'a',
                explanation: 'PR aims for seat shares that mirror vote shares.',
              },
            },
            {
              id: 'pol-elections-q2', type: 'choice', conceptId: 'duverger', skill: 'apply', reelId: 'pol-elections-3',
              passage: 'Fictional exercise. In an FPTP country, the Green Party polls 15% nationally, spread evenly. Before election day, many Green supporters say they’ll vote for a larger party “so my vote isn’t wasted”.',
              prompt: 'Which of Duverger’s mechanisms is this?',
              options: [
                { id: 'a', text: 'The psychological effect: voters abandon parties they expect not to win seats.', feedback: 'Exactly — strategic desertion before the vote.' },
                { id: 'b', text: 'The mechanical effect: the counting rules convert votes to few seats.', feedback: 'That happens after votes are cast; this is about voters’ expectations beforehand.' },
                { id: 'c', text: 'Proportional representation at work.', feedback: 'The country uses FPTP.' },
                { id: 'd', text: 'Charismatic authority.', feedback: 'This is about electoral incentives, not personal devotion.' },
              ],
              correctId: 'a',
              explanation: 'The psychological effect is anticipation of the mechanical effect.',
              fresh: {
                id: 'pol-elections-q2f', type: 'choice', conceptId: 'duverger', skill: 'apply', reelId: 'pol-elections-3',
                prompt: 'A regional party wins 8% nationally under FPTP but 30 seats, because its votes are concentrated in one region. What does this show?',
                options: [
                  { id: 'a', text: 'Duverger’s tendency has limits: geographically concentrated parties can thrive under FPTP.', feedback: 'Yes — concentration beats the mechanical penalty.' },
                  { id: 'b', text: 'Duverger’s law is always true.', feedback: 'This case is a classic exception.' },
                  { id: 'c', text: 'The country must actually use PR.', feedback: 'FPTP can reward concentrated support handsomely.' },
                ],
                correctId: 'a',
                explanation: 'Where support is concentrated, small parties can win districts.',
              },
            },
            {
              id: 'pol-elections-q3', type: 'choice', conceptId: 'electoral-tradeoffs', skill: 'reason', reelId: 'pol-elections-2',
              prompt: 'Someone argues: “PR is simply fairer, so every country should use it.” What is the strongest reply?',
              options: [
                { id: 'a', text: 'It depends what you value: PR prioritises proportional representation, FPTP prioritises single-party government and local accountability — a trade-off, not a single “fair”.', feedback: 'Right — the judgement depends on the values you weigh.' },
                { id: 'b', text: 'PR is always unfair.', feedback: 'That’s an equally one-sided claim.' },
                { id: 'c', text: 'Electoral systems don’t affect outcomes.', feedback: 'The 40–35–25 example shows they clearly do.' },
                { id: 'd', text: 'Only FPTP produces legitimate governments.', feedback: 'Both systems can produce governments people accept as legitimate.' },
              ],
              correctId: 'a',
              explanation: 'Electoral design trades off proportionality, decisiveness and local links. Reasonable people weigh these differently.',
            },
          ],
        },
        {
          id: 'pol-veto',
          title: 'Why change is hard',
          objective: 'Use the idea of veto players to predict how easily a political system can change policy.',
          prerequisite: 'Electoral systems (previous topic): coalitions and divided chambers create extra veto players.',
          nextStep: 'You’ve finished this module’s core. The challenge asks you to design institutions for a new country.',
          reels: [
            {
              id: 'pol-veto-1', kind: 'hook', title: 'The bill that can’t pass', fictional: true,
              body: [
                'Fictional scenario. A popular reform passes the lower house easily. Then the upper house amends it, the president threatens a veto, and a court is asked to review it. A year later, nothing has changed.',
                'Is that a broken system — or one working as designed?',
              ],
              visual: { motif: 'pillars', caption: 'Gate after gate' },
              interaction: {
                type: 'poll', prompt: 'Make the call: is this a problem?',
                options: [
                  { id: 'broken', text: 'Broken', response: 'Many reformers feel this way. The trade-off: the same gates also block changes you would oppose.' },
                  { id: 'design', text: 'By design', response: 'Systems built to prevent hasty or tyrannical change will also slow popular reforms.' },
                  { id: 'depends', text: 'Depends', response: 'That’s the political scientist’s answer — and veto-player theory tells you what it depends on.' },
                ],
              },
            },
            {
              id: 'pol-veto-2', kind: 'explain', title: 'Veto players',
              body: [
                'George Tsebelis defines a veto player as an individual or collective actor whose agreement is required to change the status quo — a president with a veto, a second chamber, each party in a coalition.',
                'His core prediction: the more veto players there are, and the more their preferences differ, the harder it is to change policy. Policy stability goes up.',
              ],
              visual: { motif: 'columns', caption: 'Every “yes” required' },
              sources: [{ sourceId: 'tsebelis' }],
            },
            {
              id: 'pol-veto-3', kind: 'example', title: 'Counting the gates',
              body: [
                'A single-party majority government in a parliamentary system with a weak upper house may have effectively one veto player: the governing party.',
                'A presidential system with two strong chambers controlled by different parties may have three — and each can block.',
                'A coalition of five parties has five, even inside one chamber.',
              ],
              visual: { motif: 'grid', caption: '1, 3 or 5 gates' },
              interaction: { type: 'reveal', prompt: 'Why does it matter how far apart the veto players’ preferences are?', answer: 'If they all want similar things, many veto players can still agree. The space of changes everyone accepts shrinks as their preferences diverge.' },
              sources: [{ sourceId: 'tsebelis' }, { sourceId: 'lijphart' }],
            },
            {
              id: 'pol-veto-4', kind: 'complication', title: 'Stability cuts both ways',
              body: [
                'Many veto players protect against sudden, extreme change and give minorities leverage. They also make it slow to respond to crises and can entrench an unpopular status quo.',
                'Few veto players allow decisive action — and decisive reversal after the next election. Neither design is neutral; each favours some outcomes over others.',
              ],
              visual: { motif: 'scales', caption: 'Protection vs responsiveness' },
            },
          ],
          quiz: [
            {
              id: 'pol-veto-q1', type: 'choice', conceptId: 'veto-player-definition', skill: 'recognise', reelId: 'pol-veto-2',
              prompt: 'Which of these is a veto player in Tsebelis’s sense?',
              options: [
                { id: 'a', text: 'A coalition partner whose votes the government needs to pass laws.', feedback: 'Correct — its agreement is required to change the status quo.' },
                { id: 'b', text: 'An opposition party that can criticise but not block legislation.', feedback: 'Criticism matters, but without the ability to block it isn’t a veto player.' },
                { id: 'c', text: 'A newspaper editorial board.', feedback: 'Influential, but its agreement isn’t formally required.' },
                { id: 'd', text: 'Any voter.', feedback: 'Individual voters don’t hold a veto over legislation.' },
              ],
              correctId: 'a',
              explanation: 'A veto player is anyone whose consent is necessary for policy change.',
              fresh: {
                id: 'pol-veto-q1f', type: 'choice', conceptId: 'veto-player-definition', skill: 'recognise', reelId: 'pol-veto-2',
                prompt: 'In which case is the upper house a veto player?',
                options: [
                  { id: 'a', text: 'When bills cannot become law without its approval.', feedback: 'Yes — required consent is the test.' },
                  { id: 'b', text: 'When it can only delay bills for a month.', feedback: 'A short delay isn’t a veto.' },
                  { id: 'c', text: 'When it issues non-binding reports.', feedback: 'No formal blocking power.' },
                ],
                correctId: 'a',
                explanation: 'Only actors whose agreement is required count.',
              },
            },
            {
              id: 'pol-veto-q2', type: 'choice', conceptId: 'veto-player-prediction', skill: 'apply', reelId: 'pol-veto-3',
              prompt: 'Country X: single-party majority, one chamber. Country Y: four-party coalition with sharply different views, plus a strong second chamber. Which will find it harder to pass a major reform?',
              options: [
                { id: 'a', text: 'Country Y — more veto players with more divergent preferences.', feedback: 'Exactly Tsebelis’s prediction.' },
                { id: 'b', text: 'Country X — single-party governments are always gridlocked.', feedback: 'With one veto player, X can act quickly.' },
                { id: 'c', text: 'Both equally.', feedback: 'The number and spread of veto players differ greatly.' },
                { id: 'd', text: 'It depends only on how popular the reform is.', feedback: 'Popularity matters, but institutions decide how many actors must agree.' },
              ],
              correctId: 'a',
              explanation: 'More veto players + greater distance between them = more policy stability.',
            },
            {
              id: 'pol-veto-q3', type: 'short', conceptId: 'veto-tradeoff', skill: 'reason', reelId: 'pol-veto-4',
              prompt: 'In two or three sentences: give one advantage and one disadvantage of a system with many veto players.',
              modelAnswer: 'Advantage: it protects against sudden or extreme changes and gives minorities and smaller parties leverage. Disadvantage: it makes it slow or impossible to respond to new problems and can lock in an unpopular status quo.',
              lookFor: ['An advantage such as stability, protection from extreme change, or minority leverage', 'A disadvantage such as slowness, gridlock, or entrenching the status quo', 'Recognises that the same feature causes both'],
              explanation: 'The feature that blocks bad changes also blocks good ones.',
            },
          ],
        },
      ],
      challenge: {
        id: 'pol-who-decides-m1-ch',
        title: 'A constitution for Aster',
        scenario:
          'Fictional scenario. Aster is a newly independent country with three regions. One region holds 55% of the population and its own dominant party. The two smaller regions fear being permanently outvoted. The drafting committee must choose an electoral system and a legislative structure.',
        questions: [
          {
            id: 'pol-ch-q1', type: 'choice', conceptId: 'fptp-vs-pr', skill: 'apply', reelId: 'pol-elections-2',
            prompt: 'Under nationwide FPTP with population-based districts, what is the likely risk?',
            options: [
              { id: 'a', text: 'The large region’s dominant party could win a large majority of seats, leaving the smaller regions under-represented.', feedback: 'Yes — plurality rules amplify the largest group.' },
              { id: 'b', text: 'Every region would get exactly equal seats.', feedback: 'Population-based districts follow population, not regions.' },
              { id: 'c', text: 'Coalitions would be guaranteed.', feedback: 'FPTP tends to produce single-party majorities.' },
            ],
            correctId: 'a',
            explanation: 'FPTP rewards the largest concentrated group.',
          },
          {
            id: 'pol-ch-q2', type: 'choice', conceptId: 'veto-player-prediction', skill: 'apply', reelId: 'pol-veto-3',
            prompt: 'The committee adds an upper house with equal seats per region, whose approval is required for laws. What effect does this have?',
            options: [
              { id: 'a', text: 'It adds a veto player that gives the smaller regions leverage, making major change harder without their agreement.', feedback: 'Exactly.' },
              { id: 'b', text: 'It removes veto players.', feedback: 'It adds one.' },
              { id: 'c', text: 'It has no effect on policy change.', feedback: 'A chamber whose approval is required is a veto player.' },
            ],
            correctId: 'a',
            explanation: 'A required second chamber is a classic veto player.',
          },
          {
            id: 'pol-ch-q3', type: 'choice', conceptId: 'legitimacy-perception', skill: 'reason', reelId: 'pol-legitimacy-5',
            prompt: 'Why might these protections matter for the new state’s legitimacy, not just its fairness?',
            options: [
              { id: 'a', text: 'If the smaller regions believe the rules are rigged against them, they may not accept the state’s authority as rightful.', feedback: 'Right — legitimacy depends on the governed accepting the rules.' },
              { id: 'b', text: 'Legitimacy is guaranteed once a constitution is written.', feedback: 'A written document doesn’t guarantee belief in it.' },
              { id: 'c', text: 'Legitimacy only matters for monarchies.', feedback: 'All regimes depend on some form of legitimacy.' },
            ],
            correctId: 'a',
            explanation: 'Institutions shape whether groups see authority as rightful.',
          },
        ],
      },
    },
  ],
}
