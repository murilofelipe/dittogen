import { defineCustomElement } from 'vue';
import App from './App.vue';

// Convert the App component into a web component
const DittogenElement = defineCustomElement(App);

// Register the custom element
customElements.define('dittogen-generator', DittogenElement);
