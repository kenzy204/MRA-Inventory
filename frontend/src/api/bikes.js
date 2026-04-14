import client from './client';

export async function getBikes() {
  const { data } = await client.get('/bikes');
  return data;
}

export async function getBike(id) {
  const { data } = await client.get(`/bikes/${id}`);
  return data;
}

export async function createBike(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'images') return;

    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      formData.append(key, value.join(','));
      return;
    }

    formData.append(key, value);
  });

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const { data } = await client.post('/bikes', formData);
  return data;
}

export async function updateBike(id, payload) {
  const { data } = await client.put(`/bikes/${id}`, payload);
  return data;
}

export async function deleteBike(id) {
  const { data } = await client.delete(`/bikes/${id}`);
  return data;
}

export async function syncBike(id) {
  const { data } = await client.post(`/sync/${id}`);
  return data;
}

export async function getSyncLogs() {
  const { data } = await client.get('/sync/logs/all');
  return data;
}

export async function uploadBikeImage(bikeId, file) {
  const formData = new FormData();
  formData.append('bikeId', bikeId);
  formData.append('image', file);

  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/bike-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
}
