import React, { Component } from 'react';
import styles from './Autocomplete.module.css';

class Autocomplete extends Component {

	static propTypes = {};
	static defaultProps = {
		suggestions: []
	};

	constructor(props) {
		super(props);
		this.state = {
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: "",
		};
	}

	handleClick = (e) => {
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: e.currentTarget.innerText
		});
	};

	handleChange = (e) => {
		const { suggestions } = this.props;
		const userInput = e.currentTarget.value;
		const filteredSuggestions = suggestions.filter(
			suggestion =>
				suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1);

		this.setState({
			activeSuggestion: 0,
			filteredSuggestions,
			showSuggestions: true,
			userInput: e.currentTarget.value
		});
	};

	handleKeyDown = (e) => {
		const { activeSuggestion, filteredSuggestions } = this.state;

		if (e.keyCode === 13) {
			//should be network request
			this.setState({
				// activeSuggestion: 0,
				showSuggestions: false,
				// userInput: filteredSuggestions[activeSuggestion]
			});
		} else if (e.keyCode === 38) {
			if (activeSuggestion === 0) {
				return;
			}
			this.setState({ activeSuggestion: activeSuggestion - 1 });
		} else if (e.keyCode === 40) {
			if (activeSuggestion - 1 === filteredSuggestions.length) {
				return;
			}
			this.setState({ activeSuggestion: activeSuggestion + 1 });
		}
	};

	render() {
		const {
			state: {
				activeSuggestion,
				filteredSuggestions,
				showSuggestions,
				userInput
			}
		} = this;

		let suggestionsListComponent;
		if (showSuggestions && userInput) {
			if (filteredSuggestions.length) {
				suggestionsListComponent = (
					<ul className={styles.suggestions}>
						{filteredSuggestions.map((suggestion, index) => {
							let className;
							if (index === activeSuggestion) {
								className = styles.suggestionActive;
							}

							return (
								<li className={className}
									key={suggestion}
									onClick={this.handleClick}
								>
									{suggestion}
								</li>
							);
						})}
					</ul>
				);
			} else {
				suggestionsListComponent = (
					<div className={styles.noSuggestions}>
						There are no suggestions for this movie.Try another one
					</div>
				);
			}
		}

		return (
			<React.Fragment>
				<input type="text"
					   className={styles.userInput}
					   placeholder="Enter a movie"
					   onChange={this.handleChange}
					   onKeyDown={this.handleKeyDown}
					   value={userInput} />
				{suggestionsListComponent}
			</React.Fragment>
		);
	}
}

export default Autocomplete;
