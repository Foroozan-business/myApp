const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Root test route
app.get('/', (req, res) => {
  res.send('Smile detection API is working!');
});

// POST endpoint for smile detection
app.post('/detect-smile', async (req, res) => {
  console.log("📸 /detect-smile was called!");

  try {
    const base64Data = req.body.image;

    if (!base64Data || !base64Data.startsWith('data:image')) {
      return res.status(400).json({ success: false, message: 'No valid base64 image provided' });
    }

    const imageBase64 = base64Data.split(',')[1]; // remove data:image/jpeg;base64,...

    const response = await axios({
      method: 'post',
      url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        api_key: process.env.API_KEY || 'your-api-key',
        api_secret: process.env.API_SECRET || 'your-api-secret',
        image_base64: imageBase64,
        return_attributes: 'smiling' // ✅ CORRECTED HERE
      }).toString()
    });

    const smileValue = response.data.faces?.[0]?.attributes?.smile?.value;

    if (smileValue !== undefined) {
      const message = smileValue > 50
        ? 'Such a beautiful smile! 😄'
        : 'Try for a real smile 😊';
      res.json({ success: true, message });
    } else {
      res.json({ success: false, message: 'No smile detected' });
    }

  } catch (error) {
    console.error('❌ Error during smile detection:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error processing the image',
      debug: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
