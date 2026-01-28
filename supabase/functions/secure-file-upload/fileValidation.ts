
export function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      extensions: ['.xlsx'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0x50, 0x4B, 0x03, 0x04]]
    },
    'application/vnd.ms-excel': {
      extensions: ['.xls'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0xD0, 0xCF, 0x11, 0xE0]]
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      extensions: ['.docx'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0x50, 0x4B, 0x03, 0x04]]
    },
    'application/msword': {
      extensions: ['.doc'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0xD0, 0xCF, 0x11, 0xE0]]
    },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      extensions: ['.pptx'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0x50, 0x4B, 0x03, 0x04]]
    },
    'application/vnd.ms-powerpoint': {
      extensions: ['.ppt'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0xD0, 0xCF, 0x11, 0xE0]]
    },
    'application/pdf': {
      extensions: ['.pdf'],
      maxSize: 20 * 1024 * 1024,
      magicNumbers: [[0x25, 0x50, 0x44, 0x46]]
    },
    'text/plain': {
      extensions: ['.txt'],
      maxSize: 5 * 1024 * 1024,
      magicNumbers: []
    },
    'text/csv': {
      extensions: ['.csv'],
      maxSize: 10 * 1024 * 1024,
      magicNumbers: []
    },
    'image/jpeg': {
      extensions: ['.jpg', '.jpeg'],
      maxSize: 10 * 1024 * 1024,
      magicNumbers: [[0xFF, 0xD8, 0xFF]]
    },
    'image/png': {
      extensions: ['.png'],
      maxSize: 10 * 1024 * 1024,
      magicNumbers: [[0x89, 0x50, 0x4E, 0x47]]
    },
    'image/gif': {
      extensions: ['.gif'],
      maxSize: 10 * 1024 * 1024,
      magicNumbers: [[0x47, 0x49, 0x46]]
    },
    'image/webp': {
      extensions: ['.webp'],
      maxSize: 10 * 1024 * 1024,
      magicNumbers: [[0x52, 0x49, 0x46, 0x46]]
    }
  }

  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jse',
    '.wsf', '.wsh', '.msi', '.msp', '.dll', '.app', '.deb', '.dmg', '.pkg',
    '.rpm', '.php', '.jsp', '.asp', '.aspx', '.cgi', '.pl', '.py', '.rb', '.sh'
  ]

  const fileName = file.name.toLowerCase()
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: 'File type not allowed for security reasons' }
  }
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' }
  }
  if (file.size > 25 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds maximum limit of 25MB' }
  }
  const fileType = allowedTypes[file.type as keyof typeof allowedTypes]
  if (!fileType) {
    return { valid: false, error: `File type ${file.type} is not allowed. Allowed types: PDF, Word, Excel, PowerPoint, text files, and images` }
  }
  if (file.size > fileType.maxSize) {
    return { valid: false, error: `File size exceeds maximum limit for ${file.type}` }
  }
  if (!fileType.extensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: `File extension does not match allowed extensions: ${fileType.extensions.join(', ')}` }
  }
  const extensionCount = (fileName.match(/\./g) || []).length
  if (extensionCount > 1) {
    return { valid: false, error: 'Files with multiple extensions are not allowed' }
  }
  return { valid: true }
}

export function sanitizeFilename(filename: string): string {
  let sanitized = filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^\w\-_.]/g, '')
    .replace(/_{2,}/g, '_')
    .substring(0, 100)
  if (sanitized.startsWith('.') || sanitized.startsWith('-')) {
    sanitized = 'file_' + sanitized
  }
  sanitized = sanitized
    .replace(/\.\./g, '_')
    .replace(/null/gi, '_')
    .replace(/con|prn|aux|nul|com[1-9]|lpt[1-9]/gi, 'file_')
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const lastDotIndex = sanitized.lastIndexOf('.')
  if (lastDotIndex > 0) {
    const name = sanitized.substring(0, lastDotIndex)
    const extension = sanitized.substring(lastDotIndex)
    sanitized = `${name}_${timestamp}_${randomStr}${extension}`
  } else {
    sanitized = `${sanitized}_${timestamp}_${randomStr}`
  }
  return sanitized
}
