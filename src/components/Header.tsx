type HeaderProps = {
	onHome: () => void;
	onAdd: () => void;
	onLogout: () => void;
};

function Header(props: HeaderProps) {
	return (
		<header className="site-header">
			<div className="header-inner">
				<button type="button" className="brand" onClick={props.onHome}>
					MY HOTEL LOG
				</button>

				<nav className="nav">
					<button type="button" className="nav-link" onClick={props.onHome}>
						Home
					</button>

					<button
						type="button"
						className="button button-small"
						onClick={props.onAdd}
					>
						+ Add hotel
					</button>

					<button type="button" className="nav-link" onClick={props.onLogout}>
						ログアウト
					</button>
				</nav>
			</div>
		</header>
	);
}

export default Header;
