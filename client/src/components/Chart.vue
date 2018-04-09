<template>
  <v-flex class="d-flex">
    <v-card class="d-flex flex-with-grow">
      <v-card-text class="d-flex flex-with-grow">
        <v-flex xs12>
          <v-layout column>
            <h2 class="text-xs-center">Répartition en % des notes des appels durant le mois de {{ dateFormat }}</h2>
            <PolarChart :chart-data="datacollection" :options="optionsChart" class="fill-height"></PolarChart>
          </v-layout>
        </v-flex>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import PolarChart from './PolarChart.js'
import moment from 'moment'

Chart.defaults.global.defaultFontSize = 20;

export default {
  components: {
    PolarChart
  },
  data () {
    return {
      datacollection: null,
      optionsChart: {
        legend: {
          position: 'left'
        },
        layout: {
          padding: {
            top: 50,
            bottom: 50
          }
        },
        maintainAspectRatio: false,
        events: ['click'],
        onClick: this.handleClickOnChart
      }
    }
  },
  props: ['date', 'dateFormat', 'calls'],
  watch: {
    calls (calls) {
      this.updateData()
    },
    date (date) {
      this.updateData()
    }
  },
  methods: {
    handleClickOnChart (event, array) {
      if (array[0]) {
        this.$emit('handleClickOnChart', array[0]._index)
      } else {
        this.$emit('handleClickOnChart', -1)
      }
    },
    getCallsOfTheMonth () {
      if (this.calls) {
        var parent = this

        return parent.calls.filter(function(call) {
          return moment(parent.date).format('MM') === moment(call.callHistory.StartTime).format('MM')
        })
      } 

      return []
    },
    updateData () {
      var callsMonth = this.getCallsOfTheMonth()

      var rates = [0, 0, 0, 0, 0]
      var totalRate = 0

      for (var call in callsMonth) {
        var rate = callsMonth[call].rate

        if (rate !== undefined) {
          rates[rate - 1] += 1
          totalRate += 1
        }
      }

      for (var rate in rates) {
        rates[rate] = Math.floor((rates[rate] / totalRate) * 100)
      }

      this.datacollection = {
        labels: ["1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"],
        datasets: [{
          data: rates,
          backgroundColor: [
            "rgba(244,67,54,0.7)",
            "rgba(255,152,0,0.7)",
            "rgba(255,235,59,0.7)",
            "rgba(139,195,74,0.7)",
            "rgba(76,175,80,0.7)"
          ],
          borderColor: "rgba(33,33,33,1)"
        }]
      }
    }
  } 
}
</script>
