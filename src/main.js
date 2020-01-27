import App from './App.svelte';
import './scss/style.scss';

const app = new App({
	target: document.body,
	props: {
		title: '2020 Democratic Primary Live Results'
	}
});

window.app = app;

export default app;
