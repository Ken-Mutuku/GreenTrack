// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Optional: Serve static files (e.g. HTML, CSS)
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello from Azure Node.js app!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
