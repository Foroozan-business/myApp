const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Replace these with your actual Face++ API key and secret
const API_KEY = process.env.API_KEY || 'your-api-key';
const API_SECRET = process.env.API_SECRET || 'your-api-secret';

app.use(express.json());
app.use(cors());

// Test route to confirm it's working
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Endpoint for smile detection
app.post('/detect-smile', async (req, res) => {
    try {
        const imageUrl = req.body.image; // ⬅️ This must match what Adalo sends

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'No image URL provided' });
        }

        // Send to Face++ (or your smile detection API)
        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', null, {
            params: {
                api_key: API_KEY,
                api_secret: API_SECRET,
                image_url: imageUrl,
                return_attributes: 'smile'
            }
        });

        const smileData = response.data.faces[0]?.attributes?.smile?.value;

        if (smileData !== undefined) {
            const message = smileData > 50 ? 'Such a beautiful smile!' : 'Try for a real smile 😊';
            res.json({ success: true, message });
        } else {
            res.json({ success: false, message: 'No face or smile detected' });
        }

    } catch (error) {
        console.error('Error detecting smile:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Error processing the image' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
