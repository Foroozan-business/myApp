const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Add CORS to allow cross-origin requests

const app = express();
const port = process.env.PORT || 3000;

// Replace with your Face++ API credentials
const API_KEY = process.env.API_KEY || 'your-api-key';
const API_SECRET = process.env.API_SECRET || 'your-api-secret';

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());  // Allow cross-origin requests

// Root route for testing
app.get('/', (req, res) => {
    res.send('Smile detection API is working!');
});

// Handle POST request to the root URL and detect smile
app.post('/', async (req, res) => {  // Use / (root) for smile detection
    try {
        const imageUrl = req.body.imageUrl;

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'No image URL provided' });
        }

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
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ success: false, message: 'Error processing the image' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
