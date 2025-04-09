import { useNavigate } from 'react-router-dom';

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
      <button
        onClick={handleLogout}
        className="secondary-button skinny"
        style={{
          padding: '6px 10px',
          fontSize: '14px',
          borderRadius: '6px',
          display: 'inline-block',
          width: 'fit-content',
          minWidth: 'auto',
        }}
      >
        {props.children}
      </button>
    </div>
  );
}

export default Logout;
