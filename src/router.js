// in case when Vue don't render your app, just make some changes in your router "push". This is trouble tightly bind with VueRouter

import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Alphabet from './components/Alphabet.vue'
import Test from './components/Test.vue'
import {firebaseApp} from './firebaseApp'
import store from './store.js'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/',  component: Home},
    {path: '/alphabet', component: Alphabet},
    {path: '/test', component: Test}
  ]
})

firebaseApp.auth().onAuthStateChanged(user => {
  if (user) {
    console.log(user.email)
    store.dispatch('signIn', user) // in root component use this.$store and all be working greatly
    // router.push('/')
  } 
});

/*{
  path: '/about',
  name: 'about',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" *//* './views/About.vue')
}*/