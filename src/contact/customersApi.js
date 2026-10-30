export async function createCustomer(customer) {
  const base = (import.meta.env.VITE_LARAVEL_API_BASE_URL || 'https://admin.slja.lk').replace(/\/+$/, '');
  const api = base.endsWith('/api') ? base : `${base}/api`;
  let response;
  try {
    response = await fetch(`${api}/customers`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
  } catch {
    throw new Error('Unable to reach the enquiry service. Please check your connection and try again.');
  }
  const payload = response.headers.get('content-type')?.includes('application/json')
    ? await response.json().catch(() => null)
    : null;
  if (!response.ok) {
    if (response.status === 422 && payload?.errors) {
      const messages = Object.values(payload.errors).flat().filter(message => typeof message === 'string');
      if (messages.length) throw new Error(messages.join(' '));
    }
    throw new Error('Your enquiry could not be saved. Please try again later.');
  }
  if (response.status !== 201 || payload?.data?.id == null) {
    throw new Error('The server did not confirm that your enquiry was saved. Please contact us directly.');
  }
  return payload.data;
}
