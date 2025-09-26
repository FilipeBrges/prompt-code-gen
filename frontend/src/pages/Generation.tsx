import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Code, CheckCircle, ArrowLeft, File, RotateCcw } from 'lucide-react'
import { useProject } from '../contexts/ProjectContext'
import StepIndicator from '../components/StepIndicator'
import axios from 'axios'

const steps = [
  { id: 'upload', title: 'Upload', completed: true },
  { id: 'snippets', title: 'Snippets', completed: true },
  { id: 'practices', title: 'Práticas', completed: true },
  { id: 'preview', title: 'Preview', completed: true },
  { id: 'generation', title: 'Geração', completed: false },
]

interface GeneratedFile {
  path: string
  content: string
}

interface GeneratedProject {
  project_id: string
  files: GeneratedFile[]
  instructions: string[]
  commands: string[]
  download_url: string
}

export default function Generation() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  
  const { project, setGeneratedProject: setProjectGenerated, resetProject } = useProject()
  const navigate = useNavigate()

  useEffect(() => {
    if (project.prompt) {
      generateCode()
    }
  }, [project.prompt])

  const generateCode = async () => {
    if (!project.prompt) return
    
    setGenerating(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/generate-code', {
        prompt: project.prompt
      })
      
      setGeneratedProject(response.data)
      setProjectGenerated(response.data)
      setGenerated(true)
      
      // Auto-select first file
      if (response.data.files && response.data.files.length > 0) {
        setSelectedFile(response.data.files[0])
      }
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao gerar código')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedProject) return
    
    try {
      const response = await axios.get(generatedProject.download_url, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `generated_project_${generatedProject.project_id}.zip`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Erro ao baixar projeto:', err)
    }
  }

  const handleNewProject = () => {
    resetProject()
    navigate('/')
  }

  const handleBack = () => {
    navigate('/preview')
  }

  if (!project.prompt) {
    navigate('/upload')
    return null
  }

  return (
    <div>
      <StepIndicator 
        steps={steps.map(step => 
          step.id === 'generation' ? { ...step, completed: generated } : step
        )} 
        currentStep="generation" 
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Geração de Código
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {generating 
              ? 'Gerando seu código...' 
              : generated 
                ? 'Código gerado com sucesso!'
                : 'Preparando geração...'
            }
          </p>
        </div>

        {generating && (
          <div className="card text-center py-12 mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Gerando Código...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Isso pode levar alguns momentos. Por favor, aguarde.
            </p>
          </div>
        )}

        {error && (
          <div className="card text-center py-12 mb-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <Code className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro na Geração</h2>
              <p>{error}</p>
            </div>
            <button
              onClick={generateCode}
              className="btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {generated && generatedProject && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar with file list */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <File className="h-5 w-5 mr-2" />
                  Arquivos Gerados
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {generatedProject.files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFile(file)}
                      className={`
                        w-full text-left p-2 rounded text-sm transition-colors duration-200
                        ${selectedFile?.path === file.path
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      {file.path}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {generatedProject.instructions.length > 0 && (
                <div className="card mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Instruções
                  </h3>
                  <ul className="space-y-2">
                    {generatedProject.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Commands */}
              {generatedProject.commands.length > 0 && (
                <div className="card mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Comandos
                  </h3>
                  <div className="space-y-2">
                    {generatedProject.commands.map((command, index) => (
                      <code key={index} className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm text-gray-800 dark:text-gray-200">
                        {command}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              <div className="card h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedFile ? selectedFile.path : 'Selecione um arquivo'}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="btn-primary flex items-center text-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download ZIP
                    </button>
                  </div>
                </div>

                {selectedFile ? (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-96 overflow-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {selectedFile.content}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 h-96 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Selecione um arquivo para visualizar seu conteúdo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center"
            disabled={generating}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          
          <button
            onClick={handleNewProject}
            className="btn-primary flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Novo Projeto
          </button>
        </div>
      </div>
    </div>
  )
}