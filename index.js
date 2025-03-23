const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your Face++ API credentials
const API_KEY = 'your-api-key';
const API_SECRET = 'your-api-secret';

// Middleware to parse JSON bodies
app.use(express.json());

// **Test route to check if API is working**
app.get('/test', (req, res) => {
    res.send('Smile detection API is working!');
});

// Endpoint for detecting smile
app.post('/detect-smile', async (req, res) => {
    try {
        // Get image URL from the request body
        const imageUrl = req.body.imageUrl;

        // Call Face++ API for smile detection
        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', null, {
            params: {
                api_key: API_KEY,
                api_secret: API_SECRET,
                image_url: imageUrl, // Image URL sent by the app
                return_attributes: 'smile'
            }
        });

        // Check if Face++ detected any faces and their smile attribute
        const smileData = response.data.faces[0]?.attributes?.smile?.value;

        if (smileData !== undefined) {
            res.json({ success: true, smile: smileData });
        } else {
            res.json({ success: false, message: 'No smile detected' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
