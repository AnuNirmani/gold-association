const DEFAULT_API_BASE_URL = 'https://admin.slja.lk';

function getApiBase() {
  const base = (
    import.meta.env.VITE_LARAVEL_API_BASE_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/+$/, '');

  return base.endsWith('/api') ? base : `${base}/api`;
}

export async function fetchEmployees({ signal } = {}) {
  const api = getApiBase();

  const endpoint = new URL(`${api}/employees`);

  let next = endpoint.href;
  const visited = new Set();
  const employees = new Map();

  while (next) {
    if (visited.has(next)) {
      throw new Error('The members API returned a repeated pagination link.');
    }

    visited.add(next);

    const response = await fetch(next, {
      signal,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404) {
      throw new Error(
        'The backend needs a GET /api/employees endpoint to list all members.'
      );
    }

    if (!response.ok) {
      throw new Error(`Unable to load members (HTTP ${response.status}).`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error(
        'The members API did not return JSON. Check the backend API URL.'
      );
    }

    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : payload?.data;

    if (
      !Array.isArray(rows) ||
      rows.some(
        row => !row || row.id == null || typeof row.name !== 'string'
      )
    ) {
      throw new Error('The members API returned an invalid employee list.');
    }

    rows.forEach(employee => {
      employees.set(String(employee.id), employee);
    });

    const nextLink = payload?.next_page_url ?? payload?.links?.next;

    if (nextLink) {
      const nextUrl = new URL(nextLink, endpoint);

      if (
        nextUrl.origin !== endpoint.origin ||
        nextUrl.pathname !== endpoint.pathname
      ) {
        throw new Error('The members API returned an invalid pagination link.');
      }

      next = nextUrl.href;
    } else {
      next = null;
    }
  }

  return [...employees.values()];
}

export async function fetchEmployeeById(id, { signal } = {}) {
  if (!/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    throw new Error('Enter a valid positive employee ID.');
  }
  const response = await fetch(`${getApiBase()}/employees/${id}`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) throw new Error(`No employee found with ID ${id}.`);
  if (!response.ok) throw new Error(`Unable to load employee (HTTP ${response.status}).`);
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The employee API did not return JSON. Check the backend API URL.');
  }
  const payload = await response.json();
  const employee = payload?.data ?? payload;
  if (!employee || String(employee.id) !== String(Number(id)) || typeof employee.name !== 'string') {
    throw new Error('The API returned an invalid employee record.');
  }
  return employee;
}
