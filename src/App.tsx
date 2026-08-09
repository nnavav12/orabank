import { useEffect, useState } from 'react';

function App() {
  const [page, setPage] = useState('');

  useEffect(() => {
    fetch('/clone.html')
      .then((response) => response.text())
      .then(setPage);
  }, []);

  return (
    <main className="page-shell">
      {page ? (
        <iframe
          className="cloned-page"
          title="Banking"
          srcDoc={page}
        />
      ) : (
        <div className="loading">Loading…</div>
      )}
    </main>
  );
}

export default App;
