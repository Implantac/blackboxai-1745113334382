const { Sequelize } = require('sequelize');

// Ajuste para ambiente XAMPP MySQL padrão
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'motel_db',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com MySQL estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com MySQL:', error);
  }
};

testConnection();

module.exports = sequelize;
