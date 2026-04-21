import client from './client';

//
// PROFILE
//

export async function getProfile() {
  const { data } = await client.get('/mra-center/profile');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await client.put('/mra-center/profile', payload);
  return data;
}

//
// LOCATIONS
//

export async function getLocations() {
  const { data } = await client.get('/mra-center/locations');
  return data;
}

export async function createLocation(payload) {
  const { data } = await client.post('/mra-center/locations', payload);
  return data;
}

export async function updateLocation(id, payload) {
  const { data } = await client.put(`/mra-center/locations/${id}`, payload);
  return data;
}

export async function deleteLocation(id) {
  const { data } = await client.delete(`/mra-center/locations/${id}`);
  return data;
}

//
// OPENING HOURS
//

export async function getOpeningHours(locationId) {
  const { data } = await client.get(
    `/mra-center/opening-hours/${locationId}`
  );
  return data;
}

export async function updateOpeningHours(locationId, rows) {
  const { data } = await client.put(
    `/mra-center/opening-hours/${locationId}`,
    { rows }
  );
  return data;
}
