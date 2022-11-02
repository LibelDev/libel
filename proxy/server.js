const express = require('express');
const proxy = require('html2canvas-proxy');

const app = express();
app.use('/', proxy());

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});