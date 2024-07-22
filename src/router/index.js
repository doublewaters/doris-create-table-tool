import Vue from 'vue';
import Router from 'vue-router';
import CreateTable from '@/components/CreateTable.vue'; 

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'CreateTable',
    component: CreateTable
  }
];

const router = new Router({
  routes
});

export default router;
