export function replaceURLWithHTMLLinks(text) {
    if (!text) {
        return ''; // Devuelve una cadena vacía o maneja de otra manera el caso undefined
    }

    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text?.replace(exp, "<a href='$1' target='_blank' class='text-blue-400 hover:text-blue-600 transition duration-100'>$1</a>");
}
export function replaceURLWithHTMLLinksAndTags(text) {
    if (!text) {
        return ''; // Devuelve una cadena vacía o maneja de otra manera el caso undefined
    }

    // Función para reemplazar URLs con enlaces HTML
    function replaceURLs(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        return text.replace(exp, "<a href='$1' target='_blank' class='text-blue-400 hover:text-blue-600 transition duration-100'>$1</a>");
    }

    // Función para reemplazar tags y nombres de usuario con enlaces HTML
    function replaceTagsAndUsernames(text) {
        if (!text) {
            return ''; // Devuelve una cadena vacía o maneja de otra manera el caso undefined
        }
    
        // Reemplazar tags, incluyendo #
        text = text.replace(/([#＃])([\w]+)/gi, "<a href='/search?page=0&search=%23$2' class='text-blue-400 hover:text-blue-600 transition duration-100'>$1$2</a>");
        // Reemplazar nombres de usuario, incluyendo @
        text = text.replace(/([@])([\w]+)/gi, "<a href='/$2' class='text-blue-400 hover:text-blue-600 transition duration-100'>$1$2</a>");
        return text;
    }

    // Primero reemplazar URLs, luego tags y nombres de usuario
    return replaceTagsAndUsernames(replaceURLs(text));
}
