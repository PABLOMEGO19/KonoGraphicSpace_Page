// Función para generar la página de un vídeo
async function generateVideoPage(videoData) {
    try {
        // Obtener el template de la página de vídeo
        const response = await fetch('Video_Trabajo_Template.html');
        let template = await response.text();
        
        // Crear un ID único para el vídeo si no existe
        const videoId = videoData.id || `video-${Date.now()}`;
        const youtubeId = videoData.youtubeId || '';
        
        // Crear el iframe de YouTube
        const youtubeEmbed = youtubeId ? `
        <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
            <iframe 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                src="https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>` : 
        '<p>No hay un vídeo disponible.</p>';
        
        // Reemplazar los placeholders en el template
        let html = template
            .replace('Mi video de presentación jeje', videoData.shortDescription || videoData.description || '')
            .replace('Un video hablando a cámara', videoData.title || 'Sin título')
            .replace('Edición de video', videoData.tag || 'Sin etiqueta')
            .replace('Una edición dinámica y moderna pensada para impactar desde el primer segundo', 
                    videoData.longDescription || videoData.description || '')
            // Reemplazar el reproductor de video por el de YouTube
            .replace(/<video[\s\S]*?<\/video>/, youtubeEmbed)
            // Actualizar imágenes
            .replace('img_video_charlando_1/imagen_1.png', videoData.images ? videoData.images[0] : `videos/${videoId}/imagen1.jpg`)
            .replace('img_video_charlando_1/imagen_2.png', videoData.images ? videoData.images[1] : `videos/${videoId}/imagen2.jpg`)
            .replace('<title>', `<title>${videoData.title || 'Video'} | Pablo García`);
        
        // Crear la ruta de destino
        const videoPagePath = `videos/${videoId}/index.html`;
        
        // Guardar la página generada (esto es un ejemplo, en producción necesitarías subirlo a Netlify)
        console.log('Página de vídeo generada:', videoPagePath);
        
        // En un entorno real, aquí subirías el archivo a Netlify o a tu servidor
        return {
            success: true,
            fileName: videoPagePath,  // Asegurarse de que fileName esté incluido
            pageUrl: `/${videoPagePath}`,
            videoId: videoId
        };
        
    } catch (error) {
        console.error('Error al generar la página del vídeo:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Función para manejar la subida de archivos al servidor (Netlify)
async function uploadVideoFiles(videoId, files) {
    // Esta función debería manejar la subida de archivos a Netlify
    // Por ahora, es solo un esqueleto
    console.log(`Subiendo archivos para el vídeo ${videoId}:`, files);
    return {
        success: true,
        videoUrl: `/videos/${videoId}/video.mp4`,
        images: [
            `/videos/${videoId}/imagen1.jpg`,
            `/videos/${videoId}/imagen2.jpg`
        ]
    };
}
