import React, { useState, useEffect } from 'react';
import './App.css';

const datosIniciales = [
  { 
    id: 1, 
    nombre: 'Juan', 
    apellido: 'Pérez', 
    numero: '0414-1234567', 
    notas: 'Compañero de la universidad', 
    apodo: 'Juancho', 
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=60' 
  },
  { 
    id: 2, 
    nombre: 'María', 
    apellido: 'Gómez', 
    numero: '0412-9876543', 
    notas: 'Proyecto de desarrollo', 
    apodo: 'Mari', 
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60' 
  },
  { 
    id: 3, 
    nombre: 'Carlos', 
    apellido: 'López', 
    numero: '0424-5555555', 
    notas: 'Profesor de base de datos', 
    apodo: 'Profe', 
    foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=500&q=60' 
  },
  { 
    id: 4, 
    nombre: 'Ana', 
    apellido: 'Martínez', 
    numero: '0416-1112233', 
    notas: 'Diseñadora UX/UI', 
    apodo: 'Anita', 
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60' 
  },
];

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

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [contactos, setContactos] = useState(datosIniciales);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewStyle, setViewStyle] = useState('basic');
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = () => {
    setIsAuth(false);
    setIsMenuOpen(false);
  };

  const handleDelete = (id) => {
    setContactos(contactos.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  // NUEVA FUNCIÓN: Elimina los acentos y diéresis de cualquier texto
  const quitarAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // BÚSQUEDA MEJORADA: Compara los textos sin importar mayúsculas o tildes
  const contactosFiltrados = contactos.filter(contacto => {
    const busquedaLimpia = quitarAcentos(searchTerm.toLowerCase());
    const nombreLimpio = quitarAcentos(contacto.nombre.toLowerCase());
    const apellidoLimpio = quitarAcentos(contacto.apellido.toLowerCase());
    
    return nombreLimpio.includes(busquedaLimpia) || apellidoLimpio.includes(busquedaLimpia);
  });

  const renderCard = (contacto) => {
    switch (viewStyle) {
      case 'detailed': 
        return <ContactCardDetailed key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
      case 'avatar': 
        return <ContactCardAvatar key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
      case 'basic':
      default: 
        return <ContactCardBasic key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
    }
  };

  return (
    <>
      {!isAuth ? (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Gestor de Contactos</h2>
            <input type="text" placeholder="Usuario" required autoFocus />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit">Ingresar</button>
          </form>
        </div>
      ) : (
        <>
          <nav className="top-navbar">
            <h1>Contactos</h1>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" 
              alt="Mi Perfil" 
              className="profile-pic-btn"
              onClick={() => setIsMenuOpen(true)}
            />
          </nav>

          <div 
            className={`side-menu-overlay ${isMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="menu-header">
              <h2>Mi Cuenta</h2>
              <button className="btn-close-menu" onClick={() => setIsMenuOpen(false)}>✖</button>
            </div>
            
            <div className="sidebar-menu">
              <button className="btn-add" onClick={() => setIsMenuOpen(false)}>+ Nuevo Contacto</button>
            </div>
            
            <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
          </div>

          <div className="app-container">
            <div className="view-controls">
              <div className="controls-left">
                <input 
                  type="text" 
                  className="search-bar" 
                  placeholder="Buscar contacto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="controls-right">
                <label><strong>Vista:</strong></label>
                <select value={viewStyle} onChange={(e) => setViewStyle(e.target.value)}>
                  <option value="basic">Básica (Lista)</option>
                  <option value="detailed">Detallada</option>
                  <option value="avatar">Avatares</option>
                </select>
              </div>
            </div>

            <div className="contacts-grid">
              {contactosFiltrados.length > 0 ? (
                contactosFiltrados.map(renderCard)
              ) : (
                <p>No se encontraron contactos.</p>
              )}
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
        title="Cambiar tema"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </>
  );
}

export default App;