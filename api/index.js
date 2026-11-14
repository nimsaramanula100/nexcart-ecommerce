// EN: Serverless entry point that re-exports the configured Express app; SI: Serverless ආරම්භකය ලෙස සකස් කළ Express යෙදුම අපනයනය කරයි.
const app = require('../backend/server.js');

module.exports = app;
