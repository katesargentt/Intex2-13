function Header() {
  const styles: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    left: '30px',
    fontSize: '36px',
    fontWeight: 500,
    color: '#ccd4ff',
    fontFamily: "'Noto Serif', serif",
    zIndex: 10,
    letterSpacing: '1px',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)',
    cursor: 'pointer',
  };

  return <h1 style={styles}>CineNiche</h1>;
}

export default Header;
