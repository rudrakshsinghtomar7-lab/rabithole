# rudra.

**Turn curiosity into understanding.**

Rudra is a mobile-first learning app. Pick what you want to understand, follow a structured path through short, vertically swipeable reels, and check your understanding with a three-question checkpoint at the end of every small topic. It covers your own interests and your university courses.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

Everything works without an account, a backend or any paid service. Progress is stored on your device.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check and build the static app into `dist/` (relative base, so GitHub Pages works) |
| `npm test` | Unit tests: learning-state transitions, XP idempotency, review scheduling, persistence, citations, content integrity |
| `npm run typecheck` | TypeScript project check |
| `npm run lint` | oxlint |
| `npm run server` | Optional generation server (see below) |

## What's in it

- **My Interests**: eight subjects, each with a prepared path of one module, three small topics and a module challenge:

  | Subject | Path | Action label |
  | --- | --- | --- |
  | Philosophy | *What makes you, you?* | Take a side |
  | History | *Reading the past* | Investigate |
  | Marketing | *A product. A person. A reason.* | Make your move |
  | Political Science | *Who decides?* | Make the call |
  | Economics | *The costs you don't see* | Count the cost |
  | Geography | *Why here?* | Read the map |
  | Finance | *Money over time* (educational, not advice) | Run the numbers |
  | Science | *How do we know?* | Test it | Familiarity changes the path (beginners get primer reels). You can also ask for a custom topic or learning goal, and there's a Saved list for bookmarks and notes.
- **My Courses**: create a course with an optional code, then add a syllabus, lecture material, readings and practice questions as PDF, `.txt`, `.md` or pasted text. Text is genuinely extracted with page references (sections for plain text). Scanned, corrupt, empty and unsupported files each get a clear explanation. The originals are kept so you can reopen them. A clearly labelled **sample course** (ECON 101, supply and demand) runs the full course flow, with every reel citing a real page of its bundled documents.
- **Review**: concepts that are due, concepts where you needed help, fresh practice questions and mixed questions across topics, filterable by Interests, Courses or Both. Scheduling uses a visible, configurable rule rather than a prediction:
  - answered without help: up one step
  - answered with help: same step
  - missed: back to step 1
  - default gaps are 1, 3, 7, 16 and 35 days
- **My Progress**: interests and courses are shown separately. It covers active paths, completed topics, checkpoint results, independent vs assisted answers, topics needing another attempt, review history, the daily goal and the next useful step. XP is kept apart from evidence of understanding.

### Interaction feel

- Sheets on phones can be dragged down to dismiss. The sheet tracks your finger 1:1 and resists if you drag upward. On release it either dismisses (based on velocity or projected distance) or springs back with a slight bounce. You can catch it mid-animation, and the backdrop fades in step with the drag. Wider screens get a centred card. Springs live in `src/ui/spring.ts` and use Apple's damping and response model.
- Press feedback appears the moment you press. Hover styles only apply with a mouse.
- Platform basics are covered: no tap flash, no long-press text selection on controls, no page overscroll or pull-to-refresh, safe areas respected, and a status-bar colour that follows the theme and each subject while in a reel.
- Reduced motion swaps travel for fades. Reduced transparency and higher contrast get solid surfaces and stronger borders.

### Learning rules worth knowing

- Viewing reels marks *content* done; only the checkpoint completes a topic.
- A wrong answer shows feedback specific to that option, a link back to the explaining reel, an alternative example, and a fresh question on the same concept. Anything answered after help, a retry or the solution counts as *assisted*, never as independent.
- XP is awarded once per eligible activity, keyed by a stable id: 20 per checkpoint, 5 per independent answer, 40 per module challenge, and 5 per scheduled review instance. Retakes, refreshes and reopened quizzes can't duplicate it. Swiping earns nothing.
- Course progress belongs to the course. Learning something similar in My Interests doesn't tick off a course topic.

## Personalised generation (optional)

Custom topics and turning uploaded course material into a study path need an AI provider. The browser never holds credentials. It calls `/api`, which `server/index.ts` serves.

```bash
cp .env.example .env      # add ANTHROPIC_API_KEY
npm run server            # :8790 — Vite proxies /api to it in dev
npm run dev
```

The server uses Claude (`claude-opus-5-5` by default, override with `RUDRA_MODEL`) with structured outputs to return modules, topics, reels and quizzes. It has server-side refusal fallbacks enabled (`fallbacks: "default"`). Every citation is checked twice, on the server and again in the browser against the files actually stored on the device. Citations that point to an unknown file or a missing page are removed, and reels that relied only on them are relabelled *supplementary*. Course paths arrive as a **proposal** you review before adding.

Without a server, Rudra says plainly that generation isn't set up. Custom requests are saved, and uploads are stored and readable, but nothing claims a document was analysed.

## Structure

```
src/content/    Content model + prepared paths and sample course (plain data)
src/learning/   Pure state transitions: progress, XP, review scheduling, citations
src/store/      Versioned localStorage state (sanitised on load), IndexedDB for files
src/services/   PDF/text extraction (pdf.js), generation client
src/pages/      Screens;  src/ui/  shared components (reel, quiz, sheet, art)
server/         Optional generation server (Anthropic SDK)
```

## Known limitations

- No OCR. Scanned PDFs are detected and explained, but not read.
- Only PDF, `.txt`, `.md` and pasted text are supported, not `.docx` or slides.
- Progress lives in this browser (localStorage + IndexedDB). There's no sync or account.
- Without generation configured, your own courses hold readable materials but no lessons. The sample course shows the full course flow.
- Reels are interactive visuals. The media slot for narration or video exists in the content model but no prepared reels use it yet.
- Short-answer questions are self-assessed against a model answer.
