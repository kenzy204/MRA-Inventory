import { useEffect, useMemo, useState } from 'react';

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
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({ ...defaultState, ...initialValues });
  }, [initialValues]);

  const previewUrls = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleImagesChange(e) {
    const files = Array.from(e.target.files || []);
    setImages(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await onSubmit({
        ...form,
        price: form.price === '' ? 0 : Number(form.price),
        stock: form.stock === '' ? 0 : Number(form.stock),
        mileage: form.mileage === '' ? null : Number(form.mileage),
        range_km: form.range_km === '' ? null : Number(form.range_km),
        images
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadAdditionalImages() {
    if (!bikeId || images.length === 0 || !onImageUpload) return;

    setUploading(true);

    try {
      for (const file of images) {
        await onImageUpload(bikeId, file);
      }

      setImages([]);
      alert('Images uploaded');
    } finally {
      setUploading(false);
    }
  }

  const existingImages = initialValues?.images || [];
  const displayedImages =
    previewUrls.length > 0
      ? previewUrls.map((item) => ({ image_url: item.url, isPreview: true }))
      : existingImages;

  const mainImage = displayedImages[0];
  const sideImages = displayedImages.slice(1, 3);

  function renderImage(image, altText, placeholderText) {
    if (!image) {
      return <div className="asset-upload-box">{placeholderText}</div>;
    }

    const src = image.isPreview
      ? image.image_url
      : /^https?:\/\//i.test(image.image_url)
      ? image.image_url
      : `${import.meta.env.VITE_BACKEND_URL}${image.image_url}`;

    return <img src={src} alt={altText} />;
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-stack">
        <div className="form-card">
          <h3>Asset Management</h3>

          <div className="asset-gallery">
            <div className="asset-main">
              {renderImage(mainImage, 'Bike main', 'Main Image Preview')}
            </div>

            <div className="asset-side">
              {renderImage(sideImages[0], 'Bike side', 'Side Image')}
              {renderImage(sideImages[1], 'Bike side', 'Add Media')}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div className="dropzone">
              <p style={{ marginTop: 0 }}>
                {bikeId
                  ? 'Select images to add or replace'
                  : 'Select images before saving the bike'}
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
              />

              {images.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {images.length} image(s) selected
                </div>
              )}

              {bikeId && (
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleUploadAdditionalImages}
                    disabled={images.length === 0 || uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Additional Images'}
                  </button>
                </div>
              )}
            </div>
          </div>
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
                type="number"
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
