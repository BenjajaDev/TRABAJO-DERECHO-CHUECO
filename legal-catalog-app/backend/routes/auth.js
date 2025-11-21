const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, apellido, telefono, email, password, password2 } = req.body;

  if (password !== password2) {
    return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
  }

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ msg: 'El correo electrónico ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO usuarios (nombre, apellido, telefono, email, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, telefono, email, hashedPassword]
    );

    res.status(201).json({ msg: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('--- Intento de Login ---');
  console.log('Email recibido:', email);
  console.log('Password recibido:', password ? 'Sí' : 'No');

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log('Resultado: Usuario no encontrado en la base de datos.');
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const user = users[0];
    console.log('Resultado: Usuario encontrado:', user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado de bcrypt.compare:', isMatch);

    if (!isMatch) {
      console.log('Error: La contraseña no coincide.');
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    console.log('Éxito: La contraseña coincide. Generando token...');
    const payload = {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error en el servidor durante el login:', err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
