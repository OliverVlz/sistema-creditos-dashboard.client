const uploadedFilesRegistry = new Map<string, File>()

export const setUploadedFile = (documentId: string, file: File) => {
  uploadedFilesRegistry.set(documentId, file)
}

export const getUploadedFile = (documentId: string) => {
  return uploadedFilesRegistry.get(documentId)
}

export const removeUploadedFile = (documentId: string) => {
  uploadedFilesRegistry.delete(documentId)
}

export const clearUploadedFilesRegistry = () => {
  uploadedFilesRegistry.clear()
}
