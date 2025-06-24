import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { id } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard!</p>
      <p className="text-sm text-gray-500 mt-2">
        This is a placeholder for your dashboard content.
      </p>
    </div>
  );
}
