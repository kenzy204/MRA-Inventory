// import { useState } from 'react';

// const defaultState = {
//   brand: '',
//   model: '',
//   title: '',
//   description: '',
//   price: 0,
//   stock: 0,
//   condition: 'used',
//   mileage: '',
//   motor_type: '',
//   battery_capacity: '',
//   range_km: '',
//   frame_type: '',
//   frame_size: '',
//   brakes: '',
//   suspension: '',
//   tires: '',
//   display: '',
//   drivetrain: '',
//   tags: '',
//   sku: ''
// };

// export default function BikeForm({ initialValues = defaultState, onSubmit, onImageUpload, bikeId }) {
//   const [form, setForm] = useState({ ...defaultState, ...initialValues });
//   const [imageFile, setImageFile] = useState(null);

//   function handleChange(e) {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     await onSubmit(form);
//   }

//   async function handleUpload() {
//     if (!bikeId || !imageFile || !onImageUpload) return;
//     await onImageUpload(bikeId, imageFile);
//     alert('Image uploaded');
//   }

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {Object.keys(defaultState).map((key) => (
//           <div key={key} style={{ marginBottom: 12 }}>
//             <label style={{ display: 'block', marginBottom: 4 }}>{key}</label>
//             {key === 'description' ? (
//               <textarea
//                 name={key}
//                 value={form[key] ?? ''}
//                 onChange={handleChange}
//                 style={{ width: '100%', minHeight: 80 }}
//               />
//             ) : (
//               <input
//                 name={key}
//                 value={form[key] ?? ''}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8 }}
//               />
//             )}
//           </div>
//         ))}

//         <button type="submit">Save Bike</button>
//       </form>

//       {bikeId && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Upload Image</h3>
//           <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
//           <button type="button" onClick={handleUpload} style={{ marginLeft: 8 }}>
//             Upload
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';

const defaultState = {
  brand: '',
  model: '',
  title: '',
  description: '',
  price: '',
  stock: '',
  condition: 'used',
  mileage: '',
  motor_type: '',
  battery_capacity: '',
  range_km: '',
  frame_type: '',
  frame_size: '',
  brakes: '',
  suspension: '',
  tires: '',
  display: '',
  drivetrain: '',
  tags: '',
  sku: ''
};

export default function BikeForm({
  initialValues = defaultState,
  onSubmit,
  onImageUpload,
  bikeId
}) {
  const [form, setForm] = useState({ ...defaultState, ...initialValues });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({ ...defaultState, ...initialValues });
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: form.price === '' ? 0 : Number(form.price),
        stock: form.stock === '' ? 0 : Number(form.stock),
        mileage: form.mileage === '' ? null : Number(form.mileage)
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload() {
    if (!bikeId || !imageFile || !onImageUpload) return;
    setUploading(true);
    try {
      await onImageUpload(bikeId, imageFile);
      setImageFile(null);
      alert('Image uploaded');
    } finally {
      setUploading(false);
    }
  }

  const images = initialValues?.images || [];
  const mainImage = images[0];
  const sideImages = images.slice(1, 3);

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-stack">
        <div className="form-card">
          <h3>Asset Management</h3>

          <div className="asset-gallery">
            <div className="asset-main">
              {mainImage ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${mainImage.image_url}`}
                  alt="Bike main"
                />
              ) : (
                <div className="asset-upload-box">Main Image Preview</div>
              )}
            </div>

            <div className="asset-side">
              {sideImages[0] ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${sideImages[0].image_url}`}
                  alt="Bike side"
                />
              ) : (
                <div className="asset-upload-box">Side Image</div>
              )}

              {sideImages[1] ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${sideImages[1].image_url}`}
                  alt="Bike side"
                />
              ) : (
                <div className="asset-upload-box">Add Media</div>
              )}
            </div>
          </div>

          {bikeId && (
            <div style={{ marginTop: 18 }}>
              <div className="dropzone">
                <p style={{ marginTop: 0 }}>Drop additional images here or browse files</p>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleUpload}
                    disabled={!imageFile || uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-card">
          <h3>Core Information</h3>

          <div className="field">
            <label>Product Title</label>
            <input
              className="input"
              name="title"
              value={form.title ?? ''}
              onChange={handleChange}
              placeholder="Volt-X Carbon Stealth"
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Marketing Description</label>
            <textarea
              className="textarea"
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              placeholder="Write a polished showroom description..."
            />
          </div>

          <div className="field-grid-3" style={{ marginTop: 14 }}>
            <div className="field">
              <label>MSRP ($)</label>
              <input
                className="input"
                name="price"
                type="number"
                value={form.price ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Warehouse Stock</label>
              <input
                className="input"
                name="stock"
                type="number"
                value={form.stock ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>SKU</label>
              <input
                className="input"
                name="sku"
                value={form.sku ?? ''}
                onChange={handleChange}
                placeholder="EB-2024-VLT"
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Model Details</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Brand</label>
              <input
                className="input"
                name="brand"
                value={form.brand ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Model</label>
              <input
                className="input"
                name="model"
                value={form.model ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-grid-3" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Condition</label>
              <select
                className="select"
                name="condition"
                value={form.condition ?? 'used'}
                onChange={handleChange}
              >
                <option value="used">Used</option>
                <option value="new">New</option>
              </select>
            </div>

            <div className="field">
              <label>Mileage</label>
              <input
                className="input"
                name="mileage"
                type="number"
                value={form.mileage ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Tags</label>
              <input
                className="input"
                name="tags"
                value={form.tags ?? ''}
                onChange={handleChange}
                placeholder="premium, urban, carbon"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-stack">
        <div className="form-card">
          <h3>Technical Specifications</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Motor Type</label>
              <input
                className="input"
                name="motor_type"
                value={form.motor_type ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Battery Capacity</label>
              <input
                className="input"
                name="battery_capacity"
                value={form.battery_capacity ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Range (KM)</label>
              <input
                className="input"
                name="range_km"
                value={form.range_km ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Frame Type</label>
              <input
                className="input"
                name="frame_type"
                value={form.frame_type ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Frame Size</label>
              <input
                className="input"
                name="frame_size"
                value={form.frame_size ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Brakes</label>
              <input
                className="input"
                name="brakes"
                value={form.brakes ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-grid-3" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Suspension</label>
              <input
                className="input"
                name="suspension"
                value={form.suspension ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Tires</label>
              <input
                className="input"
                name="tires"
                value={form.tires ?? ''}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Display</label>
              <input
                className="input"
                name="display"
                value={form.display ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Drivetrain</label>
            <input
              className="input"
              name="drivetrain"
              value={form.drivetrain ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="side-status-card">
          <h4 style={{ marginTop: 0 }}>Shopify Status</h4>

          <div className="side-status-meta">
            Last sync:{' '}
            {initialValues?.last_synced_at
              ? new Date(initialValues.last_synced_at).toLocaleString()
              : 'Not synced yet'}
          </div>

          <div style={{ marginBottom: 14 }}>
            <span
              className={
                initialValues?.sync_status === 'success'
                  ? 'badge badge-success'
                  : initialValues?.sync_status === 'pending'
                  ? 'badge badge-pending'
                  : initialValues?.sync_status === 'error'
                  ? 'badge badge-error'
                  : 'badge badge-synced'
              }
            >
              {initialValues?.sync_status || 'draft'}
            </span>
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Shopify Product ID</label>
            <input
              className="input"
              value={initialValues?.shopify_product_id || ''}
              readOnly
            />
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Shopify Variant ID</label>
            <input
              className="input"
              value={initialValues?.shopify_variant_id || ''}
              readOnly
            />
          </div>

          {initialValues?.sync_status === 'error' && (
            <div className="warning-box">
              Sync error detected. Review credentials or bike data, then sync again.
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="secondary-btn" type="button" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}