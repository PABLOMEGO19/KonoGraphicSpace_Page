const fs = require('fs');
const path = require('path');

// Cargar el template HTML
const templatePath = path.join(__dirname, '..', '..', 'Video_Trabajo_Template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Cargar los datos de los vídeos
const videosData = require('./videos.json');

exports.handler = async (event, context) => {
  try {
    // Extraer el ID del vídeo de la URL
    const videoId = event.path.split('/').pop();
    
    // Buscar el vídeo en los datos
    const video = videosData.videos.find(v => v.id === videoId);
    
    if (!video) {
      return {
        statusCode: 404,
        body: 'Vídeo no encontrado'
      };
    }
    
    // Reemplazar los placeholders en el template
    let html = template
      .replace('id="video-heading"', `id="video-heading">${video.title}`)
      .replace('id="video-description"', `id="video-description">${video.description}`)
      .replace('src="video.mp4"', `src="${video.videoUrl}"`)
      .replace('id="video-image-1"', `id="video-image-1" src="${video.images[0]}"`)
      .replace('id="video-image-2"', `id="video-image-2" src="${video.images[1]}"`)
      .replace('<title>', `<title>${video.title} | Mi Sitio de Vídeos`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: html
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error al cargar el vídeo'
    };
  }
};
