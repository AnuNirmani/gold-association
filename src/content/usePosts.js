import { useEffect, useState } from 'react';
import { fetchPostsByCategory } from './postsApi';

export default function usePosts(categoryTypeId, page = 1) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const key = `${categoryTypeId}/${page}/${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('timeout'), 15000);
    fetchPostsByCategory(categoryTypeId, { page, signal: controller.signal })
      .then(posts => {
        if (!controller.signal.aborted) setResult({ key, posts });
      })
      .catch(error => {
        if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
        setResult({ key, posts: [], error: controller.signal.reason === 'timeout'
          ? 'Request timed out. Please try again.'
          : error instanceof TypeError ? 'Unable to connect to the posts API.' : error.message });
      })
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [categoryTypeId, page, attempt, key]);
  const current = result?.key === key ? result : null;
  return { posts: current?.posts ?? [], error: current?.error, loading: !current,
    retry: () => setAttempt(value => value + 1) };
}
