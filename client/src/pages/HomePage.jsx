export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Application</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is the home page of your application.
      </p>
      <a
        href="/about"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Learn More
      </a>
    </div>
  );
}
