<template>
  <v-card tile color="grey lighten-3">
    <v-toolbar card color="teal" dark>
      <v-btn icon @click="closeDialog()" dark>
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Admin</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="fill-height">
      <v-container fluid grid-list-lg fill-height>
        <v-layout row wrap>
          <v-flex md6 xs12>
            <v-card class="fill-height">
                <v-card-text class="fill-height">
                  <div d-flex class="fill-height overflow">
                    <v-container fluid>
                      <v-layout row>
                          <v-flex d-flex class="align-items-center">
                              <h1>Etat des codecs</h1>
                          </v-flex>
                          <v-flex text-xs-right>
                              <v-btn fab color="success" @click="refreshCodecs">
                                <v-icon>sync</v-icon>
                              </v-btn>
                          </v-flex>
                      </v-layout>
                    </v-container>
                    <v-container fluid>
                        <v-layout row wrap>
                            <v-flex d-flex v-for="codec in codecs" :key="codec._id">
                                <v-card>
                                    <v-card-title class="title">
                                      {{ codec.systemName }}
                                    </v-card-title>
                                    <v-card-text>
                                        <v-alert :value="true" type="error" v-if="codec.error">
                                          {{ codec.messageError }}
                                        </v-alert>
                                        <v-alert :value="true" type="success" v-if="!codec.error">
                                          Codec enregistré
                                        </v-alert>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                  </div>
                </v-card-text>
            </v-card>
          </v-flex>
          <v-flex md6 xs12>
            <v-card class="fill-height">
                <v-card-text class="fill-height">
                    <v-tabs icons-and-text centered dark color="teal" class="fill-height overflow">
                      <v-tabs-slider color="p"></v-tabs-slider>
                      <v-tab href="#tab-1">
                        Ajouter
                        <v-icon>add</v-icon>
                      </v-tab>
                      <v-tab href="#tab-2">
                        Modifier
                        <v-icon>edit</v-icon>
                      </v-tab>
                      <v-tab href="#tab-3">
                        Supprimer
                        <v-icon>delete</v-icon>
                      </v-tab>
                      <v-tab-item id="tab-1">
                        <v-card flat>
                          <v-card-text>
                            <v-form ref="form" v-model="validAdd" lazy-validation>
                              <v-text-field
                                v-model="modelAdd.systemName"
                                :rules="stringRules"
                                label="Nom du codec"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.macAddress"
                                :rules="stringRules"
                                label="Adresse MAC"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.ipAddress"
                                :rules="stringRules"
                                label="Adresse IP"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.productType"
                                :rules="stringRules"
                                label="Type du produit"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.username"
                                :rules="stringRules"
                                label="Username"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.password"
                                :rules="stringRules"
                                label="Password"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.firmware"
                                :rules="stringRules"
                                label="Version du firmware"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="modelAdd.uri"
                                :rules="stringRules"
                                label="URI du codec"
                                required
                              ></v-text-field>

                              <v-btn
                                color="success"
                                :disabled="!validAdd"
                                @click="submit"
                              >
                                Ajouter
                              </v-btn>
                              <v-btn @click="clear">Effacer</v-btn>
                            </v-form>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item id="tab-2">
                        <v-card flat>
                          <v-card-text>
                            <v-form ref="formEdit" v-model="validEdit" lazy-validation>
                              <v-select
                                v-if="select"
                                :items="codecs"
                                v-model="select"
                                :hint="`${select.systemName}, ${select.ipAddress}`"
                                label="Sélectionnez un codec"
                                single-line
                                item-text="systemName"
                                item-value="_id"
                                return-object
                                persistent-hint
                              ></v-select>
                              <br>
                              <v-card>
                                <v-card-text>
                                  <v-text-field
                                    v-model="modelEdit.systemName"
                                    :rules="stringRules"
                                    label="Nom du codec"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.macAddress"
                                    :rules="stringRules"
                                    label="Adresse MAC"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.ipAddress"
                                    :rules="stringRules"
                                    label="Adresse IP"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.productType"
                                    :rules="stringRules"
                                    label="Type du produit"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.username"
                                    :rules="stringRules"
                                    label="Username"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.password"
                                    :rules="stringRules"
                                    label="Password"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.firmware"
                                    :rules="stringRules"
                                    label="Version du firmware"
                                    required
                                  ></v-text-field>
                                  <v-text-field
                                    v-model="modelEdit.uri"
                                    :rules="stringRules"
                                    label="URI du codec"
                                    required
                                  ></v-text-field>

                                  <v-btn
                                    color="success"
                                    :disabled="!validEdit"
                                    @click="submitEdit"
                                  >
                                    Modifier
                                  </v-btn>
                                </v-card-text>
                              </v-card>
                            </v-form>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item id="tab-3">
                        <v-card flat>
                          <v-card-text>
                            <v-form ref="formDelete">
                              <v-select
                                v-if="select"
                                :items="codecs"
                                v-model="select"
                                :hint="`${select.systemName}, ${select.ipAddress}`"
                                label="Sélectionnez un codec"
                                single-line
                                item-text="systemName"
                                item-value="_id"
                                return-object
                                persistent-hint
                              ></v-select>
                              <v-btn
                                color="error"
                                @click="submitDelete"
                              >
                                Supprimer
                              </v-btn>
                            </v-form>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-snackbar
                  :timeout="timeout"
                  :top="y === 'top'"
                  :bottom="y === 'bottom'"
                  :right="x === 'right'"
                  :left="x === 'left'"
                  :multi-line="mode === 'multi-line'"
                  :vertical="mode === 'vertical'"
                  v-model="snackbar"
                >
                  {{ text }}
                  <v-btn flat color="yellow" @click.native="snackbar = false">Fermer</v-btn>
                </v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style>
.align-items-center {
  align-items: center;
}
.overflow {
  overflow: auto;
}
</style>

<script>
import Api from "../services/Api";
import moment from "moment";

export default {
  data() {
    return {
      modelAdd: {
        systemName: "",
        macAddress: "",
        ipAddress: "",
        productType: "Cisco Codec",
        username: "",
        password: "",
        firmware: "",
        uri: ""
      },
      validAdd: true,
      modelEdit: {
        systemName: "",
        macAddress: "",
        ipAddress: "",
        productType: "Cisco Codec",
        username: "",
        password: "",
        firmware: "",
        uri: ""
      },
      validEdit: true,
      select: null,
      stringRules: [v => !!v || "Veuillez renseigner une valeur"],
      snackbar: false,
      y: "top",
      x: null,
      mode: "",
      timeout: 6000,
      text: ""
    };
  },
  props: ["codecs"],
  methods: {
    closeDialog() {
      this.$emit("dialogAdmin");
    },
    refreshCodecs() {
      this.$emit("refreshCodecs");
    },
    submit() {
      if (this.$refs.form.validate()) {
        Api()
          .post("/codec", this.modelAdd)
          .then(response => {
            this.text = "Codec ajouté !";
            this.snackbar = true;
            this.clear();
            this.$emit("refreshCodecs");
          })
          .catch(e => {
            alert(e);
          });
      }
    },
    submitEdit() {
      if (this.$refs.formEdit.validate()) {
        Api()
          .put("/codec", this.modelEdit)
          .then(response => {
            this.text = "Codec modifié !";
            this.snackbar = true;
            this.$emit("refreshCodecs");
          })
          .catch(e => {
            alert(e);
          });
      }
    },
    submitDelete() {
      Api()
        .delete("/codec/" + this.select._id)
        .then(response => {
          this.text = "Codec supprimé !";
          this.snackbar = true;
          this.$emit("refreshCodecs");
        })
        .catch(e => {
          alert(e);
        });
    },
    clear() {
      this.$refs.form.reset();
    }
  },
  watch: {
    codecs: function(val) {
      if (val) {
        this.select = this.codecs[0];
      }
    },
    select: function(val) {
      if (val) {
        this.modelEdit = val;
      }
    }
  }
};
</script>
