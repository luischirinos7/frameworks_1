import React, { useState, useEffect } from 'react';
import './App.css';

// 1. Datos iniciales
const datosIniciales = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', numero: '0414-1234567', notas: 'Compañero de la universidad', apodo: 'Juancho', foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=60' },
  { id: 2, nombre: 'María', apellido: 'Gómez', numero: '0412-9876543', notas: 'Proyecto de desarrollo', apodo: 'Mari', foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60' },
  { id: 3, nombre: 'Carlos', apellido: 'López', numero: '0424-5555555', notas: 'Profesor de base de datos', apodo: 'Profe', foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=500&q=60' },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', numero: '0416-1112233', notas: 'Diseñadora UX/UI', apodo: 'Anita', foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60' },
];

// 2. Componentes Adaptables
const ContactCardBasic = ({ contacto, onClick }) => (
  <div className="contact-card card-basic" onClick={() => onClick(contacto)}>
    <img src={contacto.foto} alt="foto" />
    <div className="info">
      <h4>{contacto.nombre} {contacto.apellido}</h4>
      <p>{contacto.numero}</p>
    </div>
  </div>
);

const ContactCardDetailed = ({ contacto, onClick }) => (
  <div className="contact-card card-detailed" onClick={() => onClick(contacto)}>
    <img src={contacto.foto} alt="foto" />
    <div className="info">
      <h4>{contacto.nombre} {contacto.apellido}</h4>
      {contacto.apodo && <span className="apodo-badge">"{contacto.apodo}"</span>}
      <p><strong>Tlf:</strong> {contacto.numero}</p>
      <p><strong>Notas:</strong> {contacto.notas}</p>
    </div>
  </div>
);

const ContactCardAvatar = ({ contacto, onClick }) => (
  <div className="contact-card card-avatar" onClick={() => onClick(contacto)} title={`${contacto.nombre} ${contacto.apellido}`}>
    <img src={contacto.foto} alt="foto" />
  </div>
);

// 3. Componente Principal
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [contactos, setContactos] = useState(datosIniciales);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewStyle, setViewStyle] = useState('basic');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuth(true); 
  };

  const renderCard = (contacto) => {
    switch (viewStyle) {
      case 'detailed': return <ContactCardDetailed key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
      case 'avatar': return <ContactCardAvatar key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
      case 'basic':
      default: return <ContactCardBasic key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
    }
  };

  const handleDelete = (id) => {
    setContactos(contactos.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  return (
    <>
      {!isAuth ? (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Gestor de Contactos</h2>
            <input type="text" placeholder="Usuario" required />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit">Ingresar</button>
          </form>
        </div>
      ) : (
        <>
          {/* BARRA SUPERIOR (Navbar completa) */}
          <nav className="top-navbar">
            <h1>Contactos</h1>
            <button className="btn-logout" onClick={() => setIsAuth(false)}>Cerrar Sesión</button>
          </nav>

          {/* CONTENIDO PRINCIPAL */}
          <div className="app-container">
            <div className="view-controls">
              <label><strong>Estilo de visualización:</strong></label>
              <select value={viewStyle} onChange={(e) => setViewStyle(e.target.value)}>
                <option value="basic">Básica (Estilo Lista)</option>
                <option value="detailed">Detallada (Todos los datos)</option>
                <option value="avatar">Solo Avatares</option>
              </select>
            </div>

            <div className="contacts-grid">
              {contactos.map(renderCard)}
            </div>

            {selectedContact && (
              <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <img src={selectedContact.foto} alt="Perfil" />
                  <h2>{selectedContact.nombre} {selectedContact.apellido}</h2>
                  <p><strong>Apodo:</strong> {selectedContact.apodo}</p>
                  <p><strong>Número:</strong> {selectedContact.numero}</p>
                  <p><strong>Notas:</strong> {selectedContact.notas}</p>
                  
                  <div className="modal-actions">
                    <button className="btn-delete" onClick={() => handleDelete(selectedContact.id)}>
                      Borrar
                    </button>
                    <button className="btn-close" onClick={() => setSelectedContact(null)}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <button 
        className="theme-toggle-btn" 
        onClick={() => setIsDarkMode(!isDarkMode)}
        title="Cambiar tema oscuro/claro"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </>
  );
}

export default App;