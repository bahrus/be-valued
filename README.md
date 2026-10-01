# be-valued (💍)

Reflect the value of the input to the value attribute on input event.

```html
<form be-valued>
    <input>
</form>
```

Useful for styling, persistence of innerHTML.  Works with any element whose string "value" can be determined by doing oElement.value, and which emits event "input" when the value changes.  Both "value" and "input" are configurable.


The enhancement continues to honor reset input elements:

```html
<input type="reset" value="Reset the form" />
```

by intercepting the reset event and implementing that functionality within the enhancement.

To reflect on a different event, or to reflect other properties, pass JSON arrays.  Boolean properties are reflected as boolean attributes:

```html
<form be-valued be-valued-on='["change"]' be-valued-props='["value", "checked"]'>
    <input>
    <input type=checkbox>
</form>
```

## Programmatic attachment (no attribute)

The attribute syntax shines for server-rendered HTML and progressive enhancement, where the markup alone says what the enhancement does.  But most web development today renders on the client, with a framework (Lit, React, Vue, Svelte, etc.) that already has a JavaScript reference to each element it creates.  There, attaching be-valued programmatically is the better fit:

1. **A less clunky API.**  Frameworks are awkward about setting arbitrary attributes, let alone an emoji one like `💍`, or JSON inside one, like `be-valued-props='["value", "checked"]'`.  Programmatically, that is just `{props: ['value', 'checked']}`.  A single event or property can also be passed as a plain string: `{on: 'change'}`.
2. **Less stringifying and parsing.**  The framework serializes the arrays to JSON, and the enhancement parses them back with `JSON.parse`.  Programmatically, the arrays are used as they are.
3. **Less overhead monitoring attributes.**  The attribute approach relies on be-hive / mount-observer watching the DOM for elements that carry (or gain) the attribute.  `def.js` just registers the config.  The enhancement is attached exactly when, and to exactly the elements, your code says, and mount-observer is never loaded.

Either way it is the **same enhancement**, with the same defaults and the same reset handling, so the two approaches can be mixed in one app: attributes for server-rendered islands, programmatic attachment inside client-rendered components.

### Registration

```JavaScript
import { defBeValued } from 'be-valued/def.js';
const emc = await defBeValued(document.body); // or a shadow root's host, for a scoped registry
```

### Attribute → property mapping

| Attribute            | Property | Default     | Notes |
|----------------------|----------|-------------|-------|
| `be-valued` (`💍`)   | *(attachment itself)* | | |
| `be-valued-on`       | `on`     | `['input']` | Event name(s) to listen for.  JSON array in the attribute; array *or single string* as a property. |
| `be-valued-props`    | `props`  | `['value']` | Property name(s) to reflect as (kebab-cased) attributes.  String properties set the attribute's value; boolean properties add or remove it.  JSON array in the attribute; array *or single string* as a property. |

### Declarative -- via `enh.set`

```JavaScript
// equivalent to <form be-valued be-valued-on='["change"]'>
oForm.enh.set.beValued.on = ['change'];
oForm.enh.beValued.props = ['value', 'checked'];
```

Only the first property needs to go through `.set` -- that is what attaches the enhancement.  This works before or after `defBeValued` is called.  If it is called after, the enhancement is attached once the config is registered.

### Imperative -- via `enh.get()`

```JavaScript
Object.assign(oForm.enh.get(emc), {
    on: 'change',
    props: ['value', 'checked'],
});
```

### Differences from the attribute path

- **Enhancement key.**  Programmatically, the instance is always at `el.enh.beValued`.  With the emoji attribute it is at `el.enh['💍']`.

See [demo/Programmatic](demo/Programmatic/) for runnable examples.



[![Playwright Tests](https://github.com/bahrus/be-valued/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-valued/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-valued.png)](http://badge.fury.io/js/be-valued)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-valued?style=for-the-badge)](https://bundlephobia.com/result?p=be-valued)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-valued?compression=gzip">

## Viewing Locally

Any web server that serves static files with server-side includes will do but...

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run serve
9. Open http://localhost:8000/demo/ in a modern browser

## Importing in ES Modules:

```JavaScript
import 'be-valued/be-valued.js';

```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-valued';
</script>
```
