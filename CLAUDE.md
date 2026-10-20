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
- `NIVEL` (objeto por id): 1 = muy fácil, 2 = fácil, 3 = con un poco de mano. Las de nivel 1 salen con el filtro «Para empezar». Toda receta nueva necesita su nivel.
- `GLOSARIO`: palabras de cocina que se subrayan solas en los pasos y se explican al tocarlas. El usuario está empezando a cocinar: si una receta nueva usa otro término técnico, añádelo aquí con una explicación sencilla (y, si es de fuego, con el número de la vitro del 1 al 9).
- `NUTRI` (por id, por ración): `[fibra g, raciones de fruta y verdura (≈80 g o 1 pieza), grupos]`. Los grupos son `pescado`, `azul` y `legumbre`, y alimentan las comprobaciones semanales del plan (AESAN: pescado 3–4/semana con al menos 1 azul, legumbres 2–4, fruta y verdura 5/día; EFSA: fibra 25 g/día). Toda receta nueva necesita su entrada.
- `SAL`: recetas con bastante sal y el aviso que muestran.
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

## Comprobación antes de publicar

Antes de publicar, ejecuta en la consola del navegador (o en un navegador headless) una comprobación de todas las recetas:

- `completa ≈ racion × raciones`, con un margen del 4 %.
- kcal entre −6 % y +15 % de `4p + 4c + 9g`. El margen es por la fibra.
- Cada `compra` existe en `INGREDIENTES` o en `EXTRA_ING`, y cada `usa` existe en `INGREDIENTES`.
- Cada receta tiene `SABOR` y `UTENSILIOS`.
- Las recetas de airfryer tienen «Precalienta» y «posición» en los pasos.
- Las `cat` y los `met` están en `CATS` y `METS`.
- Los `[[id]]` apuntan a recetas que existen.
- Los ids de `SEMANA_TIPO` existen.

## Datos personales (repo privado, `datos.json`)

- `recetas`: favorita, hechas, nota, fotos y estrellas de cada receta.
- `compra`: la lista de la compra.
- `plan`: `{ semanas: { "AAAA-MM-DD" (lunes): { dias, entreno[7] } }, obj: { kcal, kcalD, p, g } }`. El formato antiguo `plan.dias` se migra solo a la semana actual.
- `progreso`: `{ registros: [{ fecha, peso, cintura? }] }`. Los consejos se basan en medias semanales: 3 semanas sin cambios → −150–200 kcal; más de 0,5 kg/semana → +150–200 kcal.
- `despensa`: los ids de lo que el usuario tiene en casa («Con lo que tengo»).

## App instalable

- `manifest.webmanifest`, `sw.js` y los iconos `icon-*.png` y `apple-touch-icon.png`.
- El service worker pide primero la red para la página y, sin conexión, tira de la copia. Fuentes e iconos van primero desde la caché. No toca la API de GitHub.
- Si cambias los iconos o el manifest, sube `CACHE` en `sw.js` (`recetario-v2`…).

## Probar y publicar

- Para probar en local, abre `index.html` en el navegador. Si quieres servirlo: `python3 -m http.server`.
- Para publicar, haz commit y push a `main`. Pages se actualiza en ~1 minuto.
- Configura git en este repo con el nombre `hectorgarvi` y el email `100135701+hectorgarvi@users.noreply.github.com`, para no publicar otro email.
- `.gitignore` solo deja pasar `index.html`, `README.md`, `CLAUDE.md` y `.gitignore`. Si añades un archivo nuevo, añádelo también ahí.
