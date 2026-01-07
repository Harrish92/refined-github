import * as pageDetect from 'github-url-detection';
import features from '../feature-manager.js';
import observe from '../helpers/selector-observer.js';
import { getConversationNumber } from '../github-helpers/index.js';
import getTextNodes from '../helpers/get-text-nodes.js';

function funcDoesThings(prConversation: HTMLElement): void {
	const prNumber = getConversationNumber();

	const textNodesOnThisLine = getTextNodes(prConversation);
	for (const [, textNode] of textNodesOnThisLine.entries()){
		let text = textNode.textContent;
		let prSelfReference = '#' + prNumber!.toString();

		// Find subsequent occurrences
		let searchFromIndex: number = 0;
		const indices: number[] = [];

		while ((searchFromIndex = text.indexOf(prSelfReference, searchFromIndex)) !== -1) {
			indices.push(searchFromIndex);
			searchFromIndex += prSelfReference.length;
		}

		// Split to create a separate node containing the self-referenced link
		for (var indice of indices) {
			textNode.splitText(indice);
			const endingCharacterIndex = indice + prSelfReference.length - 1;
			if (endingCharacterIndex < text.length - 1){
				textNode.splitText(endingCharacterIndex);
			}
			textNode.parentElement!.style.textDecoration = 'underline wavy red';
		}
	}
}

function init(signal: AbortSignal): void {
	observe([
		'.comment-body',
		'.markdown-body',
		'.js-comment-body',
		'.soft-wrap',
		'.user-select-contain',
		'.d-block',
	], funcDoesThings, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isPR, // Find the one you need on https://refined-github.github.io/github-url-detection/
	],
	init,
});

