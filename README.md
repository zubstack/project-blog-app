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

Asi que siempre al inicio _de cada test_ vaciamos la database y agregamos dos entradas iniciales:

```js
beforeEach(async () => {
  await Post.deleteMany({});

  helper.initialPosts.map(async (item) => {
    let postObject = new Post(item);
    await postObject.save();
  });
});
```

/ Nota: Algo erro sucede cuando intento agregar mas de 2 entradas, hay comportamiento inesperado.

Descubri de que se trataba: Ejecutar promesas en bucle tiene un detalle y es que, el bucle puede finalizar pero no significa que las promesas se hayan terminado de ejecutar debidamente y los tests se ejecutan de todas maneras. Solucionando esto encapsulando las promesas en un array de promesas y los ejecutaremos con una sentencia especial:

```js
await Promise.all(promiseArray);
```

### JOIN collection with Mongoose

Las DB no relacionales no tienen la misma facilidad para anexar tablas relacionadas como la tienen la DB relacionales (que si tienen JOIN).
Hay muchas formas de establecer relaciones entre collecciones, la que usaremos en esta relacion _uno a muchos_ sera establecer una referencia en cada bando:

- Cada objeto usuario porta un array con los id de los posts que "escribio" y cada post guarda un unico valor (el id) que corresponde a su creador.

Para lograr eso modificamos ambos _schemas_
