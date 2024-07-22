import Vue from 'vue';
import App from './App.vue';
import router from './router'; // 导入路由配置
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router, // 注册路由
  render: h => h(App),
}).$mount('#app');
