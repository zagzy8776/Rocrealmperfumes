// Vercel serverless entry point: mounts the existing Express API at /api/*.
// The app itself is unchanged - it only skips app.listen() when VERCEL is set.
const app = require('../server/src/index');

module.exports = app;
