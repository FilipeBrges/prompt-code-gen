import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useProject } from '../contexts/ProjectContext'
import StepIndicator from '../components/StepIndicator'
import axios from 'axios'

const steps = [
  { id: 'upload', title: 'Upload', completed: false },
  { id: 'snippets', title: 'Snippets', completed: false },
  { id: 'practices', title: 'Práticas', completed: false },
  { id: 'preview', title: 'Preview', completed: false },
  { id: 'generation', title: 'Geração', completed: false },
]

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  
  const { setDocumentId } = useProject()
  const navigate = useNavigate()

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['.docx', '.pdf', '.md', '.txt']
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Tipo de arquivo não suportado. Use: ${allowedTypes.join(', ')}`)
      return
    }
    
    setFile(selectedFile)
    setError(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setDocumentId(response.data.document_id, file.name)
      setUploadComplete(true)
      
      // Navigate to next step after a short delay
      setTimeout(() => {
        navigate('/snippets')
      }, 1500)
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <StepIndicator steps={steps} currentStep="upload" />
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload do Documento
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Envie seu documento de requisitos para começar. Suportamos arquivos .docx, .pdf, .md e .txt.
          </p>
        </div>

        {!uploadComplete ? (
          <div className="card">
            {!file ? (
              <div
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200
                  ${dragActive
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">ou</p>
                <label
                  htmlFor="file-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  Selecionar Arquivo
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".docx,.pdf,.md,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Formatos suportados: DOCX, PDF, MD, TXT
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-primary-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => setFile(null)}
                    className="btn-secondary"
                    disabled={uploading}
                  >
                    Trocar Arquivo
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary flex items-center"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      'Fazer Upload'
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upload Concluído!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Seu documento foi processado com sucesso. Redirecionando para a próxima etapa...
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  )
}