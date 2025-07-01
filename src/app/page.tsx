export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* RepOrder Logo */}
      <div className="mb-8">
        <img
          src="/reporder-logo.svg"
          alt="RepOrder"
          className="h-20 w-auto"
        />
      </div>
      
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          Welcome to RepOrder
        </h1>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600 mb-4">
          Professional sales rep and inventory management platform
        </p>
        <a 
          href="/connect-store" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Store
        </a>
      </div>
    </main>
  )
} 