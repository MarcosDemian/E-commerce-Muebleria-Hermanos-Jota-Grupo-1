import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src="/img/logo-hj.png" alt="Hermanos Jota" />
          <h3>Hermanos Jota</h3>
          <p>
            Casa Taller · Av. San Juan 2847<br />San Cristóbal, CABA, Argentina
          </p>
        </div>
        <div>
          <h3>Horarios</h3>
          <p>Lunes a viernes: 10:00 – 19:00<br />Sábados: 10:00 – 14:00</p>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>
            info@hermanosjota.com.ar<br />ventas@hermanosjota.com.ar<br />WhatsApp +54 11 4567-8900
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Hermanos Jota</span>
        <span>Hecho con oficio, diseño y conciencia.</span>
      </div>
    </footer>
  );
}
