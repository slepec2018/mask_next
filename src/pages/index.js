import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Widgets from "@/components/Widgets";

export default function Home({ newsResults }) {
  return (
    <div>
      <main
        className="flex min-h-screen max-w-7xl mx-auto"
      >
        <Sidebar />
        <Feed />
        <Widgets
          newsResults={newsResults.articles}
        />
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const newsResults = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
    .then((res) => res.json());

  return {
    props: {
      newsResults,
    }
  }
}