import { Movie, Rating, User, db } from '../src/model.js';
import movieData from './data/movies.json' assert { type: 'json' };
import lodash from "lodash";

console.log('Syncing the database...');
await db.sync ({ force: true });

console.log('Seeding database...');

const moviesInDB =  await Promise.all(movieData.map(async (movie) => {
    const releaseDate = new Date(Date.parse(movie.releaseDate));
    //destructure the obj movie
    const { title, overview, posterPath } = movie;

    const newMovie = Movie.create({
        title,
        overview,
        releaseDate,
        posterPath
    });
    return newMovie
}),
);

console.log(moviesInDB);

// const usersToCreate = [];
// for (let i = 0; i < 10; i++) {
//     const email = `user${i}@test.com`;
//     usersToCreate.push(User.create({ email: email, password: 'test'}))
// }
// const usersInDB = await Promise.all(usersToCreate);
// console.log(usersInDB)

const usersToCreate = [...Array(10).keys()].map((i) => {
    return User.create({ email: `user${i + 1}@test.com`, password: 'test'});
}) 

const usersInDB = await Promise.all(usersToCreate); 

const ratingsInDB = await Promise.all(
    usersInDB.flatMap((user) => {
        //get ten random movies
        const randomMovies = lodash.sampleSize(moviesInDB, 10);

        const movieRatings = randomMovies.map((movie) => {
            return Rating.create({
                score: lodash.random(1, 5),
                userId: user.userId,
                movieId: movie.movieId
            })
        })

        return movieRatings;
    })
);

console.log(ratingsInDB)



await db.close();
console.log('Finished seeding that dataBASE!')