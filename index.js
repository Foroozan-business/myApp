const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual Face++ credentials
const API_KEY = process.env.API_KEY || 'your-api-key';
const API_SECRET = process.env.API_SECRET || 'your-api-secret';

app.use(express.json({ limit: '10mb' }));
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
    // 🔧 HARDCODED BASE64 IMAGE FOR TESTING
    const base64Data =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUVFRUVFRUVFRUVFRUVFRUXFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAIDBQYBB//EADgQAAIBAgQCCAUDBwUBAAAAAAABAgMRBBIhMQVBUWEGEzKRobHBIzJCUpHR4fAUYnKisuHwJDRTY3OCkqL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAlEQEBAQEAAgICAgMBAAAAAAAAAQIRAyExBBJBUWEicYETFGH/2gAMAwEAAhEDEQA/AOaKUUooorB//2Q==';

    const imageBase64 = base64Data.split(',')[1];

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      null,
      {
        params: {
          api_key: API_KEY,
          api_secret: API_SECRET,
          image_base64: imageBase64
          // ❌ return_attributes: 'smile' — removed for now
        },
      }
    );

    // Face++ still returns face data, just without smile score
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
