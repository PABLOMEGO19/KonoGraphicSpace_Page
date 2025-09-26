// Función para descargar un archivo
function downloadFile(filename, content, type = 'text/html') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para generar la página de un vídeo
async function generateVideoPage(videoData) {
    try {
        console.log('Enviando datos del video:', videoData);
        
        // Enviar los datos del video al servidor para crear la página
        const response = await fetch('/api/create-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(videoData)
        });

        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.error('Error del servidor:', errorData);
            } catch (e) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            throw new Error(errorData.error || errorData.message || 'Error al crear el video');
        }
        
        const result = await response.json();
        console.log('Video creado exitosamente:', result);
        
        // Mostrar mensaje de éxito con enlace al video
        if (result.success && result.siteUrl) {
            const message = `¡Video "${videoData.title || 'sin título'}" creado exitosamente!\n\n` +
                          `Puedes verlo en: ${result.siteUrl}\n` +
                          `Ver en GitHub: ${result.githubUrl}`;
            
            alert(message);
            
            // Redirigir al usuario a la página del video
            window.location.href = result.siteUrl;
            return true;
        } else {
            throw new Error('La respuesta del servidor no contiene la URL del video');
        }
        
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
        const folderPath = `videos/${videoId}`;
        
        // Verificar si estamos en un entorno que soporta File System Access API
        const supportsFileSystemAccess = 'showDirectoryPicker' in window;
        
        try {
            if (supportsFileSystemAccess) {
                // Intentar usar la API de File System Access
                const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
                let folderHandle;
                
                try {
                    folderHandle = await dirHandle.getDirectoryHandle(folderPath, { create: true });
                } catch (e) {
                    console.error('No se pudo crear la carpeta:', e);
                    throw new Error('No se pudo crear la carpeta. Asegúrate de tener los permisos necesarios.');
                }
                
                try {
                    const fileHandle = await folderHandle.getFileHandle('index.html', { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(html);
                    await writable.close();
                    console.log('Archivo guardado con éxito usando File System Access API');
                } catch (e) {
                    console.error('No se pudo guardar el archivo:', e);
                    throw new Error('No se pudo guardar el archivo. Asegúrate de tener los permisos necesarios.');
                }
            } else {
                // Usar descarga para navegadores que no soportan File System Access API
                console.log('Navegador no soporta File System Access API. Usando descarga...');
                downloadFile('index.html', html);
                
                // Crear un archivo de instrucciones
                const instructions = `INSTRUCCIONES PARA GUARDAR EL ARCHIVO:

1. Crea una carpeta llamada "${folderPath}" en la raíz de tu proyecto.
2. Guarda el archivo "index.html" que acabas de descargar dentro de esa carpeta.
3. Asegúrate de que la estructura de carpetas sea:
   - tu-proyecto/
     - videos/
       - ${videoId}/
         - index.html

¡Listo! La página de tu video estará disponible en: /${videoPagePath}`;
                
                downloadFile('instrucciones.txt', instructions, 'text/plain');
                
                return {
                    success: true,
                    fileName: videoPagePath,
                    pageUrl: `/${videoPagePath}`,
                    videoId: videoId,
                    warning: 'Se ha descargado el archivo. Sigue las instrucciones en el archivo de texto para completar la instalación.'
                };
            }
            
            console.log('Página de vídeo generada:', videoPagePath);
            
            // Mostrar mensaje de éxito con enlace al video
            const result = await response.json();
            alert(`¡Video "${videoData.title}" creado exitosamente!`);
            
            // Redirigir a la página del video
            window.location.href = result.videoUrl;
            return true;
            
        } catch (error) {
            console.error('Error al crear el video:', error);
            alert('Error al crear el video: ' + error.message);
            return false;
        }
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
