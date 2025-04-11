//logout component, sits on the top of the page, allows user to logout of their account
import { useNavigate } from 'react-router-dom';

function Logout(_props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const API_BASE =
      import.meta.env.MODE === 'development'
        ? 'https://localhost:5000'
        : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net';

    try {
      const response = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
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
          backgroundColor: '#5b4db1', // 🟣 Create Account button color
          color: 'white',
          border: 'none',
          fontWeight: '600',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'background-color 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#6b6ee5')} // 🔵 Sign In hover
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5b4db1')}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Logout;
