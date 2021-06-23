<template>

  <div style="background-color:#FFF0DF; font-family:DM Sans, sans-serif; min-height: 100vh;">

    <v-row>
      <v-col col="12" md="2">
        <v-navigation-drawer
            absolute
            permanent
            floating
            left
            align="center"
            class="v-navigation-drawer__border"
            style="padding: 18px; font-size:8px; font-weight:bold;
            border-color: white;
            text-align: left; font-color:#4b4b4b;
            display:flex; flex-direction: column; align-items: center; justify-content: center;
            "
        >
          <div style="display: flex; flex-direction: column; height: 100%;">
            <v-img
                width="10vw"
                src="@/assets/orbital_logo_latest.png"
                alt=""
                style="flex: none; top:20%;"
            ></v-img>
            <br>

            <v-list
                :class="`rounded-xl`"
                rounded
                nav
                style="display:flex; flex-direction: column; margin: auto;"
            >


              <v-list-item
                  v-for="item in navItems"
                  :key="item.title"
                  link :to="item.href"
                  color="#ff7200"
                  style="display:flex;  justify-content: center; font-size: 12px; margin-top: 4px; margin-bottom: 4px;"
              >

                <v-list-item-icon style="display:flex;justify-content: center; margin:12px;">

                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title style="font-color:#4b4b4b; margin-right:5px; margin-top:5px; margin-bottom:5px;">
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn color="#ff9d66" depressed large type="submit" v-on:click="signOut">
              <span style="color: #ffffff">Sign Out</span>
            </v-btn>
          </div>
        </v-navigation-drawer>
      </v-col>

      <v-col col="12" md="10">
        <div>
          <div>
            <v-container style="padding-bottom:0px; margin-left: 1vw;">
              <span style="margin-top: 10px; color:#4b4b4b; font-size: 32px; display:flex; align-items: flex-start;
               font-weight:bold">Project</span>
            </v-container>
          </div>

          <v-row>
            <v-col col="12" md="4">
              <div style="margin-left: 1vw; ">
              <v-dialog v-model="dialog" persistent content-class="elevation-0" max-width="600px"
                            :class="`rounded-lg`">
                    <template v-slot:activator="{ on, attrs }" :class="`rounded-lg`">
                      <v-card outlined color="white"
                              style="margin-top: 10px; padding: 2px;"
                              :class="`rounded-lg`">
                        <v-btn
                            :class="`rounded-lg`"
                            style="padding-right:0px; padding-left:0px;"
                            color="white"
                            block
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog = true; addCurrUserToTempGroupmates();"
                        >
                          <span style="color: #ff9d66; font-weight: bold; "> + Add New Project</span>
                        </v-btn>
                      </v-card>
                    </template>
                    <v-sheet outlined color="#ff9d66" style="padding: 3px;" :class="`rounded-xl`">
                      <v-card outlined :class="`rounded-xl`">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                          <v-card-title :class="`rounded-xl`">
                            <span style=" color: #ff9d66;" class="headline">Add New Project</span>
                          </v-card-title>

                          <v-card-text>

                            <v-container :class="`rounded-xl`">
                              <v-row>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Project Title*"
                                      required
                                      :rules="nameRules"
                                      color="#ff9d66"
                                      v-model="title"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Module code*"
                                      color="#ff9d66"
                                      v-model="modCode"
                                      :rules="[v => !!v || 'Module Code is required']"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" align="left">
                                  <span>Groupmates</span>
                                  <v-row>
                                  <div v-if="tempGroupmates.length !==0">
                                    <v-row>
                                    <div v-for="(user,index) in tempGroupmates" :key="user.id">
                                    
                                    <v-chip
                                        class="ma-2"
                                        color="#ff9d66"
                                        text-color="white"
                                        :input-value="user.id"
                        
                                        v-if="user.chipValue"
                                        close
                                        @click:close="remove(user,index)"
                                    >
                                      <v-avatar left class="white--text">
                                        <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                        <v-img :src="user.avatar"></v-img>
                                      </v-avatar>
                                      <span>{{ user.name }}</span>
                                    </v-chip>
                                      
                                  </div>
                                  </v-row>
                                  </div>
                                  <v-dialog v-model="dialogPerson" persistent max-width="600px">
                                    <template v-slot:activator="{ on, attrs }">

                                      <v-btn
                                          v-bind="attrs"
                                          v-on="on"
                                          outlined
                                          color="#ff9d66"
                                          @click="dialogPerson = true">
                                        <v-icon>person_add</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-card>
                                      <v-card-actions>
                                        <v-text-field
                                            v-model="search"
                                            @input="getMatchedUserbyEmail(); getMatchedUserbyName(); onQueryChange(); ">
                                        </v-text-field>
                                        {{search}}
                                      </v-card-actions>
                                      <v-card-text>
                                        <div v-for="user in this.users" :key="user.id">
                                          {{ user.id }}
                                          {{ user.name }}
                                          {{ user.email }}


                                        </div>
                                      </v-card-text>
                                      <v-card
                                          max-width="450"
                                          class="mx-auto"
                                          outlined
                                      >
                                        <v-list>
                                          <v-list-item-avatar
                                              v-if="searchName">
                                            <v-img :src="searchAvatar"></v-img>
                                          </v-list-item-avatar>
                                          {{ searchName }}
                                          <br>
                                          {{ searchEmail }}
                                          <br>
                                          {{ searchId }}
                                          <v-list-item-action>
                                            <v-btn v-if="searchId" 
                                            color="#ff9d66" outlined @click="addGroupmates();">
                                              <v-icon>person_add</v-icon>
                                            </v-btn>
                                          </v-list-item-action>
                                        </v-list>
                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn color="blue darken-1" text @click="dialogPerson = false">
                                            Close
                                          </v-btn>
                                        </v-card-actions>
                                      </v-card>
                                    </v-card>
                                  </v-dialog>
                                  </v-row>
                                </v-col>

                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-menu
                                      required
                                    
                                      v-model="menuAdd"
                                      :close-on-content-click="false"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      color="#ff9d66"
                                      min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                          required
                                          :rules="[v => (!!v && v) !== 'Deadline' || 'Deadline is required']"
                                          v-model="displayDeadline"
                                          label="Deadline*"
                                          prepend-icon="mdi-calendar"
                                          v-bind="attrs"
                                          v-on="on"
                                          color="#ff9d66"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        :disabled="dateSwitchValue == 1"
                                        color="#ff9d66"
                                        v-model="myDeadline"
                                        @input="menuAdd = false; changeDisplayDeadline();"
                                    >
                                      <div style="margin-left:10px; margin-top:-10px; padding-bottom: 10px;">
                                      <v-switch
                                          inset
                                          hide-details
                                          v-model="dateSwitchValue"
                                          color="#ff9d66"
                                          :label="`Someday`"
                                          @change="changeDisplayDeadline()"
                                      ></v-switch>
                                     
                                      </div>
                                    </v-date-picker>
                                  </v-menu>
                                  <v-row style="padding-top:5px;">
                                    <v-col cols="12" md="6" style="display:flex;">
                                      <v-switch
                                          :disabled="dateSwitchValue == 1"
                                          inset
                                          hide-details
                                          v-model="switchValue"
                                          color="#ff9d66"
                                          :label="`Include Time`"
                                      ></v-switch>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <v-menu
                                          ref="menu3"
                                          v-model="menu3"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="myDeadlineTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                      >
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-text-field
                                              :disabled="switchValue == 0  || dateSwitchValue == 1"
                                              v-model="myDeadlineTime"
                                              label="Time"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            scrollable
                                            v-if="menu3"
                                            v-model="myDeadlineTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            @click:minute="$refs.menu3.save(myDeadlineTime)"
                                        ></v-time-picker>

                                      </v-menu>
                                    </v-col>
                                  </v-row>
                                </v-col>

                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn justify="center" color="#ff9d66" text @click="dialog = false; clearInfo()">
                              Cancel
                            </v-btn>
                            <v-btn color="#ff9d66" :disabled="!valid || this.title == '' || this.modCode =='' "
                                   text @click="dialog = false;  checkTimeAdd(); ">
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-sheet>
              </v-dialog>
              </div>
              <div style="margin-left: 1vw; display:flex; flex-direction: column; justify-content: center;">
                <v-container :class="`rounded-lg`"> 
                  <v-card style="padding: 8px;" color="#ff9d66" outlined :class="`rounded-lg`">
                      <span style="margin-top: 10px; color:white; font-size: 20px; display:flex; justify-content: center;
               font-weight:bold">Project Invitation</span>
                  <v-card outlined color="white">
                    <p> Some project invitation stuff here</p>
                  </v-card>
                  </v-card>
                </v-container>
              </div>
            </v-col>

            <v-col col="12" md="8">
              <div style="display: flex">
              <v-conatiner style="margin-right:auto; margin-left:auto; display:flex">
                <v-card outlined color="#FFE4CB" style="padding: 8px; display:flex; flex-direction: column;" :class="`rounded-xl`">
                    <div style="padding:8px; display:flex; flex-direction: row;">
                      <span style="margin-top: 10px; color:#4b4b4b; font-size: 20px; display:flex; align-items: flex-start;
                      font-weight:bold">Overview</span>
                      <span style="margin-top: 10px; color:#4b4b4b; font-size: 16px; display:flex; align-items: end;
                      font-weight:bold">Click any project to see more details</span>
                   </div>
                    
                      <div v-if="length" style="padding:8px; display:flex; flex-direction: row;">
                      <v-sheet
                        :class="`rounded-xl`"
                        class="mx-auto"
                        elevation="0"
                        max-width="50vw"
                        style="background-color:#FFE4CB;"
                        
                      >
                        <v-slide-group
                          v-model="projectSlide"
                          class="pa-2"
                          active-class="success"
                          show-arrows
                        >
                          <v-slide-item
                            v-for="(project) in this.$store.state.projects"
                            :key="project.id"
                            v-slot="{ active, toggle }"
                          >
                            <v-card
                             :class="`rounded-xl`"
                              :color="active ? undefined : 'white'"
                              class="ma-2"
                              height="200"
                              width="330"
                              @click="toggle"
                              style="padding: 10px;"
                            >
                            <v-row style="padding: 5px;">
                              <v-col col="12" md="9" style="display:flex; flex-direction: column;">
                                <v-card-text style="display:flex; padding-bottom: 0px !important; padding-top :3px !important;
                                 padding-left :3px !important; padding-right :3px !important;">
                                  {{project.modCode}}
                                </v-card-text>
                                <v-card-title style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important">
                                  {{project.title}}
                                </v-card-title>
                                <v-card-text style="display:flex; padding: 2px !important;">
                                  <div v-if="project.deadline !== null">
                                <span style="">
                                  <v-icon color="#ff9d66" width="20px;">calendar_today</v-icon>
                                    {{
                                    project.deadline.toLocaleDateString("en-US", {
                                      month: 'short',
                                      day: "2-digit",
                                      year: "numeric"
                                    })
                                  }}</span>
                              </div>
                              <div v-else>
                                <span style="">
                                  <v-icon color="#ff9d66" width="20px;"> calendar_today</v-icon>
                                  Someday
                                </span>
                                </div>
                        
                                </v-card-text>
                                
                              </v-col>
                              <v-col col="12" md="3" style="display:flex; align-items: center; padding:0px !important">
                                <v-progress-circular
                                style="display:flex; justify-content: center; align-item: center; "
                                  class="progress-circular v-progress-circular__underlay"
                                  :rotate="-90"
                                  :size="60"
                                  :width="10"
                                  :value="project.progress"
                                  color="#ff9d66"
                              >
                                 {{Math.trunc((project.progress)*100) + "%"}}
                                </v-progress-circular>
                                
                              </v-col>

                            
                            </v-row>
                            <v-divider style="padding:3px;"></v-divider>
                            <span style="display:flex; align-item:center; padding: 3px; color: #999999; "><v-icon color="#999999" width="20px" style="padding:3px;">groups</v-icon> Scheduled Meeting</span>
                            
                            <span style="display:flex; padding: 3px; color: #999999; "><v-icon color="#999999" width="20px" style="padding:3px;">check_circle</v-icon>   Incompleted Todo </span>
                            
                              
                        
                            
                              <v-row
                                class="fill-height"
                                align="center"
                                justify="center"
                              >
                                <v-scale-transition>
                                  <v-icon
                                    v-if="active"
                                    color="white"
                                    size="48"
                                    v-text="'mdi-close-circle-outline'"
                                  ></v-icon>
                                </v-scale-transition>
                              </v-row>
                            </v-card>
                          </v-slide-item>
                        </v-slide-group>
                      </v-sheet>
                      </div>
                    
                    
                  
                </v-card>
              </v-conatiner>
              </div>
            </v-col>
          </v-row>

          <div>
            <v-container>
              <v-card outlined color="#FFE4CB" style="padding: 20px;" :class="`rounded-xl`">
                <v-virtual-scroll
                    :items="items"
                    :bench="100"
                    height="61vh"
                    item-height="80"
                >
                  <v-dialog v-model="dialog" persistent content-class="elevation-0" max-width="600px"
                            :class="`rounded-lg`">
                    <template v-slot:activator="{ on, attrs }" :class="`rounded-xl`">
                      <v-card outlined color="white"
                              style="margin-top: 10px;margin-left:16px; margin-right:16px; padding: 8px;"
                              :class="`rounded-xl`">
                        <v-btn
                            :class="`rounded-xl`"
                            color="white"
                            block
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog = true; addCurrUserToTempGroupmates();"
                        >
                          <span style="color: #ff9d66; font-weight: bold"> + Add New Project</span>
                        </v-btn>
                      </v-card>
                    </template>
                    <v-sheet outlined color="#ff9d66" style="padding: 3px;" :class="`rounded-xl`">
                      <v-card outlined :class="`rounded-xl`">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                          <v-card-title :class="`rounded-xl`">
                            <span style="color: #ff9d66;" class="headline">Add New Project</span>
                          </v-card-title>

                          <v-card-text>

                            <v-container :class="`rounded-xl`">
                              <v-row>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Project Title*"
                                      required
                                      :rules="nameRules"
                                      color="#ff9d66"
                                      v-model="title"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Module code*"
                                      color="#ff9d66"
                                      v-model="modCode"
                                      :rules="[v => !!v || 'Module Code is required']"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" align="left">
                                  <span>Groupmates</span>
                                  <v-row>
                                  <div v-if="tempGroupmates.length !==0">
                                    <v-row>
                                    <div v-for="(user,index) in tempGroupmates" :key="user.id">
                                    
                                    <v-chip
                                        class="ma-2"
                                        color="#ff9d66"
                                        text-color="white"
                                        :input-value="user.id"
                        
                                        v-if="user.chipValue"
                                        close
                                        @click:close="remove(user,index)"
                                    >
                                      <v-avatar left class="white--text">
                                        <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                        <v-img :src="user.avatar"></v-img>
                                      </v-avatar>
                                      <span>{{ user.name }}</span>
                                    </v-chip>
                                      
                                  </div>
                                  </v-row>
                                  </div>
                                  <v-dialog v-model="dialogPerson" persistent max-width="600px">
                                    <template v-slot:activator="{ on, attrs }">

                                      <v-btn
                                          v-bind="attrs"
                                          v-on="on"
                                          outlined
                                          color="#ff9d66"
                                          @click="dialogPerson = true">
                                        <v-icon>person_add</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-card>
                                      <v-card-actions>
                                        <v-text-field
                                            v-model="search"
                                            @input="getMatchedUserbyEmail(); getMatchedUserbyName(); onQueryChange(); ">
                                        </v-text-field>
                                        {{search}}
                                      </v-card-actions>
                                      <v-card-text>
                                        <div v-for="user in this.users" :key="user.id">
                                          {{ user.id }}
                                          {{ user.name }}
                                          {{ user.email }}


                                        </div>
                                      </v-card-text>
                                      <v-card
                                          max-width="450"
                                          class="mx-auto"
                                          outlined
                                      >
                                        <v-list>
                                          <v-list-item-avatar
                                              v-if="searchName">
                                            <v-img :src="searchAvatar"></v-img>
                                          </v-list-item-avatar>
                                          {{ searchName }}
                                          <br>
                                          {{ searchEmail }}
                                          <br>
                                          {{ searchId }}
                                          <v-list-item-action>
                                            <v-btn v-if="searchId" 
                                            color="#ff9d66" outlined @click="addGroupmates();">
                                              <v-icon>person_add</v-icon>
                                            </v-btn>
                                          </v-list-item-action>
                                        </v-list>
                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn color="blue darken-1" text @click="dialogPerson = false">
                                            Close
                                          </v-btn>
                                        </v-card-actions>
                                      </v-card>
                                    </v-card>
                                  </v-dialog>
                                  </v-row>
                                </v-col>

                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-menu
                                      required
                                    
                                      v-model="menuAdd"
                                      :close-on-content-click="false"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      color="#ff9d66"
                                      min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                          required
                                          :rules="[v => (!!v && v) !== 'Deadline' || 'Deadline is required']"
                                          v-model="displayDeadline"
                                          label="Deadline*"
                                          prepend-icon="mdi-calendar"
                                          v-bind="attrs"
                                          v-on="on"
                                          color="#ff9d66"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        :disabled="dateSwitchValue == 1"
                                        color="#ff9d66"
                                        v-model="myDeadline"
                                        @input="menuAdd = false; changeDisplayDeadline();"
                                    >
                                      <div style="margin-left:10px; margin-top:-10px; padding-bottom: 10px;">
                                      <v-switch
                                          inset
                                          hide-details
                                          v-model="dateSwitchValue"
                                          color="#ff9d66"
                                          :label="`Someday`"
                                          @change="changeDisplayDeadline()"
                                      ></v-switch>
                                     
                                      </div>
                                    </v-date-picker>
                                  </v-menu>
                                  <v-row style="padding-top:5px;">
                                    <v-col cols="12" md="6" style="display:flex;">
                                      <v-switch
                                          :disabled="dateSwitchValue == 1"
                                          inset
                                          hide-details
                                          v-model="switchValue"
                                          color="#ff9d66"
                                          :label="`Include Time`"
                                      ></v-switch>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <v-menu
                                          ref="menu3"
                                          v-model="menu3"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="myDeadlineTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                      >
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-text-field
                                              :disabled="switchValue == 0  || dateSwitchValue == 1"
                                              v-model="myDeadlineTime"
                                              label="Time"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            scrollable
                                            v-if="menu3"
                                            v-model="myDeadlineTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            @click:minute="$refs.menu3.save(myDeadlineTime)"
                                        ></v-time-picker>

                                      </v-menu>
                                    </v-col>
                                  </v-row>
                                </v-col>

                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn justify="center" color="#ff9d66" text @click="dialog = false; clearInfo()">
                              Cancel
                            </v-btn>
                            <v-btn color="#ff9d66" :disabled="!valid || this.title == '' || this.modCode =='' "
                                   text @click="dialog = false;  checkTimeAdd(); ">
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-sheet>
                  </v-dialog>
                  <br>


                  <div v-if="length">
                    <div v-for="(project,index) in this.$store.state.projects" :key="project.id">
                      <template >
                        <v-list-item style="display: block;">
                          <v-card outlined class="v-card" color="white" style="margin: auto;" :class="`rounded-xl`"
                          >

                            <v-row style="margin:0px;">
                              <v-col cols="12" md="2" align="center" justify="center" class="centerAlign"
                                     style="padding-top: 20px;padding-bottom: 20px;font-weight: bold; font-size: 20px; flex-direction: column">
                              <div v-if="project.deadline !== null">
                                <span style="margin-left:3vw; ">{{
                                    project.deadline.toLocaleDateString("en-US", {
                                      month: 'short',
                                      day: "2-digit"
                                    })
                                  }}</span>
                              </div>
                              <div v-else>
                                <span style="margin-left:3vw; ">
                                  Someday
                                </span>
                                </div>

                              <div v-if="project.deadline !== null">
                                <span class="centerAlign" style="margin-left:3vw;font-size: 14px; ">{{
                                    project.deadline.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                                  }}</span>
                              </div>


                              </v-col>
                              <v-col cols="12" md="1">
                                <v-divider vertical style="padding-top: 20px;padding-bottom: 20px;" class="leftAlign">
                                </v-divider>
                              </v-col>
                              <v-col cols="12" md="5" align="left" class="leftAlign"
                                     style="padding-top: 20px;padding-bottom: 20px;">


                                <v-row style="margin:0px;">
                                  <span style="font-weight: bold; font-size: 20px;"
                                  >{{ project.title }}</span>
                                </v-row>
                                <v-row style="margin:0px;">

                                  <span style="font-weight: normal;">{{ project.modCode }}</span>
                                </v-row>
                                <v-row style="margin:0px;">
                                  <span style="font-weight: lighter; font-size: 14px;">{{ project.groupmatesName }}</span>
                                </v-row>

                              </v-col>
                              <v-col col="12" md="1" align="right" class="centerAlign">
                                <v-list-item-action>
                                  <v-dialog v-model="display[project.title]" content-class="elevation-0" persistent
                                            max-width="600px"
                                            :class="`rounded-lg`">

                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                          color="#ff9d66"
                                          v-bind="attrs"
                                          v-on="on"
                                          icon
                                          @click="fillInfo(project);"
                                      >
                                        <v-icon> mdi-pencil-outline</v-icon>

                                      </v-btn>
                                    </template>
                                    <v-sheet outlined color="#ff9d66" style="padding: 3px;" :class="`rounded-xl`">

                                      <v-card outlined :class="`rounded-xl`">
                                        <v-form
                                            ref="form"
                                            v-model="valid"
                                            lazy-validation
                                        >
                                          <v-card-title :class="`rounded-xl`">
                                            <span class="headline">Edit Project</span>
                                          </v-card-title>

                                          <v-card-text>
                                            <v-container>
                                              <v-row>
                                                <v-col cols="12">
                                                  <v-text-field
                                                      label="Project Title*"
                                                      required
                                                      value="project.title"
                                                      :rules="nameRules"
                                                      v-model="title"
                                                      color="#ff9d66"

                                                  ></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                  <v-text-field
                                                      label="Module code"
                                                      color="#ff9d66"
                                                      v-model="modCode"
                                                      :rules="[v => !!v  || 'Module Code is required']"

                                                  >
                                                  </v-text-field>
                                                </v-col>
                                                <v-col cols="12" align="left">
                                                  <span>Groupmates</span>
                                                  <div  v-if="tempGroupmates.length !==0">
                                                    <div v-for="(user,index) in tempGroupmates" :key="user.id">
                                                     <v-row>
                                                    <v-chip
                                                        class="ma-2"
                                                        color="#ff9d66"
                                                        text-color="white"
                                                        :input-value="user.id"
                                                        v-if="user.chipValue"
                                                        close
                                                        @click:close="remove(user,index)"
                                                    >
                                                      <v-avatar left class="white--text">
                                                        <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                                        <v-img :src="user.avatar"></v-img>
                                                      </v-avatar>
                                                      <span>{{ user.name }}</span>
                                                    </v-chip>
                                                     </v-row>
                                                    </div>
                                                  </div>
                                                  <v-dialog v-model="groupmateDialogEdit" persistent max-width="600px">
                                                    <template v-slot:activator="{ on, attrs }">

                                                      <v-btn
                                                          v-bind="attrs"
                                                          v-on="on"
                                                          outlined
                                                          color="#ff9d66"
                                                          @click="groupmateDialogEdit = true">
                                                        <v-icon>person_add</v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <v-card>
                                                      <v-card-actions>
                                                        <v-text-field
                                                            v-model="search"
                                                            @input="getMatchedUserbyEmail(); getMatchedUserbyName(); onQueryChange(); ">
                                                        </v-text-field>
                                                      </v-card-actions>
                                                      <v-card
                                                          max-width="450"
                                                          class="mx-auto"
                                                          outlined
                                                      >
                                                        <v-list>
                                                          <v-list-item-avatar
                                                              v-if="searchName">
                                                            <v-img :src="searchAvatar"></v-img>
                                                          </v-list-item-avatar>
                                                          {{ searchName }}
                                                          <br>
                                                          {{ searchEmail }}
                                                          <br>
                                                          {{ searchId }}
                                                          <v-list-item-action>
                                                            <v-btn v-if="searchId" outlined color="#ff9d66" @click="addGroupmates();">
                                                              <v-icon>person_add</v-icon>
                                                            </v-btn>
                                                          </v-list-item-action>
                                                        </v-list>
                                                        <v-card-actions>
                                                          <v-spacer></v-spacer>
                                                          <v-btn color="blue darken-1" text
                                                                 @click="groupmateDialogEdit = false; checkClosing()">
                                                            Close
                                                          </v-btn>
                                                        </v-card-actions>
                                                      </v-card>
                                                    </v-card>
                                                  </v-dialog>
                                                </v-col>

                                                <v-col cols="12">
                                                  {{myDeadline}}
                                                  {{myDeadlineTime}}
                                                  {{dateSwitchValue}}
                                                  {{switchValue}}
                                                  {{displayDeadline}}
                                              <v-menu
                                                  v-model="menu[project.title]"
                                                  :close-on-content-click="false"
                                                  :nudge-right="40"
                                                  transition="scale-transition"
                                                  offset-y
                                                  color="#ff9d66"
                                                  min-width="auto"
                                              >
                                                <template v-slot:activator="{ on, attrs }">
                                                  <v-text-field
                                                      :rules="[v => (!!v && v) !== 'Deadline' || 'Deadline is required']"
                                                      v-model="displayDeadline"
                                                      label="Deadline*"
                                                      prepend-icon="mdi-calendar"
                                                      readonly
                                                      color="#ff9d66"
                                                      v-bind="attrs"
                                                      v-on="on"
                                                  ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                    :disabled="dateSwitchValue == 1"
                                                    color="#ff9d66"
                                                    v-model="myDeadline"
                                                    @input="menu[project.title] = false; changeDisplayDeadline();"
                                                >
                                                  <v-switch
                                                    inset
                                                    hide-details
                                                    v-model="dateSwitchValue"
                                                    color="#ff9d66"
                                                    :label="`Someday`"
                                                    @change="changeDisplayDeadline()"
                                                  ></v-switch>
                                                  
                                                </v-date-picker>
                                              </v-menu>
                                              <v-row style="padding-top:5px;">
                                                <v-col cols="12" md="6" style="display:flex; align-items: center;">
                                                  <v-switch
                                                      :disabled="dateSwitchValue == 1"
                                                      inset
                                                      hide-details
                                                      v-model="switchValue"
                                                      color="#ff9d66"
                                                      :label="`Include Time`"
                                                  ></v-switch>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                  <v-menu
                                                      :ref="'timeMenu'+index"
                                                      v-model="time[project.title]"
                                                      :close-on-content-click="false"
                                                      :nudge-right="40"
                                                      :return-value.sync="myDeadlineTime"
                                                      transition="scale-transition"
                                                      offset-y
                                                      style=" z-index:20"
                                                      max-width="290px"
                                                      color="#ff9d66"
                                                      min-width="290px"
                                                  >
                                                    <template v-slot:activator="{ on, attrs }">
                                                      <v-text-field
                                                          :disabled="switchValue == 0 || dateSwitchValue == 1"
                                                          v-model="myDeadlineTime"
                                                          label="Time"
                                                          prepend-icon="mdi-clock-time-four-outline"
                                                          readonly
                                                          color="#ff9d66"
                                                          v-bind="attrs"
                                                          v-on="on"
                                                      ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        scrollable
                                                        v-model="myDeadlineTime"
                                                        color="#ff9d66"
                                                        full-width
                                                        format="24hr"
                                                        @click:minute="y = 'timeMenu'+index.toString(); a = $refs[y]; a[0].save(myDeadlineTime); time[project.title] = false">
                                                    </v-time-picker>
                                                  </v-menu>
                                                </v-col>
                                              </v-row>
                                            </v-col>

                                              </v-row>
                                            </v-container>
                                            <!--                                        <small>*indicates required field</small>-->
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn color="#ff9d66" text
                                                   @click="display[project.title] = false; clearInfo();">
                                              Close
                                            </v-btn>
                                            <v-btn color="#ff9d66" text :disabled="!valid "
                                                   @click="display[project.title] = false; checkEdit(project);">

                                              Update
                                            </v-btn>
                                          </v-card-actions>
                                        </v-form>
                                      </v-card>
                                    </v-sheet>

                                  </v-dialog>
                                </v-list-item-action>

                              </v-col>
                              <v-col col="12" md="1" align="left" class="centerAlign">

                                <v-list-item-action>
                                  <v-btn color="#A5A5A5" icon @click="deleteProject(project)">
                                    <v-icon> mdi-trash-can-outline
                                    </v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-col>

                              <v-col cols="12" md="2" class="centerAlign" style="background-color: #ff9d66"
                                     :class="`rounded-r-xl`">

                              </v-col>


                            </v-row>

                          </v-card>
                        </v-list-item>
                      </template>


                      <br>


                    </div>
                  </div>
<!--                  <div v-else>-->
<!--                    You have no project.-->
<!--                  </div>-->
                </v-virtual-scroll>
              </v-card>
            </v-container>

          </div>
        </div>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import firebase from "firebase";
import {db} from "../main.ts"
import _ from 'lodash';

export default {
  name: "Project.vue",
  data: () => ({
    dialog: false,
    dialogPerson: false,
    dialogEdit: false,
    myDeadline: new Date().toISOString().substr(0, 10),
    myDeadline2: new Date().toISOString().substr(0, 10),
    title: "",
    menu: {},
    modal: false,
    switchValue: false,
    menu2: false,
    menu3: false,
    menu4: false,
    value: 0,
    passingFinalGroupmates: [],
    modCode: "",
    errors: "",
    nameRules: [
      v => !!v || 'Project title is required',
    ],
    display: {},
    menuEdit: {},
    projectSlide: null,
    myDeadlineTime: "00:00",
    search: "",
    users: [],
    usersNew: [],
    groupmateDialog: [],
    searchName: "",
    searchEmail: "",
    searchId: "",
    displayDeadline: "Deadline",
    tempGroupmates: [],
    varGroupmates:[],
    varGroupmatesId: [],
    finalGroupmates: [],
    finalDeadline:  new Date().toISOString().substr(0, 10),
    dateSwitchValue: false,
    valid: true,
    time: [],
    menuAdd: false,
    tempUser: null,
    chips: [],
    todos: [],
    groupmateDialogEdit:false,
    progress: 0,
    oldGroupmates: [],
    searchAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',

    navItems: [
      {title: 'Secret', href: "./secret", icon: 'mdi-account-group-outline'},
      {title: 'Todo', href: "./todo", icon: 'mdi-account-group-outline'},
      {title: 'Project', href: "./project", icon: 'mdi-account-group-outline'},

    ],
  }),

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = !!user;
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
    // this.$store.dispatch('getProjects');
  },

  mounted(){
    console.log("hello")
      this.$store.dispatch('getProjects');
      this.remainingTodo()

  },
  computed: {
    items() {
      return Array.from({length: 1}, (k, v) => v + 1)
    },
    length() {
      return this.$store.state.projects.length
    },
    
  
  },

  // beforeMount(){
  //   this.$store.getters.getProjects
  // },


  methods: {
    checkClosing(){
      console.log("checkClosing")
    },
    async addCurrUserToTempGroupmates(){
      const docRef = await db.collection('user').doc(this.$store.state.user.uid).get()
      this.tempGroupmates.push({
        id: docRef.id,
        name: docRef.get('name'),
        email: docRef.get('email'),
        object: docRef,
        chipValue:true,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
      })
      console.log(this.tempGroupmates)
    },
    async checkEdit(project) {
      if (this.switchValue == false) {
        console.log(this.myDeadlineTime)
        this.myDeadlineTime = "00:00"
        console.log(this.myDeadlineTime)
      }
      if (this.title == "") {
        this.title = project.title
      }
      if (this.modCode == "") {
        this.modCode = project.modCode
      }
       if (this.displayDeadline == "Someday") {
        this.finalDeadline = null
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline + "T" + (this.myDeadlineTime) + ":00+08:00"));
      }
      await this.passGroupmates();
      this.editProject(project)
    },

    async fillInfo(project) {
      this.title = project.title;
      this.modCode = project.modCode;
      this.myDeadline = project.deadlineDate;
      this.myDeadlineTime = project.deadlineTime;
      this.switchValue = project.switchValue;
      this.finalDeadline = project.deadline;
      this.dateSwitchValue = project.dateSwitchValue;
      this.displayDeadline = project.displayDeadline;
      this.tempGroupmates = await this.getGroupmates(project.groupmates);
      this.oldGroupmates = await this.getGroupmatesId(project.groupmates);
      this.progress = project.progress;
      this.todos = project.todos;
      console.log(this.varGroupmates)
      console.log(this.tempGroupmates)
      this.varGroupmates = [];
    },
    async checkTimeAdd() {
      if (this.switchValue == false) {
        this.myDeadlineTime = "00:00"
      }
      if (this.displayDeadline == "Someday") {
        this.finalDeadline = null
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline + "T" + (this.myDeadlineTime) + ":00+08:00"));
      }
      await this.passGroupmates();
      this.addProject();
    },

    validate () {
      this.$refs.form.validate()
    },

    clearInfo() {
      this.title = "";
      this.modCode = "";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.finalGroupmates = [];
      this.myDeadlineTime = "00:00";
      this.switchValue = false;
      this.finalDeadline = new Date().toISOString().substr(0, 10)
      this.displayDeadline= "Deadline";
      this.dateSwitchValue = false;
    },
    async signOut() {
      try {
        const data = await firebase.auth().signOut();
        console.log(data);
        this.$router.replace({name: "Login"});
        this.$store.state.snapshot.unsubscribe()
      } catch (err) {
        console.log(err);
      }
    },
    async fetchUserID(){
      this.$store.state.user.uid
    },
    async addProject() {
      this.errors = ""
        const response = await db.collection('project').add({
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          title: this.title,
          todos: [],
          progress: 0,
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          dateSwitchValue: this.dateSwitchValue,
          deadline: this.finalDeadline,
          displayDeadline: this.displayDeadline,
          groupmates: [],
          modCode: this.modCode,
        });
          await this.addGroupmatesToProject(response);
          await this.addForGroupmates(response);
          await db.collection('user').doc(this.$store.state.user.uid)
                  .update({project: firebase.firestore.FieldValue.arrayUnion(response)})
          await this.$store.dispatch('getProjects')
        
      
      this.title = ''
      this.modCode = ""
      this.myDeadlineTime = "00:00"
      this.myDeadline = new Date().toISOString().substr(0, 10)
      this.switchValue = false
      this.finalGroupmates = []
      this.tempGroupmates = []
      this.dateSwitchValue = false
      this.displayDeadline="Deadline"
      this.finalDeadline = new Date().toISOString().substr(0, 10)
    },

    async deleteProject(project) {
        await db.collection("user").doc(this.$store.state.user.uid).update({
          project: firebase.firestore.FieldValue.arrayRemove(db.collection("project").doc(project.id))})
        this.$store.dispatch('getProjects')
            
    },

    async editProject(project) {
      this.errors = ""
      const response = await db.collection("project").doc(project.id).update({
          title: this.title,
          progress: this.progress,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          groupmates: [],
          dateSwitchValue: this.dateSwitchValue,
          deadline: this.finalDeadline,
          displayDeadline: this.displayDeadline,
          modCode: this.modCode,
          todos: this.todos,
      })
      await this.addGroupmatesToProject(project);
      await this.addForGroupmates(project);
      this.$store.dispatch('getProjects')
      this.title = ''
      this.modCode = ""
      this.myDeadlineTime = "00:00"
      this.myDeadline = new Date().toISOString().substr(0, 10)
      this.switchValue = false
      this.finalGroupmates = []
      this.tempGroupmates = []
      this.dateSwitchValue = false
      this.displayDeadline="Deadline"
      this.finalDeadline = new Date().toISOString().substr(0, 10)
    },

    async getMatchedUserbyEmail() {
      console.log("getMatchedUserbyEmail")
      db.collection("user").where("email", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName = doc.data().name,
                  this.searchEmail = doc.data().email,
                  this.searchId = doc.id


              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },
    async getMatchedUserbyName() {
      console.log("getMatchedUserbyName")
      db.collection("user").where("name", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName = doc.data().name,
                  this.searchEmail = doc.data().email,
                  this.searchId = doc.id

              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },


    async addGroupmates() {
      
      db.collection("user").where("email", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(this.tempGroupmates)
              this.tempGroupmates.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                chipValue: true,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.tempGroupmates)
              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });

      db.collection("user").where("name", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(this.tempGroupmates)
              this.tempGroupmates.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                chipValue: true,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.tempGroupmates)
              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },

    async addForGroupmates(project) {
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        if (this.oldGroupmates.includes(this.finalGroupmates[i])) {
          console.log('groupmate already has the project')
        } else{
        db.collection('user').doc(this.finalGroupmates[i])
            .update({project: firebase.firestore.FieldValue.arrayUnion(db.collection('project').doc(project.id))})
        }
      }
      console.log("check")
    },

    async passGroupmates(response) {
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (this.tempGroupmates[i].chipValue == true) {
          console.log(this.tempGroupmates[i].id)
          this.finalGroupmates.push(this.tempGroupmates[i].id);
        }
      }
      console.log(this.tempGroupmates)
      console.log(this.finalGroupmates)
    
      this.searchId = ""
      this.searchEmail = ""
      this.searchName = ""
      this.search=""
      this.tempGroupmates = []
    },

    async addGroupmatesToProject(project){
      console.log(project);
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        db.collection('project').doc(project.id)
            .update({groupmates: firebase.firestore.FieldValue
                  .arrayUnion(db.collection('user').doc(this.finalGroupmates[i]))})
      }
    },

    async remove(user, index) {
      this.chips.splice(this.chips.indexOf(user), 1)
      this.chips = [...this.chips]
      this.$delete(this.tempGroupmates, index)
      this.tempGroupmates.push({
        id: user.id,
        name: user.name,
        email: user.email,
        object: user.doc,
        chipValue: false,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
      });
      console.log(this.tempGroupmates)
    },

    onQueryChange(event) {
      // can be this.query.length === 0 as well
      if (this.search.length === 0 || this.search != this.searchName) {
        this.searchName = "";
        this.searchId = "";
        this.searchEmail = "";
      }
    },

    changeDisplayDeadline(){
      if (this.dateSwitchValue == 1){
        this.displayDeadline = "Someday"
        this.switchValue = false
        this.myDeadlineTime = "00:00"
      } else {
        this.displayDeadline = this.myDeadline
      }
    },

    async getGroupmates(groupmates){
      for (let i = 0; i < groupmates.length; i++) {
        console.log(groupmates[i])
        console.log(groupmates[0])
        console.log(groupmates.length)
      
      console.log(this.tempGroupmates)
      const docRef = await groupmates[i].get()

      console.log(docRef)
      console.log(docRef.id)
      console.log(docRef.get('name'))
      console.log(docRef.get('email'))
      this.varGroupmates.push({
          id: docRef.id,
          name: docRef.get('name'),
          email: docRef.get('email'),
          object: docRef,
          chipValue: true,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
          }
        )
      }
      console.log(this.varGroupmates)
      return this.varGroupmates
    },

    async getGroupmatesId(groupmates){
      for (let i = 0; i < groupmates.length; i++) {
        
      const docRef = await groupmates[i].get()

      
      this.varGroupmatesId.push({
          id: docRef.id,
          
          }
        )
      }
   
      return this.varGroupmatesId
    },

  async remainingTodo(todos){
    let counter = 0
    if (todos == null || todos.length == 0){
      return 0
    } else {
      for (let i = 0; i < todos.length; i++) {
        const docRef = await db.collection('todos').doc(todos[i].id).get()
        console.log(docRef)
        if (docRef.get('complete') == false ){
          counter += 1
        }
      }
      return counter

    }
    },

  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

.v-card {
  color: #ff9d66;
  border: none;

}

.todo-item {
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
  //display:flex;
}



.completed {
  text-decoration: line-through;
  color: grey;
}

.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;
}




.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}

.elevation-0 div {
  box-shadow: none !important;
}

.checkboxCol {
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}

.centerAlign {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftAlign {
  /*display: flex;*/
  justify-content: flex-start;
  align-items: center;
}

.input-group--disabled.checkbox .input-group__input {
  color: white !important;
  outline: 1px solid #1e5180
}

.completed {
  text-decoration: line-through;
  color: grey;
}

.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-top: 14px;
  margin-bottom: 14px;
}

.theme--dark {
  color: #ffffff;
}

.theme--light.v-checkbox {
  color: #ffffff;
}



.progress-circular >>> circle {
  stroke-linecap: round;
}


.v-navigation-drawer__border{
  background-color: rgba(255,255,255,1);
  border-color: white;
  color:white;
}

.v-list--rounded .v-list-item, .v-list--rounded .v-list-item::before, .v-list--rounded .v-list-item > .v-ripple__container {
  border-radius: 20px !important;
}

.v-navigation-drawer > div{
  display: flex;
  flex-direction: column;
}

.center-me {
  transform: translate(-50%, 0);
}

.theme--light.v-card{
  color:#ff9d66
}

</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: #FFD5A5 !default
</style>