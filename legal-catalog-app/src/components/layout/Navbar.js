import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowModal(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.navLogo}>
            Catálogo Jurídico
          </Link>
          <div className={styles.navMenu}>
            {user ? (
              <>
                <span className={styles.navItem}>
                  {user.nombre} {user.apellido}
                </span>
                <button onClick={() => setShowModal(true)} className={styles.navBtn}>
                  Desconectar
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>
                  Inicio de sesión
                </Link>
                <Link to="/register" className={styles.navBtn}>
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Confirmar Cierre de Sesión</h2>
            <p>¿Estás seguro de que quieres cerrar sesión?</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.modalBtn}>
                Cancelar
              </button>
              <button onClick={handleLogout} className={`${styles.modalBtn} ${styles.confirmBtn}`}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
