import client from './client';

export async function getPhotoStickers() {
  const { data } = await client.get('/photo-stickers');
  return data;
}

export async function createPhotoSticker(payload) {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('category', payload.category);
  formData.append('size', payload.size);
  formData.append('photo_count', payload.photo_count || 0);
  formData.append('image', payload.image);

  const { data } = await client.post('/photo-stickers', formData);
  return data;
}

export async function togglePhotoSticker(id) {
  const { data } = await client.put(`/photo-stickers/${id}/toggle`);
  return data;
}

export async function deletePhotoSticker(id) {
  const { data } = await client.delete(`/photo-stickers/${id}`);
  return data;
}
