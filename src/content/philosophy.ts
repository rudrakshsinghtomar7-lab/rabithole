import type { Path } from './types'

export const philosophyIdentity: Path = {
  id: 'phil-identity',
  title: 'What makes you, you?',
  origin: 'prepared',
  subjectId: 'philosophy',
  description:
    'Personal identity through thought experiments: what keeps a thing — or a person — the same over time, and which answers survive their best objections.',
  familiarityNote:
    'New to philosophy? We add short primers on how arguments and thought experiments work. With some background, those primers are skipped.',
  sources: [
    { id: 'plutarch', title: 'Life of Theseus, §23', author: 'Plutarch', year: 'c. 75 CE', kind: 'primary', url: 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Theseus*.html' },
    { id: 'hobbes', title: 'De Corpore, Part II, ch. 11', author: 'Thomas Hobbes', year: '1655', kind: 'book' },
    { id: 'locke', title: 'An Essay Concerning Human Understanding, Book II, ch. 27 “Of Identity and Diversity”', author: 'John Locke', year: '1694 (2nd ed.)', kind: 'book', url: 'https://www.gutenberg.org/ebooks/10615' },
    { id: 'reid', title: 'Essays on the Intellectual Powers of Man, Essay III, ch. 6', author: 'Thomas Reid', year: '1785', kind: 'book' },
    { id: 'butler', title: '“Of Personal Identity”, dissertation appended to The Analogy of Religion', author: 'Joseph Butler', year: '1736', kind: 'book' },
    { id: 'parfit', title: 'Reasons and Persons, Part Three', author: 'Derek Parfit', year: '1984', kind: 'book' },
    { id: 'sep-pi', title: 'Personal Identity', author: 'Eric T. Olson, Stanford Encyclopedia of Philosophy', year: 'rev. 2023', kind: 'web', url: 'https://plato.stanford.edu/entries/identity-personal/' },
  ],
  modules: [
    {
      id: 'phil-identity-m1',
      title: 'Persistence: staying the same through change',
      summary: 'Three classic answers to what makes something — and someone — the same thing over time.',
      topics: [
        {
          id: 'phil-ship',
          title: 'The ship that kept changing',
          objective: 'Distinguish numerical identity from qualitative similarity, and explain why gradual replacement makes identity puzzling.',
          prerequisite: 'None. You only need the everyday idea that things can change and still be “the same thing.”',
          nextStep: 'Next you’ll apply the same puzzle to people: is it your memories that make you the same person?',
          reels: [
            {
              id: 'phil-ship-1', kind: 'hook', title: 'What makes you, you?',
              body: [
                'A ship sits in a harbour. Over the years, every rotten plank is replaced, one at a time, until not one original plank remains.',
                'Is it still the same ship?',
              ],
              visual: { motif: 'ship', caption: 'Plank by plank' },
              interaction: {
                type: 'poll', prompt: 'Take a side: after every plank is replaced, is it the same ship?',
                options: [
                  { id: 'same', text: 'Yes — same ship', response: 'You’re tracking continuity: the change was gradual and the ship never stopped being used as that ship. Hold onto that reason; we’ll test it.' },
                  { id: 'not', text: 'No — a new ship', response: 'You’re tracking material: a ship just is its parts, so new parts mean a new ship. Then ask: at which plank did the old ship stop existing?' },
                  { id: 'unsure', text: 'It depends', response: 'Good instinct. “Depends on what?” is exactly where the philosophy starts. The next reels give you words for the options.' },
                ],
              },
              sources: [{ sourceId: 'plutarch' }],
            },
            {
              id: 'phil-ship-2', kind: 'context', title: 'How a thought experiment works', onlyFor: 'new',
              body: [
                'A thought experiment is an imagined case built to isolate one variable. Nobody needs to rebuild a ship; the case strips away everything except the question “what keeps a thing the same?”',
                'Your reaction to the case is evidence about the concept you already use. Philosophers then test whether a general principle explains all your reactions — or whether two of them conflict.',
              ],
              visual: { motif: 'mirror', caption: 'Imagined cases, real concepts' },
            },
            {
              id: 'phil-ship-3', kind: 'explain', title: 'Two kinds of “the same”',
              body: [
                'Numerical identity means being one and the same thing: the cup you drank from yesterday is the cup on your desk now.',
                'Qualitative identity means being exactly alike: two new copies of the same book are qualitatively identical but numerically two.',
                'The ship puzzle is about numerical identity. Nobody doubts the rebuilt ship looks the same. The question is whether it is one continuing ship or a replacement.',
              ],
              visual: { motif: 'figure', caption: 'One thing, or two alike?' },
              interaction: { type: 'reveal', prompt: 'Identical twins: numerically or qualitatively identical?', answer: 'At most qualitatively similar — and never fully, since they differ in experiences. They are numerically two people.' },
              sources: [{ sourceId: 'sep-pi' }],
            },
            {
              id: 'phil-ship-4', kind: 'complication', title: 'Hobbes’s twist: the second ship',
              body: [
                'Thomas Hobbes added a complication. Suppose someone kept every discarded plank and reassembled them, in the original order, into a ship.',
                'Now two ships have a claim. One has continuity of form and use. The other has all the original material. They cannot both be numerically identical to the original — that would make two ships one ship.',
                'So a principle like “same parts, same ship” and a principle like “continuous replacement, same ship” now give conflicting answers about the same case.',
              ],
              visual: { motif: 'branch', caption: 'Two ships, one history' },
              interaction: {
                type: 'compare',
                left: { label: 'Continuity view', text: 'The ship in the harbour: changed gradually, never stopped functioning as the ship.' },
                right: { label: 'Material view', text: 'The reassembled ship: built entirely from the original planks.' },
                prompt: 'Which has the stronger claim? Notice which principle your answer relies on.',
              },
              sources: [{ sourceId: 'hobbes' }],
            },
            {
              id: 'phil-ship-5', kind: 'reflect', title: 'Why this matters for you',
              body: [
                'Most of the atoms in your body are replaced over years. Your beliefs, tastes and plans change too.',
                'If you are numerically the same person as the child in your old photos, something must ground that sameness. The rest of this module tests three candidates: memory, the body, and psychological continuity.',
              ],
              visual: { motif: 'mirror', caption: 'Same person, new parts' },
            },
          ],
          quiz: [
            {
              id: 'phil-ship-q1', type: 'choice', conceptId: 'numerical-vs-qualitative', skill: 'recognise', reelId: 'phil-ship-3',
              prompt: 'A factory produces two phones that are exactly alike. Which statement is correct?',
              options: [
                { id: 'a', text: 'They are qualitatively identical but numerically distinct.', feedback: 'Right: alike in every property, yet two things.' },
                { id: 'b', text: 'They are numerically identical because they share every property.', feedback: 'Sharing properties is qualitative identity. Numerical identity would mean there is only one phone — but there are two.' },
                { id: 'c', text: 'They are numerically identical but qualitatively distinct.', feedback: 'This reverses the terms. Numerically identical things are one thing; these phones are two.' },
                { id: 'd', text: 'Identity does not apply to manufactured objects.', feedback: 'Identity applies to any object. The ship puzzle itself is about a manufactured object.' },
              ],
              correctId: 'a',
              explanation: 'Numerical identity = one and the same thing. Qualitative identity = exactly alike. Two indistinguishable phones are two things that are alike.',
              altExample: 'Think of two coins fresh from the mint: indistinguishable, but if you pocket one, the other is still on the table.',
              fresh: {
                id: 'phil-ship-q1f', type: 'choice', conceptId: 'numerical-vs-qualitative', skill: 'recognise', reelId: 'phil-ship-3',
                prompt: 'Your grandmother’s ring has been resized and re-polished; it looks quite different now. In which sense is it “the same ring”?',
                options: [
                  { id: 'a', text: 'Numerically the same, qualitatively changed.', feedback: 'Yes: one continuing ring whose properties changed.' },
                  { id: 'b', text: 'Qualitatively the same, numerically different.', feedback: 'It no longer looks the same, so qualitative sameness is what it lost — and there is still just one ring.' },
                  { id: 'c', text: 'Neither: it is a new ring.', feedback: 'Possible on a strict material view, but resizing kept most of the metal and the ring’s history — most people would still call it numerically the same.' },
                ],
                correctId: 'a',
                explanation: 'Change in properties is qualitative change. If one ring persists through it, that is numerical identity over time.',
              },
            },
            {
              id: 'phil-ship-q2', type: 'choice', conceptId: 'persistence-conflict', skill: 'apply', reelId: 'phil-ship-4',
              prompt: 'A band keeps its name for 40 years, but every original member has been replaced. Meanwhile the four founders reunite and play the original songs under a new name. What does this case most closely mirror?',
              options: [
                { id: 'a', text: 'Hobbes’s version of the ship: continuity of role and continuity of original parts point to different groups.', feedback: 'Exactly. The named band has continuity of form; the reunion has the original “planks.”' },
                { id: 'b', text: 'Qualitative identity: both groups sound alike, so they are the same band.', feedback: 'Sounding alike is qualitative similarity. The puzzle is which group, if either, is numerically the original band.' },
                { id: 'c', text: 'There is no puzzle, because the name settles which group is the band.', feedback: 'A name is a convention. The puzzle asks whether the convention tracks anything deeper — like the material view does with the founders.' },
                { id: 'd', text: 'The original Plutarch version, because nothing is reassembled.', feedback: 'The founders reuniting is the reassembly — the original parts coming back together. That’s Hobbes’s addition.' },
              ],
              correctId: 'a',
              explanation: 'Hobbes’s case pits two principles against each other: gradual replacement (continuity) versus the original material. The band case has the same structure.',
              altExample: 'A sports club that relocated cities and replaced all its players, while former players start a club in the original stadium.',
              fresh: {
                id: 'phil-ship-q2f', type: 'choice', conceptId: 'persistence-conflict', skill: 'apply', reelId: 'phil-ship-4',
                prompt: 'A historic house is restored brick by brick. The removed bricks are shipped abroad and rebuilt into a perfect copy. Why can’t both houses be the original?',
                options: [
                  { id: 'a', text: 'Because numerical identity is one-to-one: two distinct houses cannot both be one house.', feedback: 'Yes. If both were identical to the original, they would be identical to each other — but they are two.' },
                  { id: 'b', text: 'Because the copy abroad is in a different country.', feedback: 'Location alone doesn’t settle identity; houses can, in principle, be moved.' },
                  { id: 'c', text: 'Because restored buildings always lose their identity.', feedback: 'That’s a strong claim most people reject; the puzzle is that both candidates have a reasonable claim.' },
                ],
                correctId: 'a',
                explanation: 'Identity is transitive and one-to-one. That is why branching cases force a choice between principles.',
              },
            },
            {
              id: 'phil-ship-q3', type: 'choice', conceptId: 'thought-experiment-method', skill: 'reason', reelId: 'phil-ship-2',
              prompt: 'Someone says: “The ship of Theseus is pointless — no one actually rebuilds ships like that.” What is the best response?',
              options: [
                { id: 'a', text: 'The case isolates one question — what grounds identity over time — and our answers test principles we use about real things, including people.', feedback: 'Right: the value is in isolating a variable and exposing conflicts between principles.' },
                { id: 'b', text: 'Ships were really rebuilt like this in ancient Athens, so the case is realistic.', feedback: 'Plutarch does report the Athenians preserving the ship, but the argument doesn’t depend on it being realistic.' },
                { id: 'c', text: 'Thought experiments prove facts about the world without needing evidence.', feedback: 'That overclaims. They test concepts and principles; they don’t replace evidence about how the world is.' },
                { id: 'd', text: 'The objection is correct; only real cases matter in philosophy.', feedback: 'Real cases often mix many factors at once. Imagined cases let you vary one factor at a time.' },
              ],
              correctId: 'a',
              explanation: 'Thought experiments work like controlled experiments for concepts: they hold everything fixed except the factor under test.',
            },
          ],
        },
        {
          id: 'phil-memory',
          title: 'Are you your memories?',
          objective: 'Explain Locke’s memory criterion of personal identity and evaluate it using Reid’s brave-officer objection.',
          prerequisite: 'Numerical vs qualitative identity (previous topic).',
          nextStep: 'Next: what if your psychology could be copied — twice? Parfit asks whether identity is even what matters.',
          reels: [
            {
              id: 'phil-memory-1', kind: 'hook', title: 'The prince and the cobbler',
              body: [
                'John Locke imagined a prince waking up in a cobbler’s body, with all the prince’s memories and none of the cobbler’s.',
                'Everyone would see the cobbler. But who is the person?',
              ],
              visual: { motif: 'mirror', caption: 'Same face, different mind' },
              interaction: {
                type: 'poll', prompt: 'Take a side: who wakes up?',
                options: [
                  { id: 'prince', text: 'The prince', response: 'That’s Locke’s answer: the person goes where the consciousness and memories go.' },
                  { id: 'cobbler', text: 'The cobbler', response: 'You’re siding with the body. That’s a serious position — animalism — and later you’ll see what it costs.' },
                  { id: 'unsure', text: 'Can’t say', response: 'Fair. Notice what pulls each way: the memories versus the living body.' },
                ],
              },
              sources: [{ sourceId: 'locke' }],
            },
            {
              id: 'phil-memory-2', kind: 'explain', title: 'Locke’s memory criterion',
              body: [
                'Locke distinguished the man (a living human organism) from the person (a thinking being that can consider itself as itself at different times).',
                'His proposal: a person at one time is the same person as someone earlier if they can remember, from the inside, that earlier person’s experiences.',
                'This explains why we care about responsibility. It seems unfair to punish someone for acts they cannot connect to themselves at all.',
              ],
              visual: { motif: 'branch', caption: 'Consciousness reaching back' },
              sources: [{ sourceId: 'locke' }, { sourceId: 'sep-pi' }],
            },
            {
              id: 'phil-memory-3', kind: 'example', title: 'Testing it on a real life',
              body: [
                'You at 20 remember being 12. You at 50 remember being 20. So far, memory links each stage to the next.',
                'Now the problem: you at 50 may have no memory at all of being 12. On a strict memory criterion, the 50-year-old is the 20-year-old, the 20-year-old is the 12-year-old — yet the 50-year-old is not the 12-year-old.',
              ],
              visual: { motif: 'timeline', caption: '12 → 20 → 50' },
              interaction: {
                type: 'timeline',
                events: [
                  { when: 'Age 12', what: 'Wins a school prize' },
                  { when: 'Age 20', what: 'Remembers the prize; becomes an officer' },
                  { when: 'Age 50', what: 'Remembers being an officer — not the prize' },
                ],
              },
            },
            {
              id: 'phil-memory-4', kind: 'complication', title: 'Reid’s brave officer',
              body: [
                'Thomas Reid turned that example into an objection. Identity is transitive: if A = B and B = C, then A = C.',
                'Locke’s criterion makes the general (50) identical to the officer (20) and the officer identical to the boy (12), but the general not identical to the boy. That breaks transitivity, so the criterion cannot be right as stated.',
                'Joseph Butler added a second objection: memory presupposes identity. A real memory of an experience is only a memory if you had it — so memory can’t be what makes you the one who had it.',
              ],
              visual: { motif: 'scales', caption: 'Transitivity breaks' },
              sources: [{ sourceId: 'reid' }, { sourceId: 'butler' }],
            },
            {
              id: 'phil-memory-5', kind: 'reflect', title: 'Repairing the theory',
              body: [
                'Later philosophers kept Locke’s insight but changed the mechanism: instead of direct memory, identity requires overlapping chains of psychological connections — memories, intentions, beliefs, character.',
                'The general need not remember the boy, as long as a continuous chain links them. This answers Reid. Whether it answers Butler is still debated.',
              ],
              visual: { motif: 'grid', caption: 'Overlapping chains' },
              interaction: { type: 'reveal', prompt: 'How does a chain of overlapping memories avoid Reid’s objection?', answer: 'Identity follows the whole chain (which is transitive), not each direct memory link. The general is connected to the boy through the officer.' },
              sources: [{ sourceId: 'sep-pi' }],
            },
          ],
          quiz: [
            {
              id: 'phil-memory-q1', type: 'choice', conceptId: 'memory-criterion', skill: 'recognise', reelId: 'phil-memory-2',
              prompt: 'Which statement best captures Locke’s view?',
              options: [
                { id: 'a', text: 'A person persists as long as they can remember, from the inside, their earlier experiences.', feedback: 'Correct — consciousness extended backwards through memory.' },
                { id: 'b', text: 'A person persists as long as the same living body persists.', feedback: 'That is closer to the body or animal view. Locke separated the man (organism) from the person.' },
                { id: 'c', text: 'A person persists as long as they keep the same personality traits.', feedback: 'Character continuity is part of later psychological theories, but Locke’s criterion is memory/consciousness.' },
                { id: 'd', text: 'A person persists as long as others recognise them.', feedback: 'Recognition by others is evidence we use, not what Locke said identity consists in.' },
              ],
              correctId: 'a',
              explanation: 'Locke: personal identity reaches as far back as consciousness — remembering experiences as one’s own — can reach.',
              fresh: {
                id: 'phil-memory-q1f', type: 'choice', conceptId: 'memory-criterion', skill: 'recognise', reelId: 'phil-memory-2',
                prompt: 'On Locke’s view, the prince in the cobbler’s body is…',
                options: [
                  { id: 'a', text: 'the prince, because the prince’s consciousness and memories continue.', feedback: 'Yes — the person goes where consciousness goes.' },
                  { id: 'b', text: 'the cobbler, because the body is the cobbler’s.', feedback: 'Locke would say the man is the cobbler but the person is the prince.' },
                  { id: 'c', text: 'no one, because the body and mind no longer match.', feedback: 'Locke gives a definite answer: the prince.' },
                ],
                correctId: 'a',
                explanation: 'Locke distinguishes the man from the person; personhood follows consciousness.',
              },
            },
            {
              id: 'phil-memory-q2', type: 'choice', conceptId: 'transitivity-objection', skill: 'apply', reelId: 'phil-memory-4',
              prompt: 'Asha at 80 remembers her university years but nothing from age 5. At university she remembered age 5 clearly. On a strict direct-memory criterion, what follows?',
              options: [
                { id: 'a', text: 'Asha-80 is Asha-university, who is Asha-5, yet Asha-80 is not Asha-5 — violating transitivity.', feedback: 'Exactly Reid’s structure applied to a new case.' },
                { id: 'b', text: 'Asha-80 is Asha-5, because they share a body.', feedback: 'Body continuity isn’t the criterion being tested here; the question is what the memory criterion implies.' },
                { id: 'c', text: 'Asha-80 is not Asha-university, because memories fade.', feedback: 'She does remember university, so the direct link holds there.' },
                { id: 'd', text: 'Nothing problematic follows; forgetting is normal.', feedback: 'Forgetting is normal — which is why the criterion is in trouble: it yields an impossible pattern of identities.' },
              ],
              correctId: 'a',
              explanation: 'Direct memory links can hold pairwise without holding end-to-end; identity cannot behave that way.',
              altExample: 'Think of a relay: runner 1 hands to 2, 2 hands to 3. Runner 3 never touched runner 1 — but it’s still one race.',
              fresh: {
                id: 'phil-memory-q2f', type: 'choice', conceptId: 'transitivity-objection', skill: 'apply', reelId: 'phil-memory-4',
                prompt: 'Which repair answers Reid’s objection?',
                options: [
                  { id: 'a', text: 'Require overlapping chains of psychological connection rather than direct memory.', feedback: 'Yes: chains are transitive even when direct links fade.' },
                  { id: 'b', text: 'Require that a person remember every past experience.', feedback: 'That would make almost no one the same person over a single week.' },
                  { id: 'c', text: 'Drop transitivity; identity doesn’t need it.', feedback: 'Giving up transitivity would change what “identity” means; few accept that cost.' },
                ],
                correctId: 'a',
                explanation: 'Psychological continuity theories keep Locke’s insight while restoring transitivity through chains.',
              },
            },
            {
              id: 'phil-memory-q3', type: 'short', conceptId: 'circularity-objection', skill: 'reason', reelId: 'phil-memory-4',
              prompt: 'In two or three sentences: why does Butler think memory can’t be what makes you the same person?',
              modelAnswer: 'A genuine memory of an experience is only a memory if the rememberer actually had that experience. So identifying “real” memories already assumes the person is the same one who had the experience — memory presupposes identity and can’t constitute it.',
              lookFor: ['Distinguishes real memories from apparent ones', 'Notes that “real memory” already assumes the same person had the experience', 'Concludes the account is circular'],
              explanation: 'Butler’s circularity objection: you can’t define identity using a notion (genuine memory) that already requires identity.',
            },
          ],
        },
        {
          id: 'phil-fission',
          title: 'Two of you',
          objective: 'Use Parfit’s fission case to separate “Will I survive?” from “Will what matters to me continue?”',
          prerequisite: 'Psychological continuity and transitivity (previous topic).',
          nextStep: 'You’ve finished the core of this module. Try the module challenge to connect all three ideas.',
          reels: [
            {
              id: 'phil-fission-1', kind: 'hook', title: 'The teletransporter',
              body: [
                'A machine scans you, destroys your body, and builds an exact replica on Mars from local matter. The replica has your memories, plans and personality and is sure it is you.',
                'Did you travel to Mars — or die and get replaced?',
              ],
              visual: { motif: 'figure', caption: 'Scan, transmit, rebuild' },
              interaction: {
                type: 'poll', prompt: 'Take a side: would you step in?',
                options: [
                  { id: 'yes', text: 'Yes, it’s travel', response: 'You’re treating psychological continuity as enough for survival.' },
                  { id: 'no', text: 'No, it’s death', response: 'You’re treating continuity of this body or brain as necessary.' },
                  { id: 'unsure', text: 'Not sure', response: 'Parfit thought the uncertainty itself is revealing. Keep going.' },
                ],
              },
              sources: [{ sourceId: 'parfit' }],
            },
            {
              id: 'phil-fission-2', kind: 'explain', title: 'Fission: the branch line',
              body: [
                'Now the machine malfunctions: your original body survives and a replica also appears on Mars. Both are psychologically continuous with you.',
                'Identity is one-to-one. You can’t be both of them, since they are two people. Choosing one seems arbitrary, since each has an equal claim.',
                'This is the ship of Theseus again — now about you.',
              ],
              visual: { motif: 'branch', caption: 'One becomes two' },
              sources: [{ sourceId: 'parfit' }, { sourceId: 'sep-pi' }],
            },
            {
              id: 'phil-fission-3', kind: 'example', title: 'Parfit’s radical move',
              body: [
                'Parfit argued that in fission you don’t survive as either branch — but that this is nearly as good as ordinary survival.',
                'What matters, he said, is “Relation R”: psychological connectedness and continuity. In fission you have it twice over. Identity is just R when it happens not to branch.',
                'If he’s right, the question “Will it be me?” can be empty: all the facts about memory and continuity are settled, and nothing further remains to discover.',
              ],
              visual: { motif: 'grid', caption: 'Relation R' },
              sources: [{ sourceId: 'parfit' }],
            },
            {
              id: 'phil-fission-4', kind: 'complication', title: 'The objection from the body',
              body: [
                'Animalists reply that you are a human animal. Psychological theories face the “too many thinkers” problem: if you and your organism are distinct, there seem to be two thinkers in your chair.',
                'On the animal view, the teletransporter kills you, and fission leaves you as the original body. The cost: in Locke’s prince case, the person who wakes up with the prince’s memories is the cobbler.',
              ],
              visual: { motif: 'columns', caption: 'You are an organism' },
              interaction: {
                type: 'compare',
                left: { label: 'Psychological view', text: 'You go where your psychology goes. Fission is the hard case.' },
                right: { label: 'Animal view', text: 'You are the living organism. Brain-swap cases are the hard case.' },
                prompt: 'Every view has a case that strains it. Which cost would you rather pay?',
              },
              sources: [{ sourceId: 'sep-pi' }],
            },
          ],
          quiz: [
            {
              id: 'phil-fission-q1', type: 'choice', conceptId: 'fission-problem', skill: 'recognise', reelId: 'phil-fission-2',
              prompt: 'Why is fission a problem for psychological continuity theories?',
              options: [
                { id: 'a', text: 'Both branches are equally continuous with the original, but identity is one-to-one, so the theory can’t say who the original becomes.', feedback: 'Correct. Continuity can branch; identity can’t.' },
                { id: 'b', text: 'Neither branch has any memories of the original.', feedback: 'Both branches have all the original’s memories — that is why each has an equal claim.' },
                { id: 'c', text: 'Fission is physically impossible, so the theory can ignore it.', feedback: 'The point is conceptual: a theory of identity should give a coherent answer even in imagined cases.' },
                { id: 'd', text: 'Psychological continuity requires the same body.', feedback: 'It explicitly doesn’t — that’s what distinguishes it from bodily views.' },
              ],
              correctId: 'a',
              explanation: 'A relation that can hold one-to-many (continuity) can’t simply be identity, which is one-to-one.',
              fresh: {
                id: 'phil-fission-q1f', type: 'choice', conceptId: 'fission-problem', skill: 'recognise', reelId: 'phil-fission-2',
                prompt: 'Which earlier case shares the logical structure of fission?',
                options: [
                  { id: 'a', text: 'Hobbes’s ship, where the harbour ship and the reassembled ship both claim to be the original.', feedback: 'Yes — two candidates, one original.' },
                  { id: 'b', text: 'Two identical phones from a factory.', feedback: 'Those were never one thing; nothing branched.' },
                  { id: 'c', text: 'The prince waking in the cobbler’s body.', feedback: 'That case has one candidate person, not two.' },
                ],
                correctId: 'a',
                explanation: 'Branching cases force a choice between equally good candidates.',
              },
            },
            {
              id: 'phil-fission-q2', type: 'choice', conceptId: 'relation-r', skill: 'apply', reelId: 'phil-fission-3',
              prompt: 'Maya learns she will undergo fission tomorrow. On Parfit’s view, how should she regard it?',
              options: [
                { id: 'a', text: 'Roughly as good as ordinary survival, since what matters — psychological continuity — continues, twice.', feedback: 'That’s Parfit’s conclusion.' },
                { id: 'b', text: 'As death, so she should be as afraid as she would be of dying.', feedback: 'Parfit grants she won’t be identical to either, but denies this is as bad as death.' },
                { id: 'c', text: 'As survival as exactly one of the two branches, chosen at random.', feedback: 'Parfit rejects arbitrary selection; neither branch has a better claim.' },
                { id: 'd', text: 'As irrelevant, since nothing about her psychology changes.', feedback: 'Something does change: there will be two continuers with diverging futures.' },
              ],
              correctId: 'a',
              explanation: 'Parfit: identity isn’t what matters; Relation R is. Fission gives you R without identity.',
            },
            {
              id: 'phil-fission-q3', type: 'choice', conceptId: 'animalism-cost', skill: 'reason', reelId: 'phil-fission-4',
              prompt: 'Which assumption does the animal view rely on that the psychological view rejects?',
              options: [
                { id: 'a', text: 'That you are fundamentally a biological organism, so you persist exactly when that organism does.', feedback: 'Right — that’s the core commitment, and it’s what makes the prince case hard for it.' },
                { id: 'b', text: 'That memories are unreliable.', feedback: 'Animalists can accept that memories are reliable; they deny memories are what identity consists in.' },
                { id: 'c', text: 'That identity is not one-to-one.', feedback: 'Animalists keep identity one-to-one. Organisms don’t branch in fission cases — the original body stays the original.' },
                { id: 'd', text: 'That teletransportation is possible.', feedback: 'Both views can discuss it; they disagree about what it would do.' },
              ],
              correctId: 'a',
              explanation: 'The disagreement is about what kind of thing you are: an organism, or a psychological subject.',
            },
          ],
        },
      ],
      challenge: {
        id: 'phil-identity-m1-ch',
        title: 'The upload',
        scenario:
          'Fictional scenario. A company offers “gradual upload”: over a year, your neurons are replaced one by one with artificial ones that do the same job. At the end, your psychology is intact and no original neurons remain. The removed neurons are kept frozen; in ten years they could be revived as a brain.',
        questions: [
          {
            id: 'phil-ch-q1', type: 'choice', conceptId: 'persistence-conflict', skill: 'apply', reelId: 'phil-ship-4',
            prompt: 'Which earlier case has the same structure as reviving the frozen neurons?',
            options: [
              { id: 'a', text: 'Hobbes’s reassembled ship.', feedback: 'Yes: gradual replacement on one side, original material reassembled on the other.' },
              { id: 'b', text: 'Locke’s prince and cobbler.', feedback: 'That case swaps minds and bodies; nothing is reassembled.' },
              { id: 'c', text: 'Two identical phones.', feedback: 'That case is about qualitative identity, not persistence through change.' },
            ],
            correctId: 'a',
            explanation: 'Gradual replacement versus reassembled originals is exactly the Hobbes variant.',
          },
          {
            id: 'phil-ch-q2', type: 'choice', conceptId: 'relation-r', skill: 'reason', reelId: 'phil-fission-3',
            prompt: 'If the frozen brain is revived with your old memories, what would Parfit most likely say?',
            options: [
              { id: 'a', text: 'You now have two continuers; asking which is “really you” may be empty, but what matters continues in both.', feedback: 'That’s the Parfitian reading — fission by another route.' },
              { id: 'b', text: 'The revived brain is definitely you because it has the original matter.', feedback: 'That’s the material view Parfit is sceptical of.' },
              { id: 'c', text: 'Neither is you, so you died during the upload.', feedback: 'Parfit would deny that losing identity here is like dying.' },
            ],
            correctId: 'a',
            explanation: 'Parfit dissolves the question by shifting attention from identity to Relation R.',
          },
          {
            id: 'phil-ch-q3', type: 'choice', conceptId: 'animalism-cost', skill: 'reason', reelId: 'phil-fission-4',
            prompt: 'An animalist says the gradual upload ends your life at some point during the year. What is the strongest challenge to them?',
            options: [
              { id: 'a', text: 'There seems to be no non-arbitrary moment when the organism stops existing — the same problem as “which plank?”', feedback: 'Yes: gradual change makes sharp cut-offs look arbitrary.' },
              { id: 'b', text: 'Organisms can’t have artificial parts.', feedback: 'People with pacemakers are still organisms; the challenge is subtler.' },
              { id: 'c', text: 'Animalism denies that memories exist.', feedback: 'It doesn’t; it denies memories ground identity.' },
            ],
            correctId: 'a',
            explanation: 'Gradual cases pressure any view that needs a sharp boundary.',
          },
        ],
      },
    },
  ],
}
