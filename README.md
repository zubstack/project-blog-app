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

Cuando hacemos tests, queremos encontrar a la base de datos en un estado uniforme, sin verse alterado por las ejecuciones de los mismos anteriores tests.

Asi que siempre al inicio vaciamos la database y agregamos dos entradas iniciales:

```js
beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(helper.initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(helper.initialNotes[1]);
  await noteObject.save();
});
```
