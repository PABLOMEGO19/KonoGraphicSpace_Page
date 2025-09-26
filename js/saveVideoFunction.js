// Función para guardar un video
async function saveVideo() {
    try {
        const title = document.getElementById('video-title').value;
        const description = document.getElementById('video-description').value;
        const youtubeUrl = document.getElementById('video-youtube').value;
        const tags = document.getElementById('video-tags').value.split(',').map(tag => tag.trim());
        const isPublic = document.querySelector('input[name="visibility"]:checked').value === 'public';
        const shortDescription = document.getElementById('video-short-description')?.value || '';
        
        // Extraer el ID del vídeo de YouTube
        let youtubeId = '';
        try {
            const url = new URL(youtubeUrl);
            if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
                if (url.hostname.includes('youtube.com')) {
                    youtubeId = url.searchParams.get('v');
                } else if (url.hostname.includes('youtu.be')) {
                    youtubeId = url.pathname.split('/').pop();
                }
            }
        } catch (e) {
            console.error('Error al procesar la URL de YouTube:', e);
            showNotification('Por favor, introduce una URL de YouTube válida', 'error');
            return;
        }
        
        // Si no se pudo extraer el ID, mostrar error
        if (!youtubeId) {
            showNotification('Por favor, introduce una URL de YouTube válida', 'error');
            return;
        }
        
        // Generar URL de miniatura de YouTube
        const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        
        // Crear un ID único para el vídeo basado en el título
        const videoId = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const videoData = {
            id: videoId,
            title,
            description,
            shortDescription,
            longDescription: description,
            tag: tags[0] || 'Sin etiqueta',
            youtubeUrl,
            youtubeId,
            thumbnail: thumbnailUrl,
            tags: [...new Set(tags)], // Eliminar duplicados
            isPublic: isPublic,
            createdAt: new Date().toISOString(),
            images: [thumbnailUrl, `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`]
        };

        // Generar la página del vídeo
        const pageResult = await generateVideoPage(videoData);
        
        if (pageResult && pageResult.success) {
            // Si la página se generó correctamente, actualizamos la URL
            videoData.pageUrl = pageResult.fileName;
            
            // Agregar o actualizar el video en la lista
            const existingIndex = window.videos.findIndex(v => v.id === videoId);
            if (existingIndex === -1) {
                window.videos.push(videoData);
            } else {
                window.videos[existingIndex] = videoData;
            }
            
            // Guardar y actualizar la vista
            saveVideos();
            renderVideos();
            
            // Limpiar el formulario
            document.getElementById('video-form').reset();
            showNotification('Vídeo guardado y página generada correctamente', 'success');
        } else {
            throw new Error(pageResult?.error || 'Error desconocido al generar la página');
        }
    } catch (error) {
        console.error('Error al guardar el vídeo:', error);
        showNotification(`Error al guardar el vídeo: ${error.message}`, 'error');
    }
}

// Hacer la función accesible globalmente
window.saveVideo = saveVideo;
