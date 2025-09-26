// Función para generar la página de un vídeo en la raíz del proyecto
async function generateVideoPage(videoData) {
    try {
        // Obtener el template de la página de vídeo
        const response = await fetch('Video_Trabajo_Template.html');
        let template = await response.text();
        
        // Crear un ID único para el vídeo si no existe
        const videoId = videoData.id || `video-${Date.now()}`;
        const youtubeId = videoData.youtubeId || '';
        const title = videoData.title || 'Video sin título';
        
        // Crear un nombre de archivo seguro a partir del título
        const safeTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
            
        const fileName = `${safeTitle}.html`;
        
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
            .replace('Un video hablando a cámara', title)
            .replace('Edición de video', videoData.tag || 'Sin etiqueta')
            .replace('Una edición dinámica y moderna pensada para impactar desde el primer segundo', 
                    videoData.longDescription || videoData.description || '')
            // Reemplazar el reproductor de video por el de YouTube
            .replace(/<video[\s\S]*?<\/video>/, youtubeEmbed)
            // Actualizar imágenes (si se proporcionan)
            .replace('img_video_charlando_1/imagen_1.png', videoData.images && videoData.images[0] ? videoData.images[0] : 'img_video_charlando_1/imagen_1.png')
            .replace('img_video_charlando_1/imagen_2.png', videoData.images && videoData.images[1] ? videoData.images[1] : 'img_video_charlando_1/imagen_2.png')
            .replace('<title>', `<title>${title} | Kono Graphic`);
        
        // Crear un elemento <a> para descargar el archivo
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return {
            success: true,
            fileName: fileName,
            videoId: videoId,
            title: title
        };
        
    } catch (error) {
        console.error('Error al generar la página del vídeo:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Función para manejar el envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const videoForm = document.getElementById('video-form');
    
    if (videoForm) {
        videoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar mensaje de carga
            const submitBtn = videoForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Creando página...';
            
            try {
                // Obtener los datos del formulario
                const formData = new FormData(videoForm);
                const videoData = {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    youtubeId: formData.get('youtubeId'),
                    tag: formData.get('tag'),
                    // Agregar más campos según sea necesario
                };
                
                // Generar la página del video
                const result = await generateVideoPage(videoData);
                
                if (result.success) {
                    alert(`Página de video creada: ${result.fileName}`);
                    // Opcional: redirigir a la página del video
                    // window.location.href = `/${result.fileName}`;
                } else {
                    throw new Error(result.error || 'Error desconocido al crear la página del video');
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert(`Error al crear la página: ${error.message}`);
            } finally {
                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
