module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'goBarberDB',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
