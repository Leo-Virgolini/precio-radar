import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'guia-amazon', renderMode: RenderMode.Prerender },
  { path: 'sobre-nosotros', renderMode: RenderMode.Prerender },
  { path: 'privacidad', renderMode: RenderMode.Prerender },
  { path: 'favoritos', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server }
];
