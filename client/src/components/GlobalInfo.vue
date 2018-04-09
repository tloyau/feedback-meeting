<template>
  <v-flex class="flex-without-grow">
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <h2 class="text-xs-center">Infos du mois de {{ dateFormat }}</h2>
          </v-flex>
          <v-flex md6 sm6 xs12>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon class="green white--text">call</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Nombre d'appels total</v-list-tile-title>
                  <v-list-tile-sub-title>{{ totalCalls || "Aucune donnée" }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon class="blue white--text">personal_video</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Codec le plus utilisé</v-list-tile-title>
                  <v-list-tile-sub-title>{{ mostUsedCodec || "Aucune donnée" }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              </v-list>
          </v-flex>
          <v-flex md6 sm6 xs12>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon class="orange white--text">access_time</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Durée moyenne d'appel</v-list-tile-title>
                  <template v-if="averageDuration">
                    <template v-if="averageDuration > 60">
                      <v-list-tile-sub-title>{{ Math.floor(averageDuration / 60) }} minute<span v-if="averageDuration > 120">s</span></v-list-tile-sub-title>
                    </template>
                    <template v-else>
                      <v-list-tile-sub-title>{{ averageDuration }} seconde<span v-if="averageDuration > 1">s</span></v-list-tile-sub-title>
                    </template>
                  </template>
                  <template v-else>
                    <v-list-tile-sub-title>Aucune donnée</v-list-tile-sub-title>
                  </template>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-icon class="teal white--text">rate_review</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Note moyenne</v-list-tile-title>
                  <v-list-tile-sub-title>
                    <template v-if="averageRate">
                      <v-icon v-for="i in averageRate" :key="i.id">grade</v-icon>
                    </template>
                    <template v-else>
                      Aucune donnée
                    </template>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {

    }
  },
  props: ['date', 'dateFormat', 'calls'],
  computed: {
    totalCalls () {
      return this.getCallsOfTheMonth().length
    },
    averageDuration () {
      var callsMonth = this.getCallsOfTheMonth()

      var totalDuration = 0

      for (var call in callsMonth) {
        totalDuration += parseInt(callsMonth[call].callHistory.Duration)
      }
      
      return Math.floor(totalDuration / callsMonth.length)
    },
    mostUsedCodec () {
      var callsMonth = this.getCallsOfTheMonth()

      var codecs = []

      for (var call in callsMonth) {
        var codec = callsMonth[call].codec.systemName

        if (!codecs[codec]) {
          codecs[codec] = 1
        } else {
          codecs[codec] += 1
        }
      }

      var codecMostUsed = null
      var nbCalls = null

      for (var codec in codecs) {
        var currentNbCalls = codecs[codec]

        if (!codecMostUsed) {
          codecMostUsed = codec
          nbCalls = currentNbCalls
        } else if (currentNbCalls > nbCalls) {
          codecMostUsed = codec
          nbCalls = currentNbCalls
        }
      }

      return codecMostUsed
    },
    averageRate () {
      var callsMonth = this.getCallsOfTheMonth()

      var totalRate = 0
      var nbRatings = 0

      for (var call in callsMonth) {
        if (callsMonth[call].rate) {
          nbRatings++
          totalRate += callsMonth[call].rate
        }
      }

      return Math.floor(totalRate / nbRatings)
    }
  },
  methods: {
    getCallsOfTheMonth () {
      if (this.calls) {
        var parent = this

        return parent.calls.filter(function(call) {
          return moment(parent.date).format('MM') === moment(call.callHistory.StartTime).format('MM')
        })
      }

      return []
    }
  } 
}
</script>