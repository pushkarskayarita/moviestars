import React, { useState, useEffect, useRef } from 'react';
import styles from './Autocomplete.module.css';
import { searchMovies, searchCelebrity } from '../../apis/mediawiki';
import { useHideComponent } from '../../hooks/hideComponent';
import { saveMovieToLocalStorage, getMovieFromLocalStorage } from '../../utils/localStorage';

const AutocompleteHooks = ({ fetchCelebrityInfo, toggleIsLoading, resetResults }) => {

	const [userInput, setUserInput] = useState('');
	const [debouncedUserInput, setDebouncedUserInput] = useState(userInput);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [activeSuggestion, setActiveSuggestion] = useState(0);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [error, setError] = useState(false);
	const wrapperRef = useRef(null);

	useHideComponent(wrapperRef, () => setShowSuggestions(false));

	//debounce
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedUserInput(userInput);
		}, 300);

		return () => {
			clearTimeout(timerId);
		};

	}, [userInput]);

	useEffect(() => {
		if (debouncedUserInput) {
			searchMovies(debouncedUserInput)
				.then(result => {
					if (result.data.error !== undefined) {
						throw  new Error(`${result.data.error.info}`);
					}
					if (result.data.query.search.length) {
						let suggestions = result.data.query.search.map(elem => elem.title)
							.filter(suggestion => suggestion.toLowerCase().indexOf(debouncedUserInput.toLowerCase()) > -1);
						if (suggestions.length >= 9) {
							suggestions = suggestions.slice(0, 8);
						}
						setFilteredSuggestions(suggestions);
					}
				}).catch(error => {
				console.error(error);
			});
		}
	}, [debouncedUserInput]);


	async function getResultsOfSearchCelebrity(movie) {
		if (localStorage.movies !== undefined) {
			const movieInLocalStorage = getMovieFromLocalStorage(movie);
			if (movieInLocalStorage !== undefined) {
				fetchCelebrityInfo(movieInLocalStorage.celebrity);
				return;
			}
		}

		try {
			let results = await searchCelebrity(movie);
			const celebrityName = Object.values(results[0].data.entities)[0].labels.en.value;
			const celebrityImage = results[1].data.claims.P18[0].mainsnak.datavalue.value.split(' ').join('_');
			let characterInMovie;
			if (typeof results[2] === 'string') {
				characterInMovie = results[2];
			} else if (results[2]) {
				characterInMovie = Object.values(results[2].data.entities)[0].labels.en.value;
			} else {
				characterInMovie = '';
			}
			const celebrity = {
				name: celebrityName,
				imageName: celebrityImage,
				character: characterInMovie,
			};

			fetchCelebrityInfo(celebrity);
			saveMovieToLocalStorage(movie, celebrity);

		} catch (error) {
			console.error(error.message);
			setError(true);
			toggleIsLoading(false);
		}
	}


	const handleClick = (e) => {
		setActiveSuggestion(0);
		setShowSuggestions(false);
		setFilteredSuggestions([]);
		setUserInput(e.currentTarget.innerText);
		resetResults();
		toggleIsLoading(true);
		getResultsOfSearchCelebrity(e.currentTarget.innerText);
	};

	const handleChange = (e) => {
		setActiveSuggestion(0);
		setShowSuggestions(true);
		setUserInput(e.currentTarget.value);
		setError(false);
		resetResults();
	};

	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			if (!filteredSuggestions[activeSuggestion]) return;
			setActiveSuggestion(0);
			setShowSuggestions(false);
			setUserInput(filteredSuggestions[activeSuggestion]);
			resetResults();
			toggleIsLoading(true);
			getResultsOfSearchCelebrity(filteredSuggestions[activeSuggestion]);

		} else if (e.keyCode === 38) {
			if (activeSuggestion === 0) {
				return;
			}
			setActiveSuggestion(activeSuggestion - 1);
		} else if (e.keyCode === 40) {
			if (activeSuggestion - 1 === filteredSuggestions.length) {
				return;
			}
			setActiveSuggestion(activeSuggestion + 1);
		}
	};

	const renderMessage = (message) => {
		return (
			<div className={styles.noSuggestions}>
				{message}
			</div>
		);
	};

	const renderSuggestionsList = () => {
		let message = '';
		if (showSuggestions && userInput) {
			if (filteredSuggestions.length) {
				return (
					<ul className={styles.suggestions}>
						{filteredSuggestions.map((suggestion, index) => {
							let className;
							if (index === activeSuggestion) {
								className = styles.suggestionActive;
							}
							return (
								<li className={className}
									key={suggestion}
									onClick={handleClick}
								>
									{suggestion}
								</li>
							);
						})}
					</ul>
				);
			} else {
				message = 'There are no suggestions for this movie.';
				return renderMessage(message);
			}
		} else if (error) {
			message = <p>Not enough information for this movie.<br /> Try another one.</p>;
			return renderMessage(message);
		}
	};

	return (
		<React.Fragment>
			<div className={styles.container}
				 ref={wrapperRef}>
				<input type="text"
					   className={(showSuggestions && userInput && filteredSuggestions.length) ? `${styles.userInput} ${styles.united}` : styles.userInput}
					   placeholder="Enter a movie"
					   onChange={handleChange}
					   onKeyDown={handleKeyDown}
					   value={userInput || ''} />
				{renderSuggestionsList()}
			</div>
		</React.Fragment>
	);
};

export default AutocompleteHooks;
