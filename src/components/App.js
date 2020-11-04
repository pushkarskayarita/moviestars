import React, { Component } from 'react';
import AutocompleteHooks from './Autocomplete/AutocompleteHooks';
import CelebrityInfoBox from './CelebrityInfoBox';
import styles from './App.module.css';
import camera from '../camera.png';

class App extends Component {
	state = {
		celebrity: {},
		showInfoBox: false,
		isLoading: false,
	};

	fetchCelebrityInfo = (celebrity) => {
		this.setState({
			celebrity: celebrity,
		});
	};

	toggleIsLoading = (isLoading) => {
		this.setState({
			isLoading: isLoading,
		});
	};

	resetResults = () => {
		this.setState({ showInfoBox: false });
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.celebrity !== this.state.celebrity) {
			if (!(Object.keys(this.state.celebrity).length === 0) && (this.state.celebrity.constructor === Object)) {
				this.setState({ showInfoBox: true });
			}
			if (prevState.celebrity.imageName === this.state.celebrity.imageName) {

				this.toggleIsLoading();
			}
		}
	}

	render() {
		return (
			<div className={styles.wrapper}>
				<div className={styles.column1}>
					<div className={styles.camera}><img src={camera}
														alt="" /></div>
				</div>
				<div className={styles.column2}>
					<h1 className={styles.main}>Which celebrity<br />do you look like <br /> in a
						movie?</h1>
					<AutocompleteHooks
						fetchCelebrityInfo={this.fetchCelebrityInfo}
						toggleIsLoading={this.toggleIsLoading}
						resetResults={this.resetResults}
					/>
					<CelebrityInfoBox
						celebrity={this.state.celebrity}
						toggleIsLoading={this.toggleIsLoading}
						isLoading={this.state.isLoading}
						showInfoBox={this.state.showInfoBox}
					/>
				</div>
			</div>
		);
	}
}

export default App;

