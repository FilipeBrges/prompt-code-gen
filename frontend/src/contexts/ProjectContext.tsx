import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ProjectState {
  documentId: string | null
  filename: string | null
  selectedSnippets: string[]
  selectedPractices: string[]
  prompt: string
  generatedProject: any | null
}

interface ProjectContextType {
  project: ProjectState
  setDocumentId: (id: string, filename: string) => void
  setSelectedSnippets: (snippets: string[]) => void
  setSelectedPractices: (practices: string[]) => void
  setPrompt: (prompt: string) => void
  setGeneratedProject: (project: any) => void
  resetProject: () => void
}

const initialState: ProjectState = {
  documentId: null,
  filename: null,
  selectedSnippets: [],
  selectedPractices: [],
  prompt: '',
  generatedProject: null
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectState>(initialState)

  const setDocumentId = (id: string, filename: string) => {
    setProject(prev => ({ ...prev, documentId: id, filename }))
  }

  const setSelectedSnippets = (snippets: string[]) => {
    setProject(prev => ({ ...prev, selectedSnippets: snippets }))
  }

  const setSelectedPractices = (practices: string[]) => {
    setProject(prev => ({ ...prev, selectedPractices: practices }))
  }

  const setPrompt = (prompt: string) => {
    setProject(prev => ({ ...prev, prompt }))
  }

  const setGeneratedProject = (generatedProject: any) => {
    setProject(prev => ({ ...prev, generatedProject }))
  }

  const resetProject = () => {
    setProject(initialState)
  }

  return (
    <ProjectContext.Provider value={{
      project,
      setDocumentId,
      setSelectedSnippets,
      setSelectedPractices,
      setPrompt,
      setGeneratedProject,
      resetProject
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}