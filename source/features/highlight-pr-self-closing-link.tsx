import * as pageDetect from 'github-url-detection';
import features from '../feature-manager.js';
import observe from '../helpers/selector-observer.js';

function funcDoesThings(): void {
	console.log(1);
}

function init(signal: AbortSignal): void {
	observe('[input="fc-pull_request_body"]', funcDoesThings, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isCompare, // Find the one you need on https://refined-github.github.io/github-url-detection/
	],
	init,
});

