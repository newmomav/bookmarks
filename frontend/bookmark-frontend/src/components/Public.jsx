import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header className="public__header">
        <h1>
          Welcome to <span className="nowrap">B O O K M A R K S!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Welcome to Bookmarks, an innovative web application designed to manage
          your online resources.
        </p>
        <p>
          Please log in to reach your personal dashboard, which is the central
          hub for all of your bookmarked URLs.
        </p>
      </main>
      <footer className="public__footer">
        <Link to="/login">Login</Link>
      </footer>
    </section>
  );
  return content;
};
export default Public;
