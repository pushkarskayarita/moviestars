import React, { useState, useEffect, useRef } from 'react';
import styles from './Autocomplete.module.css';
import { searchMovies } from '../../apis/mediawiki';
import { useHideComponent } from '../../hooks/hideComponent';

const AutocompleteHooks = () => {
	const [userInput, setUserInput] = useState("");
	const [debouncedUserInput, setDebouncedUserInput] = useState(userInput);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [activeSuggestion, setActiveSuggestion] = useState(0);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const wrapperRef = useRef(null);

	useHideComponent(wrapperRef,()=> setShowSuggestions(false));

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

						const suggestions = result.data.query.search.map(elem => elem.title)
							.filter(suggestion => suggestion.toLowerCase().indexOf(debouncedUserInput.toLowerCase()) > -1);
						setFilteredSuggestions(suggestions);
					}
				}).catch(error => {
				console.error(error);
			});
		}
	}, [debouncedUserInput]);


	const handleClick = (e) => {
		setActiveSuggestion(0);
		setShowSuggestions(false);
		setFilteredSuggestions([]);
		setUserInput(e.currentTarget.innerText);

		//should make api request
	};

	const handleChange = (e) => {
		setActiveSuggestion(0);
		setShowSuggestions(true);
		setUserInput(e.currentTarget.value);

	};

	const handleKeyDown = (e) => {

		if (e.keyCode === 13) {
			//should make api request

			if (!filteredSuggestions.length) return;
			setShowSuggestions(false);
			setUserInput(filteredSuggestions[activeSuggestion]);

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

	const renderSuggestionsList = () => {
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
				return (
					<div className={styles.noSuggestions}>
						There are no suggestions for this movie.Try another one
					</div>
				);
			}
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
					   value={userInput} />
				{renderSuggestionsList()}
			</div>
		</React.Fragment>
	);

};

export default AutocompleteHooks;
