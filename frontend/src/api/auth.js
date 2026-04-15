import client from './client';

export async function login(email, password) {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
}

export async function changePassword(payload) {
  const { data } = await client.put('/auth/change-password', payload);
  return data;
}
