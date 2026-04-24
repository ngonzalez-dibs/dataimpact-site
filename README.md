# Data Impact Business Solutions — Sitio Corporativo

Sitio web corporativo de Data Impact Business Solutions SpA. One-page más blog y brief institucional. HTML/CSS/JS estático.

## Estructura

```
.
├── index.html                          ← landing principal
├── brief-institucional.html            ← brief corporativo (imprimible a PDF)
├── blog/
│   ├── index.html                      ← listado de posts
│   ├── cuando-ia-si-y-cuando-no.html
│   ├── por-que-tu-dashboard-no-se-usa.html
│   └── de-excel-a-plataforma.html
├── assets/
│   ├── css/styles.css                  ← todos los estilos
│   ├── js/main.js                      ← JS del landing (rotador KPIs, modal casos, ROI, etc.)
│   ├── logo-solutions-dark.png         ← logo para fondo claro
│   └── logo-solutions-light.png        ← logo para fondo oscuro
├── sitemap.xml
└── robots.txt
```

## Desarrollo local

Cualquier servidor HTTP estático sirve. Lo más simple:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Publicación

Deploy pensado para **Netlify** con form de contacto nativo:

1. Push del repo a GitHub
2. Conectar el repo en netlify.com (sin build command, publish directory = raíz)
3. Configurar dominio custom `dataimpact.cl` en Netlify → Domain settings
4. En GoDaddy (DNS), agregar:
   - Registro `A` para `dataimpact.cl` → `75.2.60.5` (Netlify)
   - Registro `CNAME` para `www` → `<tu-sitio>.netlify.app`
5. Esperar propagación DNS (10-60 min)

Los registros `MX` del dominio (email) **no se tocan**.

## Tecnología

- HTML5 + CSS custom properties (temas claro/oscuro/sistema)
- JS vanilla (sin frameworks, sin build)
- Fuentes Google (Inter + JetBrains Mono)
- Schema.org JSON-LD: Organization, ProfessionalService, FAQPage, BlogPosting
- Dialog nativo para modal de casos, `<details>` para FAQ
- IntersectionObserver para reveal-on-scroll

## Atajos

- **Ctrl/Cmd + Shift + T** — abrir el panel de tweaks (cambiar tema, variante de H1 y color de acento)

## Licencia

© 2026 Data Impact Business Solutions SpA · RUT 78.000.816-4
