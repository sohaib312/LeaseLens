'use client'

import { useState } from 'react'
import UploadComponent from '@/components/UploadComponent'
import { FileText, Building2, Shield } from 'lucide-react'

interface LeaseData {
  monthly_rent: string
  lease_term: string
  security_deposit: string
  termination_clause: string
  rent_escalation: string
}

interface AnalysisResult {
  success: boolean
  filename: string
  data: LeaseData
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUploadSuccess = (data: AnalysisResult) => {
    setResult(data)
    setError(null)
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
    setResult(null)
  }

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading)
    if (loading) {
      setError(null)
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setError(null)
  }

  const formatLabel = (key: string): string => {
    const labels: Record<string, string> = {
      monthly_rent: 'Monthly Rent',
      lease_term: 'Lease Term',
      security_deposit: 'Security Deposit',
      termination_clause: 'Termination Clause',
      rent_escalation: 'Rent Escalation',
    }
    return labels[key] || key
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LeaseLens</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Commercial Lease Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Extract Key Lease Terms in Seconds
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your commercial lease agreement and let our AI instantly identify 
            the most critical financial and termination clauses.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">PDF Upload</h3>
              <p className="text-sm text-muted-foreground">Drag & drop or browse</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Secure</h3>
              <p className="text-sm text-muted-foreground">Files not stored</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto">
          <UploadComponent
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            onLoadingChange={handleLoadingChange}
            isLoading={isLoading}
          />

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}

          {/* Results Table */}
          {result && result.success && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Extracted from: {result.filename}
                  </p>
                </div>
                <button
                  onClick={resetAnalysis}
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 
                           hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Analyze Another
                </button>
              </div>

              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Clause
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Extracted Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(result.data).map(([key, value]) => (
                      <tr key={key} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">
                            {formatLabel(key)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-muted-foreground">
                            {value || 'Not specified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Export hint */}
              <p className="mt-4 text-center text-sm text-muted-foreground">
                💡 Tip: Select the table and copy to paste into your spreadsheet
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 bg-white/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>LeaseLens MVP - Built for Commercial Real Estate Professionals</p>
          <p className="mt-1">Powered by Google Gemini AI</p>
        </div>
      </footer>
    </div>
  )
}
