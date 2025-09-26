const fs = require('fs');
const path = require('path');

// Rutas importantes
const videosPath = path.join(__dirname, '../src/data/videos.json');
const templatePath = path.join(__dirname, '../Video_Trabajo_Template.html');
const publicPath = path.join(__dirname, '../public');

// Función para crear directorios si no existen
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Función para copiar el template y personalizarlo
function createVideoPage(videoData) {
  try {
    // Leer el template
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Crear la ruta de destino
    const videoPagePath = path.join(publicPath, 'videos', videoData.id, 'index.html');
    ensureDirectoryExistence(videoPagePath);
    
    // Reemplazar los placeholders en el template
    let html = template
      .replace('Mi video de presentación jeje', videoData.shortDescription || '')
      .replace('Un video hablando a cámara', videoData.title || '')
      .replace('Edición de video', videoData.tag || 'Sin etiqueta')
      .replace('Una edición dinámica y moderna pensada para impactar desde el primer segundo', 
               videoData.longDescription || '')
      .replace('img_video_charlando_1/imagen_1.png', `videos/${videoData.id}/imagen1.jpg`)
      .replace('img_video_charlando_1/imagen_2.png', `videos/${videoData.id}/imagen2.jpg`)
      .replace('<title>', `<title>${videoData.title} | Pablo García`);
    
    // Guardar la página generada
    fs.writeFileSync(videoPagePath, html);
    console.log(`Página del vídeo creada en: ${videoPagePath}`);
    return true;
    
  } catch (error) {
    console.error('Error al crear la página del vídeo:', error.message);
    return false;
  }
}

// Función principal para añadir un nuevo vídeo
function addNewVideo(videoData) {
  try {
    // Validar datos requeridos
    if (!videoData.id || !videoData.title) {
      throw new Error('Se requieren ID y título del vídeo');
    }
    
    // Leer el archivo actual de vídeos
    const data = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
    
    // Verificar si el video ya existe
    const videoExists = data.videos.some(v => v.id === videoData.id);
    if (videoExists) {
      throw new Error('Ya existe un video con este ID');
    }
    
    // Crear el objeto del video
    const video = {
      id: videoData.id,
      title: videoData.title,
      shortDescription: videoData.shortDescription || '',
      longDescription: videoData.longDescription || '',
      tag: videoData.tag || 'Sin etiqueta',
      videoUrl: `/videos/${videoData.id}/video.mp4`,
      images: [
        `/videos/${videoData.id}/imagen1.jpg`,
        `/videos/${videoData.id}/imagen2.jpg`
      ],
      date: new Date().toISOString().split('T')[0]
    };
    
    // Añadir el nuevo video al array
    data.videos.push(video);
    
    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(videosPath, JSON.stringify(data, null, 2));
    
    // Crear la página HTML del vídeo
    createVideoPage(video);
    
    console.log('✅ Vídeo añadido correctamente y página generada');
    return true;
    
  } catch (error) {
    console.error('❌ Error al añadir el vídeo:', error.message);
    return false;
  }
}

// Ejemplo de uso:
/*
addNewVideo({
  id: 'mi-nuevo-video',
  title: 'Título del Vídeo',
  shortDescription: 'Descripción corta que aparecerá debajo del título',
  longDescription: 'Esta es la descripción larga que aparecerá en la página del vídeo.\nPuede contener múltiples líneas.',
  tag: 'Edición de video'
});
*/

module.exports = { 
  addNewVideo,
  createVideoPage
};
