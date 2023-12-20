const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(express.static('public'));

// app.get('/download', async (req, res) => {
//   try {
//     const videoUrl = req.query.videoUrl;
//     const audioFormat = req.query.audioFormat;

//     if (!ytdl.validateURL(videoUrl)) {
//       return res.status(400).send('Invalid YouTube video URL');
//     }

//     const info = await ytdl.getInfo(videoUrl);
//     const format = ytdl.chooseFormat(info.formats, { quality: audioFormat });

//     if (!format) {
//       return res.status(404).send('Audio format not available');
//     }
    
//     res.header('Content-Disposition', `attachment; filename="${info.title}.mp3"`);
//     ytdl(videoUrl, { format: format })
//       .pipe(res);

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.get('/download', async (req, res) => {
    try {
      const videoUrl = req.query.videoUrl;
      const audioFormat = req.query.audioFormat;
  
      if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).send('Invalid YouTube video URL');
      }
  
      const info = await ytdl.getInfo(videoUrl);
      
      // Log the video information to help with debugging
      console.log('Video Information:', info);
  
      const format = ytdl.chooseFormat(info.formats, { quality: audioFormat });
  
      if (!format) {
        return res.status(404).send('Audio format not available');
      }
  
      // Use the video title as the filename
      const filename = `${info.videoDetails.title.replace(/[^\w\s]/gi, '')}.mp3`;
      res.header('Content-Disposition', `attachment; filename="${filename}"`);
      
      ytdl(videoUrl, { format: format })
        .pipe(res);
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
