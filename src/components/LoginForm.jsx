import { useState } from 'react';
import MovieDetailPage from '../pages/MovieDetailPage.jsx';
import { Route } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm({ onLogin }) {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <form
      onSubmit={(e) => {
        onLogin(e, {
          email: emailValue,
          password: passwordValue,
        });
      }}
    >
      <label htmlFor="email">Email:</label>
      <input
        name="email"
        id="email"
        type="text"
        required
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        name="password"
        id="password"
        type="password"
        required
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <button type="submit">Log In</button>
      <Route
      path='movies/:movieId'
      element={<MovieDetailPage />}
      loader={async ({ params }) => {
        const res = await axios.get(`/api/movies/${params.movieId}`);
        return { movie: res.data };
      }}
      />
    </form>
  );
}
