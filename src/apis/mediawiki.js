import axios from 'axios';

export const mediawiki = axios.create({
	baseURL: "https://en.wikipedia.org/w/api.php",
});


export const searchMovies = (userInput) => {

	return mediawiki.get("", {
		params: {
			action: "query",
			list: "search",
			format: "json",
			origin: "*",
			srsearch: `${userInput} incategory:English-language_Netflix_original_programming|English-language_films|English-language_television_shows`,
		}
	});
};

