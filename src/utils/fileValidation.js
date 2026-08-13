const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]

const ALLOWED_EXTENSIONS = ['.pdf', '.docx']

export const isValidResumeFile = (file) => {
  if (!file) return false

  const hasValidType = ALLOWED_TYPES.includes(file.type)
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  )

  return hasValidType || hasValidExtension
}