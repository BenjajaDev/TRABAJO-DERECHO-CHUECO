require('./config/config');
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API del Catálogo Jurídico funcionando');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const modulesRoutes = require('./routes/modules.js');
app.use('/api/modules', modulesRoutes);

const purchasesRoutes = require('./routes/purchases');
app.use('/api/purchases', purchasesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
