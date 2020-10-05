import React, { Component } from 'react';
import AutocompleteHooks from './Autocomplete/AutocompleteHooks';
import styles from './App.module.css';

class App extends Component {

	render() {
		return (
			<div className={styles.container}>
				<h1>Which celebrity<br />do you look like <br /> in a
					movie?</h1>
				<AutocompleteHooks />

			</div>
		);
	}

}

export default App;
