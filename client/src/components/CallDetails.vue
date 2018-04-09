<template>
  <v-card color="grey lighten-3">
    <v-card-media src="https://i1.wp.com/techmoran.com/wp-content/uploads/2014/04/Cisco-New-video-and-collaboration-endpoints-March-2014-2.jpg?fit=3000%2C1358&ssl=1" height="300px"></v-card-media>
    <v-card-text>
      <v-layout row wrap justify-space-around>
        <v-flex md7 xs12>
          <v-card tile class="mr-2">
            <v-layout row wrap>
              <v-flex md6 sm6 xs12>
                <v-list two-line>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>person</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Interlocuteur</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.callHistory.DisplayName }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>today</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Date de début d'appel</v-list-tile-title>
                      <v-list-tile-sub-title>{{ startCall }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>call_missed_outgoing</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Origine de l'appel</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.callHistory.Direction }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>personal_video</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Codec utilisé</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.codec.systemName }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>face</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Personne(s) présente(s) dans la salle</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.callHistory.RoomAnalytics.PeopleCount }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>rate_review</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Note</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <template v-if="call.rate">
                          <v-icon v-for="i in call.rate" :key="i.id">grade</v-icon>
                        </template>
                        <template v-else>
                            Aucune note
                        </template>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex md6 sm6 xs12>
                <v-list two-line>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>contact_mail</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>URI</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.callHistory.RemoteNumber }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>event</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Date de fin d'appel</v-list-tile-title>
                      <v-list-tile-sub-title>{{ endCall }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>dialer_sip</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Type d'appel</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.callHistory.Protocol }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>settings_ethernet</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Adresse MAC du codec</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.codec.macAddress }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-icon large>timer</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Durée de l'appel</v-list-tile-title>
                      <template v-if="call.callHistory.Duration > 60">
                        <v-list-tile-sub-title>
                          {{ Math.floor(call.callHistory.Duration / 60) }} minute<span v-if="call.callHistory.Duration > 120">s</span>
                        </v-list-tile-sub-title>
                      </template>
                      <template v-else>
                        <v-list-tile-sub-title>
                          {{ call.callHistory.Duration }} seconde<span v-if="call.callHistory.Duration > 1">s</span>
                        </v-list-tile-sub-title>
                      </template>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile @click="showComments">
                    <v-list-tile-avatar>
                      <v-icon large>comment</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Commentaires</v-list-tile-title>
                      <v-list-tile-sub-title>{{ call.feedbacks || "Aucun commentaire" }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex md5 xs12>
          <v-layout row wrap fill-height align-center>
            <v-flex xs12>
              <v-card tile d-flex class="ml-2">
                <v-tabs icons-and-text centered dark color="primary">
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab href="#tab-1">
                    Audio
                    <v-icon>mic</v-icon>
                  </v-tab>
                  <v-tab href="#tab-2">
                    Video
                    <v-icon>videocam</v-icon>
                  </v-tab>
                  <v-tab-item id="tab-1">
                    <v-card flat>
                      <v-layout row wrap>
                        <v-flex md6 sm6 xs12>
                          <v-subheader>Incoming</v-subheader>
                          <v-list two-line>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLoss</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Audio.Incoming.PacketLoss }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLossPercent</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Audio.Incoming.PacketLossPercent }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>MaxJitter</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Audio.Incoming.MaxJitter }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                        <v-flex md6 sm6 xs12>
                          <v-subheader>Outgoing</v-subheader>
                          <v-list two-line>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLoss</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Audio.Outgoing.PacketLoss }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLossPercent</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Audio.Outgoing.PacketLossPercent }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>MaxJitter</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Audio.Outgoing.MaxJitter }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item id="tab-2">
                    <v-card flat>
                      <v-layout row wrap>
                        <v-flex md6 sm6 xs12>
                          <v-subheader>Incoming</v-subheader>
                          <v-list two-line>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLoss</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Video.Incoming.PacketLoss }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLossPercent</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Video.Incoming.PacketLossPercent }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>MaxJitter</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Video.Incoming.MaxJitter }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                        <v-flex md6 sm6 xs12>
                          <v-subheader>Outgoing</v-subheader>
                          <v-list two-line>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLoss</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Video.Outgoing.PacketLoss }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>PacketLossPercent</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Video.Outgoing.PacketLossPercent }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title>MaxJitter</v-list-tile-title>
                                <v-list-tile-sub-title>{{ call.callHistory.Video.Outgoing.MaxJitter }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey lighten-3" class="elevation-0" light @click="dialogDiagnostics = true">Run Codec Diagnostics</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-dialog v-model="dialogComments" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"><v-icon large class="mr-2">comment</v-icon>Commentaires</span>
        </v-card-title>
        <v-card-text>
          <p class="justify">{{ call.feedbacks || "Aucun commentaire" }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDiagnostics" max-width="600px">
      <Diagnostics :codec="call.codec"/>
    </v-dialog>
  </v-card>
  
</template>

<style>
  code {
    overflow: scroll;
  }
  .justify {
    text-align: justify;
    text-justify: inter-word;
  }
</style>

<script>

import moment from 'moment'
import Diagnostics from './Diagnostics'

export default {
  data() {
    return {
      dialogComments: false,
      dialogDiagnostics: false,
    }
  },
  props: ['call'],
  components: {
    Diagnostics
  },
  computed: {
    startCall () {
      return moment(this.call.callHistory.StartTime).format("dddd Do MMMM YYYY à HH:mm:ss")
    },
    endCall () {
      return moment(this.call.callHistory.EndTime).format("dddd Do MMMM YYYY à HH:mm:ss")
    }
  },
  methods: {
    showComments() {
      this.dialogComments = true
    }
  }
}
</script>


