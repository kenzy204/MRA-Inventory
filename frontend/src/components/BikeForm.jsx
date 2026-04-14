import { useEffect, useMemo, useState } from 'react';

const defaultState = {
  brand: '',
  model: '',
  title: '',
  description: '',
  price: '',
  stock: '',
  sku: '',
  tags: '',

  condition: 'used',
  kilometerstand: '',
  km_s: '',

  merk: '',
  type: '',
  positie: '',
  koppel_motor_nm: '',
  type_aandrijving: '',

  accu_capaciteit_wh: '',
  accu_positie: '',
  accu_uitneembaar: '',
  accu: '',

  type_remmen: '',
  merk_remmen: '',
  remmen: '',

  display_merk: '',
  display_type: '',
  display: '',

  voorvork_vering_aanwezig: '',
  voorvork_vering_type: '',
  verende_zadelpen_aanwezig: '',
  verende_zadelpen_type: '',
  zadelvering: '',
  vering: '',

  bandmerk: '',
  bandmodel: '',
  anti_lek_banden: '',
  bandbreedte: '',
  banden: '',

  frame_size: '',
  type_frame: '',
  framemateriaal: '',
  frame: '',

  wielmaat: '',

  aantal_sleutels: '',
  fabrieksgarantie: ''
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
        koppel_motor_nm:
          form.koppel_motor_nm === '' ? null : Number(form.koppel_motor_nm),
        accu_capaciteit_wh:
          form.accu_capaciteit_wh === '' ? null : Number(form.accu_capaciteit_wh),
        frame_size: form.frame_size === '' ? null : Number(form.frame_size),
        aantal_sleutels:
          form.aantal_sleutels === '' ? null : Number(form.aantal_sleutels),
        kilometerstand:
          form.kilometerstand === '' ? null : Number(form.kilometerstand),
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
      alert('Afbeeldingen geüpload');
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
const galleryImages = displayedImages.slice(1);

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

  function renderBooleanSelect(name, label) {
    return (
      <div className="field">
        <label>{label}</label>
        <select className="select" name={name} value={form[name] ?? ''} onChange={handleChange}>
          <option value="">Selecteer</option>
          <option value="ja">Ja</option>
          <option value="nee">Nee</option>
        </select>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-stack">
        <div className="form-card">
          <h3>Afbeeldingen</h3>

       <div className="asset-gallery">
  <div className="asset-main">
    {renderImage(mainImage, 'Hoofdafbeelding fiets', 'Voorbeeld hoofdafbeelding')}
  </div>

  <div className="asset-side">
    {galleryImages.length > 0 ? (
      galleryImages.map((image, index) => {
        const src = image.isPreview
          ? image.image_url
          : /^https?:\/\//i.test(image.image_url)
          ? image.image_url
          : `${import.meta.env.VITE_BACKEND_URL}${image.image_url}`;

        return (
          <img
            key={index}
            src={src}
            alt={`Fiets afbeelding ${index + 2}`}
          />
        );
      })
    ) : (
      <div className="asset-upload-box">Geen extra afbeeldingen</div>
    )}
  </div>
</div>

          <div style={{ marginTop: 18 }}>
            <div className="dropzone">
              <p style={{ marginTop: 0 }}>
                {bikeId
                  ? 'Selecteer afbeeldingen om toe te voegen of te vervangen'
                  : 'Selecteer afbeeldingen voordat je de fiets opslaat'}
              </p>

              <input type="file" multiple accept="image/*" onChange={handleImagesChange} />

              {images.length > 0 && (
                <div style={{ marginTop: 12 }}>{images.length} afbeelding(en) geselecteerd</div>
              )}

              {bikeId && (
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleUploadAdditionalImages}
                    disabled={images.length === 0 || uploading}
                  >
                    {uploading ? 'Uploaden...' : 'Extra afbeeldingen uploaden'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Algemeen</h3>

          <div className="field">
            <label>Producttitel</label>
            <input
              className="input"
              name="title"
              value={form.title ?? ''}
              onChange={handleChange}
              placeholder="Bijvoorbeeld: Koga E-bike"
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Beschrijving</label>
            <textarea
              className="textarea"
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              placeholder="Schrijf een duidelijke beschrijving..."
            />
          </div>

          <div className="field-grid-3" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Prijs</label>
              <input className="input" name="price" type="number" value={form.price ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Voorraad</label>
              <input className="input" name="stock" type="number" value={form.stock ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>SKU</label>
              <input className="input" name="sku" value={form.sku ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Merk (intern)</label>
              <input className="input" name="brand" value={form.brand ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Model</label>
              <input className="input" name="model" value={form.model ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
           <div className="field">
  <label>Tags</label>
  <select
    className="select"
    name="tags"
    value={form.tags ?? ''}
    onChange={handleChange}
  >
    <option value="">Selecteer</option>
    <option value="MRA-Zwolle">MRA-Zwolle</option>
    <option value="MRA-Beilen">MRA-Beilen</option>
    <option value="MRA-Eindhoven">MRA-Eindhoven</option>
  </select>
</div>
            <div className="field">
              <label>Staat van de fiets</label>
              <select className="select" name="condition" value={form.condition ?? 'used'} onChange={handleChange}>
                <option value="used">Gebruikt</option>
                <option value="new">Nieuw</option>
                <option value="demo">Demo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Aandrijving</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Merk</label>
              <input className="input" name="merk" value={form.merk ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Type</label>
              <input className="input" name="type" value={form.type ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Positie</label>
              <input className="input" name="positie" value={form.positie ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Koppel motor (Nm)</label>
              <input
                className="input"
                name="koppel_motor_nm"
                type="number"
                step="0.1"
                value={form.koppel_motor_nm ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Aandrijving</label>
            <textarea
              className="textarea"
              name="type_aandrijving"
              value={form.type_aandrijving ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-card">
          <h3>Accu</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Accu capaciteit (Wh)</label>
              <input
                className="input"
                name="accu_capaciteit_wh"
                type="number"
                value={form.accu_capaciteit_wh ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Accu positie</label>
              <select
                className="select"
                name="accu_positie"
                value={form.accu_positie ?? ''}
                onChange={handleChange}
              >
                <option value="">Selecteer</option>
                <option value="frame">frame</option>
                <option value="bagagedrager">bagagedrager</option>
                <option value="geïntegreerd">geïntegreerd</option>
              </select>
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            {renderBooleanSelect('accu_uitneembaar', 'Accu uitneembaar')}
            <div className="field">
              <label>Accu</label>
              <textarea className="textarea" name="accu" value={form.accu ?? ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Remsysteem</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Type remmen</label>
              <select
                className="select"
                name="type_remmen"
                value={form.type_remmen ?? ''}
                onChange={handleChange}
              >
                <option value="">Selecteer</option>
                <option value="hydraulische schijf">hydraulische schijf</option>
                <option value="mechanische schijf">mechanische schijf</option>
                <option value="rollerbrake">rollerbrake</option>
              </select>
            </div>
            <div className="field">
              <label>Merk remmen</label>
              <input className="input" name="merk_remmen" value={form.merk_remmen ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Rem</label>
            <textarea className="textarea" name="remmen" value={form.remmen ?? ''} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-stack">
        <div className="form-card">
          <h3>Display</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Display merk</label>
              <input className="input" name="display_merk" value={form.display_merk ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Display type</label>
              <input className="input" name="display_type" value={form.display_type ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Display</label>
            <textarea className="textarea" name="display" value={form.display ?? ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-card">
          <h3>Veringscomfort</h3>

          <div className="field-grid-2">
            {renderBooleanSelect('voorvork_vering_aanwezig', 'Voorvork vering aanwezig')}
            <div className="field">
              <label>Voorvork vering type</label>
              <input
                className="input"
                name="voorvork_vering_type"
                value={form.voorvork_vering_type ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            {renderBooleanSelect('verende_zadelpen_aanwezig', 'Verende zadelpen aanwezig')}
            <div className="field">
              <label>Verende zadelpen type</label>
              <input
                className="input"
                name="verende_zadelpen_type"
                value={form.verende_zadelpen_type ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            {renderBooleanSelect('zadelvering', 'Zadelvering')}
            <div className="field">
              <label>Vering</label>
              <textarea className="textarea" name="vering" value={form.vering ?? ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Banden</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Bandmerk</label>
              <input className="input" name="bandmerk" value={form.bandmerk ?? ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Bandmodel</label>
              <input className="input" name="bandmodel" value={form.bandmodel ?? ''} onChange={handleChange} />
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            {renderBooleanSelect('anti_lek_banden', 'Anti-lek banden')}
            <div className="field">
              <label>Bandbreedte</label>
              <select
                className="select"
                name="bandbreedte"
                value={form.bandbreedte ?? ''}
                onChange={handleChange}
              >
                <option value="">Selecteer</option>
                <option value="smal">smal</option>
                <option value="normaal">normaal</option>
                <option value="breed">breed</option>
              </select>
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Banden</label>
            <textarea className="textarea" name="banden" value={form.banden ?? ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-card">
          <h3>Frame</h3>

          <div className="field-grid-2">
            <div className="field">
              <label>Framemaat (cm)</label>
              <input
                className="input"
                name="frame_size"
                type="number"
                step="0.1"
                value={form.frame_size ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Type frame</label>
              <select
                className="select"
                name="type_frame"
                value={form.type_frame ?? ''}
                onChange={handleChange}
              >
                <option value="">Selecteer</option>
                <option value="lage instap">lage instap</option>
                <option value="hoge instap">hoge instap</option>
                <option value="heren">heren</option>
                <option value="dames">dames</option>
              </select>
            </div>
          </div>

          <div className="field-grid-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Framemateriaal</label>
              <select
                className="select"
                name="framemateriaal"
                value={form.framemateriaal ?? ''}
                onChange={handleChange}
              >
                <option value="">Selecteer</option>
                <option value="aluminium">aluminium</option>
                <option value="staal">staal</option>
                <option value="carbon">carbon</option>
              </select>
            </div>
            <div className="field">
              <label>Frame</label>
              <textarea className="textarea" name="frame" value={form.frame ?? ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Wielen</h3>
          <div className="field">
            <label>Wielmaat</label>
            <input className="input" name="wielmaat" value={form.wielmaat ?? ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-card">
          <h3>Levering</h3>
          <div className="field-grid-2">
            <div className="field">
              <label>Aantal sleutels</label>
              <input
                className="input"
                name="aantal_sleutels"
                type="number"
                value={form.aantal_sleutels ?? ''}
                onChange={handleChange}
              />
            </div>
            {renderBooleanSelect('fabrieksgarantie', 'Fabrieksgarantie')}
          </div>
        </div>

        <div className="form-card">
          <h3>Gebruik</h3>
          <div className="field-grid-2">
            <div className="field">
              <label>Kilometerstand</label>
              <input
                className="input"
                name="kilometerstand"
                type="number"
                value={form.kilometerstand ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Km’s</label>
              <input className="input" name="km_s" value={form.km_s ?? ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="side-status-card">
          <h4 style={{ marginTop: 0 }}>Shopify-status</h4>

          <div className="side-status-meta">
            Laatste synchronisatie:{' '}
            {initialValues?.last_synced_at
              ? new Date(initialValues.last_synced_at).toLocaleString()
              : 'Nog niet gesynchroniseerd'}
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
              {initialValues?.sync_status || 'concept'}
            </span>
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Shopify Product ID</label>
            <input className="input" value={initialValues?.shopify_product_id || ''} readOnly />
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Shopify Variant ID</label>
            <input className="input" value={initialValues?.shopify_variant_id || ''} readOnly />
          </div>

          {initialValues?.sync_status === 'error' && (
            <div className="warning-box">
              Er is een synchronisatiefout opgetreden. Controleer de gegevens en probeer opnieuw.
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button className="secondary-btn" type="button" onClick={() => window.history.back()}>
              Annuleren
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
