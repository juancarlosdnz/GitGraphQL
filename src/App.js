import github from "./db.js";
import { useCallback, useEffect, useState } from "react";
import query from "./Query"
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox.js";
function App() {

  let [userName, setUsername] = useState("")
  let [repoList, setRepoList] = useState(null)
  let [pageCount, setPageCount] = useState(10)
  let [queryString, setQueryString] = useState("")
  let [totalCount, setTotalCount] = useState(null)

  const fetchData = useCallback(() => {

    const queryText = JSON.stringify(query(pageCount, queryString))

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        const viewer = data.data.viewer
        const repos = data.data.search.nodes
        const total = data.data.search.repositoryCount

        setUsername(viewer.name)
        setRepoList(repos)
        setTotalCount(total)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App container mt-5">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i> Repos</h1>
      <p>Hey there {userName}</p>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onQueryChange={(myString) => { setQueryString(myString) }}
        onTotalChange={(myNumber) => { setPageCount(myNumber) }}

      />
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map((repo) => (
            <RepoInfo key={repo.id} repo={repo} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
