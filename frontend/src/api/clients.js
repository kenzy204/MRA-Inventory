import client from './client';

export async function getClients(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const { data } = await client.get(`/clients${query}`);
  return data;
}

export async function getClient(id) {
  const { data } = await client.get(`/clients/${id}`);
  return data;
}

export async function createClient(payload) {
  const { data } = await client.post('/clients', payload);
  return data;
}

export async function deleteClient(id) {
  const { data } = await client.delete(`/clients/${id}`);
  return data;
}
