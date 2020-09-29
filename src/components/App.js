import React, { Component } from 'react';
import Autocomplete from './Autocomplete';
import styles from './App.module.css';

const suggestions = [
	"The Matrix", "The Matrix 4",
	"The Matrix Revolutions", "The Matrix Reloaded",
	"Commando (1985 film)", "The Matrix Revisited",
	"The Animatrix", "The Transformers: The Movie",
	"The Living Matrix", "Kung Pow! Enter the Fist"
];

class App extends Component {

	render() {
		return (

			<div className={styles.container}>
				<h1>Which celebrity<br />do you look like <br /> in a
					movie?</h1>
				<Autocomplete suggestions={suggestions} />
			</div>
		);
	}

}

export default App;
