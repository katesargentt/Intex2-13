import Header from '../components/Header';
import Pagination from '../components/Pagination';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovies } from '../api/MoviesAPI';
import { getCategories } from '../utils/categoryUtils';

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(pageSize, pageNum, []);
        console.log('Fetched data:', data); // ✅ log right after fetch

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

    loadMovies(); // ✅ call the async function
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
      <Header />
      <h2>Admin Page</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
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
            <th>Category</th>
            <th></th>
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
              <td>{m.description}</td>
              <td>{m.categories.join(', ')}</td>
              <td>
                <button
                  className="btn btn-primary sm w-100 mb-1"
                  onClick={() => setEditingMovie(m)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger sm w-100 mb-1"
                  onClick={() => handleDelete(m.showId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </>
  );
};
export default AdminPage;
