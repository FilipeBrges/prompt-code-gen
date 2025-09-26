import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Code2, Info } from 'lucide-react'
import { useProject } from '../contexts/ProjectContext'
import StepIndicator from '../components/StepIndicator'
import axios from 'axios'

interface Snippet {
  id: string
  title: string
  description: string
  content: string
}

const steps = [
  { id: 'upload', title: 'Upload', completed: true },
  { id: 'snippets', title: 'Snippets', completed: false },
  { id: 'practices', title: 'Práticas', completed: false },
  { id: 'preview', title: 'Preview', completed: false },
  { id: 'generation', title: 'Geração', completed: false },
]

export default function Snippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { project, setSelectedSnippets } = useProject()
  const [selectedIds, setSelectedIds] = useState<string[]>(project.selectedSnippets)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      const response = await axios.get('/api/snippets')
      setSnippets(response.data.snippets)
    } catch (err) {
      setError('Erro ao carregar snippets')
    } finally {
      setLoading(false)
    }
  }

  const handleSnippetToggle = (snippetId: string) => {
    setSelectedIds(prev => 
      prev.includes(snippetId)
        ? prev.filter(id => id !== snippetId)
        : [...prev, snippetId]
    )
  }

  const handleNext = () => {
    setSelectedSnippets(selectedIds)
    navigate('/practices')
  }

  const handleBack = () => {
    navigate('/upload')
  }

  if (!project.documentId) {
    navigate('/upload')
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchSnippets}
          className="btn-primary mt-4"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      <StepIndicator steps={steps} currentStep="snippets" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Engenharia de Prompt
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Selecione os snippets que melhor se adequam ao seu projeto. 
            Isso ajudará a gerar código mais direcionado às suas necessidades.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <strong>Nota:</strong> Você pode avançar sem selecionar nada. Os snippets são opcionais 
            e servem para personalizar o estilo e abordagem do código gerado.
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className={`
                card cursor-pointer border-2 transition-all duration-200 hover:shadow-lg
                ${selectedIds.includes(snippet.id)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
              onClick={() => handleSnippetToggle(snippet.id)}
            >
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(snippet.id)}
                    onChange={() => handleSnippetToggle(snippet.id)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center mb-2">
                    <Code2 className="h-5 w-5 text-primary-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {snippet.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {snippet.description}
                  </p>
                  <details className="group">
                    <summary className="text-sm text-primary-600 dark:text-primary-400 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300">
                      Ver conteúdo completo
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded border text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {snippet.content}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          
          <button
            onClick={handleNext}
            className="btn-primary flex items-center"
          >
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}