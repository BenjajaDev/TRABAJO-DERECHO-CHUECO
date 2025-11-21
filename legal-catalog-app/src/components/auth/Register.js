import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { nombre, apellido, telefono, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await register({ nombre, apellido, telefono, email, password, password2 });
      navigate('/login');
    } catch (err) {
      setError('Error en el registro. El correo puede que ya esté en uso.');
      console.error(err);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Registro</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input type="text" name="nombre" value={nombre} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Apellido</label>
            <input type="text" name="apellido" value={apellido} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input type="text" name="telefono" value={telefono} onChange={onChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Correo Electrónico</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input type="password" name="password" value={password} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Confirmar Contraseña</label>
            <input type="password" name="password2" value={password2} onChange={onChange} required />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Registrarse
          </button>
        </form>
        <p className={styles.subtext}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
