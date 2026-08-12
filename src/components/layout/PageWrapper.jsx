import Navbar from './Navbar'
import Footer from './Footer'

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PageWrapper