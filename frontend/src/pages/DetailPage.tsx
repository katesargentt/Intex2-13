import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import Header from '../components/Header';
import Footer from '../components/Footer';


import './DetailPage.css';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';


// const API_URL =
//   'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net/api/Movie';


const API_URL = 'https://localhost:5000/api/Movie';


const IMAGE_URL =
 'https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters';


// const endpoint = `${API_URL}/recommend/user/3`;


function DetailPage() {
 const { showId } = useParams();
 const [movie, setMovie] = useState<Movie | null>(null);
 const [recommendations, setRecommendations] = useState<Movie[]>([]);
 const [imageError, setImageError] = useState(false);


 useEffect(() => {
   fetch(`${API_URL}/${showId}`, {
     credentials: 'include',
   })
     .then(async (res) => {
       if (!res.ok) {
         throw new Error(`HTTP error! status: ${res.status}`);
       }
       return res.json();
     })
     .then(setMovie)
     .catch((err) => console.error('Error loading movie:', err));
 }, [showId]);


 useEffect(() => {
   if (!showId) return;


   fetch(`http://localhost:5002/api/recommend/movie/${showId}`)
     .then((res) => res.json())
     .then((data) => setRecommendations(data))
     .catch((err) => console.error('Error fetching recommendations:', err));
 }, [showId]);


 if (!movie) return <p>Loading...</p>;


 console.log(
   'Image URL:',
   `${IMAGE_URL}/${encodeURIComponent(movie.title.trim())}.jpg`
 );


 return (
   <>
     <AuthorizeView>
       <span>
         <Logout>
           Logout <AuthorizedUser value="email" />
         </Logout>
       </span>
       <Header />
       <div className="detail-container">
         {!imageError ? (
           <img
             src={`${IMAGE_URL}/${encodeURIComponent(movie.title.trim())}.jpg`}
             alt={movie.title}
             className="poster-image"
             onError={() => setImageError(true)}
           />
         ) : (
           <div className="poster-fallback">
             <span>{movie.title}</span>
           </div>
         )}


         <div className="movie-details">
           <h1>{movie.title}</h1>
           <p className="description">{movie.description}</p>
           <p>
             <strong>Year:</strong> {movie.releaseYear}
           </p>
           <p>
             <strong>Duration:</strong> {movie.duration}
           </p>
           <p>
             <strong>Rating:</strong> {movie.rating}
           </p>
           <p>
             <strong>Director:</strong> {movie.director}
           </p>
           <p>
             <strong>Cast:</strong> {movie.cast}
           </p>
           <p>
             <strong>Country:</strong> {movie.country}
           </p>
           <p>
             <strong>Genres:</strong>{' '}
             {movie.categories && movie.categories.length > 0
               ? movie.categories.join(', ')
               : 'N/A'}
           </p>
         </div>
       </div>
       <div>
         <h4>If you liked {movie.title}...</h4>
         <div className="recommendation-row">
           {recommendations.map((rec) => (
             <div className="recommendation-card" key={rec.showId}>
               <img
                 src={`https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters/${rec.title}`}
                 alt={rec.title}
                 className="recommendation-image"
               />
               <p className="recommendation-title">{rec.title}</p>
             </div>
           ))}
         </div>{' '}
       </div>


       <Footer />
     </AuthorizeView>
   </>
 );
}


export default DetailPage;
