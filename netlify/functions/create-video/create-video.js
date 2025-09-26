const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

// Configuración del repositorio
const REPO_OWNER = 'PABLOMEGO19';
const REPO_NAME = 'KonoGraphicSpace_Page';
const BRANCH = 'main';

exports.handler = async function(event, context) {
    // Solo permitir métodos POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Obtener datos del cuerpo de la petición
        const videoData = JSON.parse(event.body);
        const videoId = videoData.id || `video-${Date.now()}`;
        const videoPath = `videos/${videoId}/index.html`;
        
        // Autenticación con GitHub
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        // 1. Obtener la referencia actual del branch
        const { data: refData } = await octokit.git.getRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: `heads/${BRANCH}`
        });

        // 2. Obtener el commit actual
        const { data: commitData } = await octokit.git.getCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            commit_sha: refData.object.sha
        });

        // 3. Crear el árbol con el nuevo archivo
        const { data: treeData } = await octokit.git.createTree({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            base_tree: commitData.tree.sha,
            tree: [
                {
                    path: videoPath,
                    mode: '100644',
                    type: 'blob',
                    content: generateVideoPageHTML(videoData)
                }
            ]
        });

        // 4. Crear un nuevo commit
        const { data: newCommit } = await octokit.git.createCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            message: `Añadir video: ${videoData.title || videoId}`,
            tree: treeData.sha,
            parents: [commitData.sha]
        });

        // 5. Actualizar la referencia del branch
        await octokit.git.updateRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: `heads/${BRANCH}`,
            sha: newCommit.sha,
            force: false
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Video creado exitosamente',
                videoUrl: `/${videoPath}`
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error al crear el video',
                details: error.message
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
