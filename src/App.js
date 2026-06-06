import React, { useState, useEffect } from 'react';
import './App.css';

const datosIniciales = [
  { 
    id: 1, 
    nombre: 'Soporte', 
    apellido: 'Técnico', 
    numero: '0412-1661812', 
    notas: 'Canal oficial para ayuda y reporte de fallas en la aplicación.', 
    apodo: 'Admin', 
    foto: 'https://cdn-icons-png.flaticon.com/512/1067/1067566.png' 
  }
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

const ContactCardCompact = ({ contacto, onClick }) => (
  <div className="contact-card card-compact" onClick={() => onClick(contacto)}>
    <div>
      <h4>{contacto.nombre} {contacto.apellido}</h4>
      <p>{contacto.apodo ? `"${contacto.apodo}"` : 'Sin apodo'}</p>
    </div>
    <span style={{fontSize: '20px'}}>📞</span>
  </div>
);

function App() {
  const [isAuth, setIsAuth] = useState(false);
  
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [contactos, setContactos] = useState(() => {
    const contactosGuardados = localStorage.getItem('misContactos');
    return contactosGuardados ? JSON.parse(contactosGuardados) : datosIniciales;
  });

  useEffect(() => {
    localStorage.setItem('misContactos', JSON.stringify(contactos));
  }, [contactos]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [viewStyle, setViewStyle] = useState('basic');
  
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', numero: '', foto: '', apodo: '', notas: ''
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === '1234') {
      setIsAuth(true); 
      setLoginError(false);
      setLoginUser('');
      setLoginPass('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    setIsMenuOpen(false);
  };

  const handleDelete = (id) => {
    setContactos(contactos.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  const handleEditClick = (contacto) => {
    setFormData({
      nombre: contacto.nombre, apellido: contacto.apellido, numero: contacto.numero,
      foto: contacto.foto, apodo: contacto.apodo, notas: contacto.notas
    });
    setEditingId(contacto.id); 
    setIsFormOpen(true); 
    setSelectedContact(null); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'numero') {
      const soloNumeros = value.replace(/[^\d]/g, '');
      if (soloNumeros.length <= 4) {
        finalValue = soloNumeros;
      } else {
        finalValue = `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4, 11)}`;
      }
    }

    setFormData({
      ...formData,
      [name]: finalValue
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      const contactosActualizados = contactos.map(c => 
        c.id === editingId ? { ...formData, id: editingId } : c
      );
      setContactos(contactosActualizados);
    } else {
      const nuevoContacto = {
        id: Date.now(),
        nombre: formData.nombre,
        apellido: formData.apellido,
        numero: formData.numero,
        apodo: formData.apodo,
        notas: formData.notas,
        foto: formData.foto || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=500&q=60'
      };
      setContactos([...contactos, nuevoContacto]);
    }

    setFormData({ nombre: '', apellido: '', numero: '', foto: '', apodo: '', notas: '' });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleOpenCreateForm = () => {
    setEditingId(null); 
    setFormData({ nombre: '', apellido: '', numero: '', foto: '', apodo: '', notas: '' });
    setIsFormOpen(true);
    setIsMenuOpen(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ nombre: '', apellido: '', numero: '', foto: '', apodo: '', notas: '' });
  };

  const quitarAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const contactosFiltrados = contactos.filter(contacto => {
    const busquedaLimpia = quitarAcentos(searchTerm.toLowerCase());
    const nombreLimpio = quitarAcentos(contacto.nombre.toLowerCase());
    const apellidoLimpio = quitarAcentos(contacto.apellido.toLowerCase());
    
    return nombreLimpio.includes(busquedaLimpia) || apellidoLimpio.includes(busquedaLimpia);
  });

  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
  });
  
  const renderCard = (contacto) => {
    switch (viewStyle) {
      case 'detailed': return <ContactCardDetailed key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
      case 'avatar': return <ContactCardAvatar key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
      case 'compact': return <ContactCardCompact key={contacto.id} contacto={contacto} onClick={setSelectedContact} />; // <-- AQUI
      case 'basic':
      default: return <ContactCardBasic key={contacto.id} contacto={contacto} onClick={setSelectedContact} />;
    }
  };

  return (
    <>
      {!isAuth ? (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Gestor de Contactos</h2>
            
            <input 
              type="text" 
              placeholder="Usuario" 
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              required 
              autoFocus 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required 
            />
            
            {loginError && <p className="error-msg">Usuario o contraseña incorrectos</p>}
            
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
              <button className="btn-add" onClick={handleOpenCreateForm}>+ Nuevo Contacto</button>
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
                  <option value="compact">Compacta</option>
                </select>
              </div>
            </div>

            <div className="contacts-grid">
              {contactosOrdenados.length > 0 ? (
                contactosOrdenados.map(renderCard)
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
                    <button className="btn-edit" onClick={() => handleEditClick(selectedContact)}>
                      Editar
                    </button>
                    <button className="btn-close" onClick={() => setSelectedContact(null)}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isFormOpen && (
              <div className="modal-overlay" onClick={closeForm}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>{editingId ? 'Editar Contacto' : 'Crear Nuevo Contacto'}</h2>
                  
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label>Nombre</label>
                      <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Ej. Pedro" 
                        value={formData.nombre} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}
                        required 
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido</label>
                      <input 
                        type="text" 
                        name="apellido" 
                        placeholder="Ej. González" 
                        value={formData.apellido} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input 
                        type="text" 
                        name="numero" 
                        placeholder="Ej. 0414-1234567" 
                        value={formData.numero} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>URL de la Foto</label>
                      <input 
                        type="text" 
                        name="foto" 
                        placeholder="Pega el link de una imagen" 
                        value={formData.foto} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <div className="form-group">
                      <label>Apodo</label>
                      <input 
                        type="text" 
                        name="apodo" 
                        placeholder="Opcional" 
                        value={formData.apodo} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <div className="form-group">
                      <label>Notas</label>
                      <textarea 
                        name="notas" 
                        placeholder="Ej. Compañero de trabajo..."
                        value={formData.notas} 
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn-close" onClick={closeForm}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-save">
                        {editingId ? 'Actualizar' : 'Guardar'}
                      </button>
                    </div>
                  </form>

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