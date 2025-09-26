// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.maxWidth = '300px';
    notification.style.wordBreak = 'break-word';
    
    // Establecer el color según el tipo de notificación
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50'; // Verde
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336'; // Rojo
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800'; // Naranja
            break;
        default: // info
            notification.style.backgroundColor = '#2196F3'; // Azul
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Hacer que la notificación desaparezca después de 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Eliminar el elemento después de la animación
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Función para guardar un video
async function saveVideo() {
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
    loadingMessage.textContent = 'Guardando video, por favor espera...';
    document.body.appendChild(loadingMessage);
    
    try {
        // Obtener los datos del formulario
        const title = document.getElementById('video-title').value || 'Video sin título';
        const description = document.getElementById('video-description').value || '';
        const youtubeUrl = document.getElementById('video-youtube').value || '';
        const tags = (document.getElementById('video-tags')?.value || '').split(',').map(tag => tag.trim());
        const isPublic = document.querySelector('input[name="visibility"]:checked')?.value === 'public';
        const shortDescription = document.getElementById('video-short-description')?.value || '';
        
        // Extraer el ID del vídeo de YouTube (si existe)
        let youtubeId = '';
        if (youtubeUrl) {
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
                console.warn('No se pudo procesar la URL de YouTube:', e);
            }
        }
        
        // Generar URL de miniatura de YouTube (si hay un ID)
        const thumbnailUrl = youtubeId ? 
            `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : 
            'https://via.placeholder.com/1280x720?text=Sin+miniatura';
        
        // Crear un ID único para el vídeo
        const videoId = `video-${Date.now()}`;

        // Crear el objeto con los datos del video
        const videoData = {
            id: videoId,
            title,
            description,
            shortDescription,
            youtubeId,
            youtubeUrl,
            thumbnailUrl,
            videoUrl: youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : '',
            tags,
            isPublic,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Generar el contenido HTML
        const htmlContent = `
        <!DOCTYPE html>
        <html data-site="konographic.space" lang="es">
        <head>
            <meta charset="utf-8"/>
            <title>${title} | Kono Graphic | Video Creativo y Edición</title>
            <meta name="description" content="${description.replace(/"/g, '&quot;') || 'Video creado con Kono Graphic'}"/>
            <meta property="og:title" content="${title.replace(/"/g, '&quot;')} | Kono Graphic"/>
            <meta property="og:description" content="${description.replace(/"/g, '&quot;') || 'Video creado con Kono Graphic'}"/>
            <meta property="og:image" content="${thumbnailUrl}"/>
            <meta property="og:type" content="video.other"/>
            <meta name="twitter:card" content="player"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .video-container {
                    max-width: 1000px;
                    width: 100%;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .video-wrapper {
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
                    height: 0;
                    overflow: hidden;
                    background: #000;
                }
                .video-wrapper iframe,
                .video-wrapper video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 0;
                }
                .video-info {
                    padding: 20px;
                }
                .video-title {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 24px;
                }
                .video-description {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    white-space: pre-line;
                }
                .video-meta {
                    color: #888;
                    font-size: 14px;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                }
                .watermark {
                    text-align: center;
                    padding: 10px;
                    color: #999;
                    font-size: 14px;
                    background: #f9f9f9;
                }
                @media (max-width: 768px) {
                    .video-info {
                        padding: 15px;
                    }
                    .video-title {
                        font-size: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="video-container">
                <div class="video-wrapper">
                    ${youtubeId ? 
                        `<iframe 
                            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>` :
                        `<video controls autoplay>
                            <source src="" type="video/mp4">
                            Tu navegador no soporta la reproducción de videos.
                        </video>`
                    }
                </div>
                <div class="video-info">
                    <h1 class="video-title">${title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
                    ${description ? `<div class="video-description">${description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : ''}
                    <div class="video-meta">
                        <div>Publicado el: ${new Date().toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</div>
                        ${tags.length > 0 ? 
                            `<div>Etiquetas: ${tags.map(tag => `#${tag.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`).join(', ')}</div>` : ''
                        }
                    </div>
                </div>
                <div class="watermark">
                    Creado con Kono Graphic - <a href="https://konographic.space" target="_blank">konographic.space</a>
                </div>
            </div>
        </body>
        </html>
        `;
        
        // Crear un nombre de archivo seguro
        const safeTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
            
        const fileName = `video-${safeTitle || videoId}.html`;
        
        // Crear y descargar el archivo
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Actualizar el mensaje de éxito
            loadingMessage.textContent = '¡Video guardado exitosamente! Se ha descargado el archivo.';
            loadingMessage.style.backgroundColor = '#4CAF50';
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                document.body.removeChild(loadingMessage);
                // Limpiar el formulario
                const form = document.getElementById('video-form');
                if (form) form.reset();
                // Redirigir al admin
                window.location.href = 'admin.html';
            }, 2000);
            
        }, 100);
        
    } catch (error) {
        console.error('Error al guardar el video:', error);
        // Actualizar el mensaje de error
        if (document.body.contains(loadingMessage)) {
            loadingMessage.textContent = `Error: ${error.message || 'Error desconocido al guardar el video'}`;
            loadingMessage.style.backgroundColor = '#f44336';
            
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                if (document.body.contains(loadingMessage)) {
                    document.body.removeChild(loadingMessage);
                }
            }, 5000);
        } else {
            // Si no se pudo mostrar el mensaje de carga, mostrar notificación
            showNotification(`Error: ${error.message || 'Error al guardar el video'}`, 'error');
        }
    }
}

// Hacer la función accesible globalmente
window.saveVideo = saveVideo;
