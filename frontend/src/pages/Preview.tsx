import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Eye, Edit, Zap } from 'lucide-react'
import { useProject } from '../contexts/ProjectContext'
import StepIndicator from '../components/StepIndicator'
import axios from 'axios'

const steps = [
  { id: 'upload', title: 'Upload', completed: true },
  { id: 'snippets', title: 'Snippets', completed: true },
  { id: 'practices', title: 'Práticas', completed: true },
  { id: 'preview', title: 'Preview', completed: false },
  { id: 'generation', title: 'Geração', completed: false },
]

export default function Preview() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState('')
  
  const { project, setPrompt: setProjectPrompt } = useProject()
  const navigate = useNavigate()

  useEffect(() => {
    if (project.documentId) {
      composePrompt()
    }
  }, [project.documentId])

  const composePrompt = async () => {
    try {
      const response = await axios.post('/api/compose-prompt', {
        document_id: project.documentId,
        snippet_ids: project.selectedSnippets,
        practice_ids: project.selectedPractices
      })
      
      setPrompt(response.data.prompt)
      setEditedPrompt(response.data.prompt)
    } catch (err) {
      setError('Erro ao compor prompt')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    const finalPrompt = isEditing ? editedPrompt : prompt
    setProjectPrompt(finalPrompt)
    navigate('/generation')
  }

  const handleBack = () => {
    navigate('/practices')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    setPrompt(editedPrompt)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedPrompt(prompt)
    setIsEditing(false)
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
          onClick={composePrompt}
          className="btn-primary mt-4"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      <StepIndicator steps={steps} currentStep="preview" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Preview do Prompt
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Revise o prompt final antes de gerar o código. Você pode editá-lo se necessário.
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-primary-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Prompt Gerado
              </h2>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="btn-secondary flex items-center text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Edite seu prompt aqui..."
            />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                {prompt}
              </pre>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Documento
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {project.filename || 'Documento enviado'}
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Snippets Selecionados
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {project.selectedSnippets.length > 0 
                ? `${project.selectedSnippets.length} snippet(s)`
                : 'Nenhum selecionado'
              }
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Boas Práticas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {project.selectedPractices.length > 0 
                ? `${project.selectedPractices.length} prática(s)`
                : 'Nenhuma selecionada'
              }
            </p>
          </div>
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
            disabled={isEditing}
          >
            <Zap className="h-4 w-4 mr-2" />
            Gerar Código
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}