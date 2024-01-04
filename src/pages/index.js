import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";

export default function Home() {
  return (
    <div>
      <main
        className="flex min-h-screen max-w-7xl mx-auto"
      >
        <Sidebar />
        <Feed />
      </main>
    </div>
  )
}
