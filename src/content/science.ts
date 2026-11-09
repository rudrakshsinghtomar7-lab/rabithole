import type { Path } from './types'

export const scienceHowWeKnow: Path = {
  id: 'sci-how-we-know',
  title: 'How do we know?',
  origin: 'prepared',
  subjectId: 'science',
  description:
    'The reasoning that makes science work across every field: testable claims, fair experiments, and telling correlation from causation.',
  familiarityNote: 'New to scientific method? We add a short primer on hypotheses. With some background, it is skipped.',
  sources: [
    { id: 'popper', title: 'The Logic of Scientific Discovery (Logik der Forschung, 1934)', author: 'Karl Popper', year: '1959 English edition', kind: 'book' },
    { id: 'lind', title: 'A Treatise of the Scurvy', author: 'James Lind', year: '1753', kind: 'primary' },
    { id: 'jll-lind', title: 'James Lind (1753): A treatise of the scurvy — commentary and extracts', author: 'The James Lind Library', kind: 'web', url: 'https://www.jameslindlibrary.org/lind-j-1753/' },
    { id: 'whi', title: '“Risks and benefits of estrogen plus progestin in healthy postmenopausal women”, JAMA 288(3):321–333', author: 'Writing Group for the Women’s Health Initiative Investigators (Rossouw et al.)', year: '2002', kind: 'article' },
    { id: 'brit-method', title: 'Scientific method', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/science/scientific-method' },
  ],
  modules: [
    {
      id: 'sci-how-we-know-m1',
      title: 'Testing ideas',
      summary: 'Three habits of mind behind every reliable scientific claim.',
      topics: [
        {
          id: 'sci-falsifiable',
          title: 'What would prove you wrong?',
          objective: 'Recognise falsifiable claims and explain why scientific claims must risk being contradicted by evidence.',
          prerequisite: 'None.',
          nextStep: 'Next: once a claim is testable, how do you test it fairly? You’ll design a controlled experiment.',
          reels: [
            {
              id: 'sci-falsifiable-1', kind: 'hook', title: 'All swans are white',
              body: [
                'For centuries, Europeans had only ever seen white swans. “All swans are white” looked as certain as a claim could be.',
                'In 1697, Dutch explorers led by Willem de Vlamingh recorded black swans in Western Australia. Thousands of white swans had not proved the claim. One black swan disproved it.',
              ],
              visual: { motif: 'flask', caption: 'One counterexample' },
              interaction: {
                type: 'poll', prompt: 'Test it: how many white swans would prove “all swans are white”?',
                options: [
                  { id: 'many', text: 'A million', response: 'Even a million can’t rule out the next one being black. That asymmetry is the key idea.' },
                  { id: 'none', text: 'No number', response: 'Right — universal claims can’t be proved by examples, but one counterexample can refute them.' },
                ],
              },
              sources: [{ sourceId: 'popper' }],
            },
            {
              id: 'sci-falsifiable-2', kind: 'context', title: 'Hypotheses', onlyFor: 'new',
              body: [
                'A hypothesis is a proposed explanation that makes predictions. “Plants grow faster with more light” predicts that, other things equal, plants given more light will grow faster.',
                'Science advances by deriving predictions from hypotheses and checking them against observation.',
              ],
              visual: { motif: 'branch', caption: 'Idea → prediction → test' },
              sources: [{ sourceId: 'brit-method' }],
            },
            {
              id: 'sci-falsifiable-3', kind: 'explain', title: 'Falsifiability',
              body: [
                'Karl Popper argued that what makes a claim scientific is not that it can be confirmed but that it could be refuted: it forbids some possible observations.',
                '“Water boils at 100 °C at sea-level pressure” is falsifiable — measure it and it could fail. “Everything happens for a reason” is not: no observation could ever count against it.',
                'Unfalsifiable claims aren’t necessarily false. They just can’t be tested by science.',
              ],
              visual: { motif: 'scales', caption: 'Could it fail?' },
              sources: [{ sourceId: 'popper' }],
            },
            {
              id: 'sci-falsifiable-4', kind: 'example', title: 'Spot the escape hatch',
              body: [
                'Fictional example. Someone claims a crystal improves exam scores. When scores rise, it worked. When scores fall, “your energy blocked it”. When nothing changes, “it works subtly”.',
                'Every outcome is explained in advance, so no result could count against the claim. That flexibility feels like strength but is exactly what makes it untestable.',
              ],
              visual: { motif: 'grid', caption: 'Explains everything' },
              fictional: true,
              interaction: { type: 'reveal', prompt: 'How could the crystal claim be made testable?', answer: 'Specify the prediction in advance — e.g. students randomly given the crystal will score higher on average than those given an identical-looking fake — and accept that a null result counts against it.' },
            },
            {
              id: 'sci-falsifiable-5', kind: 'complication', title: 'Scientists don’t give up instantly',
              body: [
                'In practice a single surprising result rarely topples a well-supported theory. It might be a measurement error, so scientists check, replicate and look for auxiliary explanations.',
                'The difference from the crystal case: a good auxiliary explanation makes a new testable prediction. An escape hatch only protects the original claim.',
              ],
              visual: { motif: 'stack', caption: 'Check, then revise' },
            },
          ],
          quiz: [
            {
              id: 'sci-falsifiable-q1', type: 'choice', conceptId: 'falsifiability', skill: 'recognise', reelId: 'sci-falsifiable-3',
              prompt: 'Which claim is falsifiable?',
              options: [
                { id: 'a', text: 'Adding salt to water raises its boiling point.', feedback: 'Correct — you could measure it and find it doesn’t.' },
                { id: 'b', text: 'Invisible beings guide events but leave no trace.', feedback: 'No observation could contradict it.' },
                { id: 'c', text: 'Things will work out the way they’re meant to.', feedback: 'Any outcome fits, so it can’t be tested.' },
                { id: 'd', text: 'Some day, something surprising will happen.', feedback: 'Too vague to forbid any observation.' },
              ],
              correctId: 'a',
              explanation: 'A falsifiable claim rules out some possible observations.',
              altExample: '“This medicine lowers blood pressure in most patients within a month” could fail in a trial. “This medicine works for those who believe in it” is built to dodge failure.',
              fresh: {
                id: 'sci-falsifiable-q1f', type: 'choice', conceptId: 'falsifiability', skill: 'recognise', reelId: 'sci-falsifiable-3',
                prompt: 'Why is “All metals expand when heated” scientific in Popper’s sense?',
                options: [
                  { id: 'a', text: 'Because a single metal that didn’t expand when heated would refute it.', feedback: 'Yes — it risks refutation.' },
                  { id: 'b', text: 'Because it has been confirmed many times.', feedback: 'Confirmation alone isn’t Popper’s criterion.' },
                  { id: 'c', text: 'Because scientists believe it.', feedback: 'Belief doesn’t make a claim scientific.' },
                ],
                correctId: 'a',
                explanation: 'Testability = could be shown wrong.',
              },
            },
            {
              id: 'sci-falsifiable-q2', type: 'choice', conceptId: 'falsifiability', skill: 'apply', reelId: 'sci-falsifiable-4',
              prompt: 'A diet company says its plan works “if followed correctly”, and explains every failure as the person not following it correctly. What’s the problem?',
              options: [
                { id: 'a', text: '“Followed correctly” is defined after the fact, so no result can count against the claim.', feedback: 'Exactly — an escape hatch.' },
                { id: 'b', text: 'Diets can never be tested.', feedback: 'They can, with clear definitions and controlled trials.' },
                { id: 'c', text: 'There’s no problem; adherence matters.', feedback: 'Adherence does matter — but it must be defined and measured in advance.' },
                { id: 'd', text: 'The claim has been proved true.', feedback: 'Explaining away failures isn’t proof.' },
              ],
              correctId: 'a',
              explanation: 'Defining success after seeing results makes a claim unfalsifiable.',
            },
            {
              id: 'sci-falsifiable-q3', type: 'choice', conceptId: 'auxiliary-hypothesis', skill: 'reason', reelId: 'sci-falsifiable-5',
              prompt: 'A well-tested theory predicts a result that one experiment fails to find. What should scientists do first?',
              options: [
                { id: 'a', text: 'Check and replicate the experiment, and test any proposed explanation that makes new predictions.', feedback: 'Right — scrutiny before revision, and revisions must be testable.' },
                { id: 'b', text: 'Abandon the theory immediately.', feedback: 'One result could be an error; replication comes first.' },
                { id: 'c', text: 'Ignore the result forever.', feedback: 'That would make the theory unfalsifiable in practice.' },
                { id: 'd', text: 'Redefine the theory so the result fits, with no new predictions.', feedback: 'That’s an escape hatch, not science.' },
              ],
              correctId: 'a',
              explanation: 'Good revisions add testable content; bad ones just protect a claim.',
            },
          ],
        },
        {
          id: 'sci-controls',
          title: 'A fair test',
          objective: 'Identify independent, dependent and controlled variables, and explain why control groups, randomisation and blinding make an experiment fair.',
          prerequisite: 'Falsifiable predictions (previous topic).',
          nextStep: 'Next: experiments aren’t always possible. When you only have observations, correlation can mislead.',
          reels: [
            {
              id: 'sci-controls-1', kind: 'hook', title: 'Twelve sailors, 1747',
              body: [
                'Scurvy killed huge numbers of sailors on long voyages. In 1747 the naval surgeon James Lind took twelve sailors with scurvy on HMS Salisbury, kept them on the same basic diet, and gave pairs different remedies: cider, vinegar, seawater, oranges and lemons, and others.',
                'The pair given citrus recovered dramatically faster. What made this comparison convincing?',
              ],
              visual: { motif: 'flask', caption: 'Same diet, one difference' },
              interaction: {
                type: 'poll', prompt: 'Test it: what made Lind’s comparison fair?',
                options: [
                  { id: 'same', text: 'Same conditions', response: 'Yes — similar patients, same ship, same basic diet. Only the remedy differed.' },
                  { id: 'many', text: 'Lots of patients', response: 'Twelve is a small number. The strength was keeping everything else the same.' },
                ],
              },
              sources: [{ sourceId: 'lind' }, { sourceId: 'jll-lind' }],
            },
            {
              id: 'sci-controls-2', kind: 'explain', title: 'Variables',
              body: [
                'The independent variable is what you deliberately change (the remedy). The dependent variable is what you measure (recovery). Controlled variables are everything you keep the same (diet, conditions, severity of illness).',
                'If two things change at once, you can’t tell which caused the effect. A fair test changes one thing.',
              ],
              visual: { motif: 'grid', caption: 'Change one thing' },
              sources: [{ sourceId: 'brit-method' }],
            },
            {
              id: 'sci-controls-3', kind: 'example', title: 'Controls, randomisation, blinding',
              body: [
                'A control group gets no treatment or a placebo, giving a baseline to compare against. Random assignment to groups stops researchers (consciously or not) putting healthier people in the treatment group.',
                'Blinding hides who got what. Single-blind: participants don’t know. Double-blind: neither participants nor the people measuring outcomes know, so expectations can’t bias the results.',
              ],
              visual: { motif: 'branch', caption: 'Baseline · chance · blind' },
              interaction: { type: 'reveal', prompt: 'Why does a placebo group matter in a pain-relief trial?', answer: 'People often feel better simply from receiving a treatment. A placebo group shows how much improvement happens without the active drug, so the drug’s real effect can be measured.' },
            },
            {
              id: 'sci-controls-4', kind: 'complication', title: 'Small samples, big claims',
              body: [
                'Lind’s result was striking, but two patients per remedy is a tiny sample; chance could easily mislead in less dramatic cases. Larger samples make it less likely that a difference is a fluke.',
                'It also took decades before citrus became standard in the Royal Navy — evidence doesn’t act on its own.',
              ],
              visual: { motif: 'stack', caption: 'n = 2 per group' },
              sources: [{ sourceId: 'jll-lind' }],
            },
          ],
          quiz: [
            {
              id: 'sci-controls-q1', type: 'choice', conceptId: 'variables', skill: 'recognise', reelId: 'sci-controls-2',
              prompt: 'A student tests whether fertiliser affects tomato height. They give some plants fertiliser and measure height after 6 weeks. What is the dependent variable?',
              options: [
                { id: 'a', text: 'Plant height.', feedback: 'Correct — the outcome being measured.' },
                { id: 'b', text: 'Fertiliser.', feedback: 'That’s the independent variable — what’s changed.' },
                { id: 'c', text: 'The type of soil.', feedback: 'That should be a controlled variable.' },
                { id: 'd', text: 'The 6 weeks.', feedback: 'Time is kept constant — a controlled variable.' },
              ],
              correctId: 'a',
              explanation: 'Dependent = measured outcome.',
              fresh: {
                id: 'sci-controls-q1f', type: 'choice', conceptId: 'variables', skill: 'recognise', reelId: 'sci-controls-2',
                prompt: 'In the tomato experiment, which should be a controlled variable?',
                options: [
                  { id: 'a', text: 'The amount of water each plant gets.', feedback: 'Yes — keep it the same so it can’t explain differences.' },
                  { id: 'b', text: 'Whether plants get fertiliser.', feedback: 'That’s the independent variable.' },
                  { id: 'c', text: 'Final plant height.', feedback: 'That’s the dependent variable.' },
                ],
                correctId: 'a',
                explanation: 'Controlled variables are held constant.',
              },
            },
            {
              id: 'sci-controls-q2', type: 'choice', conceptId: 'randomisation-blinding', skill: 'apply', reelId: 'sci-controls-3',
              passage: 'Fictional exercise. A researcher testing a memory supplement lets volunteers choose whether to take it. Those who choose it score higher on a memory test, which the researcher marks knowing who took the supplement.',
              prompt: 'What are the two biggest flaws?',
              options: [
                { id: 'a', text: 'No random assignment (motivated people may self-select) and no blinding (the marker’s expectations could bias scoring).', feedback: 'Exactly.' },
                { id: 'b', text: 'The sample is too large and the test too easy.', feedback: 'Neither is the core problem described.' },
                { id: 'c', text: 'There are no flaws; higher scores prove it works.', feedback: 'Self-selection and unblinded marking can produce that result without any real effect.' },
                { id: 'd', text: 'Memory can’t be measured.', feedback: 'It can, with careful tests.' },
              ],
              correctId: 'a',
              explanation: 'Randomise to balance groups; blind to prevent expectation bias.',
            },
            {
              id: 'sci-controls-q3', type: 'choice', conceptId: 'sample-size', skill: 'reason', reelId: 'sci-controls-4',
              prompt: 'Why is a striking result from two patients per group weaker evidence than the same result from two hundred?',
              options: [
                { id: 'a', text: 'With tiny groups, chance differences between patients can produce large apparent effects.', feedback: 'Right — larger samples reduce the role of chance.' },
                { id: 'b', text: 'Small studies are always wrong.', feedback: 'Lind’s was right — but small samples are riskier.' },
                { id: 'c', text: 'Sample size doesn’t matter if results are dramatic.', feedback: 'Dramatic effects help, but chance still matters.' },
                { id: 'd', text: 'Larger samples remove the need for controls.', feedback: 'Controls are still essential.' },
              ],
              correctId: 'a',
              explanation: 'Bigger samples make fluke results less likely.',
            },
          ],
        },
        {
          id: 'sci-correlation',
          title: 'Correlation is not causation',
          objective: 'Explain how confounding variables create misleading correlations, and why randomised trials can overturn observational findings.',
          prerequisite: 'Controlled experiments and randomisation (previous topic).',
          nextStep: 'You’ve finished this module’s core. The challenge asks you to evaluate a real-sounding claim.',
          reels: [
            {
              id: 'sci-correlation-1', kind: 'hook', title: 'Ice cream and drownings', fictional: true,
              body: [
                'Illustrative example. In a seaside town, months with high ice-cream sales also have more drownings.',
                'Should the town ban ice cream?',
              ],
              visual: { motif: 'chart', caption: 'Moving together' },
              interaction: {
                type: 'poll', prompt: 'Test it: what explains the pattern?',
                options: [
                  { id: 'cause', text: 'Ice cream causes drowning', response: 'Unlikely. Look for a third factor that drives both.' },
                  { id: 'third', text: 'A third factor', response: 'Yes — hot weather. More people buy ice cream and more people swim.' },
                ],
              },
            },
            {
              id: 'sci-correlation-2', kind: 'explain', title: 'Confounders',
              body: [
                'A correlation means two variables move together. It doesn’t tell you why. A confounding variable influences both, creating a correlation without either causing the other.',
                'Other possibilities: reverse causation (B causes A, not A causes B) and pure coincidence in small or cherry-picked data.',
              ],
              visual: { motif: 'branch', caption: 'Hidden common cause' },
              sources: [{ sourceId: 'brit-method' }],
            },
            {
              id: 'sci-correlation-3', kind: 'example', title: 'When the trial disagreed',
              body: [
                'Large observational studies in the 1980s and 1990s found that postmenopausal women taking hormone replacement therapy (HRT) had lower rates of heart disease, and many doctors concluded HRT was protective.',
                'In 2002, the Women’s Health Initiative randomised trial of estrogen plus progestin reported the opposite for heart disease: a small increase in risk, alongside other risks. One leading explanation: women who chose HRT were, on average, healthier and wealthier to begin with — a confounder.',
              ],
              visual: { motif: 'scales', caption: 'Observed vs randomised' },
              interaction: {
                type: 'compare',
                left: { label: 'Observational studies', text: 'HRT users had less heart disease.' },
                right: { label: 'Randomised trial (2002)', text: 'Estrogen plus progestin slightly increased coronary risk.' },
                prompt: 'Why can randomisation catch what observation missed?',
              },
              sources: [{ sourceId: 'whi' }],
            },
            {
              id: 'sci-correlation-4', kind: 'complication', title: 'When you can’t randomise',
              body: [
                'You can’t randomly assign people to smoke for decades. Yet scientists established that smoking causes lung cancer through converging evidence: strong and consistent associations, dose–response (more smoking, more risk), timing, biological mechanisms, and results that held after accounting for confounders.',
                'Causal claims from observation are possible — they just demand more than one correlation.',
              ],
              visual: { motif: 'stack', caption: 'Converging evidence' },
            },
          ],
          quiz: [
            {
              id: 'sci-correlation-q1', type: 'choice', conceptId: 'confounding', skill: 'recognise', reelId: 'sci-correlation-2',
              prompt: 'What is a confounding variable?',
              options: [
                { id: 'a', text: 'A third factor that influences both variables, creating a correlation between them.', feedback: 'Correct.' },
                { id: 'b', text: 'A measurement mistake.', feedback: 'Errors are a separate problem.' },
                { id: 'c', text: 'The variable the experimenter changes.', feedback: 'That’s the independent variable.' },
                { id: 'd', text: 'A variable that has no effect.', feedback: 'Confounders matter precisely because they affect both variables.' },
              ],
              correctId: 'a',
              explanation: 'Confounders create correlations without causation between the two variables.',
              fresh: {
                id: 'sci-correlation-q1f', type: 'choice', conceptId: 'confounding', skill: 'recognise', reelId: 'sci-correlation-2',
                prompt: 'Towns with more fire stations have more fires. What’s the most likely explanation?',
                options: [
                  { id: 'a', text: 'Larger towns have both more fire stations and more fires — population is a confounder.', feedback: 'Yes — population drives both, so the two rise together without one causing the other.' },
                  { id: 'b', text: 'Fire stations cause fires.', feedback: 'That confuses correlation with causation.' },
                  { id: 'c', text: 'It must be coincidence.', feedback: 'There’s a clear common cause.' },
                ],
                correctId: 'a',
                explanation: 'Look for a common cause.',
              },
            },
            {
              id: 'sci-correlation-q2', type: 'choice', conceptId: 'rct-vs-observational', skill: 'apply', reelId: 'sci-correlation-3',
              passage: 'Fictional exercise. A survey finds people who drink a certain herbal tea live longer. The tea is expensive and popular among people who also exercise regularly.',
              prompt: 'What is the best way to test whether the tea itself extends life?',
              options: [
                { id: 'a', text: 'A randomised trial assigning people to tea or a similar placebo drink, so other habits balance out between groups.', feedback: 'Exactly — randomisation deals with confounders like wealth and exercise.' },
                { id: 'b', text: 'Survey more tea drinkers.', feedback: 'More observational data keeps the same confounders.' },
                { id: 'c', text: 'Ask tea drinkers whether they feel healthier.', feedback: 'Self-report doesn’t address confounding.' },
                { id: 'd', text: 'Accept the survey; the correlation is enough.', feedback: 'The confounders make the survey unreliable for causation.' },
              ],
              correctId: 'a',
              explanation: 'Random assignment balances confounders, known and unknown.',
            },
            {
              id: 'sci-correlation-q3', type: 'choice', conceptId: 'converging-evidence', skill: 'reason', reelId: 'sci-correlation-4',
              prompt: 'How did scientists conclude that smoking causes lung cancer without randomising people to smoke?',
              options: [
                { id: 'a', text: 'Multiple independent lines of evidence — strength, consistency, dose–response, timing and mechanism — pointed the same way.', feedback: 'Right — converging evidence.' },
                { id: 'b', text: 'They ran a randomised trial of smoking.', feedback: 'That would be unethical.' },
                { id: 'c', text: 'One large correlation was considered enough.', feedback: 'A single correlation alone wouldn’t settle it.' },
                { id: 'd', text: 'They didn’t — it’s still only a correlation.', feedback: 'The causal evidence is overwhelming.' },
              ],
              correctId: 'a',
              explanation: 'Causation can be established from observation when many kinds of evidence converge.',
            },
          ],
        },
      ],
      challenge: {
        id: 'sci-how-we-know-m1-ch',
        title: 'The focus app',
        scenario:
          'Fictional scenario. A company claims its “focus app” improves students’ grades. Its evidence: users’ grades are higher than non-users’. The app is free but students must choose to download it. The company also says the app “works differently for everyone”, so some users not improving doesn’t count against it.',
        questions: [
          {
            id: 'sci-ch-q1', type: 'choice', conceptId: 'confounding', skill: 'apply', reelId: 'sci-correlation-2',
            prompt: 'What is a likely confounder in the company’s evidence?',
            options: [
              { id: 'a', text: 'Students who choose a focus app may already be more motivated.', feedback: 'Yes — self-selection by motivation.' },
              { id: 'b', text: 'The app’s colour scheme.', feedback: 'That wouldn’t explain the grade difference across users and non-users.' },
              { id: 'c', text: 'There can’t be any confounders.', feedback: 'Choice-based groups almost always have them.' },
            ],
            correctId: 'a',
            explanation: 'Self-selected groups differ in more than one way.',
          },
          {
            id: 'sci-ch-q2', type: 'choice', conceptId: 'falsifiability', skill: 'apply', reelId: 'sci-falsifiable-4',
            prompt: 'What’s wrong with “it works differently for everyone, so non-improvers don’t count”?',
            options: [
              { id: 'a', text: 'It’s an escape hatch: if failures don’t count, no result could show the app doesn’t work.', feedback: 'Exactly.' },
              { id: 'b', text: 'Nothing; individual differences mean results can’t be tested.', feedback: 'Average effects can still be tested.' },
              { id: 'c', text: 'It proves the app works.', feedback: 'It protects the claim from evidence rather than supporting it.' },
            ],
            correctId: 'a',
            explanation: 'Testable claims accept that some results would count against them.',
          },
          {
            id: 'sci-ch-q3', type: 'choice', conceptId: 'randomisation-blinding', skill: 'reason', reelId: 'sci-controls-3',
            prompt: 'Which study design would give the strongest evidence?',
            options: [
              { id: 'a', text: 'Randomly assign students to the app or a similar-looking placebo app, with grades judged by markers who don’t know which group each student was in.', feedback: 'Yes — randomised, controlled and blinded.' },
              { id: 'b', text: 'Survey users about whether they liked it.', feedback: 'Satisfaction isn’t evidence of grade improvement.' },
              { id: 'c', text: 'Compare this year’s users with last year’s non-users.', feedback: 'Different years add more confounders.' },
            ],
            correctId: 'a',
            explanation: 'Randomisation, a control and blinding together make a fair test.',
          },
        ],
      },
    },
  ],
}
