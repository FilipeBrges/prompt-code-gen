import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, Zap, Download, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            PromptCodeGen
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Transforme documentos de requisitos em prompts otimizados e gere código 
            pronto para execução usando inteligência artificial.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* How it Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Como Funciona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200">
                <Upload className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                1. Upload do Documento
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Faça upload de seus documentos de requisitos em formato .docx, .pdf, .md ou .txt
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200">
                <Zap className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                2. Engenharia de Prompt
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Selecione snippets e boas práticas para otimizar seu prompt de acordo com suas necessidades
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200">
                <Download className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3. Geração de Código
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Obtenha código pronto para execução e baixe o projeto completo em formato ZIP
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Principais Funcionalidades
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Suporte a Múltiplos Formatos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Processe documentos .docx, .pdf, .md e .txt com facilidade
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Snippets Personalizáveis
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Escolha entre diferentes perfis de desenvolvimento
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Boas Práticas Integradas
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Aplique padrões de desenvolvimento reconhecidos
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Geração Inteligente
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Código production-ready com estrutura completa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}