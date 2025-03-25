const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Add CORS to allow cross-origin requests

const app = express();
const port = process.env.PORT || 3000;
const API_SECRET = process.env.API_SECRET || 'your-api-secret';

app.use(express.json());
app.use(cors());  // Allow cross-origin requests

// Root route for testing
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Test route to check if the API is working
app.get('/test', (req, res) => {
    res.send('Smile detection API is working!');
});

// Endpoint for detecting smile
app.post('/detect-smile', async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;

        // Check if the imageUrl is provided
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'No image URL provided' });
        }

        // Make sure to replace with your actual API URL for smile detection
        const response = await axios.post('YOUR_SMILE_DETECTION_API_URL', {
            imageUrl,
            headers: { 'Authorization': `Bearer ${API_SECRET}` }
        });

        // Assuming the API returns a `smileDetected` property
        if (response.data.smileDetected) {
            res.json({ success: true, message: 'Smile detected!' });
        } else {
            res.json({ success: false, message: 'No smile detected' });
        }
    } catch (error) {
        console.error('Error during smile detection:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error processing the image' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
