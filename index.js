const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual Face++ credentials
const API_KEY = process.env.API_KEY || 'your-api-key';
const API_SECRET = process.env.API_SECRET || 'your-api-secret';

app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.json({ status: "API is working!" });
});

// Test route
app.get('/test', (req, res) => {
    res.send('Smile detection API is working!');
});

// Smile detection endpoint
app.post('/detect-smile', async (req, res) => {
    try {
        const imageUrl = req.body.image;

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'No image URL provided' });
        }

        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', null, {
            params: {
                api_key: API_KEY,
                api_secret: API_SECRET,
                image_url: imageUrl,
                return_attributes: 'smile'
            }
        });

        const smile = response.data.faces[0]?.attributes?.smile?.value;

        if (smile !== undefined) {
            const message = smile > 50 ? 'Such a beautiful smile!' : 'Try for a real smile 😊';
            res.json({ success: true, message });
        } else {
            res.json({ success: false, message: 'No smile detected' });
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Error processing the image' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
