//edit movie component, Allows admin user to edit a movie on an autopopulated form
import { useState } from 'react';
import { Movie } from '../types/Movie';
import { updateMovie } from '../api/MoviesAPI';
import { CATEGORY_MAP } from '../utils/categoryUtils';

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

//When on the form changes, it updates in the database
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//handles the submit button functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(formData.showId, formData);
    onSuccess();
  };

  //returns the edit movie component and inputs
  return (
    <form
      onSubmit={handleSubmit}
      className="card p-3 mb-4 shadow-sm"
      style={{ maxWidth: '1000px', fontSize: '0.9rem' }}
    >
      <h5 className="mb-3">✏️ Edit Movie</h5>

      <div className="row g-3">
        {/* Left Column */}
        <div className="col-md-6">
          <div className="mb-2">
            <label className="form-label">
              <strong>Title</strong>
            </label>
            <input
              type="text"
              name="title"
              className="form-control form-control-sm"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          {/* drop down for type */}
          <div className="mb-2">
            <label className="form-label">
              <strong>Type</strong>
            </label>
            <select
              name="type"
              className="form-select form-select-sm"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="TV Show">TV Show</option>
              <option value="Movie">Movie</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">
              <strong>Director</strong>
            </label>
            <input
              type="text"
              name="director"
              className="form-control form-control-sm"
              value={formData.director}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              <strong>Cast</strong>
            </label>
            <input
              type="text"
              name="cast"
              className="form-control form-control-sm"
              value={formData.cast}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              <strong>Country</strong>
            </label>
            <input
              type="text"
              name="country"
              className="form-control form-control-sm"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-6">
          <div className="mb-2">
            <label className="form-label">
              <strong>Release Year</strong>
            </label>
            <input
              type="text"
              name="releaseYear"
              className="form-control form-control-sm"
              value={formData.releaseYear}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              <strong>Rating</strong>
            </label>
            <select
              name="rating"
              className="form-select form-select-sm"
              value={formData.rating}
              onChange={handleChange}
            >
              {/* drop down for rating */}
              <option value="">Select Rating</option>
              <option value="PG-13">PG-13</option>
              <option value="TV-MA">TV-MA</option>
              <option value="PG">PG</option>
              <option value="TV-14">TV-14</option>
              <option value="TV-PG">TV-PG</option>
              <option value="TV-Y">TV-Y</option>
              <option value="TV-Y7">TV-Y7</option>
              <option value="R">R</option>
              <option value="TV-G">TV-G</option>
              <option value="G">G</option>
              <option value="NR">NR</option>
              <option value="TV-Y7-FV">TV-Y7-FV</option>
              <option value="UR">UR</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">
              <strong>Duration</strong>
            </label>
            <input
              type="text"
              name="duration"
              className="form-control form-control-sm"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              <strong>Description</strong>
            </label>
            <textarea
              name="description"
              className="form-control form-control-sm"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Genre Checkboxes */}
      <div className="mt-4">
        <label className="form-label mb-2">
          <strong>Genres</strong>
        </label>
        <div className="row">
          {Object.entries(CATEGORY_MAP).map(([key, label]) => (
            <div key={key} className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className=""
                  style={{
                    accentColor: '#5e55aa',
                    width: '16px',
                    height: '16px',
                  }}
                  id={key}
                  checked={formData[key as keyof Movie] === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: e.target.checked ? 1 : 0,
                    })
                  }
                />
                <label className="form-check-label" htmlFor={key}>
                  {label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-sm"
          style={{
            backgroundColor: '#5e55aa',
            color: 'white',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#6e68ff')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#5e55aa')
          }
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-sm btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditMovieForm;
