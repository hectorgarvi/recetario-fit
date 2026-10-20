# Recetario fit

Recetario personal publicado en GitHub Pages: https://hectorgarvi.github.io/recetario-fit/

Recetas con mucha proteína y poca grasa que sacien, con filtros, plan semanal, lista de la compra, modo cocina y guía de marcas. Todo el texto de la web está en español de España.

## Estructura

- `index.html` contiene toda la web: HTML, CSS y JS en un solo archivo, sin dependencias ni build. Solo carga Google Fonts.
- Este repo es **público**. Los datos personales nunca van aquí.
- Los datos personales (favoritas, notas, plan, lista de la compra y fotos) están en el repo **privado** `hectorgarvi/recetario-datos`:
  - `datos.json`, con las claves `recetas`, `compra` y `plan`.
  - `fotos/<receta>-<timestamp>.jpg`.
  - `perfil.md`, con el perfil nutricional del usuario y sus objetivos. **Léelo antes de proponer recetas o planes:** `gh api repos/hectorgarvi/recetario-datos/contents/perfil.md --jq .content | base64 -d`
- La web escribe en el repo privado con la API de contenidos de GitHub. Usa un token fine-grained que el usuario pega en cada dispositivo (se guarda en localStorage `rf-ghtoken`) y que solo tiene Contents RW sobre `recetario-datos`. Sin token, guarda solo en el navegador. Al conectar, mezcla los datos locales con los remotos.

## Datos dentro de `index.html`

- `RECETAS` (array): una entrada por receta.
  - `id`, `corto`, `nombre`, `cat` (Desayuno, Tentempié, Comida, Merienda, Postre, Cena), `met` y `ext`.
  - Valores: `raciones`, y `completa` / `racion` como `{kcal, p, g, c}`.
  - Contenido: `ingredientes`, `pasos`, `tabla`, `notaTabla`, `tips`, `conserva`.
  - `compra`: lista de `[ingrediente, cantidad para la receta entera, unidad]`; `null` significa «al gusto».
  - `usa`: los ids de `INGREDIENTES` que se enlazan a la guía de marcas.
  - `gluten`: natural, avena, pan, pasta, fideos o soja. `lacteos`: booleano.
- Marcas dentro de los textos:
  - `{300}` es una cantidad que se escala con «Cantidades para».
  - `[[id]]` enlaza a otra receta.
  - `[[t:5]]` pone un temporizador de 5 minutos.
  - Evita plurales que se rompan al escalar: escribe «Claras de huevo: {1}», no «{1} clara».
- `UTENSILIOS` (objeto por id de receta): lista de `[utensilio, qué hacer si no lo tienes]`. Toda receta nueva debe tener su entrada; cuando un aparato eléctrico es imprescindible (batidora, picadora, airfryer), da la alternativa a mano o con otro aparato. `AF_HORNO(...)` y `BASCULA(...)` generan los textos de horno convencional y de medidas con cucharas.
- `INGREDIENTES`: la guía de marcas, con criterio de etiqueta y `productos`. Cada producto lleva `[kcal, prot, grasa, carb]` por 100 g y un enlace a su ficha.
- `EXTRA_ING`: ingredientes de la lista de la compra que no tienen ficha de marca.
- `PASILLOS`: el orden de las zonas del súper en la lista de la compra.
- `SABOR`: el color de la ficha de cada receta (avena, frambuesa, melocoton, cacao, vainilla, espinaca).
- `HUECOS` y `SEMANA_TIPO`: los huecos del plan y la semana de ejemplo. `"id|1.5"` significa ración ×1,5.

## Criterios al añadir recetas

- Mucha proteína y poca grasa en las recetas. La grasa buena va en la comida del mediodía (aceite de oliva, pescado azul) y en los frutos secos.
- Valores nutricionales **aproximados**, calculados con productos reales.
  - Verifica los productos en Open Food Facts: `https://search.openfoodfacts.org/search?q=...`, filtrando por `countries_tags` que contenga `en:spain`.
  - Si no hay un producto verificable, deja `productos: []` y explica el criterio en el texto. Nunca inventes una marca.
- Cocina del usuario: freidora de aire Princess de 10 L (tipo horno, con varias alturas de bandeja), sartén, cazo y microondas. Toda receta de airfryer debe incluir: precalentado (temperatura y 3 min), altura de la bandeja, temperatura y tiempo de cada fase y cómo saber si está hecho.
- Revisa que `completa` sea `racion × raciones`. Comprueba también que kcal ≈ 4·p + 4·c + 9·g, con margen por la fibra.

## Probar y publicar

- Para probar en local, abre `index.html` en el navegador. Si quieres servirlo: `python3 -m http.server`.
- Para publicar, haz commit y push a `main`. Pages se actualiza en ~1 minuto.
- Configura git en este repo con el nombre `hectorgarvi` y el email `100135701+hectorgarvi@users.noreply.github.com`, para no publicar otro email.
- `.gitignore` solo deja pasar `index.html`, `README.md`, `CLAUDE.md` y `.gitignore`. Si añades un archivo nuevo, añádelo también ahí.
