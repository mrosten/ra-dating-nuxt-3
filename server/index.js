const express = require('express');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const port = process.env.PORT || 3000;

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }


  // Use Nuxt's render middleware
  app.use(nuxt.render);
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

start();

module.exports = app;
