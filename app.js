import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import { Movie, User } from './src/model.js';
import { all } from 'axios';

const app = express();
const port = '8000';
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

function loginRequired(req, res, next) {
    if (!req.session.userId) {
        res.status(401).json({error: 'Unauthorized'});
    } else {
        next()
    }
}

//Routes
app.get(`/api/movies`, async (req, res) => {
    const allMovies = await Movie.findAll();
    res.json(allMovies);
});

app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: {email: email }});


    if (user && user.password === password) {
        req.session.userId = user.userId
        res.json({success: true}) 
    } else {
        res.json({ success: false })
    }
});

app.post('/api/logout', (req, res) => {
    if (!req.session.userId) {
        res.status(401).json({ error: 'Unauthorized '});
    } else {;
        req.session.destroy();
        res.json({ success: true});
    }
});

app.get('api/ratings', async (req, res) => {
    const { userId } = req.session;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized '});
    } else {
        const user = await User.findByPk(userId);
        const ratings = await user.getRatings({
            include: {
                model: Movie,
                attributes: ['title'],
            },
        });
        res.json(ratings);
    }
});

app.post('api/ratings', loginRequired, async (req, res) => {
    const { userId } = req.session
    const { movieId, score } = req.body;

    const user = await User.findByPk(userId);
    const rating = await user.createRating({
        movieId: movieId,
        score: score
    });
    res.json(rating)
    // if(!userId) {
    //     res.status(401).json({ error: 'Unauthorized '})
    // } else {
    //     const { movieId, score } = req.body;

    //     const user = await User.findByPk(1);
    //     const rating = await user.createRating({
    //         movieId: 5,
    //         score: 5
    //     })
    // }
});

ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));
