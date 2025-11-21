const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
    req.userId = decoded.id || decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Obtener cursos comprados por el usuario
router.get('/my-purchases', verifyToken, (req, res) => {
  const userId = req.userId;
  
  const query = `
    SELECT c.id, c.title, c.price, co.purchase_date 
    FROM compras co
    INNER JOIN cursos c ON co.curso_id = c.id
    WHERE co.user_id = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener compras:', err);
      return res.status(500).json({ message: 'Error al obtener compras' });
    }
    res.json(results);
  });
});

// Verificar si un curso específico está comprado
router.get('/check/:cursoId', verifyToken, (req, res) => {
  const userId = req.userId;
  const cursoId = req.params.cursoId;
  
  const query = 'SELECT * FROM compras WHERE user_id = ? AND curso_id = ?';
  
  db.query(query, [userId, cursoId], (err, results) => {
    if (err) {
      console.error('Error al verificar compra:', err);
      return res.status(500).json({ message: 'Error al verificar compra' });
    }
    res.json({ purchased: results.length > 0 });
  });
});

// Comprar un curso
router.post('/purchase', verifyToken, (req, res) => {
  const userId = req.userId;
  const { cursoId } = req.body;

  if (!cursoId) {
    return res.status(400).json({ message: 'ID del curso requerido' });
  }

  // Verificar si ya compró el curso
  const checkQuery = 'SELECT * FROM compras WHERE user_id = ? AND curso_id = ?';
  
  db.query(checkQuery, [userId, cursoId], (err, results) => {
    if (err) {
      console.error('Error al verificar compra existente:', err);
      return res.status(500).json({ message: 'Error al verificar compra' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Ya compraste este curso' });
    }

    // Verificar que el curso existe
    const courseQuery = 'SELECT * FROM cursos WHERE id = ?';
    db.query(courseQuery, [cursoId], (err, courseResults) => {
      if (err) {
        console.error('Error al verificar curso:', err);
        return res.status(500).json({ message: 'Error al verificar curso' });
      }

      if (courseResults.length === 0) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      // Registrar la compra
      const insertQuery = 'INSERT INTO compras (user_id, curso_id) VALUES (?, ?)';
      
      db.query(insertQuery, [userId, cursoId], (err, result) => {
        if (err) {
          console.error('Error al registrar compra:', err);
          return res.status(500).json({ message: 'Error al registrar compra' });
        }

        res.status(201).json({ 
          message: 'Curso comprado exitosamente',
          purchaseId: result.insertId
        });
      });
    });
  });
});

module.exports = router;
