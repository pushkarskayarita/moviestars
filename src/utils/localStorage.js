export const saveMovieToLocalStorage = (movie, celebrity) => {
	let movies = [];
	if (localStorage.movies) {
		movies = JSON.parse(localStorage.movies);
	}
	movies.push({
		title: movie, celebrity: celebrity,
	});
	localStorage.setItem('movies', JSON.stringify(movies));

};

export const getMovieFromLocalStorage = (movie) => {
	let movies = JSON.parse(localStorage.movies);
	const existingMovieIndex = movies.findIndex(el => {
		return el.title === movie;
	});
	if (existingMovieIndex !== -1) {
		return movies[existingMovieIndex];
	}
};
