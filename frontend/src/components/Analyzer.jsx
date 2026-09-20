import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Upload, FileText, Zap, Sparkles, ArrowRight, X, Image, 
  Scan, Loader2, Camera, CheckCircle, AlertCircle 
} from 'lucide-react'
import api from '../api/client'

const EXAMPLES = {
  high: `Congratulations! You have been selected for our internship program.

Pay ₹1999 registration fee today.
Only 10 seats remaining.
Contact us on WhatsApp immediately.`,

  low: `We are hiring Software Engineering Interns.

Apply through our official careers page at careers.techcorp.com.
The internship includes a technical interview and coding assessment.

No payment is required.
Location: Remote`,

  medium: `Exciting opportunity! Join our team as a Frontend Developer Intern.

Work from home. Stipend ₹15,000/month.

Contact: recruiter@gmail.com
Limited positions available. Apply today!`
}

function Analyzer({ showToast }) {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('text')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [ocrStatus, setOcrStatus] = useState('idle')
  const [ocrProgress, setOcrProgress] = useState(0)
  const fileInputRef = useRef(null)
  const ocrRunRef = useRef(0)

  const handleAnalyze = async () => {
    const finalText = text || extractedText
    if (!finalText.trim()) {
      showToast('Please paste some text or upload a screenshot', 'error')
      return
    }

    if (finalText.trim().length < 10) {
      showToast('Please provide more details for analysis (minimum 10 characters)', 'error')
      return
    }

    setIsAnalyzing(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showToast('Please login first', 'error')
        navigate('/login')
        return
      }
      
      const response = await api.analyze(finalText)
      navigate(`/results/${response.id}`, { state: { result: response } })
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error')
        navigate('/login')
      } else {
        showToast(error.response?.data?.detail || 'Analysis failed. Please try again.', 'error')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      showToast('Please upload PNG, JPG, JPEG, or WEBP images only', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error')
      return
    }

    setScreenshot(file)
    setOcrStatus('extracting')
    setIsExtracting(true)
    setOcrProgress(0)

    const reader = new FileReader()
    reader.onload = (e) => setScreenshotPreview(e.target.result)
    reader.readAsDataURL(file)

    showToast('📸 Processing screenshot...', 'info')

    const run = ++ocrRunRef.current

    try {
      const Tesseract = await import('tesseract.js')
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && Number.isFinite(m.progress)) {
            setOcrProgress(Math.round(m.progress * 100))
          }
        },
      })
      const { data } = await worker.recognize(file)
      await worker.terminate()

      if (run !== ocrRunRef.current) return

      const extracted = (data?.text || '').trim()
      if (!extracted) {
        throw new Error('No text found in image')
      }

      setExtractedText(extracted)
      setText(extracted)
      setOcrStatus('done')
      setOcrProgress(100)
      showToast('✅ Text extracted successfully!', 'success')
    } catch (error) {
      if (run !== ocrRunRef.current) return
      setOcrStatus('error')
      setOcrProgress(0)
      showToast('❌ OCR failed. Please paste the text manually.', 'error')
    } finally {
      if (run === ocrRunRef.current) setIsExtracting(false)
    }
  }

  const removeScreenshot = () => {
    ocrRunRef.current += 1
    setScreenshot(null)
    setScreenshotPreview(null)
    setExtractedText('')
    setOcrStatus('idle')
    setOcrProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const loadExample = (type) => {
    setText(EXAMPLES[type])
    setExtractedText('')
    setOcrStatus('idle')
    showToast('Example loaded! Click Analyze to test.', 'info')
  }

  const loadingMessages = [
    'Scanning opportunity...',
    'Extracting signals...',
    'Checking risk patterns...',
    'Building verification report...'
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className="premium-eyebrow">Verification workspace</span>
          </div>
          <h1 className="premium-display text-3xl sm:text-4xl">
            Analyze an <span className="premium-gradient-text">opportunity</span>
          </h1>
          <p className="text-mist mt-3">
            Paste the message, job description, or email — or upload a screenshot
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-fog">Try an example:</span>
          <button
            onClick={() => loadExample('high')}
            className="premium-status-danger rounded-badges hover:bg-danger/20 transition-colors"
          >
            High Risk
          </button>
          <button
            onClick={() => loadExample('medium')}
            className="premium-status-warn rounded-badges hover:bg-warn/20 transition-colors"
          >
            Medium Risk
          </button>
          <button
            onClick={() => loadExample('low')}
            className="premium-status-safe rounded-badges hover:bg-ok/20 transition-colors"
          >
            Low Risk
          </button>
        </div>

        <div className="premium-panel p-5 sm:p-8 shadow-glass-deep">
          <div className="flex gap-2 mb-6 border-b border-hairline pb-5">
            <button
              onClick={() => setActiveTab('text')}
              className={`premium-tab ${activeTab === 'text' ? 'premium-tab-active' : ''}`}
              aria-pressed={activeTab === 'text'}
            >
              <FileText className="w-4 h-4" strokeWidth={1.5} />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`premium-tab ${activeTab === 'upload' ? 'premium-tab-active' : ''}`}
              aria-pressed={activeTab === 'upload'}
            >
              <Camera className="w-4 h-4" strokeWidth={1.5} />
              <span>Upload Screenshot</span>
            </button>
          </div>

          {activeTab === 'text' ? (
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a WhatsApp message, email, internship offer, LinkedIn post, or job description..."
                className="premium-textarea w-full !min-h-52 font-normal bg-canvas2/60"
                aria-label="Opportunity text"
              />
              <div className="flex items-center justify-between text-xs text-fog/70">
                <span>{text.length} / 10000 characters</span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>WhatsApp · Email · LinkedIn · Telegram · Job portals</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {!screenshotPreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="premium-upload block rounded-cards bg-canvas2/40 hover:bg-surface2"
                  >
                    <span className="flex flex-col items-center justify-center space-y-4 text-center">
                      <span className="premium-icon-tile w-16 h-16 rounded-icons bg-surface2 shadow-subtle">
                        <Upload className="w-8 h-8" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-white font-medium text-lg">Upload a screenshot</span>
                        <span className="block text-fog text-sm mt-1">Drag & drop or click to browse</span>
                        <span className="flex flex-wrap justify-center gap-2 mt-3">
                          {['PNG', 'JPG', 'JPEG', 'WEBP'].map((ext) => (
                            <span key={ext} className="premium-chip">{ext}</span>
                          ))}
                        </span>
                      </span>
                      <span className="premium-button-primary">
                        Choose File
                      </span>
                      <span className="text-xs text-fog/70">
                        Max file size: 5MB • Supports OCR text extraction
                      </span>
                    </span>
                  </button>
                ) : (
                  <div className="relative rounded-cards overflow-hidden border border-hairline bg-canvas2/80 shadow-glass-deep">
                    <img 
                      src={screenshotPreview} 
                      alt="Screenshot preview" 
                      className="w-full max-h-80 object-contain bg-canvas2 p-4"
                    />
                    {isExtracting && (
                      <div className="absolute inset-0 bg-canvas2/80 flex items-center justify-center">
                        <div className="text-center px-6 max-w-sm">
                          <Loader2 className="w-10 h-10 text-frost animate-spin mx-auto mb-3" strokeWidth={1.5} />
                          <p className="text-mist text-sm">Extracting text with OCR...</p>
                          <div className="premium-progress-track mt-3 h-1.5">
                            <div className="premium-progress-fill !bg-accent" style={{ width: `${ocrProgress}%` }} />
                          </div>
                          <p className="text-fog text-xs mt-2 font-mono">{ocrProgress}%</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={removeScreenshot}
                      className="absolute top-3 right-3 p-2 rounded-buttons bg-canvas2/90 hover:bg-danger/20 transition-colors shadow-subtle"
                      aria-label="Remove screenshot"
                    >
                      <X className="w-4 h-4 text-mist" />
                    </button>
                    {extractedText && !isExtracting && (
                      <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-canvas2/90 rounded-badges shadow-subtle">
                        <p className="text-xs text-ok inline-flex items-center gap-1.5">
                          <Scan className="w-3 h-3" />
                          Text extracted ({extractedText.length} chars)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {extractedText && !isExtracting && (
                <div className="space-y-2">
                  <label className="text-sm text-mist font-medium">Extracted Text (edit if needed):</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="premium-textarea w-full !min-h-32 text-sm bg-canvas2/60"
                    placeholder="Extracted text from screenshot..."
                    aria-label="Extracted text"
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || isExtracting || (!text.trim() && !screenshot)}
            className="premium-button-primary w-full mt-6 !min-h-12"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : isExtracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Extracting Text...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Analyze Opportunity</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {isAnalyzing && (
            <div className="mt-5 space-y-2.5 animate-fade-in">
              {loadingMessages.map((msg, i) => (
                <div key={msg} className="flex items-center space-x-3 text-sm text-mist">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="premium-footer-note">
          <p>
            ⚠️ TraceOrigin provides risk indicators based on available information.
            A high score does not prove fraud, and a low score does not guarantee legitimacy.
            Always verify opportunities through official channels.
          </p>
        </div>
      </div>
    </div>
  )
}

// ✅ THIS IS CRUCIAL – Default export
export default Analyzer