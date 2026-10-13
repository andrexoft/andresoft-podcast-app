# Podcast App

Aplicación web de podcasts desarrollada como prueba técnica frontend con **Next.js, React, TypeScript y CSS Modules**. Consume la API pública de Apple Podcasts para mostrar podcasts, consultar sus episodios y reproducirlos desde el navegador.

El proyecto prioriza la separación de responsabilidades, la reutilización de componentes, el tipado, la calidad del código y un flujo de trabajo con Git basado en ramas y Pull Requests.

## Funcionalidades

- Consultar el Top 100 de podcasts.
- Buscar podcasts por título o autor.
- Consultar el detalle de cada podcast y sus episodios.
- Acceder a la página de detalle de un episodio.
- Reproducir episodios mediante el reproductor de audio del navegador.
- Mantener datos en caché durante 24 horas.
- Mostrar estados de carga y gestionar errores de las peticiones.
- Navegar mediante rutas dinámicas.
- Adaptar la interfaz a diferentes tamaños de pantalla.

## Tecnologías

- **Next.js 16:** framework de React y sistema de rutas mediante App Router.
- **React 19:** construcción de interfaces mediante componentes.
- **TypeScript:** tipado estático y contratos entre las distintas capas.
- **CSS Modules:** estilos encapsulados por componente.
- **Jest y React Testing Library:** pruebas automatizadas.
- **ESLint y Prettier:** análisis estático y formato.
- **Git y GitHub:** control de versiones, ramas, Pull Requests y etiquetas.
- **Docker:** configuración preparada para una imagen de producción mediante un Dockerfile multi-stage.

No se utiliza una librería externa de componentes visuales.

## ¿Por qué Next.js?

Se eligió Next.js porque proporciona una estructura de aplicación basada en React, routing integrado y un proceso de compilación optimizado para producción.

En este proyecto aporta ventajas concretas:

- **App Router:** permite organizar las páginas y las rutas dinámicas mediante la estructura de archivos.
- **Integración con React y TypeScript:** facilita desarrollar componentes tipados y mantener una estructura consistente.
- **Optimización de imágenes:** permite utilizar `next/image` y configurar los dominios remotos permitidos.
- **Compilación de producción:** ofrece un proceso integrado para generar una versión optimizada de la aplicación.
- **Evolución de la arquitectura:** permite incorporar otras estrategias de renderizado si los requisitos futuros lo justifican.

Las páginas que obtienen datos mediante los hooks actuales utilizan componentes cliente. La elección de Next.js no implica que todas las páginas estén utilizando renderizado en servidor: la estrategia se elige según las necesidades de cada funcionalidad.

## Arquitectura

El código se organiza por responsabilidades:

```text
src/
├── app/
│   ├── page.tsx
│   └── podcast/
│       └── [id]/
│           ├── page.tsx
│           └── episode/
│               └── [episodeId]/
│                   └── page.tsx
├── components/
│   ├── Header/
│   ├── Loading/
│   ├── PodcastCard/
│   ├── PodcastDetail/
│   ├── PodcastEpisodeDetail/
│   ├── PodcastGrid/
│   ├── PodcastSidebar/
│   └── SearchBar/
├── hooks/
│   ├── usePodcasts.ts
│   └── usePodcastDetail.tsx
├── lib/
│   └── cache.ts
├── services/
│   ├── podcastService.ts
│   └── podcastDetailService.ts
└── types/
    ├── episode.ts
    ├── podcast.ts
    └── podcastDetail.ts
```

### Components

Los componentes se encargan de representar la interfaz y gestionar las interacciones correspondientes. Se reutilizan elementos como `PodcastCard`, `PodcastGrid`, `SearchBar`, `Loading` y `PodcastSidebar` para evitar duplicaciones.

### Hooks

`usePodcasts` gestiona la carga del listado, la caché y los estados de carga y error.

`usePodcastDetail` obtiene los datos de un podcast y los reutiliza en las páginas de detalle del podcast y del episodio.

### Services

Los servicios encapsulan las peticiones a Apple Podcasts y la transformación de las respuestas externas al modelo interno.

### Types

Los modelos `Podcast`, `Episode` y `PodcastDetail` centralizan los contratos de datos utilizados por las distintas capas.

### Lib

La carpeta `lib` contiene utilidades compartidas, como la implementación de la caché.

## Gestión del estado y caché

Se utiliza el estado local de React y custom hooks para gestionar las necesidades actuales de la aplicación.

La búsqueda pertenece a la página principal y se gestiona mediante `useState` y `useMemo`. Los datos de los podcasts se gestionan mediante hooks, servicios y una caché en `localStorage`.

La caché tiene una duración de 24 horas. Si los datos no existen o han expirado, se solicita nueva información al servicio correspondiente.

No se ha incorporado Context API ni una librería de estado global porque actualmente no existe una necesidad de estado compartido suficientemente compleja que justifique esa capa adicional. Esta decisión evita añadir dependencias y complejidad innecesarias. Si los requisitos evolucionan, se podrá reevaluar.

## API de Apple Podcasts

La aplicación utiliza los endpoints públicos de Apple para consultar el listado y los detalles.

**Listado de podcasts:**

```text
https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json
```

**Detalle y episodios:**

```text
https://itunes.apple.com/lookup?id={id}&media=podcast&entity=podcastEpisode&limit=20
```

Las peticiones están centralizadas en los servicios. De este modo, los componentes no necesitan depender directamente de la estructura de las respuestas de Apple.

## Testing y calidad

Las pruebas se desarrollan con Jest y React Testing Library, priorizando el comportamiento observable de la aplicación.

La última ejecución verificada de la batería de pruebas obtuvo:

- **10 suites superadas.**
- **60 tests superados.**
- **ESLint sin errores.**
- **Build de producción completada correctamente.**

Las pruebas cubren componentes, hooks, servicios y la lógica de caché.

Comandos disponibles:

```bash
npm test -- --runInBand
npm run test:watch
npm run test:coverage
npm run lint
npm run format:check
npm run build
```

`npm run format:check` puede señalar archivos preexistentes que necesitan formatearse. El formato global debe mantenerse como una tarea independiente para evitar mezclar cambios ajenos a otras mejoras.

## Docker

El repositorio incluye:

- `Dockerfile` multi-stage para preparar una imagen de producción.
- `.dockerignore` para excluir archivos innecesarios del contexto de compilación.
- `output: "standalone"` en la configuración de Next.js.

La compilación local de Next.js ha generado correctamente `.next/standalone/server.js`. Sin embargo, la imagen Docker no se ha construido ni ejecutado en el entorno de desarrollo, por lo que esa validación queda pendiente en un entorno con Docker disponible.

Una vez instalado Docker, la imagen se puede construir desde la raíz del proyecto:

```bash
docker build -t andresoft-podcast-app .
```

Para ejecutarla:

```bash
docker run --rm -p 3000:3000 andresoft-podcast-app
```

La aplicación quedaría disponible en `http://localhost:3000`.

## Git y flujo de trabajo

Las mejoras se organizan en ramas independientes y se integran mediante Pull Requests hacia `main`.

Se utilizan mensajes de commit descriptivos, siguiendo una convención similar a Conventional Commits:

- `feat`: nueva funcionalidad.
- `fix`: corrección.
- `refactor`: reorganización interna.
- `test`: pruebas.
- `docs`: documentación.
- `build`: configuración de construcción y herramientas.

Las etiquetas anotadas permiten identificar hitos concretos de la evolución del proyecto.

## Requisitos

- Node.js compatible con Next.js 16.
- npm.

Docker solo es necesario si se desea construir o ejecutar la imagen del contenedor.

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/andrexoft/andresoft-podcast-app.git
cd andresoft-podcast-app
```

Instalar dependencias:

```bash
npm ci
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Producción

Crear la compilación:

```bash
npm run build
```

Iniciar el servidor de producción:

```bash
npm start
```

La configuración `standalone` también permite preparar la aplicación para su ejecución en un contenedor.

## Rutas

| Ruta                                | Descripción                    |
| ----------------------------------- | ------------------------------ |
| `/`                                 | Listado y búsqueda de podcasts |
| `/podcast/[id]`                     | Detalle de un podcast          |
| `/podcast/[id]/episode/[episodeId]` | Detalle de un episodio         |

## Decisiones de diseño

El proyecto busca aplicar la solución más sencilla que responda a las necesidades actuales, manteniendo la posibilidad de evolucionar.

Entre sus principales decisiones se encuentran:

- Separar la interfaz de los servicios de datos.
- Reutilizar componentes cuando existe una responsabilidad compartida.
- Centralizar los modelos mediante TypeScript.
- Evitar una solución global de estado si no aporta valor.
- Mantener una caché sencilla para reducir peticiones repetidas.
- Validar los cambios mediante tests, lint y compilación.
- Trabajar con ramas y Pull Requests para facilitar la revisión del código.
