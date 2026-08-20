import { useState, useRef, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { sendChatMessageRequest } from '../api/endpoints/dashboard.api'

const AiCareerChat = () => {
  const { user } = useAuth()
  const USER_ID = user?.id

  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed || isSending) return

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setQuestion('')
    setIsSending(true)
    setError('')

    try {
      const response = await sendChatMessageRequest(USER_ID, trimmed)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: response.data.answer }
      ])
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Could not get a response. Make sure a resume and profile exist.'
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl h-full">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">AI Career Chat</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ask anything about your career, resume, or job search.
        </p>
      </div>

      <Card className="flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-3">
          {messages.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                Ask your first question to start the conversation.
              </p>
              <p className="text-xs text-gray-300 mt-2">
                Try: "What should I improve in my resume?"
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start items-center gap-2">
              <Spinner size="sm" />
              <span className="text-xs text-gray-400">Thinking - this can take a minute.</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-3 pt-3 border-t border-gray-100">
          <div className="flex-1">
            <Input
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a career question..."
            />
          </div>
          <Button type="submit" variant="primary" disabled={isSending || !question.trim()}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default AiCareerChat