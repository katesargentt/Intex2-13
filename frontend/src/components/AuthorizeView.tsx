import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

export const UserContext = createContext<User | null>(null);

interface User {
  email: string;
  roles: string[];
  userId: number | null; // Added userId property
}

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // add a loading state
  //const navigate = useNavigate();
  let emptyuser: User = { email: '', roles: [], userId: null };

  const [user, setUser] = useState(emptyuser);

  useEffect(() => {
    async function fetchWithRetry(url: string, options: any) {
      try {
        const response = await fetch(url, options);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }

        const data = await response.json();

        if (data.email && Array.isArray(data.roles)) {
          setUser({
            email: data.email,
            roles: data.roles,
            userId: data.userId ?? null,
          });
          setAuthorized(true);
        } else {
          throw new Error('Invalid user session');
        }
      } catch (error) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    const API_BASE =
      import.meta.env.MODE === 'development'
        ? 'https://localhost:5000'
        : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net';

    fetchWithRetry(`${API_BASE}/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authorized) {
    return (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    );
  }

  return <Navigate to="/login" />;
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null; // Prevents errors if context is null

  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeView;
