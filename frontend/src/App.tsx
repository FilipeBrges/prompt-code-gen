import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Snippets from './pages/Snippets'
import Practices from './pages/Practices'
import Preview from './pages/Preview'
import Generation from './pages/Generation'
import { ProjectProvider } from './contexts/ProjectContext'

function App() {
  return (
    <ProjectProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/snippets" element={<Snippets />} />
          <Route path="/practices" element={<Practices />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/generation" element={<Generation />} />
        </Routes>
      </Layout>
    </ProjectProvider>
  )
}

export default App