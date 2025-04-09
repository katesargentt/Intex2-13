import Header from '../components/Header';
import Pagination from '../components/Pagination';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovies } from '../api/MoviesAPI';
import { getCategories } from '../utils/categoryUtils';
import './AdminPage.css';
import EditMovieForm from '../components/EditMovieForm';
import NewMovieForm from '../components/NewMovieForm';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/AuthorizeView'; // adjust path as needed

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showForm, setShowForm] = useState(false);

  const UserCheckWrapper = ({ children }: { children: React.ReactNode }) => {
    const user = useContext(UserContext);

    if (!user || !user.roles?.includes('Administrator')) {
      return <Navigate to="/movies" />;
    }

    return <>{children}</>;
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(pageSize, pageNum, []);
        console.log('Fetched data:', data);

        if (data && Array.isArray(data.movies)) {
          const moviesWithCategories = data.movies.map((m) => ({
            ...m,
            categories: getCategories(m),
          }));
          setMovies(moviesWithCategories);
          setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
        } else {
          setError(
            'Failed to load movies — movies is undefined or not an array.'
          );
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum]);

  const handleDelete = async (showId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this Movie?'
    );
    if (!confirmDelete) return;
    try {
      await deleteMovie(showId);
      setMovies(movies.filter((m) => m.showId !== showId));
    } catch (error) {
      alert('Failed to delete Movie. Please try again');
    }
  };
  if (loading) return <p>loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (editingMovie) {
    console.log(editingMovie);
  }
  return (
    <>
      <UserCheckWrapper>
        <span>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
        </span>
        <div className="admin-reset">
          <Header />
          <div className="container mt-5">
            <h2 className="text-center mb-4">🎬 Admin Movie Manager</h2>
            {!showForm && (
              <button
                className="btn btn-success mb-3"
                onClick={() => setShowForm(true)}
              >
                Add Movie
              </button>
            )}
            {showForm && (
              <div className="form-overlay">
                <div className="form-wrapper">
                  <NewMovieForm
                    onSuccess={() => {
                      setShowForm(false);
                      fetchMovies(pageSize, pageNum, []).then((data) => {
                        if (data && Array.isArray(data.movies)) {
                          const moviesWithCategories = data.movies.map((m) => ({
                            ...m,
                            categories: getCategories(m),
                          }));
                          setMovies(moviesWithCategories);
                        }
                      });
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            )}
            {editingMovie && (
              <div className="form-overlay">
                <div className="edit-form-wrapper">
                  <EditMovieForm
                    movie={editingMovie}
                    onSuccess={() => {
                      setEditingMovie(null);
                      fetchMovies(pageSize, pageNum, []).then((data) => {
                        if (data && Array.isArray(data.movies)) {
                          const moviesWithCategories = data.movies.map((m) => ({
                            ...m,
                            categories: getCategories(m),
                          }));
                          setMovies(moviesWithCategories);
                        }
                      });
                    }}
                    onCancel={() => setEditingMovie(null)} // optional, if you support cancel
                  />
                </div>
              </div>
            )}
            <div className="table-responsive overflow-auto">
              <table className="table table-bordered table-striped shadow-sm">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Show ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Cast</th>
                    <th>Country</th>
                    <th>Release Year</th>
                    <th>Rating</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Categories</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m.showId}>
                      <td>{m.showId}</td>
                      <td>{m.type}</td>
                      <td>{m.title}</td>
                      <td>{m.director}</td>
                      <td>{m.cast}</td>
                      <td>{m.country}</td>
                      <td>{m.releaseYear}</td>
                      <td>{m.rating}</td>
                      <td>{m.duration}</td>
                      <td className="description-cell">{m.description}</td>
                      <td>{(m.categories ?? []).join(', ')}</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setEditingMovie(m)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(m.showId)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 d-flex justify-content-center">
              <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPageNum(1);
                }}
              />
            </div>
            <br />
          </div>
        </div>
      </UserCheckWrapper>
    </>
  );
};

export default AdminPage;
