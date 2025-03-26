const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Smile detection API is working!');
});

app.post('/detect-smile', async (req, res) => {
  console.log("📸 /detect-smile was called!");

  const image = req.body.image;

  if (!image) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }

  // Decide whether to use base64 or image_url
  const isBase64 = image.startsWith('data:image');
  const payload = {
    api_key: process.env.API_KEY || 'your-api-key',
    api_secret: process.env.API_SECRET || 'your-api-secret',
    return_attributes: 'smile'
  };

  if (isBase64) {
    console.log("📸 Using base64 image");
    payload.image_base64 = image.split(',')[1]; // strip the data:image/jpeg;base64,...
  } else if (image.startsWith('http')) {
    console.log("🌐 Using image URL");
    payload.image_url = image;
  } else {
    return res.status(400).json({ success: false, message: 'Invalid image format' });
  }

  try {
    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      new URLSearchParams(payload).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

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
