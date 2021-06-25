<template>
  <div
    style="
      background-color: #fff0df;
      font-family: DM Sans, sans-serif;
      min-height: 100vh;
    "
  >
    <v-row>
      <v-col col="12" md="2">
        <v-navigation-drawer
          absolute
          permanent
          floating
          left
          align="center"
          class="v-navigation-drawer__border"
          style="
            padding: 18px;
            font-size: 8px;
            font-weight: bold;
            border-color: white;
            text-align: left;
            font-color: #4b4b4b;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <div style="display: flex; flex-direction: column; height: 100%">
            <v-img
              width="10vw"
              src="@/assets/orbital_logo_latest.png"
              alt=""
              style="flex: none; top: 20%"
            ></v-img>
            <br />

            <v-list
              :class="`rounded-xl`"
              rounded
              nav
              style="display: flex; flex-direction: column; margin: auto"
            >
              <v-list-item
                v-for="item in navItems"
                :key="item.title"
                link
                :to="item.href"
                color="#ff7200"
                style="
                  display: flex;
                  justify-content: center;
                  font-size: 12px;
                  margin-top: 4px;
                  margin-bottom: 4px;
                "
              >
                <v-list-item-icon
                  style="display: flex; justify-content: center; margin: 12px"
                >
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    style="
                      font-color: #4b4b4b;
                      margin-right: 5px;
                      margin-top: 5px;
                      margin-bottom: 5px;
                    "
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn
              color="#ff9d66"
              depressed
              large
              type="submit"
              v-on:click="signOut"
            >
              <span style="color: #ffffff">Sign Out</span>
            </v-btn>
          </div>
        </v-navigation-drawer>
      </v-col>

      <v-col col="12" md="10">
        <div>
          <div>
            <v-container style="padding-bottom: 0px; margin-left: 1vw">
              <span
                style="
                  margin-top: 10px;
                  color: #4b4b4b;
                  font-size: 32px;
                  display: flex;
                  align-items: flex-start;
                  font-weight: bold;
                "
                >Project</span
              >
            </v-container>
          </div>

          <v-row>
            <v-col col="12" md="4">
              <div style="margin-left: 1vw">
                <v-dialog
                  v-model="dialog"
                  persistent
                  content-class="elevation-0"
                  max-width="600px"
                  :class="`rounded-lg`"
                >
                  <template
                    v-slot:activator="{ on, attrs }"
                    :class="`rounded-lg`"
                  >
                    <v-card
                      outlined
                      color="white"
                      style="margin-top: 15px; padding: 2px"
                      :class="`rounded-lg`"
                    >
                      <v-btn
                        :class="`rounded-lg`"
                        style="padding-right: 0px; padding-left: 0px"
                        color="white"
                        block
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          dialog = true;
                          addCurrUserToTempGroupmates();
                        "
                      >
                        <span style="color: #ff9d66; font-weight: bold">
                          + Add New Project</span
                        >
                      </v-btn>
                    </v-card>
                  </template>
                  <v-sheet
                    outlined
                    color="#ff9d66"
                    style="padding: 3px"
                    :class="`rounded-xl`"
                  >
                    <v-card outlined :class="`rounded-xl`">
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-card-title :class="`rounded-xl`">
                          <span style="color: #ff9d66" class="headline"
                            >Add New Project</span
                          >
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
                                  :rules="[
                                    (v) => !!v || 'Module Code is required',
                                  ]"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" align="left">
                                <span style="padding-bottom:10px;">Groupmates</span>
                                <v-row>
                                  <div v-if="tempGroupmates.length !== 0">
                                    <v-row>
                                      <div
                                        v-for="(user, index) in tempGroupmates"
                                        :key="user.id"
                                      >
                                        <v-chip
                                          class="ma-4"
                                          color="#ff9d66"
                                          text-color="white"
                                          :input-value="user.id"
                                          v-if="user.chipValue"
                                          close
                                          @click:close="remove(user, index)"
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
                                  <v-dialog
                                    v-model="dialogPerson"
                                    persistent
                                    max-width="600px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        color="#ff9d66"
                                        @click="dialogPerson = true"
                                      >
                                        <v-icon>person_add</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-card>
                                      <v-card-actions>
                                        <v-text-field
                                          v-model="search"
                                          @input="
                                            getMatchedUserbyEmail();
                                            getMatchedUserbyName();
                                            onQueryChange();
                                          "
                                        >
                                        </v-text-field>
                                        {{ search }}
                                      </v-card-actions>
                                      <v-card-text>
                                        <div
                                          v-for="user in this.users"
                                          :key="user.id"
                                        >
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
                                          <v-list-item-avatar v-if="searchName">
                                            <v-img :src="searchAvatar"></v-img>
                                          </v-list-item-avatar>
                                          {{ searchName }}
                                          <br />
                                          {{ searchEmail }}
                                          <br />
                                          {{ searchId }}
                                          <v-list-item-action>
                                            <v-btn
                                              v-if="searchId"
                                              color="#ff9d66"
                                              outlined
                                              @click="addGroupmates()"
                                            >
                                              <v-icon>person_add</v-icon>
                                            </v-btn>
                                          </v-list-item-action>
                                        </v-list>
                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="dialogPerson = false"
                                          >
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
                                      :rules="[
                                        (v) =>
                                          (!!v && v) !== 'Deadline' ||
                                          'Deadline is required',
                                      ]"
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
                                    @input="
                                      menuAdd = false;
                                      changeDisplayDeadline();
                                    "
                                  >
                                    <div
                                      style="
                                        margin-left: 10px;
                                        margin-top: -10px;
                                        padding-bottom: 10px;
                                      "
                                    >
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
                                <v-row style="padding-top: 5px">
                                  <v-col cols="12" md="6" style="display: flex">
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
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-text-field
                                          :disabled="
                                            switchValue == 0 ||
                                            dateSwitchValue == 1
                                          "
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
                                        @click:minute="
                                          $refs.menu3.save(myDeadlineTime)
                                        "
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
                          <v-btn
                            justify="center"
                            color="#ff9d66"
                            text
                            @click="
                              dialog = false;
                              clearInfo();
                            "
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="#ff9d66"
                            :disabled="
                              !valid || this.title == '' || this.modCode == ''
                            "
                            text
                            @click="
                              dialog = false;
                              checkTimeAdd();
                            "
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-sheet>
                </v-dialog>
              </div>
              <div
                style="
                  margin-left: 1vw;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  padding-top: 20px !important;
                "
              >
                <v-container :class="`rounded-lg`" style="padding-top: 20px !important; padding:0px;">
                  <v-card
                    style="padding: 8px ; padding-top: 20px !important; padding-bottom:12px;!important"
                    color="#ff9d66"
                    outlined
                    :class="`rounded-xl`"
                    min-height="30vh"
                  >
                    <span
                      style="
                        margin-top: 10px;
                        color: white;
                        font-size: 20px;
                        display: flex;
                        justify-content: center;
                        
                        font-weight: bold;
                      "
                      >Project Invitations</span
                    >
                    <div v-if="this.$store.state.projectInvitations.length !== 0"  style="display: flex; flex-direction: row; justify-content:center !important">
                    <v-slide-group
                          v-model="projectInvitationSlide"
                          style="display: flex; flex-direction: row; justify-content:center !important"
                          active-class="success"
                          show-arrows
                          center-active
                         
                        >
                        <v-slide-item
                            v-for="(projectInvitation) in this.$store.state.projectInvitations"
                            :key="projectInvitation.id"
                            style="display:flex; justify-content:center !important"

                          >
                    
                    <v-card outlined color="white" class="ma-2"
                              width="280" :class="`rounded-xl`"
                              style="padding: 10px; padding-left:10px;">
                      <v-col
                                  col="12"
                                  md="12"
                                  style="display: flex; flex-direction: column"
                                >
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding-bottom: 0px !important;
                                      padding-top: 3px !important;
                                      padding-left: 3px !important;
                                      padding-right: 3px !important;
                                    "
                                  >
                                    {{projectInvitation.modCode}}
                                  </v-card-text>
                                  <v-card-title
                                    style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                  >
                                    {{projectInvitation.title}}
                                  </v-card-title>
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding: 2px !important;
                                    "
                                  >
                                    <div v-if="projectInvitation.deadline !== null">
                                      <span style="">
                                        <v-icon color="#ff9d66" width="20px;"
                                          >calendar_today</v-icon
                                        >
                                        {{
                                          projectInvitation.deadline.toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "short",
                                              day: "2-digit",
                                              year: "numeric",
                                            }
                                          )
                                        }}</span
                                      >
                                    </div>
                                    <div v-else>
                                      <span style="">
                                        <v-icon color="#ff9d66" width="20px;">
                                          calendar_today</v-icon
                                        >
                                        Someday
                                      </span>
                                    </div>
                                    
                                  </v-card-text>
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding: 2px !important;
                                      color:#999999
                                    ">
                                    <div>
                                      <span color="#999999">
                                        <v-icon color="#999999">mdi-account</v-icon>

                                        {{projectInvitation.creator}}
                                      </span>
                                    </div>
                                  </v-card-text>
                                  <v-card-actions  style="padding: 0px; !important" >
                                    <v-row
                                    style="padding-top: 20px!important; "
                                      align="center"
                                      justify="center"
                                    >
                                      <v-btn text small color="#ff9d66" @click="acceptProject(projectInvitation)">
                                        Accept
                                      </v-btn>
                                      <v-btn
                                      small
                                        text
                                        color="#999999"
                                        @click="declineProject(projectInvitation)"
                                      >
                                        Decline
                                      </v-btn>
                                      
                                    </v-row>`
                                  </v-card-actions>
                                  
                        </v-col>
                    </v-card>
                        </v-slide-item>
                    </v-slide-group>
                    
                  
                    </div>
                    <div v-else style="padding-top:9vh; padding-bottom:9vh; display:flex; align-items: center; justify-content: center" >
                      <span style="font-weight:bold; color:white;" >You do not have any project invitation.</span>
                    </div>
                    
                  </v-card>
                </v-container>
              </div>
            </v-col>

            <v-col col="12" md="8">
              <div style="display: flex">
                <v-container
                  style="margin-right: auto; margin-left: auto; display: flex"
                  max-width="51vw"
                  min-width="51vw"
                  
                >
                  <v-card
                    max-width="51vw"
                    min-width="51vw"
                    
                    outlined
                    color="#FFE4CB"
                    style="padding: 14px; display: flex; flex-direction: column"
                    :class="`rounded-xl`"
                  >
                    <div
                      style="padding: 8px; display: flex; flex-direction: row; justify-content: space-between"
                    >
                      <span
                        style="
                          margin-top: 10px;
                          margin-left: 3vw;
                          color: #4b4b4b;
                          font-size: 20px;
                          display: flex;
                          align-items: flex-start;
                          font-weight: bold;
                        "
                        >Overview</span
                      >
                      
                      <v-btn align="right" outlined 
                            style="
                          margin-top: 10px;
                          color: #4b4b4b;
                          font-size: 16px;
                          display: flex;
                          align-items: center;
                          font-weight: bold;
                          margin-right: 3vw;

                        ">
                        Table View
                      </v-btn>
                    </div>

                    <div
                      v-if="length"
                      style="display: flex; flex-direction: row"
                    >
                      <v-sheet
                        :class="`rounded-xl`"
                        class="mx-auto"
                        elevation="0"
                        max-width="50vw"
                        style="background-color: #ffe4cb"
                      >
                        <v-slide-group
                          v-model="projectSlide"
                       
                          active-class="success"
                          show-arrows
                        >
                          <v-slide-item
                            v-for="(project,index) in this.$store.state.projects"
                            :key="project.id"
                            v-slot="{ active, toggle }"
                          >
                            <v-card
                              :class="`rounded-xl`"
                              :color="active ? undefined : 'white'"
                              class="ma-2"
                              height="200"
                              width="330"
                              @click="
                                toggle;
                                passCurrSelectedProject(project);
                                assignCurrProject(project);
                              "
                              style="padding: 10px; padding-left:14px;"
                            >
                              <v-row style="padding: 5px">
                                <v-col
                                  col="12"
                                  md="9"
                                  style="display: flex; flex-direction: column"
                                >
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding-bottom: 0px !important;
                                      padding-top: 3px !important;
                                      padding-left: 3px !important;
                                      padding-right: 3px !important;
                                    "
                                  >
                                    {{ project.modCode }}
                                  </v-card-text>
                                  <v-card-title
                                    style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                  >
                                    {{ project.title }}
                                  </v-card-title>
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding: 2px !important;
                                    "
                                  >
                                    <div v-if="project.deadline !== null">
                                      <span style="">
                                        <v-icon color="#ff9d66" width="20px;"
                                          >calendar_today</v-icon
                                        >
                                        {{
                                          project.deadline.toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "short",
                                              day: "2-digit",
                                              year: "numeric",
                                            }
                                          )
                                        }}</span
                                      >
                                    </div>
                                    <div v-else>
                                      <span style="">
                                        <v-icon color="#ff9d66" width="20px;">
                                          calendar_today</v-icon
                                        >
                                        Someday
                                      </span>
                                    </div>
                                  </v-card-text>
                                </v-col>
                                <v-col
                                  col="12"
                                  md="3"
                                  style="
                                    display: flex;
                                    align-items: center;
                                    padding: 0px !important;
                                  "
                                >
                                  <v-progress-circular
                                    style="
                                      display: flex;
                                      justify-content: center;
                                      align-item: center;
                                    "
                                    class="
                                      progress-circular
                                      
                                      v-progress-circular__underlay
                                    "
                                    :rotate="-90"
                                    :size="60"
                                    :width="8"
                                    :value="project.progress * 100"
                                    color="#ff7200"
                                  >
                                    <span style="font-weight: bold">{{
                                      Math.trunc(project.progress * 100) + "%"
                                    }}</span>
                                  </v-progress-circular>
                                </v-col>
                              </v-row>
                              <v-divider style="padding: 3px"></v-divider>
                              <span
                                style="
                                  display: flex;
                                  align-items: center;
                                  padding: 3px;
                                  font-size: 14px;
                                  color: #999999;
                                "
                                ><v-icon
                                  color="#999999"
                                  width="20px"
                                  
                                  style="padding: 3px; padding-right: 10px"
                                  >groups</v-icon
                                >
                                Scheduled Meeting</span
                              >

                              <div style="display:flex; justify-content: space-between">
                              <span
                                style="
                                  display: flex;
                                  padding: 3px;
                                  font-size: 14px;
                                  align-items: center;
                                  color: #999999;
                                "
                                ><v-icon
                                  color="#999999"
                                  width="20px"
                                  style="padding: 3px; padding-right:10px;"
                                  >check_circle</v-icon
                                >
                                Incompleted Todo
                              </span>
                              <div style="display:flex; ">
                              <v-dialog
                                    v-model="display[project.title]"
                                    content-class="elevation-0"
                                    persistent
                                    max-width="600px"
                                    :class="`rounded-lg`"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        color="#ff9d66"
                                        v-bind="attrs"
                                        v-on="on"
                                        icon
                                        @click="fillInfo(project)"
                                      >
                                        <v-icon> mdi-pencil-outline</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-sheet
                                      outlined
                                      color="#ff9d66"
                                      style="padding: 3px"
                                      :class="`rounded-xl`"
                                    >
                                      <v-card outlined :class="`rounded-xl`">
                                        <v-form
                                          ref="form"
                                          v-model="valid"
                                          lazy-validation
                                        >
                                          <v-card-title :class="`rounded-xl`">
                                            <span class="headline"
                                              >Edit Project</span
                                            >
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
                                                    :rules="[
                                                      (v) =>
                                                        !!v ||
                                                        'Module Code is required',
                                                    ]"
                                                  >
                                                  </v-text-field>
                                                </v-col>
                                                <v-col cols="12" align="left">
                                                  <span style="padding: 5px;">Groupmates</span>
                                                  <div
                                                    v-if="
                                                      tempGroupmates.length !==
                                                      0
                                                    "
                                                  >
                                                    <div
                                                      v-for="(
                                                        user, index
                                                      ) in tempGroupmates"
                                                      :key="user.id"
                                                    >
                                                      <v-row>
                                                        <v-chip
                                                          class="ma-2"
                                                          color="#ff9d66"
                                                          text-color="white"
                                                          :input-value="user.id"
                                                          v-if="user.chipValue"
                                                          close
                                                          @click:close="
                                                            remove(user, index)
                                                          "
                                                        >
                                                          <v-avatar
                                                            left
                                                            class="white--text"
                                                          >
                                                           
                                                            <v-img
                                                              :src="user.avatar"
                                                            ></v-img>
                                                          </v-avatar>
                                                          <span>{{
                                                            user.name
                                                          }}</span>
                                                        </v-chip>
                                                      </v-row>
                                                    </div>
                                                  </div>
                                                  <v-dialog
                                                    v-model="
                                                      groupmateDialogEdit
                                                    "
                                                    persistent
                                                    max-width="600px"
                                                  >
                                                    <template
                                                      v-slot:activator="{
                                                        on,
                                                        attrs,
                                                      }"
                                                    >
                                                      <v-btn
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                        color="#ff9d66"
                                                        @click="
                                                          groupmateDialogEdit = true
                                                        "
                                                      >
                                                        <v-icon
                                                          >person_add</v-icon
                                                        >
                                                      </v-btn>
                                                    </template>
                                                    <v-card>
                                                      <v-card-actions>
                                                        <v-text-field
                                                          v-model="search"
                                                          @input="
                                                            getMatchedUserbyEmail();
                                                            getMatchedUserbyName();
                                                            onQueryChange();
                                                          "
                                                        >
                                                        </v-text-field>
                                                      </v-card-actions>
                                                      <v-card
                                                        max-width="450"
                                                        class="mx-auto"
                                                        outlined
                                                      >
                                                        <v-list>
                                                          <v-list-item-avatar
                                                            v-if="searchName"
                                                          >
                                                            <v-img
                                                              :src="
                                                                searchAvatar
                                                              "
                                                            ></v-img>
                                                          </v-list-item-avatar>
                                                          {{ searchName }}
                                                          <br />
                                                          {{ searchEmail }}
                                                          <br />
                                                          {{ searchId }}
                                                          <v-list-item-action>
                                                            <v-btn
                                                              v-if="searchId"
                                                              outlined
                                                              color="#ff9d66"
                                                              @click="
                                                                addGroupmates()
                                                              "
                                                            >
                                                              <v-icon
                                                                >person_add</v-icon
                                                              >
                                                            </v-btn>
                                                          </v-list-item-action>
                                                        </v-list>
                                                        <v-card-actions>
                                                          <v-spacer></v-spacer>
                                                          <v-btn
                                                            color="blue darken-1"
                                                            text
                                                            @click="
                                                              groupmateDialogEdit = false;
                                                              checkClosing();
                                                            "
                                                          >
                                                            Close
                                                          </v-btn>
                                                        </v-card-actions>
                                                      </v-card>
                                                    </v-card>
                                                  </v-dialog>
                                                  </v-col>

                                                <v-col cols="12">
                                                  {{ myDeadline }}
                                                  {{ myDeadlineTime }}
                                                  {{ dateSwitchValue }}
                                                  {{ switchValue }}
                                                  {{ displayDeadline }}
                                                  <v-menu
                                                    v-model="
                                                      menu[project.title]
                                                    "
                                                    :close-on-content-click="
                                                      false
                                                    "
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    color="#ff9d66"
                                                    min-width="auto"
                                                  >
                                                    <template
                                                      v-slot:activator="{
                                                        on,
                                                        attrs,
                                                      }"
                                                    >
                                                      <v-text-field
                                                        :rules="[
                                                          (v) =>
                                                            (!!v && v) !==
                                                              'Deadline' ||
                                                            'Deadline is required',
                                                        ]"
                                                        v-model="
                                                          displayDeadline
                                                        "
                                                        label="Deadline*"
                                                        prepend-icon="mdi-calendar"
                                                        readonly
                                                        color="#ff9d66"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                      ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                      :disabled="
                                                        dateSwitchValue == 1
                                                      "
                                                      color="#ff9d66"
                                                      v-model="myDeadline"
                                                      @input="
                                                        menu[
                                                          project.title
                                                        ] = false;
                                                        changeDisplayDeadline();
                                                      "
                                                    >
                                                      <v-switch
                                                        inset
                                                        hide-details
                                                        v-model="
                                                          dateSwitchValue
                                                        "
                                                        color="#ff9d66"
                                                        :label="`Someday`"
                                                        @change="
                                                          changeDisplayDeadline()
                                                        "
                                                      ></v-switch>
                                                    </v-date-picker>
                                                  </v-menu>
                                                  <v-row
                                                    style="padding-top: 5px"
                                                  >
                                                    <v-col
                                                      cols="12"
                                                      md="6"
                                                      style="
                                                        display: flex;
                                                        align-items: center;
                                                      "
                                                    >
                                                      <v-switch
                                                        :disabled="
                                                          dateSwitchValue == 1
                                                        "
                                                        inset
                                                        hide-details
                                                        v-model="switchValue"
                                                        color="#ff9d66"
                                                        :label="`Include Time`"
                                                      ></v-switch>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                      <v-menu
                                                        :ref="
                                                          'timeMenu' + index
                                                        "
                                                        v-model="
                                                          time[project.title]
                                                        "
                                                        :close-on-content-click="
                                                          false
                                                        "
                                                        :nudge-right="40"
                                                        :return-value.sync="
                                                          myDeadlineTime
                                                        "
                                                        transition="scale-transition"
                                                        offset-y
                                                        style="z-index: 20"
                                                        max-width="290px"
                                                        color="#ff9d66"
                                                        min-width="290px"
                                                      >
                                                        <template
                                                          v-slot:activator="{
                                                            on,
                                                            attrs,
                                                          }"
                                                        >
                                                          <v-text-field
                                                            :disabled="
                                                              switchValue ==
                                                                0 ||
                                                              dateSwitchValue ==
                                                                1
                                                            "
                                                            v-model="
                                                              myDeadlineTime
                                                            "
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
                                                          v-model="
                                                            myDeadlineTime
                                                          "
                                                          color="#ff9d66"
                                                          full-width
                                                          format="24hr"
                                                          @click:minute="
                                                            y =
                                                              'timeMenu' +
                                                              index.toString();
                                                            a = $refs[y];
                                                            a[0].save(
                                                              myDeadlineTime
                                                            );
                                                            time[
                                                              project.title
                                                            ] = false;
                                                          "
                                                        >
                                                        </v-time-picker>
                                                      </v-menu>
                                                    </v-col>
                                                  </v-row>
                                                </v-col>
                                              </v-row>
                                            </v-container>
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                              color="#ff9d66"
                                              text
                                              @click="
                                                display[project.title] = false;
                                                clearInfo();
                                              "
                                            >
                                              Close
                                            </v-btn>
                                            <v-btn
                                              color="#ff9d66"
                                              text
                                              :disabled="!valid"
                                              @click="
                                                display[project.title] = false;
                                                checkEdit(project);
                                              "
                                            >
                                              Update
                                            </v-btn>
                                          </v-card-actions>
                                        </v-form>
                                      </v-card>
                                    </v-sheet>
                                  </v-dialog>
                                  <v-btn
                                    color="#A5A5A5"
                                    icon
                                    @click="deleteProject(project)"
                                  >
                                    <v-icon> mdi-trash-can-outline </v-icon>
                                  </v-btn>
                                  </div>
                              </div>

                              <!-- <v-row
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
                              </v-row> -->
                            </v-card>
                          </v-slide-item>
                        </v-slide-group>
                      </v-sheet>
                    </div>
                    <div v-else style="padding:80px; display:flex' align-items: center; justify-content: center">
                       <span style="font-color: #999999; font-weight: bold; font-size: 16px;">You do have any project yet. Create a new one or accept any project invitation</span>
                    </div>
                    <div>
                      <span
                        style="
                          margin-top: 10px;
                          color: #4b4b4b;
                          font-size: 16px;
                          display: flex;
                          align-items: center;
                          font-weight: light;
                          margin-right: 3vw;
                          justify-content: flex-end;

                        "
                        >Click any project to see more details</span
                      >
                    </div>
                  </v-card>
                </v-container>
              </div>
            </v-col>
          </v-row>
          <div v-if="currTodos.length !== 0 || currProject != null">
            <v-container :class="`rounded-xl`">
              <v-card
                outlined
                color="#FFE4CB"
                style="padding: 20px; max-height: 61vh; overflow-y: scroll; "
                :class="`rounded-xl`"
              >
                <span style="color:#ff9d66; font-weight:bold; padding: 10px; font-size: 20px; display:flex; justify-content:flex-start;"> 
                  {{currProject}}</span>

                <v-card
                  outlined
                  color="#ff9d66"
                  style="padding: 20px; overflow-y: scroll; max-height: 61vh"
                  :class="`rounded-xl`"
                >
                  <v-tabs
                  :class="`rounded-xl`"
                  style="padding:10px;"
                    v-model="tab"
                    fixed-tabs
                    color="white"
                    background-color="#ff9d66"
                    dark
                  >
                    <v-tab> Meetings </v-tab>
                    <v-tab> Todos </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab" style="background-color:#ff9d66;">
                    <v-tab-item style="background-color:#ff9d66;">
                      <v-container style="background-color: #ffe4cb; border-radius:24px;" :class="`rounded-xl`">
                      <v-card color="#FFE4CB" outlined :class="`rounded-xl`" style="padding: 10px; overflow-y: scroll">
                        <v-card-title>Meetings</v-card-title>

                      </v-card>
                      </v-container>
                    </v-tab-item>
                    <v-tab-item style="background-color:#ff9d66;">
                      <v-container style="background-color: #ffe4cb; border-radius:24px;" :class="`rounded-xl`">
                        <v-card
                          outlined
                          style="padding: 10px;"
                          color="#FFE4CB"
                          :class="`rounded-xl`"
                        >
                          <v-card-title>Your Todo</v-card-title>
                          <div v-if="currTodos">
                            <div
                              v-for="(todo, index) in orderedTasks"
                              :key="todo.id"
                            >
                              <template>
                                <v-list-item style="display: block">
                                  <v-card
                                    outlined
                                    color="white"
                                    style="margin: auto"
                                    :class="`rounded-xl`"
                                  >
                                    <v-row style="margin: 0px">
                                      <v-col
                                        cols="12"
                                        md="2"
                                        align="center"
                                        justify="center"
                                        class="centerAlign"
                                        style="
                                          padding-top: 20px;
                                          padding-bottom: 20px;
                                          font-weight: bold;
                                          font-size: 20px;
                                          flex-direction: column;
                                        "
                                      >
                                        <div v-if="todo.finalDeadline !== null">
                                          <span
                                            style="margin-left: 3vw"
                                            v-bind:class="{
                                              completed: todo.complete,
                                            }"
                                            >{{
                                              todo.finalDeadline.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                              })
                                            }}</span
                                          >
                                        </div>
                                        <div v-else>
                                          <span
                                            style="margin-left: 3vw"
                                            v-bind:class="{
                                              completed: todo.complete,
                                            }"
                                          >
                                            Someday
                                          </span>
                                        </div>

                                        <div v-if="todo.finalDeadline !== null">
                                          <span
                                            class="centerAlign"
                                            style="
                                              margin-left: 3vw;
                                              font-size: 14px;
                                            "
                                            v-bind:class="{
                                              completed: todo.complete,
                                            }"
                                            >{{
                                              todo.finalDeadline.toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })
                                              }}
                                            </span
                                          >
                                        </div>
                                      </v-col>
                                      <v-col cols="12" md="1">
                                        <v-divider
                                          vertical
                                          style="
                                            padding-top: 20px;
                                            padding-bottom: 20px;
                                          "
                                          class="leftAlign"
                                        >
                                        </v-divider>
                                      </v-col>
                                      <v-col
                                        cols="12"
                                        md="5"
                                        align="left"
                                        class="leftAlign"
                                        style="
                                          padding-top: 20px;
                                          padding-bottom: 20px;
                                        "
                                      >
                                        <v-row style="margin: 0px">
                                          <span
                                            style="
                                              font-weight: bold;
                                              font-size: 20px;
                                            "
                                            v-bind:class="{
                                              completed: todo.complete,
                                            }"
                                            >{{ todo.title }}</span
                                          >
                                        </v-row>

                                      <div v-if="todo.note">
                                        <v-row style="margin: 0px">
                                          <span
                                            style="
                                              font-weight: lighter;
                                              font-size: 14px;
                                            "
                                            v-bind:class="{
                                              completed: todo.complete,
                                            }"
                                            >{{ todo.note }}</span
                                          >
                                        </v-row>
                                      </div>
                                      </v-col>
                                      <!--  -->
                                      <v-col
                                        col="12"
                                        md="1"
                                        align="right"
                                        class="centerAlign"
                                      >
                                        <v-list-item-action>
                                          <v-dialog
                                            v-model="Taskdisplay[todo.title]"
                                            content-class="elevation-0"
                                            persistent
                                            max-width="600px"
                                            :class="`rounded-lg`"
                                          >
                                            <template
                                              v-slot:activator="{ on, attrs }"
                                            >
                                              <v-btn
                                                color="#ff9d66"
                                                v-bind="attrs"
                                                v-on="on"
                                                icon
                                                @click="
                                                  fillTodoInfo(todo);
                                                  getProjectMenu();
                                                "
                                              >
                                                <v-icon>
                                                  mdi-pencil-outline</v-icon
                                                >
                                              </v-btn>
                                              <!--  -->
                                            </template>
                                            <v-sheet
                                              outlined
                                              color="#ff9d66"
                                              style="padding: 3px"
                                              :class="`rounded-xl`"
                                            >
                                              <v-card
                                                outlined
                                                :class="`rounded-xl`"
                                              >
                                                <v-form
                                                  ref="form"
                                                  v-model="valid"
                                                  lazy-validation
                                                >
                                                  <v-card-title
                                                    :class="`rounded-xl`"
                                                  >
                                                    <span class="headline"
                                                      >Edit Todo</span
                                                    >
                                                  </v-card-title>

                                                  <v-card-text>
                                                    <v-container>
                                                      <v-row>
                                                        <v-col cols="12">
                                                          <v-text-field
                                                            label="Todo Title*"
                                                            required
                                                            value="todo.title"
                                                            :rules="nameRules"
                                                            v-model="TaskmyTodo"
                                                            color="#ff9d66"
                                                          ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                          <v-select
                                                            :items="projects"
                                                            item-text="title"
                                                            item-value="id"
                                                            label="Module Project*"
                                                            required
                                                            @input="
                                                              renderGroupmates
                                                            "
                                                            color="#ff9d66"
                                                            v-model="
                                                              TaskmyProject
                                                            "
                                                            :rules="[
                                                              (v) =>
                                                                !!v ||
                                                                'Project is required',
                                                            ]"
                                                          ></v-select>
                                                          <!--  -->
                                                        </v-col>
                                                        <v-col
                                                          cols="12"
                                                          align="left"
                                                          :class="`rounded-xl`"
                                                        >
                                                          <span
                                                            style="
                                                              color: rgb(
                                                                113,
                                                                113,
                                                                113
                                                              );
                                                            "
                                                            >Person In
                                                            Charge</span
                                                          >
                                                          <div
                                                            v-if="
                                                              TasktempGroupmates
                                                            "
                                                          >
                                                            <v-combobox
                                                              :disabled="
                                                                TaskmyProject ==
                                                                null
                                                              "
                                                              item-text="name"
                                                              item-value="id"
                                                              v-model="
                                                                TaskgroupmatesChips
                                                              "
                                                              item-color="#ff9d66"
                                                              :items="
                                                                TasktempGroupmates
                                                              "
                                                              chips
                                                              clearable
                                                              label="Person In Charge"
                                                              multiple
                                                              color="#ff9d66"
                                                            >
                                                              <template
                                                                v-slot:selection="{
                                                                  attrs,
                                                                  item,
                                                                  parent,
                                                                  selected,
                                                                }"
                                                                color="#ff9d66"
                                                              >
                                                                <v-chip
                                                                  class="ma-2"
                                                                  color="#ff9d66"
                                                                  text-color="white"
                                                                  v-bind="attrs"
                                                                  :input-value="
                                                                    selected
                                                                  "
                                                                  close
                                                                  @click="
                                                                    parent.selectItem(
                                                                      item
                                                                    )
                                                                  "
                                                                  @click:close="
                                                                    Taskremove(
                                                                      item
                                                                    )
                                                                  "
                                                                >
                                                                  <v-avatar
                                                                    left
                                                                    class="
                                                                      white--text
                                                                    "
                                                                  >
                                                                    <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                                                    <v-img
                                                                      :src="
                                                                        item.avatar
                                                                      "
                                                                    ></v-img>
                                                                  </v-avatar>
                                                                  <span>{{
                                                                    item.name
                                                                  }}</span>
                                                                </v-chip>
                                                              </template>
                                                            </v-combobox>
                                                          </div>
                                                        </v-col>
                                                        <v-col cols="12">
                                                          <v-menu
                                                            v-model="
                                                              Taskmenu[
                                                                todo.title
                                                              ]
                                                            "
                                                            :close-on-content-click="
                                                              false
                                                            "
                                                            :nudge-right="40"
                                                            transition="scale-transition"
                                                            offset-y
                                                            color="#ff9d66"
                                                            min-width="auto"
                                                          >
                                                            <template
                                                              v-slot:activator="{
                                                                on,
                                                                attrs,
                                                              }"
                                                            >
                                                              <v-text-field
                                                                :rules="[
                                                                  (v) =>
                                                                    (!!v &&
                                                                      v) !==
                                                                      'Deadline' ||
                                                                    'Deadline is required',
                                                                ]"
                                                                v-model="
                                                                  TaskdisplayDeadline
                                                                "
                                                                label="Deadline*"
                                                                prepend-icon="mdi-calendar"
                                                                readonly
                                                                color="#ff9d66"
                                                                v-bind="attrs"
                                                                v-on="on"
                                                              ></v-text-field>
                                                            </template>
                                                            <!--  -->
                                                            <v-date-picker
                                                              :disabled="
                                                                TaskdateSwitchValue ==
                                                                1
                                                              "
                                                              color="#ff9d66"
                                                              v-model="
                                                                TaskmyDeadline
                                                              "
                                                              @input="
                                                                Taskmenu[
                                                                  todo.title
                                                                ] = false;
                                                                changeTaskDisplayDeadline();
                                                              "
                                                            >
                                                              <v-switch
                                                                inset
                                                                hide-details
                                                                v-model="
                                                                  TaskdateSwitchValue
                                                                "
                                                                color="#ff9d66"
                                                                :label="`Someday`"
                                                                @change="
                                                                  changeTaskDisplayDeadline()
                                                                "
                                                              ></v-switch>
                                                            </v-date-picker>
                                                          </v-menu>
                                                          <v-row
                                                            style="
                                                              padding-top: 5px;
                                                            "
                                                          >
                                                            <v-col
                                                              cols="12"
                                                              md="6"
                                                              style="
                                                                display: flex;
                                                                align-items: center;
                                                              "
                                                            >
                                                              <v-switch
                                                                :disabled="
                                                                  TaskdateSwitchValue ==
                                                                  1
                                                                "
                                                                inset
                                                                hide-details
                                                                v-model="
                                                                  TaskswitchValue
                                                                "
                                                                color="#ff9d66"
                                                                :label="`Include Time`"
                                                              ></v-switch>
                                                            </v-col>
                                                            <v-col
                                                              cols="12"
                                                              md="6"
                                                            >
                                                              <v-menu
                                                                :ref="
                                                                  'timeMenu' +
                                                                  index
                                                                "
                                                                v-model="
                                                                  Tasktime[
                                                                    todo.title
                                                                  ]
                                                                "
                                                                :close-on-content-click="
                                                                  false
                                                                "
                                                                :nudge-right="
                                                                  40
                                                                "
                                                                :return-value.sync="
                                                                  TaskmyDeadlineTime
                                                                "
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="
                                                                  z-index: 20;
                                                                "
                                                                max-width="290px"
                                                                color="#ff9d66"
                                                                min-width="290px"
                                                              >
                                                                <template
                                                                  v-slot:activator="{
                                                                    on,
                                                                    attrs,
                                                                  }"
                                                                >
                                                                  <v-text-field
                                                                    :disabled="
                                                                      TaskswitchValue ==
                                                                        0 ||
                                                                      TaskdateSwitchValue ==
                                                                        1
                                                                    "
                                                                    v-model="
                                                                      TaskmyDeadlineTime
                                                                    "
                                                                    label="Time"
                                                                    prepend-icon="mdi-clock-time-four-outline"
                                                                    readonly
                                                                    color="#ff9d66"
                                                                    v-bind="
                                                                      attrs
                                                                    "
                                                                    v-on="on"
                                                                  ></v-text-field>
                                                                </template>
                                                                <v-time-picker
                                                                  scrollable
                                                                  v-model="
                                                                    TaskmyDeadlineTime
                                                                  "
                                                                  color="#ff9d66"
                                                                  full-width
                                                                  format="24hr"
                                                                  @click:minute="
                                                                    y =
                                                                      'timeMenu' +
                                                                      index.toString();
                                                                    a =
                                                                      $refs[y];
                                                                    a[0].save(
                                                                      TaskmyDeadlineTime
                                                                    );
                                                                    Tasktime[
                                                                      todo.title
                                                                    ] = false;
                                                                  "
                                                                >
                                                                </v-time-picker>
                                                              </v-menu>
                                                            </v-col>
                                                          </v-row>
                                                        </v-col>
                                                        <v-col
                                                          cols="12"
                                                          :class="`rounded-xl`"
                                                        >
                                                          <v-textarea
                                                            name="input-7-1"
                                                            label="Notes"
                                                            rows="2"
                                                            color="#ff9d66"
                                                            v-model="TaskmyNote"
                                                          ></v-textarea>
                                                        </v-col>
                                                      </v-row>
                                                    </v-container>
                                                    <!--                                        <small>*indicates required field</small>-->
                                                  </v-card-text>
                                                  <v-card-actions>
                                                    <v-spacer></v-spacer>

                                                    <v-btn
                                                      color="#ff9d66"
                                                      text
                                                      @click="
                                                        Taskdisplay[
                                                          todo.title
                                                        ] = false;
                                                        clearTodoInfo();
                                                      "
                                                    >
                                                      Close
                                                    </v-btn>
                                                    <v-btn
                                                      color="#ff9d66"
                                                      text
                                                      :disabled="!valid"
                                                      @click="
                                                        Taskdisplay[
                                                          todo.title
                                                        ] = false;
                                                        checkTodoEdit(todo);
                                                      "
                                                    >
                                                      Update
                                                    </v-btn>
                                                  </v-card-actions>
                                                </v-form>
                                              </v-card>
                                            </v-sheet>
                                          </v-dialog>
                                        </v-list-item-action>
                                      </v-col>
                                      <v-col
                                        col="12"
                                        md="1"
                                        align="left"
                                        class="centerAlign"
                                      >
                                        <v-list-item-action>
                                          <v-btn
                                            color="#A5A5A5"
                                            icon
                                            @click="deleteTask(todo)"
                                          >
                                            <v-icon>
                                              mdi-trash-can-outline
                                            </v-icon>
                                          </v-btn>
                                        </v-list-item-action>
                                      </v-col>

                                      <v-col
                                        cols="12"
                                        md="2"
                                        class="centerAlign"
                                        style="background-color: #ff9d66"
                                        :class="`rounded-r-xl`"
                                      >
                                        <v-card outlined color="#ff9d66">
                                          <v-checkbox
                                            class="centerAlign"
                                            :class="`theme--light`"
                                            color="white"
                                            hide-details
                                            dark
                                            v-model="todo.complete"
                                            @click="completeTask(todo)"
                                          />
                                        </v-card>
                                      </v-col>
                                    </v-row>
                                  </v-card>
                                </v-list-item>
                              </template>

                              <br />
                            </div>
                          </div>
                        </v-card>
                      </v-container>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
              </v-card>
            </v-container>
          </div>
          <div v-else height="61vh" style="padding:20vh; display:flex; align-items: center; justify-content: center">
            <span style="font-weight: bold; font-size: 24px;">You have not selected any project yet.</span>
          </div>

          <!-- Original Project Display -->
          <!-- <div>
            <v-container>
              <v-card
                outlined
                color="#FFE4CB"
                style="padding: 20px"
                :class="`rounded-xl`"
              >
                <v-virtual-scroll
                  :items="items"
                  :bench="100"
                  height="61vh"
                  item-height="80"
                >
                  <v-dialog
                    v-model="dialog"
                    persistent
                    content-class="elevation-0"
                    max-width="600px"
                    :class="`rounded-lg`"
                  >
                    <template
                      v-slot:activator="{ on, attrs }"
                      :class="`rounded-xl`"
                    >
                      <v-card
                        outlined
                        color="white"
                        style="
                          margin-top: 10px;
                          margin-left: 16px;
                          margin-right: 16px;
                          padding: 8px;
                        "
                        :class="`rounded-xl`"
                      >
                        <v-btn
                          :class="`rounded-xl`"
                          color="white"
                          block
                          outlined
                          v-bind="attrs"
                          v-on="on"
                          @click="
                            dialog = true;
                            addCurrUserToTempGroupmates();
                          "
                        >
                          <span style="color: #ff9d66; font-weight: bold">
                            + Add New Project</span
                          >
                        </v-btn>
                      </v-card>
                    </template>
                    <v-sheet
                      outlined
                      color="#ff9d66"
                      style="padding: 3px"
                      :class="`rounded-xl`"
                    >
                      <v-card outlined :class="`rounded-xl`">
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-card-title :class="`rounded-xl`">
                            <span style="color: #ff9d66" class="headline"
                              >Add New Project</span
                            >
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
                                    :rules="[
                                      (v) => !!v || 'Module Code is required',
                                    ]"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" align="left">
                                  <span>Groupmates</span>
                                  <v-row>
                                    <div v-if="tempGroupmates.length !== 0">
                                      <v-row>
                                        <div
                                          v-for="(
                                            user, index
                                          ) in tempGroupmates"
                                          :key="user.id"
                                        >
                                          <v-chip
                                            class="ma-2"
                                            color="#ff9d66"
                                            text-color="white"
                                            :input-value="user.id"
                                            v-if="user.chipValue"
                                            close
                                            @click:close="remove(user, index)"
                                          >
                                            <v-avatar left class="white--text">
                                              
                                              <v-img :src="user.avatar"></v-img>
                                            </v-avatar>
                                            <span>{{ user.name }}</span>
                                          </v-chip>
                                        </div>
                                      </v-row>
                                    </div>
                                    <v-dialog
                                      v-model="dialogPerson"
                                      persistent
                                      max-width="600px"
                                    >
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-btn
                                          v-bind="attrs"
                                          v-on="on"
                                          outlined
                                          color="#ff9d66"
                                          @click="dialogPerson = true"
                                        >
                                          <v-icon>person_add</v-icon>
                                        </v-btn>
                                      </template>
                                      <v-card>
                                        <v-card-actions>
                                          <v-text-field
                                            v-model="search"
                                            @input="
                                              getMatchedUserbyEmail();
                                              getMatchedUserbyName();
                                              onQueryChange();
                                            "
                                          >
                                          </v-text-field>
                                          {{ search }}
                                        </v-card-actions>
                                        <v-card-text>
                                          <div
                                            v-for="user in this.users"
                                            :key="user.id"
                                          >
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
                                              v-if="searchName"
                                            >
                                              <v-img
                                                :src="searchAvatar"
                                              ></v-img>
                                            </v-list-item-avatar>
                                            {{ searchName }}
                                            <br />
                                            {{ searchEmail }}
                                            <br />
                                            {{ searchId }}
                                            <v-list-item-action>
                                              <v-btn
                                                v-if="searchId"
                                                color="#ff9d66"
                                                outlined
                                                @click="addGroupmates()"
                                              >
                                                <v-icon>person_add</v-icon>
                                              </v-btn>
                                            </v-list-item-action>
                                          </v-list>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                              color="blue darken-1"
                                              text
                                              @click="dialogPerson = false"
                                            >
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
                                        :rules="[
                                          (v) =>
                                            (!!v && v) !== 'Deadline' ||
                                            'Deadline is required',
                                        ]"
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
                                      @input="
                                        menuAdd = false;
                                        changeDisplayDeadline();
                                      "
                                    >
                                      <div
                                        style="
                                          margin-left: 10px;
                                          margin-top: -10px;
                                          padding-bottom: 10px;
                                        "
                                      >
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
                                  <v-row style="padding-top: 5px">
                                    <v-col
                                      cols="12"
                                      md="6"
                                      style="display: flex"
                                    >
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
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-text-field
                                            :disabled="
                                              switchValue == 0 ||
                                              dateSwitchValue == 1
                                            "
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
                                          @click:minute="
                                            $refs.menu3.save(myDeadlineTime)
                                          "
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
                            <v-btn
                              justify="center"
                              color="#ff9d66"
                              text
                              @click="
                                dialog = false;
                                clearInfo();
                              "
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              color="#ff9d66"
                              :disabled="
                                !valid || this.title == '' || this.modCode == ''
                              "
                              text
                              @click="
                                dialog = false;
                                checkTimeAdd();
                              "
                            >
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-sheet>
                  </v-dialog>
                  <br />

                  <div v-if="length">
                    <div
                      v-for="(project, index) in this.$store.state.projects"
                      :key="project.id"
                    >
                      <template>
                        <v-list-item style="display: block">
                          <v-card
                            outlined
                            class="v-card"
                            color="white"
                            style="margin: auto"
                            :class="`rounded-xl`"
                          >
                            <v-row style="margin: 0px">
                              <v-col
                                cols="12"
                                md="2"
                                align="center"
                                justify="center"
                                class="centerAlign"
                                style="
                                  padding-top: 20px;
                                  padding-bottom: 20px;
                                  font-weight: bold;
                                  font-size: 20px;
                                  flex-direction: column;
                                "
                              >
                                <div v-if="project.deadline !== null">
                                  <span style="margin-left: 3vw">{{
                                    project.deadline.toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "2-digit",
                                      }
                                    )
                                  }}</span>
                                </div>
                                <div v-else>
                                  <span style="margin-left: 3vw">
                                    Someday
                                  </span>
                                </div>

                                <div v-if="project.deadline !== null">
                                  <span
                                    class="centerAlign"
                                    style="margin-left: 3vw; font-size: 14px"
                                    >{{
                                      project.deadline.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    }}</span
                                  >
                                </div>
                              </v-col>
                              <v-col cols="12" md="1">
                                <v-divider
                                  vertical
                                  style="
                                    padding-top: 20px;
                                    padding-bottom: 20px;
                                  "
                                  class="leftAlign"
                                >
                                </v-divider>
                              </v-col>
                              <v-col
                                cols="12"
                                md="5"
                                align="left"
                                class="leftAlign"
                                style="padding-top: 20px; padding-bottom: 20px"
                              >
                                <v-row style="margin: 0px">
                                  <span
                                    style="font-weight: bold; font-size: 20px"
                                    >{{ project.title }}</span
                                  >
                                </v-row>
                                <v-row style="margin: 0px">
                                  <span style="font-weight: normal">{{
                                    project.modCode
                                  }}</span>
                                </v-row>
                                <v-row style="margin: 0px">
                                  <span
                                    style="
                                      font-weight: lighter;
                                      font-size: 14px;
                                    "
                                    >{{ project.groupmatesName }}</span
                                  >
                                </v-row>
                              </v-col>
                              <v-col
                                col="12"
                                md="1"
                                align="right"
                                class="centerAlign"
                              >
                                <v-list-item-action>
                                  <v-dialog
                                    v-model="display[project.title]"
                                    content-class="elevation-0"
                                    persistent
                                    max-width="600px"
                                    :class="`rounded-lg`"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        color="#ff9d66"
                                        v-bind="attrs"
                                        v-on="on"
                                        icon
                                        @click="fillInfo(project)"
                                      >
                                        <v-icon> mdi-pencil-outline</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-sheet
                                      outlined
                                      color="#ff9d66"
                                      style="padding: 3px"
                                      :class="`rounded-xl`"
                                    >
                                      <v-card outlined :class="`rounded-xl`">
                                        <v-form
                                          ref="form"
                                          v-model="valid"
                                          lazy-validation
                                        >
                                          <v-card-title :class="`rounded-xl`">
                                            <span class="headline"
                                              >Edit Project</span
                                            >
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
                                                    :rules="[
                                                      (v) =>
                                                        !!v ||
                                                        'Module Code is required',
                                                    ]"
                                                  >
                                                  </v-text-field>
                                                </v-col>
                                                <v-col cols="12" align="left">
                                                  <span>Groupmates</span>
                                                  <div
                                                    v-if="
                                                      tempGroupmates.length !==
                                                      0
                                                    "
                                                  >
                                                    <div
                                                      v-for="(
                                                        user, index
                                                      ) in tempGroupmates"
                                                      :key="user.id"
                                                    >
                                                      <v-row>
                                                        <v-chip
                                                          class="ma-2"
                                                          color="#ff9d66"
                                                          text-color="white"
                                                          :input-value="user.id"
                                                          v-if="user.chipValue"
                                                          close
                                                          @click:close="
                                                            remove(user, index)
                                                          "
                                                        >
                                                          <v-avatar
                                                            left
                                                            class="white--text"
                                                          >
                                                           
                                                            <v-img
                                                              :src="user.avatar"
                                                            ></v-img>
                                                          </v-avatar>
                                                          <span>{{
                                                            user.name
                                                          }}</span>
                                                        </v-chip>
                                                      </v-row>
                                                    </div>
                                                  </div>
                                                  <v-dialog
                                                    v-model="
                                                      groupmateDialogEdit
                                                    "
                                                    persistent
                                                    max-width="600px"
                                                  >
                                                    <template
                                                      v-slot:activator="{
                                                        on,
                                                        attrs,
                                                      }"
                                                    >
                                                      <v-btn
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        outlined
                                                        color="#ff9d66"
                                                        @click="
                                                          groupmateDialogEdit = true
                                                        "
                                                      >
                                                        <v-icon
                                                          >person_add</v-icon
                                                        >
                                                      </v-btn>
                                                    </template>
                                                    <v-card>
                                                      <v-card-actions>
                                                        <v-text-field
                                                          v-model="search"
                                                          @input="
                                                            getMatchedUserbyEmail();
                                                            getMatchedUserbyName();
                                                            onQueryChange();
                                                          "
                                                        >
                                                        </v-text-field>
                                                      </v-card-actions>
                                                      <v-card
                                                        max-width="450"
                                                        class="mx-auto"
                                                        outlined
                                                      >
                                                        <v-list>
                                                          <v-list-item-avatar
                                                            v-if="searchName"
                                                          >
                                                            <v-img
                                                              :src="
                                                                searchAvatar
                                                              "
                                                            ></v-img>
                                                          </v-list-item-avatar>
                                                          {{ searchName }}
                                                          <br />
                                                          {{ searchEmail }}
                                                          <br />
                                                          {{ searchId }}
                                                          <v-list-item-action>
                                                            <v-btn
                                                              v-if="searchId"
                                                              outlined
                                                              color="#ff9d66"
                                                              @click="
                                                                addGroupmates()
                                                              "
                                                            >
                                                              <v-icon
                                                                >person_add</v-icon
                                                              >
                                                            </v-btn>
                                                          </v-list-item-action>
                                                        </v-list>
                                                        <v-card-actions>
                                                          <v-spacer></v-spacer>
                                                          <v-btn
                                                            color="blue darken-1"
                                                            text
                                                            @click="
                                                              groupmateDialogEdit = false;
                                                              checkClosing();
                                                            "
                                                          >
                                                            Close
                                                          </v-btn>
                                                        </v-card-actions>
                                                      </v-card>
                                                    </v-card>
                                                  </v-dialog>
                                                </v-col>

                                                <v-col cols="12">
                                                  {{ myDeadline }}
                                                  {{ myDeadlineTime }}
                                                  {{ dateSwitchValue }}
                                                  {{ switchValue }}
                                                  {{ displayDeadline }}
                                                  <v-menu
                                                    v-model="
                                                      menu[project.title]
                                                    "
                                                    :close-on-content-click="
                                                      false
                                                    "
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    color="#ff9d66"
                                                    min-width="auto"
                                                  >
                                                    <template
                                                      v-slot:activator="{
                                                        on,
                                                        attrs,
                                                      }"
                                                    >
                                                      <v-text-field
                                                        :rules="[
                                                          (v) =>
                                                            (!!v && v) !==
                                                              'Deadline' ||
                                                            'Deadline is required',
                                                        ]"
                                                        v-model="
                                                          displayDeadline
                                                        "
                                                        label="Deadline*"
                                                        prepend-icon="mdi-calendar"
                                                        readonly
                                                        color="#ff9d66"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                      ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                      :disabled="
                                                        dateSwitchValue == 1
                                                      "
                                                      color="#ff9d66"
                                                      v-model="myDeadline"
                                                      @input="
                                                        menu[
                                                          project.title
                                                        ] = false;
                                                        changeDisplayDeadline();
                                                      "
                                                    >
                                                      <v-switch
                                                        inset
                                                        hide-details
                                                        v-model="
                                                          dateSwitchValue
                                                        "
                                                        color="#ff9d66"
                                                        :label="`Someday`"
                                                        @change="
                                                          changeDisplayDeadline()
                                                        "
                                                      ></v-switch>
                                                    </v-date-picker>
                                                  </v-menu>
                                                  <v-row
                                                    style="padding-top: 5px"
                                                  >
                                                    <v-col
                                                      cols="12"
                                                      md="6"
                                                      style="
                                                        display: flex;
                                                        align-items: center;
                                                      "
                                                    >
                                                      <v-switch
                                                        :disabled="
                                                          dateSwitchValue == 1
                                                        "
                                                        inset
                                                        hide-details
                                                        v-model="switchValue"
                                                        color="#ff9d66"
                                                        :label="`Include Time`"
                                                      ></v-switch>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                      <v-menu
                                                        :ref="
                                                          'timeMenu' + index
                                                        "
                                                        v-model="
                                                          time[project.title]
                                                        "
                                                        :close-on-content-click="
                                                          false
                                                        "
                                                        :nudge-right="40"
                                                        :return-value.sync="
                                                          myDeadlineTime
                                                        "
                                                        transition="scale-transition"
                                                        offset-y
                                                        style="z-index: 20"
                                                        max-width="290px"
                                                        color="#ff9d66"
                                                        min-width="290px"
                                                      >
                                                        <template
                                                          v-slot:activator="{
                                                            on,
                                                            attrs,
                                                          }"
                                                        >
                                                          <v-text-field
                                                            :disabled="
                                                              switchValue ==
                                                                0 ||
                                                              dateSwitchValue ==
                                                                1
                                                            "
                                                            v-model="
                                                              myDeadlineTime
                                                            "
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
                                                          v-model="
                                                            myDeadlineTime
                                                          "
                                                          color="#ff9d66"
                                                          full-width
                                                          format="24hr"
                                                          @click:minute="
                                                            y =
                                                              'timeMenu' +
                                                              index.toString();
                                                            a = $refs[y];
                                                            a[0].save(
                                                              myDeadlineTime
                                                            );
                                                            time[
                                                              project.title
                                                            ] = false;
                                                          "
                                                        >
                                                        </v-time-picker>
                                                      </v-menu>
                                                    </v-col>
                                                  </v-row>
                                                </v-col>
                                              </v-row>
                                            </v-container>
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                              color="#ff9d66"
                                              text
                                              @click="
                                                display[project.title] = false;
                                                clearInfo();
                                              "
                                            >
                                              Close
                                            </v-btn>
                                            <v-btn
                                              color="#ff9d66"
                                              text
                                              :disabled="!valid"
                                              @click="
                                                display[project.title] = false;
                                                checkEdit(project);
                                              "
                                            >
                                              Update
                                            </v-btn>
                                          </v-card-actions>
                                        </v-form>
                                      </v-card>
                                    </v-sheet>
                                  </v-dialog>
                                </v-list-item-action>
                              </v-col>
                              <v-col
                                col="12"
                                md="1"
                                align="left"
                                class="centerAlign"
                              >
                                <v-list-item-action>
                                  <v-btn
                                    color="#A5A5A5"
                                    icon
                                    @click="deleteProject(project)"
                                  >
                                    <v-icon> mdi-trash-can-outline </v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
                                class="centerAlign"
                                style="background-color: #ff9d66"
                                :class="`rounded-r-xl`"
                              >
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-list-item>
                      </template>

                      <br />
                    </div>
                  </div>
                  
                </v-virtual-scroll>
              </v-card>
            </v-container>
          </div> -->
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../main.ts";
import _ from "lodash";

export default {
  name: "Project.vue",
  data: () => ({
    Tasktime: {},
    currProject: null,
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
    nameRules: [(v) => !!v || "Project title is required"],
    display: {},
    Taskdisplay: {},
    menuEdit: {},
    tab: null,
    projectSlide: null,
    projectInvitationSlide: null,
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
    TasktempGroupmates: [],
    varGroupmates: [],
    varGroupmatesId: [],
    finalGroupmates: [],
    finalDeadline: new Date().toISOString().substr(0, 10),
    dateSwitchValue: false,
    valid: true,
    time: [],
    menuAdd: false,
    tempUser: null,
    chips: [],
    todos: [],
    groupmateDialogEdit: false,
    progress: 0,
    oldGroupmates: [],
    searchAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",

    navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "done" },
      { title: "Project", href: "./project", icon: "work" },
    ],
    currTodos: [],
    currMeetings: [],
    Taskmenu: {},
    TaskmyTodo: "",
    TaskmyProject: "",
    TaskmyDeadline: new Date().toISOString().substr(0, 10),
    TaskmyDeadlineTime: "00:00",
    TaskfinalDeadline: new Date().toISOString().substr(0, 10),
    TaskmyNote: "",
    TaskswitchValue: false,
    TaskdisplayDeadline: "Deadline",
    TaskdateSwitchValue: false,
    TaskgroupmatesChips: [],
    TaskvarPIC: [],
    TaskvarPICId: [],
    TaskoldGroupmatesChips: [],
    projects: [],
    varPIC: [],
    varPICId: [],
    currProjectObject: null,
    projectInvitations: [],
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
    this.currTodos = []
  },

  async mounted() {
    console.log("hello");
    await this.$store.dispatch("getProjects");
    await this.$store.dispatch("getProjectInvitations");
    console.log(this.$store.state.projectInvitations)
    this.remainingTodo();
    this.currTodos = []
    console.log(this.currTodos)
  },

  computed: {
    items() {
      return Array.from({ length: 1 }, (k, v) => v + 1);
    },
    length() {
      return this.$store.state.projects.length;
    },
    orderedTasks: function () {
      return _.orderBy(
        this.currTodos,
        ["complete", "finalDeadline"],
        ["asc", "asc"]
      );
    },
    
  },

  // beforeMount(){
  //   this.$store.getters.getProjects
  // },

  methods: {
    assignCurrProject(project){
      this.currProjectObject = project
      this.currProject = project.modCode + " " + project.title 
    },

    checkTodoEdit(task) {
      if (this.TaskswitchValue == false) {
        this.TaskmyDeadlineTime = "00:00";
      }
      if (this.TaskdisplayDeadline == "Someday") {
        this.TaskfinalDeadline = null;
      } else {
        this.TaskfinalDeadline = firebase.firestore.Timestamp.fromDate(
          new Date(
            this.TaskmyDeadline + "T" + this.TaskmyDeadlineTime + ":00+08:00"
          )
        );
      }
      this.editTask(task);
    },

    async renderGroupmates() {
      const docRef = await db
        .collection("project")
        .doc(this.TaskmyProject)
        .get();
      const data = await docRef.get("groupmates");
      for (let i = 0; i < data.length; i++) {
        const currGroupmate = await data[i].get();
        this.TasktempGroupmates.push({
          id: currGroupmate.id,
          name: currGroupmate.get("name"),
          object: currGroupmate,
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        });
      }

      console.log(this.$store.state.user);
    },
    async getPIC(PIC) {
      this.TaskvarPIC = []
      console.log(PIC);
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();
        this.TaskvarPIC.push({
          id: docRef.id,
          name: docRef.get("name"),
          object: docRef,
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        });
      }
      console.log(this.TaskvarPIC);
      return this.TaskvarPIC;
    },

    async getPICId(PIC) {
      this.TaskvarPICId = []
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();

        this.TaskvarPICId.push(docRef.id);
      }

      return this.TaskvarPICId;
    },

    async addFinalPIC(task) {
      this.TaskgroupmatesChipsId = [];
      for (let i = 0; i < this.TaskgroupmatesChips.length; i++) {
        this.TaskgroupmatesChipsId.push(this.TaskgroupmatesChips[i].id);
      }
      console.log(this.TaskgroupmatesChipsId);

      for (let i = 0; i < this.TaskgroupmatesChipsId.length; i++) {
        if (this.TaskoldGroupmatesChips.includes(this.TaskgroupmatesChipsId[i])) {
          console.log("groupmate has already in charge the todo");
        } else {
          db.collection("user")
            .doc(this.TaskgroupmatesChipsId[i])
            .update({
              todo: firebase.firestore.FieldValue.arrayUnion(
                db.collection("todo").doc(task.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.TaskoldGroupmatesChips.length; i++) {
        if (this.TaskgroupmatesChipsId.includes(this.TaskoldGroupmatesChips[i])) {
          console.log("this groupmate is still in charge of the todo");
        } else {
          console.log(this.TaskoldGroupmatesChips[i]);
          db.collection("user")
            .doc(this.TaskoldGroupmatesChips[i])
            .update({
              todo: firebase.firestore.FieldValue.arrayRemove(
                db.collection("todo").doc(task.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.TaskgroupmatesChips.length; i++) {
        db.collection("todo")
          .doc(task.id)
          .update({
            PIC: firebase.firestore.FieldValue.arrayUnion(
              db.collection("user").doc(this.TaskgroupmatesChips[i].id)
            ),
          });
      }
    },

    async deleteTask(task) {
      console.log(task)
      console.log(this.$store.state.user.uid)
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          todo: firebase.firestore.FieldValue.arrayRemove(
            db.collection("todo").doc(task.id)
          ),
        });
      await db
        .collection("project")
        .doc(task.project)
        .update({
          todos: firebase.firestore.FieldValue.arrayRemove(
            db.collection("todo").doc(task.id)
          ),
        });
      this.EditpassCurrSelectedProject(task.project)
      await db.collection("todo").doc(task.id).delete();
      this.$store.dispatch("getTasks");
      this.$store.dispatch("getProjects")

    },

    completeTask: function (task) {
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      });
      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTasks");
      
      

    },
    async editTask(task) {
      console.log(task.id);
      console.log(this.TaskdateSwitchValue);
      const response = await db
        .collection("todo")
        .doc(task.id)
        .update({
          task: this.TaskmyTodo,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          complete: this.Taskcomplete,
          deadlineTime: this.TaskmyDeadlineTime,
          deadlineDate: this.TaskmyDeadline,
          switchValue: this.TaskswitchValue,
          dateSwitchValue: this.TaskdateSwitchValue,
          // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
          deadline: this.TaskfinalDeadline,
          displayDeadline: this.TaskdisplayDeadline,
          note: this.TaskmyNote,
          project: db.collection("project").doc(this.TaskmyProject),
          PIC: [],
        });
      await this.addFinalPIC(task);
      if (this.TaskoldMyProject !== this.TaskmyProject) {
        await db
          .collection("project")
          .doc(this.TaskmyProject)
          .update({
            todos: firebase.firestore.FieldValue.arrayUnion(
              db.collection("todo").doc(task.id)
            ),
          })
          .catch((error) => console.log(error));
        await db
          .collection("project")
          .doc(this.TaskoldMyProject)
          .update({
            todos: firebase.firestore.FieldValue.arrayRemove(
              db.collection("todo").doc(task.id)
            ),
          })
          .catch((error) => console.log(error));
      }

      this.$store.dispatch("getTasks");
      this.$store.dispatch("getProjects");
      console.log(this.TaskmyProject)
      console.log(this.TaskoldMyProject)
      this.EditpassCurrSelectedProject(this.TaskoldMyProject)
      this.currProject
      this.TaskmyTodo = "";
      this.TaskmyProject = null;
      this.TaskmyNote = "";
      this.TaskmyDeadlineTime = "00:00";
      this.TaskmyDeadline = new Date().toISOString().substr(0, 10);
      this.TaskswitchValue = false;
      this.TaskdateSwitchValue = false;
      this.TaskdisplayDeadline = "Deadline";
      this.TaskfinalDeadline = new Date().toISOString().substr(0, 10);
      this.TaskgroupmatesChips = [];
      this.TaskvarPIC = [];
      this.TaskvarPICId = [];
    },
    async getProjectMenu() {
      let data = await this.$store.getters.getProjects;
      data = this.$store.state.projects;
      console.log(this.$store.state.projects);
      for (let i = 0; i < data.length; i++) {
        const doc = await data[i];
        console.log(doc);
        this.projects.push({
          title: doc.title,
          id: doc.id,
        });
      }
      console.log(this.projects);
    },
    clearTodoInfo() {
      this.TaskmyTodo = "";
      this.TaskmyProject = "";
      this.TaskmyDeadline = new Date().toISOString().substr(0, 10);
      this.TaskmyDeadlineTime = "00:00";
      this.TaskfinalDeadline = new Date().toISOString().substr(0, 10);
      this.TaskmyNote = "";
      this.TaskswitchValue = false;
      this.TaskdisplayDeadline = "Deadline";
      this.TaskdateSwitchValue = false;
      this.TaskgroupmatesChips = [];
      this.TaskvarPIC = [];
      this.TaskvarPICId = [];
      this.TaskoldGroupmatesChips = [];
    },

    async fillTodoInfo(task) {
      console.log(task)
      console.log(task.task)
      console.log(task.PIC)
      this.Taskcomplete = task.complete;
      this.TaskmyTodo = task.title;
      this.TaskmyProject = task.project;
      this.TaskoldMyProject = task.oldProject;
      this.TaskmyDeadline = task.TaskmyDeadline;
      this.TaskmyDeadlineTime = task.TaskmyDeadlineTime;
      this.TaskmyNote = task.note;
      this.TaskswitchValue = task.TaskswitchValue;
      this.TaskfinalDeadline = task.finalDeadline;
      this.TaskdateSwitchValue = task.TaskdateSwitchValue;
      this.TaskdisplayDeadline = task.TaskdisplayDeadline;
      this.TaskgroupmatesChips = task.TaskgroupmatesChips;
      this.TaskoldGroupmatesChips = task.TaskoldGroupmatesChips;
      console.log(task.PIC)
      console.log(this.oldGroupmatesChips);
      console.log(this.TaskmyTodo)
    },
    async passCurrSelectedProject(project) {
      
      console.log(project)
      this.currTodos = []
      const todos = project.todos;
      for (let i = 0; i < todos.length; i++) {
        const data = await db.collection("todo").doc(todos[i].id).get();
        this.currTodos.push({
          id: data.id,
          title: data.get("task"),
          complete: data.get("complete"),
          note: data.get("note"),
          finalDeadline: data.get("deadline") ? data.get("deadline").toDate() : null,
          project: data.get("project").id,
          oldProject: data.get("project").id,
          TaskmyDeadline: data.get("deadlineDate"),
          TaskmyDeadlineTime: data.get("deadlineTime"),
          TaskswitchValue: data.get("switchValue"),
          TaskdateSwitchValue: data.get("dateSwitchValue"),
          TaskdisplayDeadline: data.get("displayDeadline"),
          TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
          TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          
        })
        console.log(data.get("deadline"));
      }
     
      console.log(this.currTodos);
    },

 async EditpassCurrSelectedProject(projectID) {
      console.log(projectID)
      this.currTodos = []
      const docRef = await db.collection('project').doc(projectID).get();
      const todos = await docRef.get('todos');
      for (let i = 0; i < todos.length; i++) {
        const data = await db.collection("todo").doc(todos[i].id).get();
        this.currTodos.push({
          id: data.id,
          title: data.get("task"),
          complete: data.get("complete"),
          note: data.get("note"),
          finalDeadline: data.get("deadline") ? data.get("deadline").toDate() : null,
          project: data.get("project").id,
          oldProject: data.get("project").id,
          TaskmyDeadline: data.get("deadlineDate"),
          TaskmyDeadlineTime: data.get("deadlineTime"),
          TaskswitchValue: data.get("switchValue"),
          TaskdateSwitchValue: data.get("dateSwitchValue"),
          TaskdisplayDeadline: data.get("displayDeadline"),
          TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
          TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          
        })
        console.log(data.get("deadline"));
      }
     
      console.log(this.currTodos);
    },

    async addCurrUserToTempGroupmates() {
      const docRef = await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .get();
      this.tempGroupmates.push({
        id: docRef.id,
        name: docRef.get("name"),
        email: docRef.get("email"),
        object: docRef,
        chipValue: true,
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      });
      console.log(this.tempGroupmates);
    },
    async checkEdit(project) {
      if (this.switchValue == false) {
        console.log(this.myDeadlineTime);
        this.myDeadlineTime = "00:00";
        console.log(this.myDeadlineTime);
      }
      if (this.title == "") {
        this.title = project.title;
      }
      if (this.modCode == "") {
        this.modCode = project.modCode;
      }
      if (this.displayDeadline == "Someday") {
        this.finalDeadline = null;
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(
          new Date(this.myDeadline + "T" + this.myDeadlineTime + ":00+08:00")
        );
      }
      await this.passGroupmates();
      this.editProject(project);
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
      console.log(this.varGroupmates);
      console.log(this.tempGroupmates);
      this.varGroupmates = [];
    },
    async checkTimeAdd() {
      if (this.switchValue == false) {
        this.myDeadlineTime = "00:00";
      }
      if (this.displayDeadline == "Someday") {
        this.finalDeadline = null;
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(
          new Date(this.myDeadline + "T" + this.myDeadlineTime + ":00+08:00")
        );
      }
      await this.passGroupmates();
      this.addProject();
    },

    validate() {
      this.$refs.form.validate();
    },

    clearInfo() {
      this.title = "";
      this.modCode = "";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.finalGroupmates = [];
      this.myDeadlineTime = "00:00";
      this.switchValue = false;
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.displayDeadline = "Deadline";
      this.dateSwitchValue = false;
    },
    async signOut() {
      try {
        const data = await firebase.auth().signOut();
        console.log(data);
        this.$router.replace({ name: "Login" });
        this.$store.state.snapshot.unsubscribe();
      } catch (err) {
        console.log(err);
      }
    },
    async fetchUserID() {
      this.$store.state.user.uid;
    },
    async addProject() {
      this.errors = "";
      const response = await db.collection("project").add({
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        creator: db.collection('user').doc(this.$store.state.user.uid),
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
        groupmates_invited: [],
        groupmates_declined: [],
        modCode: this.modCode,
      });
      await this.addGroupmatesToProject(response);
      await this.addForGroupmates(response);
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          project: firebase.firestore.FieldValue.arrayUnion(response),
        });
      await this.$store.dispatch("getProjects");

      this.title = "";
      this.modCode = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.finalGroupmates = [];
      this.tempGroupmates = [];
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
    },

    async deleteProject(project) {
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          project: firebase.firestore.FieldValue.arrayRemove(
            db.collection("project").doc(project.id)
          ),
        });
      for (let i = 0; i < project.todos.length; i++) {
        await db.collection('user').doc(this.$store.state.user.uid)
        .update({todo: firebase.firestore.FieldValue.arrayRemove( db.collection("todo").doc(project.todos[i].id))})
      }
      this.currTodos = [];
      this.currProject = null;
      this.$store.dispatch("getProjects");
    },

    async editProject(project) {
      this.errors = "";
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
      });
      
      console.log(this.currProjectObject.id)
      console.log(project.id)
      
      console.log(this.currProject)
      this.$store.dispatch("getProjects");
      if (project.id == this.currProjectObject.id){
      
        this.currProject = this.modCode + " " + this.title
      }
      this.title = "";
      this.modCode = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.finalGroupmates = [];
      this.tempGroupmates = [];
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
    },

    async getMatchedUserbyEmail() {
      console.log("getMatchedUserbyEmail");
      db.collection("user")
        .where("email", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            (this.searchName = doc.data().name),
              (this.searchEmail = doc.data().email),
              (this.searchId = doc.id);

            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    async getMatchedUserbyName() {
      console.log("getMatchedUserbyName");
      db.collection("user")
        .where("name", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            (this.searchName = doc.data().name),
              (this.searchEmail = doc.data().email),
              (this.searchId = doc.id);

            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },

    async addGroupmates() {
      db.collection("user")
        .where("email", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(this.tempGroupmates);
            this.tempGroupmates.push({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              object: doc,
              chipValue: true,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            });
            console.log(this.tempGroupmates);
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      db.collection("user")
        .where("name", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(this.tempGroupmates);
            this.tempGroupmates.push({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              object: doc,
              chipValue: true,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            });
            console.log(this.tempGroupmates);
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },

    async addForGroupmates(project) {
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        if (this.oldGroupmates.includes(this.finalGroupmates[i]) || this.finalGroupmates[i] === this.$store.state.user.uid) {
          console.log("groupmate already has the project");
        } else {
          db.collection("user")
            .doc(this.finalGroupmates[i])
            .update({
              project_invited: firebase.firestore.FieldValue.arrayUnion(
                db.collection("project").doc(project.id)
              ),
            });
        }
      }
      console.log("check");
    },

   
    async passGroupmates(response) {
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (this.tempGroupmates[i].chipValue == true) {
          console.log(this.tempGroupmates[i].id);
          this.finalGroupmates.push(this.tempGroupmates[i].id);
        }
      }
      console.log(this.tempGroupmates);
      console.log(this.finalGroupmates);

      this.searchId = "";
      this.searchEmail = "";
      this.searchName = "";
      this.search = "";
      this.tempGroupmates = [];
    },

    async addGroupmatesToProject(project) {
      console.log(project);
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        if (this.finalGroupmates[i] !== this.$store.state.user.uid){
          db.collection("project")
            .doc(project.id)
            .update({
              groupmates_invited: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])
              ),
            });
        } else {
          db.collection("project").doc(project.id).update({groupmates:firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])) })
        }
      }
    },

    async remove(user, index) {
      this.chips.splice(this.chips.indexOf(user), 1);
      this.chips = [...this.chips];
      this.$delete(this.tempGroupmates, index);
      this.tempGroupmates.push({
        id: user.id,
        name: user.name,
        email: user.email,
        object: user.doc,
        chipValue: false,
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      });
      console.log(this.tempGroupmates);
    },

    Taskremove(item) {
      this.TaskgroupmatesChips.splice(
        this.TaskgroupmatesChips.indexOf(item),
        1
      );
      this.TaskgroupmatesChips = [...this.TaskgroupmatesChips];
    },

    onQueryChange(event) {
      // can be this.query.length === 0 as well
      if (this.search.length === 0 || this.search != this.searchName) {
        this.searchName = "";
        this.searchId = "";
        this.searchEmail = "";
      }
    },

    changeDisplayDeadline() {
      if (this.dateSwitchValue == 1) {
        this.displayDeadline = "Someday";
        this.switchValue = false;
        this.myDeadlineTime = "00:00";
      } else {
        this.displayDeadline = this.myDeadline;
      }
    },

    changeTaskDisplayDeadline() {
      if (this.TaskdateSwitchValue == 1) {
        this.TaskdisplayDeadline = "Someday";
        this.TaskswitchValue = false;
        this.TaskmyDeadlineTime = "00:00";
      } else {
        this.TaskdisplayDeadline = this.TaskmyDeadline;
      }
    },

    async getGroupmates(groupmates) {
      for (let i = 0; i < groupmates.length; i++) {
        console.log(groupmates[i]);
        console.log(groupmates[0]);
        console.log(groupmates.length);

        console.log(this.tempGroupmates);
        const docRef = await groupmates[i].get();

        console.log(docRef);
        console.log(docRef.id);
        console.log(docRef.get("name"));
        console.log(docRef.get("email"));
        this.varGroupmates.push({
          id: docRef.id,
          name: docRef.get("name"),
          email: docRef.get("email"),
          object: docRef,
          chipValue: true,
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        });
      }
      console.log(this.varGroupmates);
      return this.varGroupmates;
    },

    async getGroupmatesId(groupmates) {
      for (let i = 0; i < groupmates.length; i++) {
        const docRef = await groupmates[i].get();

        this.varGroupmatesId.push({
          id: docRef.id,
        });
      }

      return this.varGroupmatesId;
    },

    async remainingTodo(todos) {
      let counter = 0;
      if (todos == null || todos.length == 0) {
        return 0;
      } else {
        for (let i = 0; i < todos.length; i++) {
          const docRef = await db.collection("todos").doc(todos[i].id).get();
          console.log(docRef);
          if (docRef.get("complete") == false) {
            counter += 1;
          }
        }
        return counter;
      }
    },

    async acceptProject(projectInvitation){
        await db.collection('user').doc(this.$store.state.user.uid).update({
          project_invited: firebase.firestore.FieldValue.arrayRemove(
                db.collection("project").doc(projectInvitation.id)
        )})
        this.$store.dispatch('getProjectInvitations')
        await db.collection('user').doc(this.$store.state.user.uid).update({
          project: firebase.firestore.FieldValue.arrayUnion(
                db.collection("project").doc(projectInvitation.id)
        )})
        this.$store.dispatch('getProjects')
        

        await db.collection('project').doc(projectInvitation).update({
          groupmates: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.$store.state.user.uid)
        )})
        await db.collection('project').doc(projectInvitation).update({
          groupmates_invited: firebase.firestore.FieldValue.arrayRemove(
                db.collection("user").doc(this.$store.state.user.uid)
        )})
    },

    async declineProject(projectInvitation){
        await db.collection('user').doc(this.$store.state.user.uid).update({
          project_invited: firebase.firestore.FieldValue.arrayRemove(
                db.collection("project").doc(projectInvitation.id)
        )})
        this.$store.dispatch('getProjectInvitations')
        await db.collection('project').doc(projectInvitation).update({
          groupmates_declined: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.$store.state.user.uid)
        )})
        await db.collection('project').doc(projectInvitation).update({
          groupmates_invited: firebase.firestore.FieldValue.arrayRemove(
                db.collection("user").doc(this.$store.state.user.uid)
        )})
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");

.v-card {
  color: #ff9d66 !important; 
  border: none;
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
  margin-top: 0px !important;
  padding-top: 0px !important;
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
  outline: 1px solid #1e5180;
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


.v-navigation-drawer__border {
  background-color: rgba(255, 255, 255, 1);
  border-color: white;
  color: white;
}

.v-list--rounded .v-list-item,
.v-list--rounded .v-list-item::before,
.v-list--rounded .v-list-item > .v-ripple__container {
  border-radius: 20px !important;
}

.v-navigation-drawer > div {
  display: flex;
  flex-direction: column;
}

.center-me {
  transform: translate(-50%, 0);
}

.theme--light.v-card {
  color: #ff9d66;
}

.v-slide-group__next,
.v-slide-group__prev {
  align-items: center;
  display: flex;
  flex: 0 1 52px;
  justify-content: center;
  min-width: 40px !important ;
}
</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: white !default
</style>
