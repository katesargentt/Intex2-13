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
