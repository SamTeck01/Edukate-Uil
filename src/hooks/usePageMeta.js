import { useEffect } from 'react';

/**
 * usePageMeta — Dynamically updates <title> and <meta name="description">
 * on each route change for better SEO and browser-tab UX.
 *
 * @param {{ title: string, description?: string }} options
 */
export default function usePageMeta({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      } else {
        meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }

    // Cleanup: restore defaults when unmounting (optional)
    return () => {
      document.title = 'Edukate UIL — Faculty of Physical Sciences Learning Platform';
    };
  }, [title, description]);
}
