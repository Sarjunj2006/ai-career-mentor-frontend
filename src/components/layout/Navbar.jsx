const Navbar = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <span className="text-lg font-semibold text-primary">
        AI Career Mentor
      </span>
      <nav className="flex gap-6 text-sm text-secondary">
        <a href="/" className="hover:text-primary transition-colors">Home</a>
        <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
      </nav>
    </header>
  )
}

export default Navbar