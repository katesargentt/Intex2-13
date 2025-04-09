import sqlite3
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import linear_kernel
from scipy.sparse import csr_matrix

class Recommender:
    def __init__(self, db_path="Movies.db"):
        self.conn = sqlite3.connect(db_path)
        self.movies = pd.read_sql_query("SELECT * FROM movies_titles", self.conn)
        self.ratings = pd.read_sql_query("SELECT * FROM movies_ratings", self.conn)
        self.prepare_models()

    def prepare_models(self):
        self.user_movie_df = self.ratings.pivot(index='user_id', columns='show_id', values='rating').fillna(0)
        self.svd = TruncatedSVD(n_components=20, random_state=42)
        self.sparse_matrix = csr_matrix(self.user_movie_df.values)
        self.reduced = self.svd.fit_transform(self.sparse_matrix)
        self.reconstructed = self.svd.inverse_transform(self.reduced)
        self.reconstructed_df = pd.DataFrame(self.reconstructed, index=self.user_movie_df.index, columns=self.user_movie_df.columns)

    def get_similar_movies_by_genre(self, genre, exclude_ids=[], top_n=15):
        genre_columns = [col for col in self.movies.columns if self.movies[col].isin([0, 1]).all()]
        
        # Dynamically create a genre string column
        self.movies['genre'] = self.movies[genre_columns].apply(
            lambda row: ', '.join([col for col in genre_columns if row[col] == 1]),
            axis=1
        )

        # Now filter using the reconstructed genre string
        filtered = self.movies[
            self.movies['genre'].str.contains(genre, na=False) &
            (~self.movies['show_id'].isin(exclude_ids))
        ].copy()

        filtered['image'] = filtered['show_id'] + '.jpg'

        return filtered[['show_id', 'title', 'image', 'genre']].head(top_n).to_dict(orient='records')


    def get_user_recommendations(self, user_id, top_n=20):
        if user_id not in self.reconstructed_df.index:
            return []

        scores = self.reconstructed_df.loc[user_id]
        already_rated = self.ratings[self.ratings['user_id'] == user_id]['show_id'].tolist()
        recommended = scores[~scores.index.isin(already_rated)].nlargest(top_n).index.tolist()

        # Grab movie metadata for the recommended IDs
        result = self.movies[self.movies['show_id'].isin(recommended)].copy()

        # 🔍 Auto-detect genre by looking for genre columns with value == 1
        genre_columns = [col for col in result.columns if result[col].isin([0, 1]).all()]
        result['genre'] = result[genre_columns].apply(lambda row: ', '.join([col for col in genre_columns if row[col] == 1]), axis=1)

        # 🧪 Optionally simulate image file names for now
        result['image'] = result['show_id'] + '.jpg'

        # Only return the fields the frontend needs
        return result[['show_id', 'title', 'image', 'genre']].to_dict(orient='records')

    def get_user_recommendations_with_genre_rows(self, user_id, top_n=20, genre_expansion_n=15):
        if user_id not in self.reconstructed_df.index:
            return {'recommended': [], 'by_genre': {}}

        scores = self.reconstructed_df.loc[user_id]
        already_rated = self.ratings[self.ratings['user_id'] == user_id]['show_id'].tolist()
        recommended_ids = scores[~scores.index.isin(already_rated)].nlargest(top_n).index.tolist()

        # Get metadata for these recommended movies
        recommended_movies = self.movies[self.movies['show_id'].isin(recommended_ids)].copy()

        # Dynamically build genre string
        genre_columns = [col for col in self.movies.columns if self.movies[col].isin([0, 1]).all()]
        recommended_movies['genre'] = recommended_movies[genre_columns].apply(
            lambda row: ', '.join([col for col in genre_columns if row[col] == 1]),
            axis=1
        )
        recommended_movies['image'] = recommended_movies['show_id'] + '.jpg'

        # Build initial response
        result = {
            "recommended": recommended_movies[['show_id', 'title', 'image', 'genre']].to_dict(orient="records"),
            "by_genre": {}
        }

        # Expand: Find more movies from genres in the recommendations
        seen_ids = set(recommended_ids)
        added_genres = set()

        for genre_str in recommended_movies['genre']:
            if not genre_str:
                continue

            for genre in genre_str.split(', '):
                if genre and genre not in added_genres:
                    similar = self.get_similar_movies_by_genre(
                        genre=genre,
                        exclude_ids=list(seen_ids),
                        top_n=genre_expansion_n
                    )
                    if similar:
                        result['by_genre'][genre] = similar
                        added_genres.add(genre)
                        seen_ids.update([movie['show_id'] for movie in similar])

                if len(added_genres) >= 3:
                    break

            if len(added_genres) >= 3:
                break

        return result

def get_content_based_recommendations(target_show_id, top_n=5, db_path="Movies.db"):
    import sqlite3
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel

    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM movies_titles", conn)
    conn.close()

    # Fill missing descriptions with empty strings
    df['description'] = df['description'].fillna("")

    # TF-IDF matrix from descriptions
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['description'])

    # Cosine similarity
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Index of the movie
    indices = pd.Series(df.index, index=df['show_id']).drop_duplicates()
    if target_show_id not in indices:
        return []

    idx = indices[target_show_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    movie_indices = [i[0] for i in sim_scores]

    results = df.iloc[movie_indices].copy()

    # Include genre and image for frontend
    genre_cols = [col for col in results.columns if results[col].isin([0, 1]).all()]
    results['genre'] = results[genre_cols].apply(lambda row: ', '.join([col for col in genre_cols if row[col] == 1]), axis=1)
    results['image'] = results['show_id'] + ".jpg"

    return results[['show_id', 'title', 'image', 'genre']].to_dict(orient='records')
