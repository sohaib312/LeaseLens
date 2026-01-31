'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface LeaseData {
  monthly_rent: string
  lease_term: string
  security_deposit: string
  termination_clause: string
  rent_escalation: string
}

interface AnalysisResult {
  success: boolean
  filename: string
  data: LeaseData
}

interface UploadComponentProps {
  onSuccess: (data: AnalysisResult) => void
  onError: (error: string) => void
  onLoadingChange: (loading: boolean) => void
  isLoading: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UploadComponent({
  onSuccess,
  onError,
  onLoadingChange,
  isLoading,
}: UploadComponentProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Please upload a PDF file'
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError(validationError)
      setUploadStatus('error')
      return
    }

    setSelectedFile(file)
    setUploadStatus('uploading')
    onLoadingChange(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed')
      }

      setUploadStatus('success')
      onSuccess(data)
    } catch (error) {
      setUploadStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      onError(errorMessage)
    } finally {
      onLoadingChange(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />
      case 'success':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />
      case 'error':
        return <XCircle className="h-12 w-12 text-destructive" />
      default:
        return <Upload className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="text-center">
            <p className="font-medium text-foreground">Analyzing lease document...</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a few seconds
            </p>
          </div>
        )
      case 'success':
        return (
          <div className="text-center">
            <p className="font-medium text-green-600">Analysis complete!</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedFile?.name}
            </p>
          </div>
        )
      case 'error':
        return (
          <div className="text-center">
            <p className="font-medium text-destructive">Upload failed</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetUpload()
              }}
              className="text-sm text-primary hover:underline mt-1"
            >
              Try again
            </button>
          </div>
        )
      default:
        return (
          <div className="text-center">
            <p className="font-medium text-foreground">
              Drop your lease PDF here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse files
            </p>
          </div>
        )
    }
  }

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          group relative cursor-pointer
          border-2 border-dashed rounded-xl p-12
          transition-all duration-200 ease-in-out
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
          }
          ${isLoading ? 'pointer-events-none opacity-75' : ''}
          ${uploadStatus === 'success' ? 'border-green-500/50 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-destructive/50 bg-destructive/5' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          {getStatusIcon()}
          {getStatusText()}

          {uploadStatus === 'idle' && (
            <div className="flex items-center gap-2 mt-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                PDF files up to 10MB
              </span>
            </div>
          )}
        </div>

        {/* Progress overlay */}
        {uploadStatus === 'uploading' && (
          <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm font-medium text-primary">
                Processing with AI...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File info */}
      {selectedFile && uploadStatus !== 'idle' && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{selectedFile.name}</span>
          <span className="text-muted-foreground/50">
            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>
      )}
    </div>
  )
}
