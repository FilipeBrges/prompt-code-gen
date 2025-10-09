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
  download_url: string
  raw_text?: string
}

export default function Generation() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

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
        prompt: project.prompt,
      })

      setGeneratedProject(response.data)
      setProjectGenerated(response.data)
      setGenerated(true)

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
        responseType: 'blob',
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
        steps={steps.map((step) =>
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
              : 'Preparando geração...'}
          </p>
        </div>

        {/* Loading */}
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

        {/* Erro */}
        {error && (
          <div className="card text-center py-12 mb-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <Code className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro na Geração</h2>
              <p>{error}</p>
            </div>
            <button onClick={generateCode} className="btn-primary">
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Resultado */}
        {generated && generatedProject && (
          generatedProject.files && generatedProject.files.length > 0 ? (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Lista de arquivos */}
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
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                        `}
                      >
                        {file.path}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exibição do conteúdo */}
              <div className="lg:col-span-3">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                      {selectedFile ? selectedFile.path : 'Selecione um arquivo'}
                    </h3>
                    <button
                      onClick={handleDownload}
                      className="btn-primary flex items-center text-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download ZIP
                    </button>
                  </div>
                  {selectedFile ? (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-96 overflow-auto">
                      <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
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
          ) : (
            // Quando o retorno for apenas texto bruto (sem arquivos)
            <div className="grid lg:grid-cols-3 gap-8 my-8">
              {/* Blocos de código */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Blocos de código gerados
                  </h3>
                  {(() => {
                    const codeBlockRegex = /```(\w+)[\r\n]+([\s\S]*?)(?=```)/g
                    const raw = generatedProject.raw_text || ''
                    const blocks = []
                    let match
                    while ((match = codeBlockRegex.exec(raw))) {
                      const lang = match[1].toLowerCase()
                      if (lang === 'bash' || lang === 'sh' || lang === 'shell') continue
                      blocks.push({ lang, code: match[2] })
                    }

                    if (blocks.length === 0) {
                      return (
                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          Nenhum bloco de código encontrado.
                        </pre>
                      )
                    }

                    return (
                      <div className="space-y-6">
                        {blocks.map((block, idx) => (
                          <div
                            key={idx}
                            className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                {block.lang}
                              </span>
                              <button
                                className="btn-secondary text-xs px-2 py-1 rounded flex items-center"
                                onClick={() => {
                                  navigator.clipboard.writeText(block.code)
                                  setCopiedIdx(idx)
                                  setTimeout(() => setCopiedIdx(null), 1500)
                                }}
                              >
                                {copiedIdx === idx ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                ) : null}
                                {copiedIdx === idx ? 'Copiado!' : 'Copiar'}
                              </button>
                            </div>
                            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto break-words">
                              {block.code}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Instruções e explicações */}
              <div className="lg:col-span-1">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Instruções e Explicações
                  </h3>
                  {(() => {
                    const raw = generatedProject.raw_text || ''
                    const startIdx = raw.toLowerCase().indexOf('### estrutura do projeto')
                    let instructions = ''
                    if (startIdx !== -1) {
                      instructions = raw.slice(startIdx)
                    }

                    // Remove blocos de código
                    instructions = instructions.replace(/```(\w+)[\r\n]+([\s\S]*?)(?=```)/g, '')

                    if (!instructions.trim()) {
                      return (
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhuma instrução relevante encontrada.
                        </p>
                      )
                    }

                    const lines = instructions.split(/\r?\n/).filter((l) => l.trim())

                    return (
                      <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200 overflow-auto break-words">
                        {lines.map((line, idx) => {
                          let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')

                          if (line.startsWith('###')) {
                            return (
                              <h4
                                key={idx}
                                className="font-bold text-base mt-4 mb-2"
                                dangerouslySetInnerHTML={{
                                  __html: formatted.replace(/^#+\s*/, ''),
                                }}
                              />
                            )
                          }
                          if (line.startsWith('##')) {
                            return (
                              <h3
                                key={idx}
                                className="font-bold text-lg mt-6 mb-2"
                                dangerouslySetInnerHTML={{
                                  __html: formatted.replace(/^#+\s*/, ''),
                                }}
                              />
                            )
                          }
                          if (line.trim().match(/^(\*|-|\d+\.)\s+/)) {
                            return (
                              <li
                                key={idx}
                                className="ml-4 list-disc"
                                dangerouslySetInnerHTML={{
                                  __html: formatted.replace(/^(\s*(\*|-|\d+\.)\s+)/, ''),
                                }}
                              />
                            )
                          }
                          return (
                            <p key={idx} dangerouslySetInnerHTML={{ __html: formatted }} />
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          )
        )}

        {/* Botões inferiores */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center"
            disabled={generating}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>

          <button onClick={handleNewProject} className="btn-primary flex items-center">
            <RotateCcw className="h-4 w-4 mr-2" />
            Novo Projeto
          </button>
        </div>
      </div>
    </div>
  )
}
