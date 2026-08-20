import { useState, useRef, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { uploadResumeRequest } from '../api/endpoints/resume.api'
import { isValidResumeFile } from '../utils/fileValidation'
import { useAuth } from '../context/AuthContext'

const LAST_UPLOAD_KEY = 'last_resume_upload'

const Resume = () => {
  const { user } = useAuth()
  const userId = user?.id

  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(LAST_UPLOAD_KEY)
    if (saved) {
      try {
        setResult(JSON.parse(saved))
      } catch {
        localStorage.removeItem(LAST_UPLOAD_KEY)
      }
    }
  }, [])

  const resetState = () => {
    setError('')
    setResult(null)
    setUploadProgress(0)
  }

  const handleFileSelect = (file) => {
    resetState()

    if (!isValidResumeFile(file)) {
      setError('Only PDF and DOCX files are supported.')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError('')
    setResult(null)

    try {
      const response = await uploadResumeRequest(
        selectedFile,
        userId,
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          setUploadProgress(percent)
        },
      )

      setResult(response.data)
      localStorage.setItem(LAST_UPLOAD_KEY, JSON.stringify(response.data))
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        'Upload failed. Please try again.'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    resetState()
    localStorage.removeItem(LAST_UPLOAD_KEY)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Resume</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload your resume in PDF or DOCX format — this powers AI Resume Analysis,
          Career Recommendations, and more.
        </p>
      </div>

      <Card>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-indigo-50'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleInputChange}
            className="hidden"
          />

          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>

          <p className="mt-3 text-sm font-medium text-gray-700">
            Drag and drop your resume here, or{' '}
            <span className="text-primary font-semibold">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Supports PDF and DOCX up to 10MB
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <svg
                className="h-5 w-5 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <span className="text-sm text-gray-700 truncate">
                {selectedFile.name}
              </span>
            </div>

            {!isUploading && (
              <button
                onClick={handleRemoveFile}
                className="text-xs text-gray-400 hover:text-red-600 shrink-0 ml-3"
              >
                Remove
              </button>
            )}
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Spinner size="sm" />
              <span className="text-xs text-gray-500">
                Uploading... {uploadProgress}%
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </div>
      </Card>

      {result && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Upload Successful
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Head to the Dashboard to run AI Resume Analysis.
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-xs text-gray-400 hover:text-red-600 shrink-0"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Message</span>
              <span className="text-gray-800 font-medium">
                {result.message}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Resume ID</span>
              <span className="text-gray-800 font-medium">
                {result.resume_id}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Characters Extracted</span>
              <span className="text-gray-800 font-medium">
                {result.characters_extracted}
              </span>
            </div>

            <div>
              <span className="text-gray-500 block mb-2">Preview</span>
              <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 leading-relaxed">
                {result.preview}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Resume