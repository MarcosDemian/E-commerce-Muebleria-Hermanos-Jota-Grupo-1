import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_PRODUCTOS } from '../config';

const IMAGENES_CATALOGO = [
  { label: 'Aparador Uspallata', url: 'img/aparador-uspallata.png' },
  { label: 'Biblioteca Recoleta', url: 'img/biblioteca-recoleta.png' },
  { label: 'Butaca Mendoza', url: 'img/butaca-mendoza.png' },
  { label: 'Sillón Copacabana', url: 'img/sillon-copacabana.png' },
  { label: 'Mesa de Centro Araucaria', url: 'img/mesa-centro-araucaria.png' },
  { label: 'Mesa de Noche Aconcagua', url: 'img/mesa-noche-aconcagua.png' },
  { label: 'Sofá Patagonia', url: 'img/sofa-patagonia.png' },
  { label: 'Mesa Comedor Pampa', url: 'img/mesa-comedor-pampa.png' },
  { label: 'Sillas Córdoba', url: 'img/sillas-cordoba.png' },
  { label: 'Escritorio Costa', url: 'img/escritorio-costa.png' },
  { label: 'Silla de Trabajo Belgrano', url: 'img/silla-trabajo-belgrano.png' }
];

export default function ProductForm({ mode = 'create', onShowToast }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit' && Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '10',
    imagenUrl: 'img/aparador-uspallata.png',
    categoria: 'Living'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isEdit) return;

    setLoadingInitial(true);
    fetch(`${API_PRODUCTOS}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el producto para editar.');
        return res.json();
      })
      .then(data => {
        setFormData({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          precio: data.precio !== undefined ? String(data.precio) : '',
          stock: data.stock !== undefined ? String(data.stock) : '10',
          imagenUrl: data.imagenUrl || data.imagen || 'img/aparador-uspallata.png',
          categoria: data.categoria || 'Living'
        });
        setLoadingInitial(false);
      })
      .catch(err => {
        setServerError(err.message);
        setLoadingInitial(false);
      });
  }, [isEdit, id]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre del producto es obligatorio.';
    }
    const numPrecio = Number(formData.precio);
    if (formData.precio === '' || Number.isNaN(numPrecio) || numPrecio <= 0) {
      nextErrors.precio = 'Ingresá un precio numérico mayor a 0.';
    }
    const numStock = Number(formData.stock);
    if (formData.stock !== '' && (Number.isNaN(numStock) || numStock < 0)) {
      nextErrors.stock = 'El stock no puede ser negativo.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        stock: formData.stock === '' ? 0 : Number(formData.stock),
        imagenUrl: formData.imagenUrl.trim() || 'img/aparador-uspallata.png',
        categoria: formData.categoria.trim() || 'General'
      };

      const url = isEdit ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || 'Error al guardar el producto en el servidor.');
      }

      if (onShowToast) {
        onShowToast(
          isEdit
            ? `"${data.nombre}" actualizado con éxito`
            : `"${data.nombre}" creado en el catálogo`
        );
      }

      const targetId = data._id || data.id;
      navigate(targetId ? `/productos/${targetId}` : '/productos');
    } catch (err) {
      console.error('Error guardando producto:', err);
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <section className="section container">
        <div className="loading-state">
          <p>⏳ Cargando datos del producto...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">ADMINISTRACIÓN DE CATÁLOGO</p>
          <h1>{isEdit ? 'Editar producto' : 'Alta de producto'}</h1>
          <p>
            {isEdit
              ? 'Actualizá los datos de la pieza seleccionada en MongoDB.'
              : 'Completá el formulario para incorporar una nueva pieza al catálogo persistente.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <button
            type="button"
            className="back-link"
            style={{ marginBottom: '1.25rem' }}
            onClick={() => navigate(isEdit ? `/productos/${id}` : '/productos')}
          >
            ← {isEdit ? 'Volver al detalle' : 'Volver al catálogo'}
          </button>

          {serverError && (
            <div className="error-state" style={{ marginBottom: '1.5rem' }}>
              <h3>⚠️ No se pudo guardar</h3>
              <p>{serverError}</p>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nombre">Nombre del producto *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: Mesa Ratona Caldén"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'invalid' : ''}
              />
              <small className="field-error">{errors.nombre}</small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="field">
                <label htmlFor="precio">Precio (ARS) *</label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Ej: 650000"
                  value={formData.precio}
                  onChange={handleChange}
                  className={errors.precio ? 'invalid' : ''}
                />
                <small className="field-error">{errors.precio}</small>
              </div>

              <div className="field">
                <label htmlFor="stock">Stock disponible</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Ej: 10"
                  value={formData.stock}
                  onChange={handleChange}
                  className={errors.stock ? 'invalid' : ''}
                />
                <small className="field-error">{errors.stock}</small>
              </div>

              <div className="field">
                <label htmlFor="categoria">Categoría</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem', border: '1px solid rgba(53, 43, 39, 0.18)', background: '#fff' }}
                >
                  <option value="Living">Living</option>
                  <option value="Comedor">Comedor</option>
                  <option value="Dormitorio">Dormitorio</option>
                  <option value="Guardado">Guardado</option>
                  <option value="Trabajo">Trabajo</option>
                  <option value="General">General</option>
                </select>
                <small className="field-error"></small>
              </div>
            </div>

            <div className="field">
              <label htmlFor="imagenUrl">URL o Ruta de Imagen (imagenUrl)</label>
              <input
                id="imagenUrl"
                name="imagenUrl"
                type="text"
                placeholder="img/aparador-uspallata.png o https://..."
                value={formData.imagenUrl}
                onChange={handleChange}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <small className="muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  O elegí una imagen del catálogo local:
                </small>
                <select
                  aria-label="Seleccionar imagen predefinida"
                  value={IMAGENES_CATALOGO.some(i => i.url === formData.imagenUrl) ? formData.imagenUrl : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({ ...prev, imagenUrl: e.target.value }));
                    }
                  }}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid rgba(53, 43, 39, 0.18)', background: '#fff', fontSize: '0.85rem' }}
                >
                  <option value="">-- Seleccionar foto del taller --</option>
                  {IMAGENES_CATALOGO.map(img => (
                    <option key={img.url} value={img.url}>{img.label} ({img.url})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                placeholder="Describí los materiales, terminaciones y espíritu de la pieza..."
                value={formData.descripcion}
                onChange={handleChange}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => navigate(isEdit ? `/productos/${id}` : '/productos')}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="button button-primary"
                disabled={submitting}
              >
                {submitting
                  ? 'GUARDANDO...'
                  : isEdit
                    ? 'GUARDAR CAMBIOS'
                    : 'CREAR PRODUCTO'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
