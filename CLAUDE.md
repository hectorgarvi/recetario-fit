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
  - `id`, `corto`, `nombre`, `cat` (Desayuno, Tentempié, Comida, Merienda, Postre, Cena, Salsa; las salsas no salen en el plan), `met` y `ext`.
  - Valores: `raciones`, y `completa` / `racion` como `{kcal, p, g, c}`.
  - Tiempo: `tiempoTxt` es la fuente de verdad. Al cargar se calculan `act` (elaboración), `esp` (espera) y `tot`. Escribe el texto como `"10 min + 12–15 min de airfryer + 2 h en la nevera"`: el primer tramo es trabajo; los tramos con nevera, congelador, horno, airfryer, cocción, enfriar o noche cuentan como espera (en un rango cuenta lo más largo). Si una cocción exige estar encima (remover), añade la receta a `TRABAJO`. El campo `min` ya no se usa para ordenar ni filtrar.
  - Contenido: `ingredientes`, `pasos`, `tabla`, `notaTabla`, `tips`, `conserva`.
  - `compra`: lista de `[ingrediente, cantidad para la receta entera, unidad]`; `null` significa «al gusto».
  - `usa`: los ids de `INGREDIENTES` que se enlazan a la guía de marcas.
  - `gluten`: natural, avena, pan, pasta, fideos o soja. `lacteos`: booleano.
- Marcas dentro de los textos:
  - `{300}` es una cantidad que se escala con «Cantidades para».
  - `[[id]]` enlaza a otra receta.
  - `[[t:5]]` pone un temporizador de 5 minutos.
  - Evita plurales que se rompan al escalar: escribe «Claras de huevo: {1}», no «{1} clara».
- **Variantes con proteína en polvo:** recetas con `pro: true` y `base: "<id de la receta normal>"`. Están ocultas salvo que el usuario active «Mostrar recetas con proteína en polvo» en Filtros (`state.verPro`, guardado en el navegador). No salen en «Con lo que tengo» ni en las opciones del plan si están ocultas, y la receta normal enlaza a su variante cuando están visibles. Las recetas normales no se tocan: cualquier versión con proteína va como receta aparte. Referencia de cálculo: HSN Evowhey 2.0 (362 kcal, 74 g de proteína y 3,8 g de grasa por 100 g); para chocolate blanco, Masmusculo (388 / 72,8 / 4,6).
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
- Bases de tarta sin mantequilla: avena + clara, bien apretada y horneada 5 min a 160 °C (la clara hace de pegamento). Cremas o yogur en la base solo dan sabor y la ablandan.
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
- `.gitignore` ignora todo salvo lo que se publica: `index.html`, `README.md`, `CLAUDE.md`, `.gitignore`, `manifest.webmanifest`, `sw.js` y los iconos. Si añades un archivo nuevo, añádelo también ahí.

### Comprobación lista para pegar

Abre `index.html` en un navegador (o en uno headless) y ejecuta en la consola:

```js
const out = [], ingOk = id => INGREDIENTES.some(i => i.id === id) || EXTRA_ING[id];
RECETAS.forEach(r => {
  (r.opciones ? Object.values(r.opciones) : [r]).forEach(({ completa: c, racion: q }) => {
    ["kcal", "p", "g", "c"].forEach(k => { if (Math.abs(q[k] * r.raciones - c[k]) > Math.max(2, c[k] * 0.04)) out.push(r.id + ": completa." + k); });
    const d = (c.kcal - (4 * c.p + 4 * c.c + 9 * c.g)) / c.kcal; if (d < -0.06 || d > 0.15) out.push(r.id + ": kcal vs macros");
  });
  r.compra.forEach(([i]) => { if (!ingOk(i)) out.push(r.id + ": compra " + i); });
  r.usa.forEach(i => { if (!INGREDIENTES.some(x => x.id === i)) out.push(r.id + ": usa " + i); });
  ["SABOR", "NUTRI", "NIVEL", "UTENSILIOS"].forEach(t => { if (!window.eval(t)[r.id]) out.push(r.id + ": falta en " + t); });
  if (r.met.includes("Airfryer") && !/Precalienta[\s\S]*posición/.test(r.pasos.join(" "))) out.push(r.id + ": airfryer sin precalentar o sin posición");
  r.cat.forEach(c => { if (!CATS.includes(c)) out.push(r.id + ": cat " + c); });
  r.met.forEach(m => { if (!METS.includes(m)) out.push(r.id + ": met " + m); });
  [...r.pasos, ...r.ingredientes.flatMap(g => g.items), ...r.tips].join(" ").replace(/\[\[([a-z-]+)\]\]/g, (x, id) => { if (!byId(id)) out.push(r.id + ": enlace roto " + id); });
});
SEMANA_TIPO.flat().forEach(v => { const id = v.split("|")[0]; if (id && !byId(id)) out.push("semana tipo: " + id); });
console.log(RECETAS.length + " recetas", out.length ? out : "todo OK");
```

## Decisiones tomadas (y por qué)

- **GitHub Pages + repositorio privado de datos, sin Firebase ni artifact de claude.ai.** El usuario quiere usarlo desde su cuenta personal y desde casa sin depender de Claude, y que se sincronice entre el móvil y el ordenador. Un artifact de claude.ai no puede llamar a servicios externos, y GitHub evita darse de alta en otro servicio. Antes hubo una versión en un artifact de la cuenta de trabajo, ya borrada.
- **El token nunca va en el código** (el repo es público). Lo pega el usuario en cada dispositivo y solo tiene Contents RW sobre `recetario-datos`.
- **Recetas muy bajas en grasa a propósito; la grasa buena del día va en la comida.** El usuario empezó pidiendo «la mínima grasa posible»; se le explicó que necesita unos 55 g o más al día. No volver a recetas «0 grasa» ni a planes por debajo de unas 2.000 kcal.
- **Valores nutricionales aproximados, calculados con productos reales verificados** y nunca con marcas inventadas. Lo que no se puede verificar se marca como «sin verificar» o se deja sin marca.
- **Sin micronutrientes ni contador de calorías de todo lo que come.** Se descartó por falsa precisión (los datos de Open Food Facts están incompletos) y porque ya existen apps para eso.

## Reglas de la sincronización (no romper)

Salieron de una revisión de código con dos fallos de pérdida de datos:
- `Saved.sucios` (las secciones con cambios sin subir) se guarda en localStorage (`rf-sucios`) y se recupera al abrir. Si no, al reabrir con conexión el `pull` pisaba lo local.
- Con cambios pendientes, `pull` **no** adopta el `sha` remoto ni aplica los datos. Así el `push` choca (409/422) y mezcla por secciones; si no, borraba lo de otro dispositivo.
- Al conectar, lo local se mezcla con lo remoto (`mezclar`). Si se conecta sin conexión, se marca `todo` y la mezcla se hace al volver.
- Las secciones son `recetas` (una clave por receta, `r-<id>`), `compra`, `plan`, `progreso` y `despensa`. Si añades una sección nueva, inclúyela en `datos()`, `aplicar()`, la mezcla de `push` y `mezclar()`.
- Hay una prueba de punta a punta que se hizo con el token de `gh` (`gh auth token -u hectorgarvi`) contra el repo privado, borrando después lo que crea. Repítela si tocas `Saved`.

## Estilo visual

- Estilo «fresco y frutal», elegido por el usuario. Cada receta tiene el color de su sabor (`SABOR`), las kcal van en grande y la ficha se abre como una hoja que sube desde abajo.
- Fuentes: Bricolage Grotesque (títulos y números) y Onest (texto).
- Colores como tokens en `:root`, con modo oscuro en `prefers-color-scheme` y en `[data-theme]` (botón ◐/☀/☾). El fondo va también en `html` para que la app instalada no deje franjas blancas.
- Gráficas: azul `#2a78d6` para la media semanal y naranja `#eb6834` para cada registro (paleta de referencia que pasa la comprobación de daltonismo). Nunca verde con rojo.
- Tarjetas del mosaico: kcal en grande, macros y, al final, una línea con raciones/opción y otra aparte con el tiempo (`tiempoCorto`: «15 min + 4 h de espera»).
- Pensada primero para el móvil (390 px). Revisa en modo oscuro y a esa anchura antes de publicar.

## Skills y herramientas usadas (para replicar el estilo)

Skills de Claude Code que se cargaron al construir la web; vuelve a cargarlas antes de tocar el diseño o las gráficas:
- **`frontend-design`** (plugin oficial `frontend-design` de Anthropic): dirección estética. De ahí salieron las propuestas de estilo, el «fresco y frutal» elegido, las fuentes y las tarjetas por color de sabor. Úsala antes de cualquier pantalla o rediseño nuevo.
- **`dataviz`** (skill integrada en Claude Code, sin plugin): gráficas de Progreso. La paleta azul/naranja se validó con su comprobador de color (contraste y daltonismo) en claro y oscuro.
- **`artifact-capabilities`**: se consultó al principio, cuando la web era un artifact de claude.ai. Ya no aplica (ver Decisiones).

Otras herramientas, sin skill:
- Open Food Facts (`search.openfoodfacts.org`, filtrando `en:spain`) para verificar marcas y valores.
- Chromium headless de Playwright para probar: `--dump-dom` con un script inyectado que corre la comprobación de arriba, y `--screenshot --window-size=390,844` para ver el móvil (también en modo oscuro).
- `gh` con la cuenta `hectorgarvi` para el repo privado y `perfil.md`.

## Sobre el usuario

Su perfil (datos, objetivos, gustos) está en `perfil.md` del repo privado. Léelo. Lo esencial para trabajar con él:
- Escribe en español de España.
- Está empezando a cocinar.
- Prefiere ver las cosas en la propia web, no en documentos.
- Agradece que se le digan las cosas claras, aunque contradigan lo que pidió, y que se compruebe todo antes de darlo por bueno.

## Ideas posibles para más adelante

Pendiente del usuario:
- Decidir si se protege la web con login de verdad (Cloudflare Pages + Access) o se deja así. Otras personas tienen el enlace; los datos personales ya están a salvo en el repo privado.
- Fotos de etiquetas de una tienda de suplementos de Torremolinos (junto al Carrefour) para añadir productos a la guía de marcas.
- Recetas con un solo tiempo («35 min») cuentan todo como elaboración; se podrían partir en trabajo + cocción (arroz con pollo, crema de calabacín, pescado con pisto, caldo).


Más recetas, sobre todo comidas y cenas de pescado azul. Rehacer la semana tipo con más variedad (bizcocho o brownie de postre, albóndigas o curry de comida) manteniendo las ~2.300 kcal.

