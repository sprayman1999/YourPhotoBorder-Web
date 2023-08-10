import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue'
import router from './router'
import VueUploadComponent from 'vue-upload-component'
import JpegAnalyzer from './common/Analyzers/JpegAnalyzer';

const app = createApp(App)

app.use(createPinia())
app.use(ArcoVue)
app.use(router)
app.component('file-upload', VueUploadComponent)
app.mount('#app')
