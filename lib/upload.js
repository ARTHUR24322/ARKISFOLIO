/**
 * Validates a file for upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {string|null} - Error message if invalid, null otherwise
 */
export function validateFile(file, options = {}) {
    if (!file || typeof file === 'string') return null;

    const {
        maxSizeMB = 150,
        allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4']
    } = options;

    // Check size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
        return `Fichier trop volumineux. Maximum autorisé: ${maxSizeMB}Mo.`;
    }

    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        return `Extension non autorisée. Autorisé: ${allowedExtensions.join(', ')}.`;
    }

    return null;
}
