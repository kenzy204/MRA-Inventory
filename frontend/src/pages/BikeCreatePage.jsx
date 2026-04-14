// import { useNavigate } from 'react-router-dom';
// import BikeForm from '../components/BikeForm';
// import { createBike } from '../api/bikes';

// export default function BikeCreatePage() {
//   const navigate = useNavigate();

//   async function handleSubmit(form) {
//     const bike = await createBike(form);
//     navigate(`/bikes/${bike.id}/edit`);
//   }

//   return (
//     <div>
//       <h1>Create Bike</h1>
//       <BikeForm onSubmit={handleSubmit} />
//     </div>
//   );
// }

import { useNavigate } from 'react-router-dom';
import BikeForm from '../components/BikeForm';
import { createBike } from '../api/bikes';

export default function BikeCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(form) {
    const result = await createBike(form);
    navigate(`/bikes/${result.bike.id}/edit`);
  }

  return <BikeForm onSubmit={handleSubmit} />;
}