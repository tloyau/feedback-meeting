<template>
  <v-app>
    <v-toolbar app dark color="primary">
      <v-icon medium>comment</v-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="slide-y-transition"
        offset-y full-width :return-value.sync="date">
        <v-btn color="success" slot="activator">{{ dateFormat}}</v-btn>
        <v-date-picker type="month" v-model="date" locale="fr" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu = false">Annuler</v-btn>
          <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
      <v-spacer></v-spacer>
      <v-btn @click="dialogCalls = true" color="teal" class="mr-3">Liste des Appels</v-btn>
      <v-toolbar-items>
        <v-btn flat @click="goToGitHub">Github Repo</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-lg fill-height>
        <v-layout row wrap>
          <v-dialog v-model="dialogCallDetails" max-width="1300px">
            <CallDetails :call="callSelected" v-if="callSelected"/>
          </v-dialog>
          <v-dialog v-model="dialogCalls" 
            fullscreen
            transition="dialog-bottom-transition"
            :overlay="false"
            scrollable>
            <Calls :calls="originalCalls" v-on:dialogCalls="dialogCallsCloseEvent"/>
          </v-dialog>
          <v-flex md6 xs12 class="pa-0">
            <v-layout column class="ma-0">
              <GlobalInfo :dateFormat="dateFormat" :date="date" :calls="calls"/>
              <Chart :dateFormat="dateFormat" :date="date" :calls="calls" v-on:handleClickOnChart="handleClickOnChartEvent"/>
            </v-layout>
          </v-flex>
          <v-flex md6 xs12>
            <Calendar :date="date" v-on:eventSelected="handleEvent" :calls="calls"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
  </v-app>
</template>

<style>
  .full-width {
    width: 100%;
  }
  .fill-height {
    height: 100% !important;
  }
  .no-padding {
    padding: 0 !important;
  }
  .flex-without-grow {
    flex: 0 1 auto !important;
  }
  .flex-with-grow {
    flex: 1 1 auto !important;
  }
  .list__tile {
    user-select: auto !important;
  }
</style>

<script>
import Calendar from './components/Calendar'
import GlobalInfo from './components/GlobalInfo'
import CallDetails from './components/CallDetails'
import Chart from './components/Chart'
import Calls from './components/Calls'
import Api from './services/Api'

import moment from 'moment'

export default {
  data () {
    return {
      title: 'Feedback Meeting',
      dialogCallDetails: false,
      dialogDiagnostics: false,
      dialogCalls: false,
      date: null,
      dateFormat: null,
      menu: false,
      calls: [],
      originalCalls: [],
      callSelected: null,
      codecs: []
    }
  },
  name: 'App',
  components: {
    Calendar,
    GlobalInfo,
    CallDetails,
    Chart,
    Calls
  },
  created () {
    this.date = moment().format("YYYY-MM")
  },
  methods: {
    handleEvent(event) {
      this.callSelected = event
      this.dialogCallDetails = true
    },
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    dialogCallsCloseEvent() {
      this.dialogCalls = false
    },
    handleClickOnChartEvent(index) {
      if (index != -1) {
        this.calls = this.calls.filter(function (call) {
          return call.rate === (index + 1)
        })
      } else {
        this.calls = this.originalCalls
      }
    },
    goToGitHub() {
      window.open('https://github.com/tloyau/feedback-meeting', '_blank')
    }
  },
  watch: {
    date: function (val) {
      this.dateFormat = this.jsUcfirst(moment(val).format("MMMM YYYY"))   
    }
  },
  sockets: {
    newCall: function (newCallData) {
      this.originalCalls.push(newCallData)
      this.calls = this.originalCalls
    },
    updateCall: function (newCallData) {
      for (var call in this.originalCalls) {
        if (this.originalCalls[call]._id === newCallData._id) {
          this.originalCalls[call] = newCallData
        }
      }
    }
  },
  mounted () {
    Api().get('call')
      .then(response => {
        this.calls = response.data
        this.originalCalls = response.data
      })
      .catch(e => {
        console.log(e)
      })

    Api().get('codec')
      .then(response => {
        this.codecs = response.data
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>
