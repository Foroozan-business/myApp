const express = require('express');
const cors = require('cors');  // Add CORS to allow cross-origin requests

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());  // Allow cross-origin requests

// Root route for testing
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
