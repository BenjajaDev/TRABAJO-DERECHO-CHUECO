const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();


//Select todos los modulos
router.get('/', async (req, res) => {
    try {
      const [modules] = await db.query('SELECT * FROM cursos');
      res.json(modules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los modulos' });
    }
})


module.exports = router;