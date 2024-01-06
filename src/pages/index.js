import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Widgets from "@/components/Widgets";
import CommentModal from "@/components/CommentModal";

export default function Home({ newsResults, randomUsersResults }) {
  return (
    <div>
      <main
        className="flex min-h-screen max-w-7xl mx-auto"
      >
        <Sidebar />
        <Feed />
        <Widgets
          newsResults={newsResults.articles}
          randomUsersResults={randomUsersResults.results}
        />
        <CommentModal />
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const newsResults = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
    .then((res) => res.json());
  
  const randomUsersResults = await fetch('https://randomuser.me/api/?results=30&inc=name,login,picture')
    .then((res) => res.json());

  return {
    props: {
      newsResults,
      randomUsersResults
    }
  }
}