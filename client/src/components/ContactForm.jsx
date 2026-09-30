import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [enviado, setEnviado] = useState(false);

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarCampo = (name, value) => {
    let errorTexto = '';
    const val = value.trim();

    if (name === 'nombre') {
      if (!val) errorTexto = 'El nombre es obligatorio.';
      else if (val.length < 3) errorTexto = 'El nombre debe tener al menos 3 caracteres.';
    } else if (name === 'email') {
      if (!val) errorTexto = 'El email es obligatorio.';
      else if (!validarEmail(val)) errorTexto = 'Por favor, ingresá un email válido.';
    } else if (name === 'mensaje') {
      if (!val) errorTexto = 'El mensaje es obligatorio.';
      else if (val.length < 10) errorTexto = 'El mensaje debe tener al menos 10 caracteres.';
    }

    setErrors(prev => ({ ...prev, [name]: errorTexto }));
    return !errorTexto;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validarCampo(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const okNombre = validarCampo('nombre', formData.nombre);
    const okEmail = validarCampo('email', formData.email);
    const okMensaje = validarCampo('mensaje', formData.mensaje);

    if (okNombre && okEmail && okMensaje) {
      setEnviado(true);
    }
  };

  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">HABLEMOS</p>
          <h1>Contacto</h1>
          <p>
            Estamos para ayudarte a encontrar una pieza que tenga sentido en tu espacio.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">CASA TALLER</p>
            <h2>Pasá a conocernos.</h2>
            <p>
              Av. San Juan 2847, Barrio de San Cristóbal, Ciudad Autónoma de Buenos Aires.
            </p>
            <p>
              <strong>Horarios</strong><br />
              Lunes a viernes: 10:00 – 19:00<br />
              Sábados: 10:00 – 14:00
            </p>
            <p>
              <strong>Ventas</strong><br />
              ventas@hermanosjota.com.ar<br />
              WhatsApp +54 11 4567-8900
            </p>
          </div>

          <div>
            {!enviado ? (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.nombre ? 'invalid' : ''}
                  />
                  <small className="field-error">{errors.nombre}</small>
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email ? 'invalid' : ''}
                  />
                  <small className="field-error">{errors.email}</small>
                </div>

                <div className="field">
                  <label htmlFor="mensaje">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="6"
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.mensaje}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.mensaje ? 'invalid' : ''}
                  ></textarea>
                  <small className="field-error">{errors.mensaje}</small>
                </div>

                <button className="button button-primary" type="submit">
                  ENVIAR MENSAJE
                </button>
              </form>
            ) : (
              <div className="success-message">
                <h2>¡Mensaje enviado con éxito!</h2>
                <p>
                  Gracias <strong>{formData.nombre}</strong> por comunicarte con Hermanos Jota. Nos pondremos en contacto desde Casa Taller a la brevedad.
                </p>
                <button 
                  className="button button-secondary" 
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setEnviado(false);
                    setFormData({ nombre: '', email: '', mensaje: '' });
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
