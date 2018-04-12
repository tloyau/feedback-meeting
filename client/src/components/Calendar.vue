<template>
  <v-card class="fill-height">
    <v-card-text class="fill-height">
      <full-calendar 
        :events="events" :config="config" ref="calendar" 
        @event-selected="eventSelected" class="min-height">
      </full-calendar>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      colors: [
        "rgb(244,67,54)",
        "rgb(255,152,0)",
        "rgb(255,235,59)",
        "rgb(139,195,74)",
        "rgb(76,175,80)"
      ],
      config: {
        defaultView: 'month',
        locale: 'fr',
        eventLimit: true,
        height: 'parent',
        editable: false,
        header: {
          left: '',
          center: 'title',
          right: ''
        },
        displayEventTime: true,
        columnHeaderText: function(mom) {
          return mom.format('dddd')
        }
      }
    }
  },
  props: ['date', 'calls'],
  methods: {
    eventSelected(event) {
      this.$emit('eventSelected', event.data)
    }
  },
  computed: {
    events: function () {
      var eventsArray = []
      
      for (var call in this.calls) {
        var callData = this.calls[call]

        eventsArray.push({
          title : callData.callHistory.DisplayName,
          start : callData.callHistory.StartTime,
          end : callData.callHistory.EndTime,
          color: this.colors[callData.rate - 1] || "rgb(158,158,158)",
          data: callData
        })
      }

      return eventsArray
    }
  },
  watch: {
    date: function (val) {
      this.$refs.calendar.fireMethod('gotoDate', moment(val).format("YYYY-MM-DD"))
    }
  }
}
</script>

<style>
  .fc { 
    text-transform: capitalize
  }
  .min-height {
    min-height: 500px;
  }
</style>




