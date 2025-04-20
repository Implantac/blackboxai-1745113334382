require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const sequelize = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test database connection and sync models
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com MySQL estabelecida com sucesso.');
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (err) {
    console.error('Erro ao conectar ou sincronizar com o banco:', err);
  }
})();

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const roomsRoutes = require('./routes/rooms');
const minibarRoutes = require('./routes/minibar');
const financialRoutes = require('./routes/financial');
const fiscalRoutes = require('./routes/fiscal');
const usersRoutes = require('./routes/users');

app.use('/api/rooms', roomsRoutes);
app.use('/api/minibar', minibarRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/fiscal', fiscalRoutes);
app.use('/api/users', usersRoutes);

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Backend Motel Management System está rodando.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
