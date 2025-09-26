const { Octokit } = require('@octokit/rest');

// Configuración del repositorio
const REPO_OWNER = 'PABLOMEGO19';
const REPO_NAME = 'KonoGraphicSpace_Page';
const BRANCH = 'main';
const COMMITTER = {
    name: 'KonoGraphic Bot',
    email: 'bot@konographic.space'
};

// Configuración de CORS
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async function(event, context) {
    // Manejar solicitud OPTIONS para CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers,
            body: ''
        };
    }
    
    // Solo permitir métodos POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Obtener datos del cuerpo de la petición
        const videoData = JSON.parse(event.body);
        const videoId = videoData.id || `video-${Date.now()}`;
        const videoPath = `videos/${videoId}/index.html`;
        
        // Autenticación con GitHub usando token de acceso personal
        if (!process.env.GITHUB_TOKEN) {
            throw new Error('Token de GitHub no configurado. Por favor, configura la variable de entorno GITHUB_TOKEN.');
        }

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
            userAgent: 'KonoGraphicSpace-Page/1.0.0',
            timeZone: 'Europe/Madrid'
        });

        // 1. Obtener la referencia actual del branch
        const { data: ref } = await octokit.git.getRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: `heads/${BRANCH}`
        });

        // 2. Obtener el commit actual
        const { data: currentCommit } = await octokit.git.getCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            commit_sha: ref.object.sha
        });

        // 3. Crear el blob con el contenido del archivo
        const fileContent = generateVideoPageHTML(videoData);
        const { data: blob } = await octokit.git.createBlob({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            content: fileContent,
            encoding: 'utf-8'
        });

        // 4. Crear un nuevo árbol con el archivo
        const { data: tree } = await octokit.git.createTree({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            base_tree: currentCommit.tree.sha,
            tree: [{
                path: videoPath,
                mode: '100644',
                type: 'blob',
                sha: blob.sha
            }]
        });

        // 5. Crear un nuevo commit
        const { data: newCommit } = await octokit.git.createCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            message: `Añadir video: ${videoData.title || videoId}`,
            tree: tree.sha,
            parents: [currentCommit.sha],
            author: COMMITTER,
            committer: COMMITTER
        });

        // 6. Actualizar la referencia del branch
        await octokit.git.updateRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: `heads/${BRANCH}`,
            sha: newCommit.sha
        });

        // Obtener la URL del archivo en GitHub
        const githubFileUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${videoPath}`;
        const siteUrl = `https://${REPO_NAME}.netlify.app/${videoPath}`;
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify({
                success: true,
                message: 'Video creado exitosamente',
                videoUrl: `/${videoPath}`,
                githubUrl: githubFileUrl,
                siteUrl: siteUrl,
                videoId: videoId
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify({
                success: false,
                error: 'Error al crear el video',
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};

// Función para generar el HTML de la página del video
function generateVideoPageHTML(videoData) {
    const youtubeId = videoData.youtubeId || '';
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

    return `<!DOCTYPE html>
<html data-site="konographic.space" lang="es">
<head>
    <meta charset="utf-8"/>
    <title>${videoData.title || 'Video'} | Kono Graphic</title>
    <meta name="description" content="${videoData.description || 'Video de Kono Graphic'}"/>
    <meta property="og:title" content="${videoData.title || 'Video'} | Kono Graphic"/>
    <meta property="og:description" content="${videoData.description || 'Video de Kono Graphic'}"/>
    <meta property="og:image" content="${videoData.thumbnail || 'https://raw.githubusercontent.com/PABLOMEGO19/ImagesPagina/main/Sin-t%C3%ADtulo-1.jpg'}"/>
    <meta property="og:type" content="website"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="/css/estilos.css" type="text/css"/>
</head>
<body>
    <header>
        <!-- Aquí va tu encabezado común -->
    </header>

    <main>
        <h1>${videoData.title || 'Video'}</h1>
        ${youtubeEmbed}
        <div class="video-description">
            <p>${videoData.description || ''}</p>
        </div>
    </main>

    <footer>
        <!-- Aquí va tu pie de página común -->
    </footer>
</body>
</html>`;
}
