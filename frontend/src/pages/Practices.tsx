import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, BookOpen, Info } from 'lucide-react'
import { useProject } from '../contexts/ProjectContext'
import StepIndicator from '../components/StepIndicator'
import axios from 'axios'

interface Practice {
  id: string
  title: string
  excerpt: string
  content: string
}

const steps = [
  { id: 'upload', title: 'Upload', completed: true },
  { id: 'snippets', title: 'Snippets', completed: true },
  { id: 'practices', title: 'Práticas', completed: false },
  { id: 'preview', title: 'Preview', completed: false },
  { id: 'generation', title: 'Geração', completed: false },
]

export default function Practices() {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { project, setSelectedPractices } = useProject()
  const [selectedIds, setSelectedIds] = useState<string[]>(project.selectedPractices)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPractices()
  }, [])

  const fetchPractices = async () => {
    try {
      const response = await axios.get('/api/practices')
      setPractices(response.data.practices)
    } catch (err) {
      setError('Erro ao carregar boas práticas')
    } finally {
      setLoading(false)
    }
  }

  const handlePracticeToggle = (practiceId: string) => {
    setSelectedIds(prev => 
      prev.includes(practiceId)
        ? prev.filter(id => id !== practiceId)
        : [...prev, practiceId]
    )
  }

  const handleNext = () => {
    setSelectedPractices(selectedIds)
    navigate('/preview')
  }

  const handleBack = () => {
    navigate('/snippets')
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
          onClick={fetchPractices}
          className="btn-primary mt-4"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      <StepIndicator steps={steps} currentStep="practices" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Boas Práticas
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Selecione as boas práticas que devem ser aplicadas no código gerado.
            Isso garantirá maior qualidade e aderência aos padrões de desenvolvimento.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <strong>Nota:</strong> Você pode avançar sem selecionar nada. As boas práticas são opcionais 
            e ajudam a melhorar a qualidade do código gerado.
          </p>
        </div>

        {practices.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Nenhuma boa prática disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 mb-8">
            {practices.map((practice) => (
              <div
                key={practice.id}
                className={`
                  card cursor-pointer border-2 transition-all duration-200 hover:shadow-lg
                  ${selectedIds.includes(practice.id)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }
                `}
                onClick={() => handlePracticeToggle(practice.id)}
              >
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(practice.id)}
                      onChange={() => handlePracticeToggle(practice.id)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-primary-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {practice.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {practice.excerpt}
                    </p>
                    <details className="group">
                      <summary className="text-sm text-primary-600 dark:text-primary-400 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300">
                        Ver conteúdo completo
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded border text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {practice.content}
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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