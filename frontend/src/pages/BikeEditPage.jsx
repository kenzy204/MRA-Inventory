// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import BikeForm from '../components/BikeForm';
// import { getBike, updateBike, uploadBikeImage } from '../api/bikes';

// export default function BikeEditPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [bike, setBike] = useState(null);

//   async function load() {
//     const data = await getBike(id);
//     setBike(data);
//   }

//   useEffect(() => {
//     load();
//   }, [id]);

//   async function handleSubmit(form) {
//     await updateBike(id, form);
//     navigate('/');
//   }

//   async function handleImageUpload(bikeId, file) {
//     await uploadBikeImage(bikeId, file);
//     await load();
//   }

//   if (!bike) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Edit Bike</h1>
//       <BikeForm
//         initialValues={bike}
//         bikeId={bike.id}
//         onSubmit={handleSubmit}
//         onImageUpload={handleImageUpload}
//       />

//       <div style={{ marginTop: 24 }}>
//         <h3>Images</h3>
//         <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//           {(bike.images || []).map((img) => (
//             <img
//               key={img.id}
//               src={`${import.meta.env.VITE_BACKEND_URL}${img.image_url}`}
//               alt=""
//               style={{ width: 140, height: 100, objectFit: 'cover', border: '1px solid #ccc' }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BikeForm from '../components/BikeForm';
import { getBike, updateBike, uploadBikeImage } from '../api/bikes';

export default function BikeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await getBike(id);
      setBike(data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bike');
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSubmit(form) {
    await updateBike(id, form);
    navigate('/');
  }

  async function handleImageUpload(bikeId, file) {
    await uploadBikeImage(bikeId, file);
    await load();
  }

  if (error) return <p className="error-text">{error}</p>;
  if (!bike) return <p>Loading...</p>;

  return (
    <BikeForm
      initialValues={bike}
      bikeId={bike.id}
      onSubmit={handleSubmit}
      onImageUpload={handleImageUpload}
    />
  );
}