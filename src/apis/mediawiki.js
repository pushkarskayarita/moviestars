import axios from 'axios';

const wikipedia = axios.create({
	baseURL: 'https://en.wikipedia.org/w/api.php',
	params: {
		format: 'json',
		origin: '*',
	},
});

const wikidata = axios.create({
	baseURL: 'https://www.wikidata.org/w/api.php',
	params: {
		format: 'json',
		origin: '*',
	},
});
const searchCategories = 'English-language_Netflix_original_programming|English-language_films|English-language_television_shows';

export const searchMovies = (userInput) => {
	if (!userInput) return;
	return wikipedia.get('', {
		params: {
			action: 'query',
			list: 'search',
			srsearch: `${userInput} incategory:${searchCategories}`,
		},
	});
};

function isActorsDataExist(result) {
	const castMembersClaims = result.data.claims.P161;
	const voiceActorsClaims = result.data.claims.P725;
	if (castMembersClaims && castMembersClaims[0].mainsnak.snaktype === 'value') {
		return result.data.claims.P161;
	} else if (voiceActorsClaims && !(castMembersClaims && castMembersClaims[0].mainsnak.snaktype === 'value')) {
		return result.data.claims.P725;
	} else {
		const error = new Error('No actors data for this movie');
		error.name = 'NoActors';
		throw error;
	}
}

export function searchCelebrity(movie) {

	if (!movie) return;
	let actorsClaims;
	let castEntities;

	return asyncGetWikidataItem(movie)
		.then(asyncGetCastMembersClaims)
		.then(result => {
			actorsClaims = isActorsDataExist(result);
			castEntities = actorsClaims.slice(0, 50).map(claim => claim.mainsnak.datavalue.value.id).join('|');
			return asyncGetCastMembersEntities(castEntities);
		})
		.then(asyncGetRandomCastMember)
		.then(result => asyncNameImageCharacter(result, actorsClaims));
}

const asyncGetWikidataItem = movie => {
	return wikipedia.get('', {
		params: {
			action: 'query',
			prop: 'pageprops',
			titles: movie,
		},
	});
};

const asyncGetCastMembersClaims = result => {
	const wikidataItem = Object.values(result.data.query.pages)[0].pageprops.wikibase_item;
	return wikidata.get('', {
		params: {
			action: 'wbgetclaims',
			props: 'value',
			entity: wikidataItem,
		},
	});
};

const asyncGetCastMembersEntities = result => {
	return wikidata.get('', {
		params: {
			action: 'wbgetentities',
			props: 'claims',
			languages: 'en',
			ids: result,
		},
	});
};

const asyncGetRandomCastMember = result => {
	const castMembersWithPhotos = Object.values(result.data.entities).filter(item => item.claims.P18 !== undefined);
	if (castMembersWithPhotos === undefined || castMembersWithPhotos.length === 0) {
		// error.name = 'NoPhoto';
		throw new Error('No photo of actors');
	} else {
		const randomCastMember = Math.round(Math.random() * (castMembersWithPhotos.length - 1));
		return castMembersWithPhotos[randomCastMember].id;
	}
};

const asyncGetCastMemberImage = memberId => {
	return wikidata.get('', {
		params: {
			action: 'wbgetclaims',
			property: 'P18',
			entity: memberId,
		},
	});
};

const asyncGetCastMemberName = memberId => {
	return wikidata.get('', {
		params: {
			action: 'wbgetentities',
			props: 'labels',
			languages: 'en',
			ids: memberId,
		},
	});
};

const asyncGetCastMemberCharacter = (memberId, castMembersClaims) => {
	const character = castMembersClaims.find(item => item.mainsnak.datavalue.value.id === memberId);
	if (character.qualifiers) {
		if (character.qualifiers.P453 !== undefined) {
			const characterId = character.qualifiers.P453[0].datavalue.value.id;

			return wikidata.get('', {
				params: {
					action: 'wbgetentities',
					props: 'labels',
					languages: 'en',
					ids: characterId,
				},
			});
		} else if (character.qualifiers.P4633 !== undefined) {
			return Promise.resolve(character.qualifiers.P4633[0].datavalue.value);
		}
	}
};

const asyncNameImageCharacter = (memberId, castMembersClaims) => {
	return Promise.all(
		[asyncGetCastMemberName(memberId),
			asyncGetCastMemberImage(memberId),
			asyncGetCastMemberCharacter(memberId, castMembersClaims),
		]);
};


