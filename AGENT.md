# AGENT.md — Zarpa Creativa Web

Guía de referencia para el agente de IA que trabaje en este proyecto. Leer antes de generar cualquier código.

---

## Proyecto

**Zarpa Creativa** es la web corporativa de una agencia de marketing digital. Su objetivo es presentar servicios, casos de éxito, equipo y captar leads de clientes potenciales.

### Paleta de color corporativa

| Token | Valor | Uso |
|---|---|---|
| `brand-blue` | `#8AB3DC` | Acento corporativo azul (degradados, highlights) |
| `brand-yellow` | `#E6CF84` | Acento corporativo amarillo (degradados, highlights) |
| `base-bg` | `#FAF6EF` | Fondo base global |
| `base-ink` | `#191919` | Color de texto principal |

En CSS/Tailwind están disponibles como `var(--color-brand-blue)`, `var(--color-brand-yellow)`, etc., definidos en `src/styles/global.css`.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework principal | [Astro](https://astro.build) (última versión estable) |
| Componentes interactivos | [Vue 3](https://vuejs.org) — **solo cuando sea necesaria alta interactividad** |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) |
| Lenguaje | TypeScript (preferido) / JavaScript |
| Gestor de paquetes | pnpm |

---

## Reglas de componentes

### Prioridad de tecnología

1. **Astro nativo** — Por defecto, todos los componentes y páginas se escriben en `.astro`. Sin JS en cliente si no es necesario.
2. **JS/TS vanilla** — Para lógica ligera que sí necesite ejecutarse en cliente (pequeñas animaciones, toggles simples), usar `<script>` inline en el propio `.astro`.
3. **Vue 3** — Solo si el componente requiere estado reactivo complejo, interacciones frecuentes con el DOM, o lógica de UI no trivial (ej: formularios con validación en tiempo real, sliders, modales con lógica compleja, tabs dinámicos). Usar `client:load` o `client:visible` según el caso.

> **Regla de oro:** Si tienes dudas entre JS vanilla y Vue, usa JS vanilla.

### Directivas de hidratación en Vue

- `client:visible` → componentes fuera del viewport inicial (sliders, secciones de testimonios, etc.)
- `client:load` → componentes críticos que deben ser interactivos nada más cargar (formulario hero, menú móvil si tiene estado complejo)
- `client:idle` → componentes no críticos que pueden esperar

---

## Arquitectura de archivos

```
src/
├── assets/              # Imágenes, fuentes, SVGs estáticos
├── components/
│   ├── ui/              # Componentes genéricos reutilizables (Button, Badge, Card...)
│   ├── sections/        # Secciones de página (Hero, Services, Testimonials...)
│   └── layout/          # Header, Footer, Nav, etc.
├── layouts/
│   └── Layout.astro     # Layout base (head, meta, fonts)
├── pages/               # Una página = un archivo. Deben estar limpias de lógica
└── data/                # Datos estáticos en TS (servicios, equipo, testimonios...)
    └── *.ts
```

---

## Reglas de páginas

- Las páginas (`src/pages/`) deben ser **lo más delgadas posible**: solo componen secciones.
- Toda la lógica de presentación va en componentes dentro de `src/components/sections/`.
- Los datos fijos (copy, listados, configuración) van en `src/data/` como arrays/objetos TypeScript exportados.

**Ejemplo de página bien estructurada:**
```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/sections/Hero.astro';
import Services from '@/components/sections/Services.astro';
import CaseStudies from '@/components/sections/CaseStudies.astro';
import ContactForm from '@/components/sections/ContactForm.vue'; // Vue: formulario reactivo
---

<Layout title="Zarpa Creativa - Agencia de Marketing Digital">
  <Hero />
  <Services />
  <CaseStudies />
  <ContactForm client:visible />
</Layout>
```

---

## Estilos con Tailwind 4

- Usar clases de utilidad de Tailwind directamente en los templates.
- No crear CSS custom salvo que sea estrictamente necesario (animaciones complejas, variables de diseño globales).
- Las variables de diseño (colores de marca, tipografía) se definen en el `@theme` de Tailwind 4 en el CSS global.
- Evitar `style` inline.

---

## Animaciones con `tailwind-animations`

El proyecto tiene instalada la librería [`tailwind-animations`](https://tailwind-animations.com/) (ya importada en `global.css`). **Usarla siempre que se necesite una animación**, antes de escribir keyframes CSS propios.

### Instalación (ya hecha)

Para Tailwind v4, basta con el `@import` en el CSS global:
```css
@import 'tailwind-animations';
```

### Clases de animación disponibles

Prefijo `animate-` seguido del nombre del efecto:

| Clase | Efecto |
|---|---|
| `animate-fade-in` | Aparición con opacidad |
| `animate-blurred-fade-in` | Aparición con desenfoque |
| `animate-zoom-in` | Entrada con zoom |
| `animate-slide-in-top` | Entrada desde arriba |
| `animate-slide-in-left` | Entrada desde la izquierda |
| `animate-bouncing` | Rebote continuo |
| `animate-pulsing` | Pulso continuo |
| `animate-shake` | Vibración |
| `animate-flip-horizontal` | Volteo horizontal |
| `animate-rotate-360` | Rotación completa |
| `animate-fade-in-up` | Subida con fade |

Controlar duración, retardo y pasos con las utilidades estándar de Tailwind (`duration-*`, `delay-*`).

### Animaciones al hacer scroll (viewport)

Usar `timeline-view` para activar la animación cuando el elemento entra en pantalla:

```html
<!-- Elemento que aparece al hacer scroll -->
<div class="timeline-view animate-fade-in-up animate-range-moderate">
  Contenido
</div>
```

**Rangos predefinidos** (cuándo empieza/termina la animación respecto a la visibilidad):

| Clase | Rango |
|---|---|
| `animate-range-gradual` | 10% – 90% |
| `animate-range-moderate` | 20% – 80% |
| `animate-range-brisk` | 30% – 70% |
| `animate-range-rapid` | 40% – 60% |
| `animate-range-entry` | Solo al entrar |
| `animate-range-exit` | Solo al salir |

Rango personalizado con valor arbitrario: `animate-range-[entry_5%_contain_20%]`

### Reglas de uso

- **Preferir `timeline-view` + `animate-range-moderate`** como punto de partida para reveal de secciones.
- Para hero y elementos críticos sobre el fold, usar la clase de animación directamente (sin `timeline-view`).
- No crear `@keyframes` propios si existe una clase equivalente en la librería.
- Combinar con `delay-*` para efectos escalonados (`delay-100`, `delay-200`, etc.).

---

## Convenciones de nombre

- Componentes: `PascalCase.astro` / `PascalCase.vue`
- Archivos de datos: `camelCase.ts` (ej: `services.ts`, `teamMembers.ts`)
- Páginas: `kebab-case.astro` (ej: `casos-de-exito.astro`)
- Variables y funciones: `camelCase`

---

## Accesibilidad

- Usar HTML semántico siempre (`<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`).
- Las imágenes deben tener `alt` descriptivo o `alt=""` si son decorativas.
- Los botones e iconos interactivos deben tener `aria-label` cuando no tengan texto visible.
- Contraste mínimo AA en todos los textos.

---

## Rendimiento

- Preferir el componente `<Image />` de Astro sobre `<img>` para todas las imágenes.
- Los iconos SVG simples se pueden inline directamente en `.astro`.
- Lazy-load de componentes Vue con `client:visible` por defecto.

---

## Lo que NO hacer

- No crear lógica de negocio dentro de páginas.
- No usar Vue para componentes puramente estáticos.
- No crear hojas de estilo CSS separadas por componente (usar Tailwind).
- No mezclar múltiples responsabilidades en un mismo componente.
- No usar `any` en TypeScript.
