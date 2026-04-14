function buildBikeTitle(bike) {
  if (bike.title && bike.title.trim()) return bike.title.trim();
  return `${bike.brand || ''} ${bike.model || ''}`.trim();
}

function buildBikeDescriptionHtml(bike) {
  return `
    <p>${bike.description || ''}</p>
    <h3>Specifications</h3>
    <ul>
      <li><strong>Brand:</strong> ${bike.brand || ''}</li>
      <li><strong>Model:</strong> ${bike.model || ''}</li>
      <li><strong>Condition:</strong> ${bike.condition || ''}</li>
      <li><strong>Mileage:</strong> ${bike.mileage || ''}</li>
      <li><strong>Motor Type:</strong> ${bike.motor_type || ''}</li>
      <li><strong>Battery Capacity:</strong> ${bike.battery_capacity || ''}</li>
      <li><strong>Range:</strong> ${bike.range_km || ''}</li>
      <li><strong>Frame Type:</strong> ${bike.frame_type || ''}</li>
      <li><strong>Frame Size:</strong> ${bike.frame_size || ''}</li>
      <li><strong>Brakes:</strong> ${bike.brakes || ''}</li>
      <li><strong>Suspension:</strong> ${bike.suspension || ''}</li>
      <li><strong>Tires:</strong> ${bike.tires || ''}</li>
      <li><strong>Display:</strong> ${bike.display || ''}</li>
      <li><strong>Drivetrain:</strong> ${bike.drivetrain || ''}</li>
    </ul>
  `;
}

module.exports = {
  buildBikeTitle,
  buildBikeDescriptionHtml
};