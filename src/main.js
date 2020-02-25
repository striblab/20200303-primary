import App from './App.svelte';
import './scss/style.scss';

const app = new App({
	target: document.querySelector('.l-container'),
	props: {
		title: '2020 Minnesota primary results'
	}
});

window.app = app;

export default app;
