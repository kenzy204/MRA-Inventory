import client from './client';

export async function getSettings() {
  const { data } = await client.get('/settings');
  return data;
}

export async function updateSettings(payload) {
  const { data } = await client.put('/settings', payload);
  return data;
}