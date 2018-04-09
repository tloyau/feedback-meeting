// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'

import FullCalendar from 'vue-full-calendar'
import 'fullcalendar/dist/locale/fr'
import 'fullcalendar/dist/fullcalendar.css'

import moment from 'vue-moment'
import momentFR from 'moment/locale/fr'

import VueCharts from 'vue-chartjs'

import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, 'http://144.254.51.227:15140');

Vue.use(Vuetify)
Vue.use(FullCalendar)
Vue.use(moment, {
  momentFR
})
Vue.use(VueCharts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
