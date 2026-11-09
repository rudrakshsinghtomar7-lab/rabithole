import type { Path } from './types'

export const historyEvidence: Path = {
  id: 'hist-evidence',
  title: 'Reading the past',
  origin: 'prepared',
  subjectId: 'history',
  description:
    'How historians work: weighing sources against each other, separating causes from triggers, and judging competing interpretations of the same events.',
  familiarityNote:
    'New to history as a discipline? We add primers on primary and secondary sources. With some background, those are skipped.',
  sources: [
    { id: 'brit-kadesh', title: 'Battle of Kadesh', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/event/Battle-of-Kadesh' },
    { id: 'lichtheim', title: 'Ancient Egyptian Literature, Vol. II: The New Kingdom (includes the Kadesh “Poem” and “Bulletin”)', author: 'Miriam Lichtheim', year: '1976', kind: 'book' },
    { id: 'kadesh-treaty', title: 'Egyptian–Hittite peace treaty (Karnak inscription and Hattusa clay tablets)', year: 'c. 1259 BCE', kind: 'primary', url: 'https://www.britannica.com/event/Battle-of-Kadesh' },
    { id: 'brit-ww1', title: 'World War I: The outbreak of war', author: 'Encyclopaedia Britannica', kind: 'web', url: 'https://www.britannica.com/event/World-War-I' },
    { id: 'clark', title: 'The Sleepwalkers: How Europe Went to War in 1914', author: 'Christopher Clark', year: '2012', kind: 'book' },
    { id: 'fischer', title: 'Griff nach der Weltmacht (Germany’s Aims in the First World War)', author: 'Fritz Fischer', year: '1961', kind: 'book' },
    { id: 'gibbon', title: 'The History of the Decline and Fall of the Roman Empire', author: 'Edward Gibbon', year: '1776–1789', kind: 'book', url: 'https://www.gutenberg.org/ebooks/731' },
    { id: 'brown', title: 'The World of Late Antiquity, AD 150–750', author: 'Peter Brown', year: '1971', kind: 'book' },
    { id: 'ward-perkins', title: 'The Fall of Rome and the End of Civilization', author: 'Bryan Ward-Perkins', year: '2005', kind: 'book' },
  ],
  modules: [
    {
      id: 'hist-evidence-m1',
      title: 'Evidence, cause and interpretation',
      summary: 'The three core moves of historical thinking, each practised on a real case.',
      topics: [
        {
          id: 'hist-kadesh',
          title: 'One battle. Two stories.',
          objective: 'Evaluate conflicting primary sources by asking who produced them, for whom, and why — and use corroboration to reach a supported conclusion.',
          prerequisite: 'None.',
          nextStep: 'Next: when sources agree on what happened, historians still argue about why. You’ll separate causes from triggers.',
          reels: [
            {
              id: 'hist-kadesh-1', kind: 'hook', title: 'One battle. Two stories.', fictional: true,
              body: [
                'Fictional exercise. A king’s monument declares a crushing victory: “The enemy fled before me like birds.” A soldier’s letter home, written the same week, describes heavy losses and a retreat.',
                'Can both accounts be true?',
              ],
              visual: { motif: 'tablets', caption: 'Monument and letter' },
              interaction: {
                type: 'poll', prompt: 'Investigate: which account would you trust more?',
                options: [
                  { id: 'king', text: 'The monument', response: 'Official records often have access to the big picture. But ask: who was the monument for, and what did the king need it to say?' },
                  { id: 'soldier', text: 'The letter', response: 'Eyewitness detail is valuable. But one soldier saw one part of a battlefield — and may have reasons of his own.' },
                  { id: 'both', text: 'Both, partly', response: 'That’s where historians usually land. Each source answers a different question well. The skill is working out which.' },
                ],
              },
            },
            {
              id: 'hist-kadesh-2', kind: 'context', title: 'Primary and secondary sources', onlyFor: 'new',
              body: [
                'A primary source was produced at or near the time by someone involved: an inscription, a letter, a treaty, a photograph.',
                'A secondary source is a later interpretation: a historian’s book or an encyclopedia entry. Secondary sources depend on primary ones and add analysis.',
                'Neither is automatically more trustworthy. Every source has an author, an audience and a purpose.',
              ],
              visual: { motif: 'stack', caption: 'Evidence and interpretation' },
            },
            {
              id: 'hist-kadesh-3', kind: 'example', title: 'The real case: Kadesh, c. 1274 BCE',
              body: [
                'Near the Orontes River, in what is now Syria, the Egyptian army of Ramesses II fought the Hittite army of Muwatalli II.',
                'Ramesses had his version carved on temple walls across Egypt — at Karnak, Luxor, Abu Simbel and the Ramesseum — showing him routing the enemy almost single-handedly.',
                'Hittite records, and what happened next, tell a different story: Kadesh stayed in Hittite hands, and the Egyptians withdrew south.',
              ],
              visual: { motif: 'columns', caption: 'Carved in stone' },
              sources: [{ sourceId: 'brit-kadesh' }, { sourceId: 'lichtheim' }],
            },
            {
              id: 'hist-kadesh-4', kind: 'explain', title: 'Asking the right questions',
              body: [
                'Authorship: Ramesses’s inscriptions were royal propaganda, made to show the king as the gods’ chosen champion.',
                'Audience: they were displayed to Egyptians and the gods, not to Hittites. Victory was the expected message.',
                'Corroboration: when an account conflicts with outcomes no one disputes — Kadesh not captured, Egyptian withdrawal — weigh the account against those outcomes.',
                'A source can be unreliable about the result and still be good evidence of something else: how Ramesses wanted to be seen.',
              ],
              visual: { motif: 'scales', caption: 'Who, for whom, why' },
              interaction: {
                type: 'compare',
                left: { label: 'Egyptian inscriptions', text: 'The king, nearly alone, routs the Hittite chariots. A great victory.' },
                right: { label: 'Outcome', text: 'Kadesh stays Hittite. Egypt withdraws. Neither side wins outright.' },
                prompt: 'What can the inscriptions reliably tell you, even if their verdict is wrong?',
              },
              sources: [{ sourceId: 'brit-kadesh' }],
            },
            {
              id: 'hist-kadesh-5', kind: 'complication', title: 'The treaty that followed',
              body: [
                'Around 1259 BCE, Ramesses II and the Hittite king Hattusili III agreed one of the earliest surviving peace treaties. It survives in two versions: hieroglyphs at Karnak and Akkadian cuneiform on clay tablets from the Hittite capital, Hattusa.',
                'Each version presents its own king as the party who asked for peace less desperately. Even the agreement carries two stories — yet the shared terms, matching across both versions, are strong evidence of what was actually agreed.',
              ],
              visual: { motif: 'tablets', caption: 'Two copies, one agreement' },
              sources: [{ sourceId: 'kadesh-treaty' }, { sourceId: 'brit-kadesh' }],
            },
          ],
          quiz: [
            {
              id: 'hist-kadesh-q1', type: 'choice', conceptId: 'source-purpose', skill: 'recognise', reelId: 'hist-kadesh-4',
              prompt: 'Why do historians treat Ramesses II’s temple inscriptions cautiously as evidence of the battle’s outcome?',
              options: [
                { id: 'a', text: 'They were royal propaganda for an Egyptian audience, made to present the king as victorious.', feedback: 'Right: purpose and audience shape what a source says.' },
                { id: 'b', text: 'They were carved long after anyone remembered the battle.', feedback: 'They were produced during Ramesses’s reign, so lateness isn’t the issue — purpose is.' },
                { id: 'c', text: 'Hieroglyphs cannot be reliably translated.', feedback: 'Egyptian hieroglyphs have been reliably read since the 1820s.' },
                { id: 'd', text: 'Ancient sources are always unreliable.', feedback: 'Too sweeping. The same inscriptions are excellent evidence of royal ideology.' },
              ],
              correctId: 'a',
              explanation: 'Ask who made a source, for whom, and why. Monumental royal inscriptions were designed to glorify the king.',
              altExample: 'A company’s press release about its own quarterly results: useful, but you’d check it against independent figures.',
              fresh: {
                id: 'hist-kadesh-q1f', type: 'choice', conceptId: 'source-purpose', skill: 'recognise', reelId: 'hist-kadesh-4',
                prompt: 'Which is the best use of the Kadesh inscriptions as evidence?',
                options: [
                  { id: 'a', text: 'Evidence of how Ramesses wanted his kingship to be seen.', feedback: 'Yes — reliable for ideology even if unreliable on the result.' },
                  { id: 'b', text: 'Proof that Egypt won decisively.', feedback: 'The outcome — Kadesh remaining Hittite — contradicts that verdict.' },
                  { id: 'c', text: 'Nothing; propaganda has no historical value.', feedback: 'Propaganda is valuable evidence of beliefs, aims and self-presentation.' },
                ],
                correctId: 'a',
                explanation: 'A source’s bias tells you what it is good evidence for.',
              },
            },
            {
              id: 'hist-kadesh-q2', type: 'choice', conceptId: 'corroboration', skill: 'apply', reelId: 'hist-kadesh-4',
              passage: 'Fictional exercise. A city council’s minutes record that a new bridge “opened to great celebration.” A local newspaper from the same week reports the opening was postponed after cracks appeared. Tax records show bridge tolls were first collected four months later.',
              prompt: 'What is the most supported conclusion?',
              options: [
                { id: 'a', text: 'The bridge probably did not open as the minutes claim; the toll records independently corroborate the delay.', feedback: 'Yes: an independent, routine record breaks the tie.' },
                { id: 'b', text: 'The minutes are official, so the bridge opened as recorded.', feedback: 'Official status isn’t enough; the council had reasons to present the project well, and another record contradicts it.' },
                { id: 'c', text: 'Newspapers exaggerate, so the bridge opened on time.', feedback: 'Possible bias doesn’t erase evidence — especially when the tax records agree with the newspaper.' },
                { id: 'd', text: 'Nothing can be concluded because the sources disagree.', feedback: 'Disagreement is the normal starting point; corroboration lets you reach a supported judgement.' },
              ],
              correctId: 'a',
              explanation: 'When sources conflict, look for independent evidence — especially records produced for routine purposes, with no stake in the story.',
            },
            {
              id: 'hist-kadesh-q3', type: 'choice', conceptId: 'reliability-for-what', skill: 'reason', reelId: 'hist-kadesh-5',
              prompt: 'Both versions of the Egyptian–Hittite treaty flatter their own king. Why can historians still rely on the treaty’s terms?',
              options: [
                { id: 'a', text: 'Where two independently produced versions with opposite biases agree, that shared content is strongly corroborated.', feedback: 'Exactly — agreement between rival sources is powerful evidence.' },
                { id: 'b', text: 'Treaties are legal documents and therefore free of bias.', feedback: 'The framing in each version shows treaties can be biased too.' },
                { id: 'c', text: 'The Akkadian version is older, so it is correct.', feedback: 'Age doesn’t settle reliability; the agreement between versions does the work.' },
                { id: 'd', text: 'Because the battle was a clear Egyptian victory.', feedback: 'The evidence points to a stalemate, not a clear victory.' },
              ],
              correctId: 'a',
              explanation: 'Agreement between sources with opposing interests is among the strongest forms of corroboration.',
            },
          ],
        },
        {
          id: 'hist-causes',
          title: 'Spark and powder',
          objective: 'Distinguish long-term causes from short-term triggers, and use chronology to explain how an event escalated.',
          prerequisite: 'Weighing sources (previous topic) helps but isn’t required.',
          nextStep: 'Next: historians can agree on causes and still disagree on the big story. You’ll compare interpretations of Rome’s fall.',
          reels: [
            {
              id: 'hist-causes-1', kind: 'hook', title: 'Two shots in Sarajevo',
              body: [
                'On 28 June 1914, Gavrilo Princip, a young Bosnian Serb nationalist, shot Archduke Franz Ferdinand, heir to Austria-Hungary’s throne, in Sarajevo.',
                'Within six weeks, most of Europe’s great powers were at war. Did one assassination cause a world war?',
              ],
              visual: { motif: 'dominoes', caption: '28 June 1914' },
              interaction: {
                type: 'poll', prompt: 'Investigate: was the assassination the cause of the war?',
                options: [
                  { id: 'yes', text: 'Yes', response: 'It started the chain — but many assassinations before 1914 didn’t lead to war. What made this one different?' },
                  { id: 'no', text: 'No', response: 'Then what was it? Historians call it a trigger: the event that set existing tensions in motion.' },
                  { id: 'part', text: 'Partly', response: 'That’s the key distinction this topic draws: between triggers and deeper causes.' },
                ],
              },
              sources: [{ sourceId: 'brit-ww1' }],
            },
            {
              id: 'hist-causes-2', kind: 'explain', title: 'Causes and triggers',
              body: [
                'Long-term causes are conditions that make an outcome possible or likely: alliance commitments, an arms race, rival imperial ambitions, nationalism in the Balkans.',
                'A trigger is the immediate event that turns that potential into action. It matters — without it, events may have unfolded differently — but on its own it explains little.',
                'A strong explanation shows how the trigger interacted with the conditions.',
              ],
              visual: { motif: 'stack', caption: 'Conditions + trigger' },
            },
            {
              id: 'hist-causes-3', kind: 'example', title: 'Six weeks, step by step',
              body: [
                'Chronology shows how commitments turned a regional crisis into a continental war. Each step was a decision, not an inevitability.',
              ],
              visual: { motif: 'timeline', caption: 'The July Crisis' },
              interaction: {
                type: 'timeline',
                events: [
                  { when: '28 June', what: 'Franz Ferdinand assassinated in Sarajevo' },
                  { when: '23 July', what: 'Austria-Hungary sends Serbia an ultimatum' },
                  { when: '28 July', what: 'Austria-Hungary declares war on Serbia' },
                  { when: '30 July', what: 'Russia orders general mobilisation' },
                  { when: '1–3 Aug', what: 'Germany declares war on Russia, then France' },
                  { when: '4 Aug', what: 'Germany invades Belgium; Britain declares war' },
                ],
              },
              sources: [{ sourceId: 'brit-ww1' }],
            },
            {
              id: 'hist-causes-4', kind: 'complication', title: 'Who is responsible?',
              body: [
                'In 1961 Fritz Fischer argued that Germany’s leaders actively sought a war of expansion and used the crisis to launch it.',
                'In 2012 Christopher Clark argued that decision-makers across Europe — in Vienna, Berlin, St Petersburg, Paris, London and Belgrade — stumbled into war like “sleepwalkers,” each acting on fears and partial information.',
                'Both historians use the same chronology. They disagree about intentions, and about which causes to weigh most heavily.',
              ],
              visual: { motif: 'scales', caption: 'Same facts, different weight' },
              interaction: {
                type: 'compare',
                left: { label: 'Fischer (1961)', text: 'German leaders deliberately pursued war for expansion.' },
                right: { label: 'Clark (2012)', text: 'Shared responsibility; leaders across Europe misjudged each other.' },
                prompt: 'What kind of evidence would help you decide between them?',
              },
              sources: [{ sourceId: 'fischer' }, { sourceId: 'clark' }],
            },
          ],
          quiz: [
            {
              id: 'hist-causes-q1', type: 'choice', conceptId: 'cause-vs-trigger', skill: 'recognise', reelId: 'hist-causes-2',
              prompt: 'Which of these is best described as a long-term cause of the First World War rather than a trigger?',
              options: [
                { id: 'a', text: 'The system of alliances binding the great powers to support each other.', feedback: 'Correct: a standing condition that turned a regional conflict into a general one.' },
                { id: 'b', text: 'The assassination of Franz Ferdinand.', feedback: 'That’s the classic trigger — the immediate event.' },
                { id: 'c', text: 'Austria-Hungary’s ultimatum of 23 July.', feedback: 'That’s a short-term step in the crisis, not a long-term condition.' },
                { id: 'd', text: 'Germany’s invasion of Belgium.', feedback: 'That’s part of the war’s outbreak — it brought Britain in — not a long-term cause.' },
              ],
              correctId: 'a',
              explanation: 'Long-term causes are conditions that exist before the crisis; triggers and short-term steps happen within it.',
              altExample: 'A forest fire: dry weather and dead undergrowth are long-term causes; a discarded match is the trigger.',
              fresh: {
                id: 'hist-causes-q1f', type: 'choice', conceptId: 'cause-vs-trigger', skill: 'recognise', reelId: 'hist-causes-2',
                prompt: 'A city’s bread prices had risen for two years; then the government cut a subsidy and riots broke out that night. What was the subsidy cut?',
                options: [
                  { id: 'a', text: 'The trigger.', feedback: 'Yes: the immediate event acting on existing pressure.' },
                  { id: 'b', text: 'A long-term cause.', feedback: 'The two years of rising prices are the long-term condition; the cut was immediate.' },
                  { id: 'c', text: 'Irrelevant, since prices had already risen.', feedback: 'Triggers matter: they explain timing.' },
                ],
                correctId: 'a',
                explanation: 'Triggers explain timing; long-term causes explain why the trigger had such an effect.',
              },
            },
            {
              id: 'hist-causes-q2', type: 'choice', conceptId: 'chronology-escalation', skill: 'apply', reelId: 'hist-causes-3',
              prompt: 'Britain declared war only after Germany invaded Belgium. What does this sequence suggest about Britain’s entry?',
              options: [
                { id: 'a', text: 'A specific event — the violation of Belgian neutrality — was decisive for Britain’s timing, on top of wider strategic concerns.', feedback: 'Yes: chronology lets you link a decision to what preceded it.' },
                { id: 'b', text: 'Britain started the war.', feedback: 'Britain was among the last great powers to declare war in August 1914.' },
                { id: 'c', text: 'Britain’s decision had nothing to do with events on the continent.', feedback: 'The order of events suggests a direct link to the invasion of Belgium.' },
                { id: 'd', text: 'Chronology can’t say anything about causes.', feedback: 'Order alone doesn’t prove causation, but it narrows the possibilities and shows what decision-makers knew.' },
              ],
              correctId: 'a',
              explanation: 'Sequence is evidence: what came before a decision constrains what could have caused it.',
            },
            {
              id: 'hist-causes-q3', type: 'choice', conceptId: 'interpretation-weighting', skill: 'reason', reelId: 'hist-causes-4',
              prompt: 'Fischer and Clark draw on largely the same events. What best explains why they reach different conclusions?',
              options: [
                { id: 'a', text: 'They weigh causes differently and make different judgements about leaders’ intentions.', feedback: 'Right — interpretation is about weighting and inference, not just facts.' },
                { id: 'b', text: 'One of them invented evidence.', feedback: 'Both are respected works; the disagreement is interpretive.' },
                { id: 'c', text: 'History is just opinion, so neither is better supported.', feedback: 'Interpretations can be judged by how well they account for the evidence.' },
                { id: 'd', text: 'They study completely different wars.', feedback: 'Both explain the outbreak of the First World War.' },
              ],
              correctId: 'a',
              explanation: 'Historians’ disagreements are often about intentions and the relative weight of causes.',
            },
          ],
        },
        {
          id: 'hist-rome',
          title: 'Did Rome fall?',
          objective: 'Compare competing historical interpretations and judge them by the evidence each relies on.',
          prerequisite: 'Causes vs triggers (previous topic).',
          nextStep: 'You’ve finished this module’s core. The challenge asks you to combine sources, causes and interpretation.',
          reels: [
            {
              id: 'hist-rome-1', kind: 'hook', title: 'A date in 476',
              body: [
                'In 476 CE, the Germanic commander Odoacer deposed Romulus Augustulus, the last emperor in the West. Textbooks often call this “the fall of Rome.”',
                'But the Eastern Roman Empire continued, centred on Constantinople, until 1453. Daily life in many Western provinces didn’t change overnight. So what fell?',
              ],
              visual: { motif: 'arch', caption: '476 CE' },
              interaction: {
                type: 'poll', prompt: 'Investigate: “fall” or “transformation”?',
                options: [
                  { id: 'fall', text: 'It fell', response: 'You’re in good company with Gibbon — and with recent archaeologists. Let’s see their evidence.' },
                  { id: 'trans', text: 'It transformed', response: 'That’s the late-antiquity view. Hold it up against the material evidence later.' },
                  { id: 'both', text: 'Depends where', response: 'A strong instinct: the answer differs by region and by what you measure.' },
                ],
              },
              sources: [{ sourceId: 'gibbon' }],
            },
            {
              id: 'hist-rome-2', kind: 'explain', title: 'Three interpretations',
              body: [
                'Decline and fall: Edward Gibbon (1776–1789) told a story of long decline, blaming among other things the loss of civic virtue and the rise of Christianity.',
                'Transformation: Peter Brown (1971) reframed the period as “late antiquity,” a time of religious and cultural creativity rather than collapse.',
                'Return of collapse: Bryan Ward-Perkins (2005) used archaeology to argue that living standards in the West fell sharply after the fifth century.',
              ],
              visual: { motif: 'columns', caption: 'Three readings' },
              sources: [{ sourceId: 'gibbon' }, { sourceId: 'brown' }, { sourceId: 'ward-perkins' }],
            },
            {
              id: 'hist-rome-3', kind: 'example', title: 'What the ground says',
              body: [
                'Ward-Perkins points to evidence that is hard to spin: in many Western regions after about 400–500 CE, mass-produced pottery and roof tiles become rarer and cruder, coinage use declines, and buildings are smaller and made of perishable materials.',
                'This kind of evidence wasn’t produced to persuade anyone. That’s why it carries weight — the same lesson as Kadesh’s toll records.',
              ],
              visual: { motif: 'stack', caption: 'Pots, tiles, coins' },
              sources: [{ sourceId: 'ward-perkins' }],
            },
            {
              id: 'hist-rome-4', kind: 'complication', title: 'Different questions, different answers',
              body: [
                'Brown studies religion, ideas and art, where the period was inventive. Ward-Perkins studies material life and the economy, where it declined.',
                'They may both be largely right about different things. The judgement to make is not “who wins” but which interpretation better answers a particular question, and on what evidence.',
              ],
              visual: { motif: 'scales', caption: 'What are you measuring?' },
              interaction: {
                type: 'compare',
                left: { label: 'Transformation (Brown)', text: 'Focus: religion, culture, ideas. Finds creativity and continuity.' },
                right: { label: 'Collapse (Ward-Perkins)', text: 'Focus: economy, material life. Finds sharp decline.' },
                prompt: 'If you asked “Did ordinary people live worse in 550 than 350?”, which evidence would you weigh most?',
              },
            },
          ],
          quiz: [
            {
              id: 'hist-rome-q1', type: 'choice', conceptId: 'interpretations-rome', skill: 'recognise', reelId: 'hist-rome-2',
              prompt: 'Which historian is most associated with reframing the period as “late antiquity”?',
              options: [
                { id: 'a', text: 'Peter Brown', feedback: 'Correct — The World of Late Antiquity (1971).' },
                { id: 'b', text: 'Edward Gibbon', feedback: 'Gibbon is the classic voice of “decline and fall.”' },
                { id: 'c', text: 'Bryan Ward-Perkins', feedback: 'Ward-Perkins argued for a return to the idea of collapse, using archaeology.' },
                { id: 'd', text: 'Christopher Clark', feedback: 'Clark writes on the outbreak of the First World War.' },
              ],
              correctId: 'a',
              explanation: 'Brown’s “late antiquity” emphasises cultural and religious transformation.',
              fresh: {
                id: 'hist-rome-q1f', type: 'choice', conceptId: 'interpretations-rome', skill: 'recognise', reelId: 'hist-rome-2',
                prompt: 'What kind of evidence is central to Ward-Perkins’s argument?',
                options: [
                  { id: 'a', text: 'Archaeological evidence of material living standards.', feedback: 'Yes — pottery, tiles, coins, buildings.' },
                  { id: 'b', text: 'Sermons and religious writing.', feedback: 'That’s closer to Brown’s focus.' },
                  { id: 'c', text: 'Emperors’ speeches.', feedback: 'His case rests on material remains, not rhetoric.' },
                ],
                correctId: 'a',
                explanation: 'Ward-Perkins grounds “collapse” in material evidence.',
              },
            },
            {
              id: 'hist-rome-q2', type: 'choice', conceptId: 'evidence-type-weight', skill: 'apply', reelId: 'hist-rome-3',
              prompt: 'A historian wants to know whether trade networks in a Western province shrank after 450 CE. Which evidence is most useful?',
              options: [
                { id: 'a', text: 'The distribution of imported pottery found at excavated sites before and after 450.', feedback: 'Yes — routine material evidence directly tracks trade.' },
                { id: 'b', text: 'A bishop’s letter lamenting the sinfulness of the age.', feedback: 'Valuable for beliefs, but moral complaint is weak evidence about trade volume.' },
                { id: 'c', text: 'A modern novel set in the period.', feedback: 'Fiction isn’t evidence of the period itself.' },
                { id: 'd', text: 'Gibbon’s judgement on the period.', feedback: 'Gibbon is a secondary interpretation written 1,300 years later.' },
              ],
              correctId: 'a',
              explanation: 'Match the evidence to the question. Material remains are strong evidence for economic questions.',
            },
            {
              id: 'hist-rome-q3', type: 'choice', conceptId: 'interpretation-scope', skill: 'reason', reelId: 'hist-rome-4',
              prompt: 'Why might Brown and Ward-Perkins both be partly right?',
              options: [
                { id: 'a', text: 'They answer different questions — cultural change versus material living standards — using different evidence.', feedback: 'Right: interpretations often differ in scope, not just in conclusion.' },
                { id: 'b', text: 'All interpretations are equally valid.', feedback: 'Interpretations can be better or worse supported; here they cover different ground.' },
                { id: 'c', text: 'They agree completely and only use different words.', feedback: 'They disagree substantively about what the period should be called and how it felt to live through it.' },
                { id: 'd', text: 'Because Rome both fell in 476 and in 1453.', feedback: 'Those dates concern West and East, not the Brown–Ward-Perkins debate.' },
              ],
              correctId: 'a',
              explanation: 'Clarify the question an interpretation answers before judging it.',
            },
          ],
        },
      ],
      challenge: {
        id: 'hist-evidence-m1-ch',
        title: 'The harbour archive',
        scenario:
          'Fictional exercise. A port town’s archive holds: (1) the governor’s report that a “small disturbance” over grain was “quickly settled”; (2) a merchant’s diary describing three days of riots after grain prices doubled; (3) customs ledgers showing grain imports fell by half over the previous two years; (4) a historian’s book arguing the riots were organised by the governor’s political rivals.',
        questions: [
          {
            id: 'hist-ch-q1', type: 'choice', conceptId: 'corroboration', skill: 'apply', reelId: 'hist-kadesh-4',
            prompt: 'Which source best helps decide between the governor’s and the merchant’s accounts of scale?',
            options: [
              { id: 'a', text: 'The customs ledgers, as routine records with no stake in the story — they show the pressure that makes a serious riot plausible.', feedback: 'Yes — independent routine evidence.' },
              { id: 'b', text: 'The governor’s report, because it is official.', feedback: 'The governor had reasons to minimise disorder.' },
              { id: 'c', text: 'The historian’s book, because it is most recent.', feedback: 'Recency doesn’t make an interpretation evidence about scale.' },
            ],
            correctId: 'a',
            explanation: 'Routine records corroborate or undermine accounts written with a purpose.',
          },
          {
            id: 'hist-ch-q2', type: 'choice', conceptId: 'cause-vs-trigger', skill: 'apply', reelId: 'hist-causes-2',
            prompt: 'In this case, what is the long-term cause and what is the trigger?',
            options: [
              { id: 'a', text: 'Long-term: two years of falling imports. Trigger: grain prices doubling.', feedback: 'Correct.' },
              { id: 'b', text: 'Long-term: price doubling. Trigger: falling imports.', feedback: 'Reversed — the two-year decline is the background condition.' },
              { id: 'c', text: 'Both are triggers.', feedback: 'The two-year decline is a condition, not an immediate event.' },
            ],
            correctId: 'a',
            explanation: 'Conditions build over time; triggers are immediate.',
          },
          {
            id: 'hist-ch-q3', type: 'choice', conceptId: 'interpretation-weighting', skill: 'reason', reelId: 'hist-causes-4',
            prompt: 'What would most strengthen the historian’s claim that rivals organised the riots?',
            options: [
              { id: 'a', text: 'Independent evidence linking the rivals to the crowds — letters, payments, arrests.', feedback: 'Yes: an interpretation about intention needs evidence of intention.' },
              { id: 'b', text: 'More evidence that grain prices rose.', feedback: 'That supports an economic explanation, not organisation by rivals.' },
              { id: 'c', text: 'The governor’s report calling it small.', feedback: 'That says nothing about who organised it.' },
            ],
            correctId: 'a',
            explanation: 'Claims about intentions require evidence of intentions, not only of conditions.',
          },
        ],
      },
    },
  ],
}
