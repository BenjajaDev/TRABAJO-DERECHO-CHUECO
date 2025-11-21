import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.content}>
          <h2>🔒 Acceso Restringido</h2>
          <p>Debes iniciar sesión para comprar cursos</p>
          <div className={styles.actions}>
            <Link to="/login" className={styles.loginButton}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
