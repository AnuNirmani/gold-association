import DOMPurify from 'dompurify';

const DEFAULT_API_BASE_URL = 'https://admin.slja.lk';

const base = (
  import.meta.env.VITE_LARAVEL_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

const api = base.endsWith('/api')
  ? base
  : `${base}/api`;

export const POST_CATEGORIES = { news: 53, events: 54 };
export const postLink = post => `/posts/category/${post.category_type_id}/post/${post.post_id}`;

export async function fetchPostsByCategory(categoryTypeId, { page = 1, signal } = {}) {
  const response = await fetch(`${api}/posts/category/${categoryTypeId}?page=${page}&limit=12`, {
    signal, headers: { Accept: 'application/json' }, cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Unable to load posts (HTTP ${response.status}).`);
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The posts API did not return JSON. Check the backend URL and routes.');
  }
  const payload = await response.json();
  const posts = payload?.data ?? payload;
  if (!Array.isArray(posts)) throw new Error('The posts API returned an invalid list.');
  return posts.map(post => {
    if (!/^\d+$/.test(String(post.post_id)) || typeof post.title !== 'string' ||
        String(post.category_type_id) !== String(categoryTypeId)) {
      throw new Error('The posts API returned an invalid post or category.');
    }
    const description = preparePostDescription(post.description);
    const document = new DOMParser().parseFromString(description, 'text/html');
    return { ...post, image: resolvePostImage(post.image), description, excerpt: document.body.textContent.trim() };
  });
}

export function resolvePostImage(value) {
  if (!value || typeof value !== 'string') return '';
  const origin = new URL(`${api}/`, window.location.origin).origin;
  if (/^(https?:)?\/\//i.test(value)) {
    return new URL(value, origin).href;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return '';
  const path = value.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^(?:public\/)?storage\//, '');
  return new URL(`/storage/${path}`, origin).href;
}

export function preparePostDescription(description) {
  const document = new DOMParser().parseFromString(DOMPurify.sanitize(String(description ?? '')), 'text/html');
  document.querySelectorAll('img[src]').forEach(image => {
    const src = image.getAttribute('src');
    // Description images can live outside Laravel's storage directory.
    const url = new URL(src, new URL(`${api}/`, window.location.origin).origin);
    if (['http:', 'https:'].includes(url.protocol)) image.setAttribute('src', url.href);
    else image.removeAttribute('src');
  });
  return DOMPurify.sanitize(document.body.innerHTML);
}

export async function fetchPostByCategoryAndId(categoryTypeId, postId, { signal } = {}) {
  for (const id of [categoryTypeId, postId]) {
    if (!/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
      throw new Error('Category and post IDs must be positive integers.');
    }
  }
  const response = await fetch(`${api}/posts/category/${categoryTypeId}/post/${postId}`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) throw new Error('Post not found in this category.');
  if (!response.ok) throw new Error(`Unable to load post (HTTP ${response.status}).`);
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The posts API did not return JSON. Check the backend API URL.');
  }
  const payload = await response.json();
  const post = payload?.data ?? payload;
  if (!post || String(post.post_id) !== String(Number(postId)) ||
      String(post.category_type_id) !== String(Number(categoryTypeId)) || typeof post.title !== 'string') {
    throw new Error('The posts API returned an invalid post.');
  }
  return {
    ...post,
    image: resolvePostImage(post.image),
    description: preparePostDescription(post.description),
  };
}
