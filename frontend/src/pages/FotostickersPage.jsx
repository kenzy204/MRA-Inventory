import { useEffect, useMemo, useState } from 'react';
import {
  getPhotoStickers,
  createPhotoSticker,
  togglePhotoSticker,
  deletePhotoSticker
} from '../api/photoStickers';

const categories = [
  { key: 'linksboven', label: 'Linksboven' },
  { key: 'boven', label: 'Boven' },
  { key: 'rechtsboven', label: 'Rechtsboven' },
  { key: 'midden', label: 'Midden' },
  { key: 'linksonder', label: 'Linksonder' },
  { key: 'onder', label: 'Onder' },
  { key: 'rechtsonder', label: 'Rechtsonder' },
  { key: 'feestdagen', label: 'Feestdagen' },
  { key: 'financiering', label: 'Financiering' },
  { key: 'dynamisch', label: 'Dynamisch' },
  { key: 'overig', label: 'Overig' }
];

export default function FotostickersPage() {
  const [stickers, setStickers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('linksboven');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'linksboven',
    size: 'groot',
    photo_count: 0,
    image: null
  });
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await getPhotoStickers();
      setStickers(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Fotostickers laden mislukt');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredStickers = useMemo(() => {
    return stickers.filter((item) => item.category === activeCategory);
  }, [stickers, activeCategory]);

  function imageSrc(url) {
    if (!url) return '';
    return /^https?:\/\//i.test(url)
      ? url
      : `${import.meta.env.VITE_BACKEND_URL}${url}`;
  }

  async function handleCreate(e) {
    e.preventDefault();

    if (!form.title || !form.image) {
      setError('Titel en afbeelding zijn verplicht');
      return;
    }

    await createPhotoSticker({
      ...form,
      category: activeCategory
    });

    setModalOpen(false);
    setForm({
      title: '',
      category: activeCategory,
      size: 'groot',
      photo_count: 0,
      image: null
    });

    await load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Weet je zeker dat je deze fotosticker wilt verwijderen?')) return;
    await deletePhotoSticker(id);
    await load();
  }

  async function handleToggle(id) {
    await togglePhotoSticker(id);
    await load();
  }

  const activeLabel =
    categories.find((cat) => cat.key === activeCategory)?.label || '';

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>Fotostickers MRA E-Bike Center</h2>

      <div className="fotosticker-layout">
        <div className="fotosticker-sidebar">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`fotosticker-category ${
                activeCategory === category.key ? 'active' : ''
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="fotosticker-content">
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            Onderstaand vind je alle beschikbare fotostickers voor de categorie
            "{activeLabel}". Je kunt je eigen fotostickers uploaden en aan- of uitzetten.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => setModalOpen(true)}
          >
            + Eigen fotosticker uploaden
          </button>

          {error && <p className="error-text">{error}</p>}

          <div className="fotosticker-grid">
            {filteredStickers.map((item) => (
              <div key={item.id} className="fotosticker-card">
                <div className="fotosticker-card-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.size} - {item.photo_count}</p>
                  </div>

                  <button
                    type="button"
                    className="table-btn"
                    onClick={() => handleToggle(item.id)}
                  >
                    {item.is_active ? 'Aan' : 'Uit'}
                  </button>
                </div>

                <div className="fotosticker-preview">
                  <img src={imageSrc(item.image_url)} alt={item.title} />
                </div>

                <div className="table-actions">
                  <button
                    type="button"
                    className="table-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}

            {filteredStickers.length === 0 && (
              <div className="fotosticker-empty">
                Geen fotostickers in deze categorie.
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="fotosticker-modal">
            <div className="modal-head">
              <h3>Fotosticker toevoegen</h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="form-stack">
              <div className="field">
                <label>Titel</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label>Fotosticker</label>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || null
                    }))
                  }
                />
              </div>

              <div className="field">
                <label>Formaat</label>
                <select
                  className="select"
                  value={form.size}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, size: e.target.value }))
                  }
                >
                  <option value="groot">Groot</option>
                  <option value="normaal">Normaal</option>
                  <option value="extra groot">Extra groot</option>
                  <option value="volledige breedte">Volledige breedte</option>
                </select>
              </div>

              <div className="field">
                <label>Aantal foto's</label>
                <input
                  className="input"
                  type="number"
                  value={form.photo_count}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      photo_count: e.target.value
                    }))
                  }
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Annuleren
                </button>

                <button type="submit" className="primary-btn">
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
