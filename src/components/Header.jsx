  function Header(props) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="brand"
          onClick={props.onHome}
          >
          MY HOTEL LOG
        </button>

        <nav className="nav">
          <button
          className="nav-link"
          onClick={props.onHome}
          >
            Home
          </button>

          <button
          className="button button-small"
          onClick={props.onAdd}
          >
            + Add hotel
          </button>
        </nav>
      </div>
    </header>
);
}

export default Header;