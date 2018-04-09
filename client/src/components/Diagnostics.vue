<template>
  <v-card>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex md6 sm6 xs12>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Nom</v-list-tile-title>
                  <v-list-tile-sub-title>{{ codec.systemName }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Type</v-list-tile-title>
                  <v-list-tile-sub-title>{{ codec.productType }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Firmware</v-list-tile-title>
                  <v-list-tile-sub-title>{{ codec.firmware}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
          <v-flex md6 sm6 xs12>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Adresse IP</v-list-tile-title>
                  <v-list-tile-sub-title>{{ codec.ipAddress}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Adresse MAC</v-list-tile-title>
                  <v-list-tile-sub-title>{{ codec.macAddress}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>URI</v-list-tile-title>
                  <v-list-tile-sub-title>{{ codec.uri}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 text-xs-center>
        <v-card flat>
          <v-card-text>
            <a :href="urlCodec" target="_blank" class="subheading">Accéder à l'interface du {{ codec.systemName }}</a>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card color="grey lighten-3" flat tile>
          <v-card-text>
            <v-layout row mb-3 align-center>
              <v-flex>
                <h1 class="headline pl-2">Diagnostics</h1>
              </v-flex>
              <v-flex text-xs-right>
                <v-btn fab color="success" class="flex-without-grow" @click="getDiagnostics">
                  <v-icon>sync</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-expansion-panel>
              <v-expansion-panel-content>
                <div slot="header" class="title error--text">Errors</div>
                <v-card>
                  <v-card-text class="pt-0">
                    <v-container fluid grid-list-sm>
                      <v-layout row wrap>
                        <v-flex xs12 v-for="item in errors" :key="item.id">
                          <v-card color="error" class="white--text">
                            <v-card-title>
                              <h1 class="title d-flex align-center"><v-icon dark>error</v-icon>&nbsp;&nbsp;{{ item.Type }}</h1>
                            </v-card-title>
                            <v-card-text>
                              <h2 class="subheading" v-if="item.Description">{{ item.Description }}</h2>
                              <h3 class="subheading" v-if="item.References"><code>{{ item.References }}</code></h3>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content>
                <div slot="header" class="title warning--text">Warnings</div>
                <v-card>
                  <v-card-text class="pt-0">
                    <v-container fluid grid-list-sm>
                      <v-layout row wrap>
                        <v-flex xs12 v-for="item in warnings" :key="item.id">
                          <v-card color="warning">
                            <v-card-title>
                              <h1 class="title d-flex align-center"><v-icon>warning</v-icon>&nbsp;&nbsp;{{ item.Type }}</h1>
                            </v-card-title>
                            <v-card-text>
                              <h2 class="subheading" v-if="item.Description">{{ item.Description }}</h2>
                              <h3 class="subheading" v-if="item.References"><code>{{ item.References }}</code></h3>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content>
                <div slot="header" class="title info--text">Infos</div>
                <v-card>
                  <v-card-text class="pt-0">
                    <v-container fluid grid-list-sm>
                      <v-layout row wrap>
                        <v-flex xs12 v-for="item in infos" :key="item.id">
                          <v-card color="info" class="white--text">
                            <v-card-title>
                              <h1 class="title d-flex align-center"><v-icon dark>info</v-icon>&nbsp;&nbsp;{{ item.Type }}</h1>
                            </v-card-title>
                            <v-card-text>
                              <h2 class="subheading" v-if="item.Description">{{ item.Description }}</h2>
                              <h3 class="subheading" v-if="item.References"><code>{{ item.References }}</code></h3>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content>
                <div slot="header" class="title success--text">Success</div>
                <v-card>
                  <v-card-text class="pt-0">
                    <v-container fluid grid-list-sm>
                      <v-layout row wrap>
                        <v-flex xs12 v-for="item in success" :key="item.id">
                          <v-card color="success" class="white--text">
                            <v-card-title>
                              <h1 class="title d-flex align-center"><v-icon dark>check_circle</v-icon>&nbsp;&nbsp;{{ item.Type }}</h1>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>

import VueJsonPretty from 'vue-json-pretty'

import moment from 'moment'

import Api from '@/services/Api'

export default {
  data() {
    return {
      errors: [],
      warnings: [],
      infos: [], 
      success: [],
      refreshingData: false
    }
  },
  components: {
    VueJsonPretty
  },
  props: ['codec'],
  created () {
    this.getDiagnostics()
  },
  computed: {
    urlCodec () {
      return 'http://' + this.codec.ipAddress 
    }
  },
  methods: {
    getDiagnostics () {
      Api().get('codec/diagnostics/' + this.codec.macAddress)
        .then(response => {
          this.parseDiagnostics(response.data.Message)
        })
        .catch(e => {
          console.log(e)
        })
    },
    parseDiagnostics (diagnostics) {
      this.errors = []
      this.warnings = []
      this.infos = []
      this.success = []

      for (var element in diagnostics) {
        switch(diagnostics[element].Level) {
          case 'Error':
            this.errors.push(diagnostics[element])
          break;
          case 'Warning':
            this.warnings.push(diagnostics[element])
          break;
          case 'Info':
            this.infos.push(diagnostics[element])
          break;
          case 'OK':
            this.success.push(diagnostics[element])
          break;
        }
      }
    }
  }
}
</script>

<style>
  .expansion-panel__body .card {
    border-radius: 2px !important;
  }
</style>
