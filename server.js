const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Folder to store text files
const folderPath = path.join(__dirname, 'files');

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Endpoint to create a text file with current timestamp
app.post('/create-file', (req, res) => {
  const timestamp = new Date().toISOString();
  const fileName = `${timestamp}.txt`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFile(filePath, timestamp, (err) => {
    if (err) {
      console.error('Error creating file:', err);
      return res.status(500).json({ message: 'Failed to create file' });
    }
    res.status(201).json({ message: 'File created', fileName });
  });
});

// Endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ message: 'Failed to read directory' });
    }
    const textFiles = files.filter(file => file.endsWith('.txt'));
    res.status(200).json({ files: textFiles });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
