import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import { Movie } from './src/model.js';
import { all } from 'axios';

const app = express();
const port = '8000';
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

//Routes
app.get(`/api/movies`, async (req, res) => {
    const allMovies = await Movie.findAll();
    res.json(allMovies);
});

app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: {email: email }});

    if (user && user.password) {
        req.session.userId = user.userId
        res.json({success: true}) 
    } else {
        res.json({ success: false })
    }
});

ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));
