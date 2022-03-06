// Formato de index-dev.js
// para correr localmente
// por si algun dia se necesite
// tener un index.js para correr en AWS.

require('dotenv').config();

const { connect } = require('./common/mongoose');

const port = process.env.PORT;

connect(() => {
  const app = require('./app');
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
});
