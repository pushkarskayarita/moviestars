import React, { useCallback } from 'react';
import Loader from './Loader/Loader';
import styles from './CelebrityInfoBox.module.css';

const CelebrityInfoBox = ({ celebrity, toggleIsLoading, isLoading, showInfoBox }) => {

	const setOnload = useCallback(node => {
		if (node !== null) {

			node.addEventListener('load',()=> toggleIsLoading(false));
		}

	}, [toggleIsLoading]);

	return (
		<div className={styles.wrapper} >
			<div className={(!isLoading && showInfoBox) ? styles.container : `${styles.container} ${styles.hidden}`}>
				<div className={styles.photoContainer}>
					{celebrity.imageName ?
						<img
							ref={setOnload}
							src={`http://commons.wikimedia.org/wiki/Special:FilePath/${celebrity.imageName}?height=300px`}  alt={"Celebrity"}/>
							: null}
				</div>
				<div className={styles.content}>
					{celebrity.name ? <h2>{celebrity.name} </h2> : null}
					<h3>{celebrity.character || null}</h3>
				</div>
			</div>
			{isLoading && <Loader />}
		</div>

	);
};

export default CelebrityInfoBox;


