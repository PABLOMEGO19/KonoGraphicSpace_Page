<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Verificar si se subió un archivo
if (!isset($_FILES['thumbnail']) || $_FILES['thumbnail']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Error al subir la imagen']);
    exit;
}

// Verificar datos del código
$code = $_POST['code'] ?? '';
$imageName = $_POST['imageName'] ?? '';

if (empty($code) || empty($imageName)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

// Crear directorio si no existe
$uploadDir = 'img_mi_trabajo/img_miniaturas/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Verificar y mover el archivo subido
$imageFile = $_FILES['thumbnail'];
$imagePath = $uploadDir . $imageName;

if (!move_uploaded_file($imageFile['tmp_name'], $imagePath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar la imagen']);
    exit;
}

// Ruta al archivo Mi_Trabajo.html
$miTrabajoFile = 'Mi_Trabajo.html';

// Leer el contenido actual
if (!file_exists($miTrabajoFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Archivo Mi_Trabajo.html no encontrado']);
    exit;
}

$content = file_get_contents($miTrabajoFile);

// Buscar y reemplazar el comentario de inserción
$search = '<!-- Insertar Publicaciones aqui-->';
$replace = $code . "\n           <!-- Insertar Publicaciones aqui-->";

$newContent = str_replace($search, $replace, $content);

// Escribir el contenido modificado
if (file_put_contents($miTrabajoFile, $newContent) === false) {
    // Si hay error, eliminar la imagen subida
    unlink($imagePath);
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar Mi_Trabajo.html']);
    exit;
}

// Respuesta exitosa
echo json_encode([
    'success' => true,
    'message' => 'Video agregado exitosamente',
    'imageName' => $imageName,
    'imagePath' => $imagePath
]);
?>
