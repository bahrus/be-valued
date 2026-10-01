# Add Support For Programmatic Attachment

## Bruce's Ask

Can you please follow the example of [be-persistent](https://github.com/bahrus/be-persistent) and [the addendum](../types/ImportantEnhancementAddendum.md) to add demos and adjust be-valued.js as needed and add def.js to support programmatic attachment of this enhancement?

Please add your implementation notes below.

## Implementation Notes

be-valued can now be attached with no attribute and no be-hive, via
`el.enh.set.beValued` or `el.enh.get(emc)`. It follows be-persistent and
addendum steps 1–6. Step 7 (accept elements wherever an id is accepted)
doesn't apply: be-valued takes no ids. The approach matches be-clonable,
be-delible and be-typed, done just before this one. See
[be-clonable's notes](../../be-clonable/Chats/AddSupportForProgrammaticAttachment.md).
be-valued needed the fewest changes of the four.

### What changed

| File | Change |
|------|--------|
| `def.js` (new) | `defBeValued(ref)`, the formulaic copy of be-persistent's. |
| `be-valued.js` | `init` reads `ctx.emc \|\| ctx.config`, `await`s roundabout, then sets `initialized` (steps 1–2). `on` / `props` may be a single string (see below). |
| `emc.mjs` → `emc.json`, `💍.json` | `enhKey` changed from `BeValued` to `beValued`. |
| `package.json` | Adds `assign-gingerly` to `dependencies`. `exports` now lists `./def.js`, `./emc.json` and `./💍.json`, replacing the nonexistent `./emc.js` and `./💍.js`. `files` now includes the two JSON files. |
| `types/be-valued/types.d.ts` | `on` / `props` typed `string \| string[]`. Adds `initialized?: boolean`. |
| `README.md` | New "Programmatic attachment (no attribute)" section (step 6). Also an attribute example showing the JSON-array syntax for `be-valued-on` / `be-valued-props`, which the README didn't show before. |
| `demo/Programmatic/` | `DeclarativeInSequence.html`, `DeclarativeOutOfSequence.html`, `Imperative.html`. |
| `tests/Programmatic*.{html,spec.mjs}` | One per pattern (step 5). |

### Notes

1. **A single string for `on` / `props`.** The attributes take JSON arrays
   (`be-valued-on='["change"]'`). The natural programmatic mistake is
   `{on: 'change'}`. Before, `for (const e of on)` would have iterated the
   string's characters. That registers listeners for `c`, `h`, `a`, …, and
   fails silently. A small `toArray` helper now treats a string as a
   one-element array, in both `hydrate` and `handleEvent`. The README's
   mapping table calls out that the property accepts this and the attribute
   doesn't.

2. **`enhKey` casing**, as in be-clonable and be-delible: `BeValued` →
   `beValued`, so the API is `el.enh.set.beValued`.

3. **`package.json`**: the same issues as the others:
   - `def.js` imports assign-gingerly, but it wasn't a dependency. It only
     resolved, at 0.0.87, through be-hive.
   - `exports` listed nonexistent `.js` files.
   - `files` left out `emc.json`.

Nothing else needed fixing:
- Both settings are referenced by the `hydrate` action, so addendum step 4
  doesn't bite.
- There's no `dispatch` compact, so no roundabout console error.
- The button / compact issues from be-typed don't apply.

### Tests

The three new specs follow be-persistent's fixtures. They load only
`def.js`: no attribute, no be-hive. Each spec waits for `resolved`, then:
- *In / out of sequence* (`on: ['input']`): typing reflects to `value="…"`.
  Clicking the form's reset button restores both the value and the original
  (absent) attribute.
- *Imperative* (`on: 'change'` as a **string**, `props: ['value',
  'checked']`):
  - typing does *not* reflect;
  - blurring, which fires `change`, does;
  - checking the checkbox adds `checked=""`, and unchecking removes it.
- All three assert no console errors, and that mount-observer was never
  requested.

`test1.spec.mjs` (the attribute path) now also asserts no console errors.

Negative controls. Each fix was temporarily reverted, and its test failed
for the expected reason:

| Reverted | Result |
|----------|--------|
| `ctx.config` fallback removed | All 3 fail: never resolves |
| `toArray` made a no-op | Imperative fails: no `value` attribute after `change` |

Final run: **4 passed**, and the programmatic specs 15/15 with
`--repeat-each 5`. Also checked in the browser:
- the three demo pages: reflection and reset both work, with no errors;
- the new README attribute example: JSON-array `on` / `props`, `change`
  only, and `checked` reflected.

### Other things to know

- `test1.spec.mjs` still waits a fixed 12 seconds, so the suite takes about
  14 s. I left that alone.
- `npm install` updated `package-lock.json`, for the new dependency.
- `git status` shows the `legacy/` files as deleted. That was already the
  case before this change; I didn't touch them.
- The `types.d.ts` change is in this clone of the `types` submodule. It
  needs committing / pushing from there.

