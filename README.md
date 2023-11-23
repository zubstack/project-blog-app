# Practice: Blog List

Comando para ejecutar un test especifico

```bash
npm test -- -t '<test_text>'
```

A esto le llamo 'pulir' un objeto. Alteramos el _schema_ para que transforme los datos que llegan para presentarlos en un formato mas agusto:

```js
postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
```
