# WaKa App
A mobile webapp for learning japanese kanji &amp; vocabulary.


This app uses the most up-to-date version of the WaniKani curriculum as its lesson structure.

> *I do no claim to own the curriculum for this app, __only the code explicitly in this repository__.*

The curriculum is not included in the app until an API token is given.
*TODO: API token registration*

---

API can be added as a new file 'src/api_token.ts'

```javascript
export default '<API TOKEN HERE>';
```

---

The app will feature a quiz function that lets users revise sets of radicals, kanji or vocabulary.
<!-- Later plans are:
 - A custom study mode.
 - Inclusion of the WaniKani SRS system, linked to the users account. -->

---

The app uses Typescript, VueJS, Babel and some other stuff and will be compiled into a capacitor app (If I can figure that out).
