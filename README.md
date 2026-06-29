# EkklesiaMx — Sitio web

Sitio rediseñado de "Crónicas de un Caminante" → **EkklesiaMx**.
Multi-página real: cada sección vive en su propio archivo `.html`, enlazado
entre sí, con un sistema de diseño compartido (`assets/styles.css` y
`assets/app.js`).

## 1. Estructura del proyecto

```
ekklesiamx/
├── index.html         → Inicio (Hero + Índice + nota personal breve)
├── identidad.html      → ¿Quién eres en Cristo? (8 verdades + rescate)
├── musica.html         → Spotify principal + grid de canciones + YouTube
├── palabra.html         → La Biblia (ediciones, lectura online, app)
├── comunidad.html      → WhatsApp + Oración de entrega + CTA final
├── assets/
│   ├── styles.css       → Paleta, tipografía, cursor, nav, botones (compartido)
│   └── app.js            → Cursor, menú, pestaña-índice, audio, scroll-reveal (compartido)
├── audio/
│   ├── inicio-tema.mp3       ← pista de Inicio (la pide el modal de bienvenida)
│   ├── identidad-tema.mp3    ← pista de Identidad
│   ├── musica-tema.mp3       ← pista de Música
│   ├── palabra-tema.mp3      ← pista de Palabra
│   └── comunidad-tema.mp3    ← pista de Comunidad
├── brandbook/
│   └── EkklesiaMx-Brandbook.pdf  → Manual de identidad visual (10 páginas)
└── README.md           → este archivo
```

Cada página `.html` solo contiene SU contenido específico (su `<style>`
particular va dentro de la misma página, y lo compartido —colores, tipografía,
cursor, nav, botones— vive en `assets/styles.css` y `assets/app.js`).
Esto significa que si más adelante cambias un color en `styles.css`,
cambia en las 5 páginas a la vez.

## 2. Cómo se navega

La barra superior y el menú (ícono ☰ en móvil) llevan a las 5 páginas.
Al subir esto a cualquier hosting de archivos estáticos (GitHub Pages,
Netlify, Vercel, hosting compartido, etc.) las rutas quedan así, de forma
automática, sin configuración adicional:

```
tudominio.com/                 → Inicio
tudominio.com/identidad.html    → Identidad
tudominio.com/musica.html       → Música
tudominio.com/palabra.html      → Palabra
tudominio.com/comunidad.html    → Comunidad
```

Si más adelante quieres que se vea sin el `.html` (ej. `/identidad` en vez
de `/identidad.html`), es un paso adicional de configuración del hosting —
te lo explico en la sección 4.

## 3. Cómo subir esto a GitHub (paso a paso)

### Opción rápida: desde la web de GitHub (sin usar la terminal)

1. Entra a [github.com](https://github.com) e inicia sesión (o crea una cuenta gratuita).
2. Arriba a la derecha, clic en el **+** → **New repository**.
3. Nombra el repositorio, por ejemplo `ekklesiamx`. Puede ser público o privado
   (para GitHub Pages gratis necesita ser público, o tener GitHub Pro si es privado).
4. Clic en **Create repository**.
5. En la página del repo vacío, clic en **uploading an existing file**.
6. Arrastra TODA la carpeta `ekklesiamx` (todos los archivos y subcarpetas:
   `index.html`, `identidad.html`, `assets/`, `audio/`, etc.) a la zona de carga.
7. Escribe un mensaje de commit, por ejemplo "Primera versión de EkklesiaMx".
8. Clic en **Commit changes**.

### Opción con terminal (Git instalado en tu computadora)

```bash
# 1. Entra a la carpeta del proyecto
cd ekklesiamx

# 2. Inicializa el repositorio local
git init

# 3. Agrega todos los archivos
git add .

# 4. Crea el primer commit
git commit -m "Primera versión de EkklesiaMx"

# 5. Conecta con el repositorio remoto que creaste en GitHub
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ekklesiamx.git

# 6. Sube los archivos
git push -u origin main
```

## 4. Publicar el sitio gratis con GitHub Pages

1. Dentro del repositorio en GitHub, ve a **Settings** (pestaña superior).
2. En el menú izquierdo, clic en **Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`.
4. Clic en **Save**.
5. Espera 1–2 minutos. GitHub te dará una URL como:
   `https://tu-usuario.github.io/ekklesiamx/`
6. Esa URL ya es tu sitio en vivo, con todas sus páginas funcionando
   (`/ekklesiamx/identidad.html`, etc.).

### Si quieres tu propio dominio (ej. ekklesiamx.com)

1. Compra el dominio en cualquier proveedor (Namecheap, GoDaddy, etc.).
2. En **Settings → Pages**, en el campo **Custom domain**, escribe tu dominio.
3. En el panel de DNS de tu proveedor de dominio, agrega los registros que
   GitHub te indique (normalmente un registro `A` o `CNAME`).
4. Espera la propagación (puede tardar desde minutos hasta 24 horas).

### Si quieres ocultar el ".html" de las URLs (opcional)

GitHub Pages no permite reescritura de rutas tan flexible como otros
hostings. Las dos formas más simples:

- **Convertir cada página en una carpeta con `index.html` dentro**, por ejemplo
  mover `identidad.html` a `identidad/index.html`. Así la URL queda
  `tudominio.com/identidad/` sin extensión. (Te puedo preparar esta
  estructura si la prefieres — solo dime y la genero.)
- **Usar Netlify en vez de GitHub Pages** para alojar el sitio: Netlify sí
  permite ocultar el `.html` automáticamente sin reestructurar carpetas,
  y también conecta directo con tu repositorio de GitHub (login con GitHub →
  "Import from Git" → selecciona el repo → Deploy).

## 5. Cómo actualizar el sitio después de la primera subida

Cada vez que quieras cambiar algo (texto, color, una imagen):

**Desde la web:** entra al archivo en GitHub, clic en el lápiz (editar),
haz tu cambio, y clic en **Commit changes**. El sitio se actualiza solo
en 1–2 minutos.

**Desde terminal:**
```bash
git add .
git commit -m "Describe aquí qué cambiaste"
git push
```

## 6. Funcionalidades de esta versión

- **Música por sección**: cada página tiene su propia atmósfera musical (ver carpeta `audio/`). Un botón flotante en la esquina inferior derecha permite silenciar o reactivar el audio de la página actual; la preferencia de silencio se recuerda en el navegador del visitante incluso al cambiar de página.
- **Pestaña-índice**: una línea discreta en el borde superior central de cada página. Al acercar el cursor (o tocarla en pantallas táctiles) se despliega un panel con las 5 secciones, iluminándose con el acento naranja mientras permanece abierto.
- **"Ver más"**: en Inicio, cada fila del índice y la nota personal incluyen un enlace "Ver más" que conecta directamente con la página profunda correspondiente.
- **Ondas de fuego**: una capa ambiental animada (`.fire-waves` en `styles.css`) agrega manchas de luz cálida/fría que respiran lentamente detrás de los héroes y algunas secciones, en línea con la dirección visual de "fuego que consume en amor".
- **Carátulas de Spotify reales**: la página de Música usa reproductores embed oficiales de Spotify (iframes), no llamadas `fetch` al endpoint oembed — esto garantiza que la portada, título y artista siempre se vean correctamente, sin depender de políticas de CORS del navegador.
- **Brand Book**: `brandbook/EkklesiaMx-Brandbook.pdf` — manual de identidad visual de 10 páginas con misión, visión, valores, paleta de color, tipografía, reglas de logotipo, voz de marca y ejemplos de aplicación.

## 7. Notas técnicas

- El cursor de punto (`#dot-cursor` en `assets/app.js`) se desactiva
  automáticamente en pantallas táctiles (móvil/tablet), donde no aplica.
- Los embeds de Spotify usan el endpoint público `oembed` de Spotify —
  no requieren API key, pero si Spotify cambia ese endpoint en el futuro,
  las portadas mostrarán un estado de respaldo ("Abrir en Spotify").
- El audio de fondo (`audio/holy-instrumental.mp3`) solo se reproduce
  después de que el visitante interactúa con el modal de bienvenida en
  Inicio — los navegadores bloquean el autoplay de audio sin interacción
  del usuario, así que este diseño respeta esa regla.
