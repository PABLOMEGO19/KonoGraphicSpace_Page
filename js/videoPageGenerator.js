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
        console.log('Generando página de video localmente:', videoData);
        
        // Mostrar mensaje de carga
        const loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '20px';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translateX(-50%)';
        loadingMessage.style.backgroundColor = '#4CAF50';
        loadingMessage.style.color = 'white';
        loadingMessage.style.padding = '15px';
        loadingMessage.style.borderRadius = '5px';
        loadingMessage.style.zIndex = '1000';
        loadingMessage.textContent = 'Generando video, por favor espera...';
        document.body.appendChild(loadingMessage);
        
        try {
            // Generar el HTML del video
            const videoId = videoData.id || `video-${Date.now()}`;
            const fileName = `video-${videoId}.html`;
            const htmlContent = generateVideoHTML(videoData);
            
            // Crear un enlace de descarga
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Crear un enlace temporal y simular clic para descargar
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                // Mostrar mensaje de éxito
                loadingMessage.textContent = '¡Video generado exitosamente! Se ha descargado el archivo.';
                loadingMessage.style.backgroundColor = '#4CAF50';
                
                // Ocultar el mensaje después de 5 segundos
                setTimeout(() => {
                    document.body.removeChild(loadingMessage);
                }, 5000);
                
            }, 100);
            
            return true;
            
        } catch (error) {
            console.error('Error al generar el video:', error);
            loadingMessage.textContent = `Error: ${error.message || 'Error desconocido al generar el video'}`;
            loadingMessage.style.backgroundColor = '#f44336';
            
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                if (document.body.contains(loadingMessage)) {
                    document.body.removeChild(loadingMessage);
                }
            }, 5000);
            
            throw error;
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

// Función para generar el HTML del video
function generateVideoHTML(videoData) {
    const { title = 'Video sin título', description = '', videoUrl = '' } = videoData;
    
    return `
    <!DOCTYPE html>
    <html data-site="konographic.space" lang="es">
    <head>
        <meta charset="utf-8"/>
        <title>${title} | Kono Graphic | Video Creativo y Edición</title>
        <meta name="description" content="${description || 'Video creado con Kono Graphic'}"/>
        <meta property="og:title" content="${title} | Kono Graphic"/>
        <meta property="og:description" content="${description || 'Video creado con Kono Graphic'}"/>
        <meta property="og:type" content="video.other"/>
        <meta name="twitter:card" content="player"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .video-container {
                max-width: 800px;
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
            .video-wrapper {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
                height: 0;
                overflow: hidden;
                background: #000;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .video-wrapper video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
            }
            .video-info {
                margin-top: 20px;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .video-title {
                margin: 0 0 10px 0;
                color: #333;
            }
            .video-description {
                color: #666;
                line-height: 1.5;
            }
            .watermark {
                text-align: center;
                margin-top: 20px;
                color: #999;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="video-container">
            <div class="video-wrapper">
                <video controls autoplay>
                    <source src="${videoUrl}" type="video/mp4">
                    Tu navegador no soporta la reproducción de videos.
                </video>
            </div>
            <div class="video-info">
                <h1 class="video-title">${title}</h1>
                ${description ? `<p class="video-description">${description}</p>` : ''}
            </div>
            <div class="watermark">
                Creado con Kono Graphic - <a href="https://konographic.space" target="_blank">konographic.space</a>
            </div>
        </div>
    </body>
    </html>
    `;
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
