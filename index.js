app.post('/detect-smile', async (req, res) => {
  try {
    const base64Data = req.body.image;

    if (!base64Data || !base64Data.startsWith('data:image')) {
      return res.status(400).json({ success: false, message: 'No valid base64 image provided' });
    }

    const imageBase64 = base64Data.split(',')[1];

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      null,
      {
        params: {
          api_key: API_KEY,
          api_secret: API_SECRET,
          image_base64: imageBase64
        }
      }
    );

    const faceCount = response.data.faces?.length;

    if (faceCount && faceCount > 0) {
      res.json({ success: true, message: `Face detected! (${faceCount})` });
    } else {
      res.json({ success: false, message: 'No face detected' });
    }

  } catch (error) {
    console.error('Error during smile detection:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error processing the image',
      debug: error.response?.data || error.message
    });
  }
});
