import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Code } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useProject } from '../contexts/ProjectContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme()
  const { resetProject } = useProject()
  const navigate = useNavigate()

  const handleHomeClick = () => {
    resetProject()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Voltar ao início"
            >
              <Code className="h-8 w-8" />
              <span className="text-xl font-bold">PromptCodeGen</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}