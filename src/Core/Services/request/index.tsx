/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-useless-catch */
const baseApiURL = import.meta.env.VITE_API_BASE_URL;

const timeZoneOffset = new Date().getTimezoneOffset().toString();

async function GET<T = unknown>(url: string): Promise<T> {
  try {
    const response = await fetch(baseApiURL + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const json = await response.json();
    if (response.status <= 299) return json as T;
    throw new Error('Failed to fetch');
  } catch (error) {
    throw error;
  }
}

type RequestBody = object | string | number;

async function POST<T = unknown, P = RequestBody>(
  url: string,
  body: P,
): Promise<T> {
  try {
    const response = await fetch(baseApiURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Timezone-Offset': timeZoneOffset,
        Accept: '*/*',
      },
      body: JSON.stringify(body),
    });
    const json: T = await response.json();
    if (response.status <= 299) return json;
    throw new Error('Failed to post');
  } catch (error) {
    throw error;
  }
}

async function PUT<T = unknown, P = object | string | number>(
  url: string,
  body: P,
): Promise<T> {
  try {
    const response = await fetch(baseApiURL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (response.status <= 299) return json as T;
    throw new Error('Failed to put');
  } catch (error) {
    throw error;
  }
}

async function DELETE<T = unknown>(url: string): Promise<T> {
  try {
    const response = await fetch(baseApiURL + url, {
      method: 'DELETE',
      headers: {
      },
    });
    const json = await response.json();
    if (response.status <= 299) return json as T;
    throw new Error('Failed to delete');
  } catch (error) {
    throw error;
  }
}

export { GET, POST, PUT, DELETE };
