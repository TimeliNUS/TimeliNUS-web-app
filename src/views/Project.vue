<template>
  <div
    style="
      background-color: #fff0df;
      font-family: DM Sans, sans-serif;
      min-height: 100vh;
    "
  >
    <div style="display: flex">
      <v-navigation-drawer
        permanent
        floating
        left
        align="center"
        class="v-navigation-drawer__border"
        v-bind:class="{ isActive: isNavigationBarActive }"
        style="
          padding: 18px;
          font-size: 8px;
          font-weight: bold;
          border-color: white;
          text-align: left;
          font-color: #4b4b4b;
          min-width: 256px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        "
      >
        <div style="display: flex; flex-direction: column; min-height: 100%">
          <v-img
            width="160"
            src="@/assets/orbital_logo_latest.png"
            alt=""
            contain
            style="flex: none; top: 50px; margin-bottom: 50px"
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
                  >{{ item.title }}</v-list-item-title
                >
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

      <v-column style="flex: 1" class="content">
        <div>
          <v-row
            style="
              margin-top: 10px;
              padding-bottom: 0px;
              margin-left: 1vw;
              align-items: center;
            "
          >
            <v-icon
              class="navigation_button"
              large
              v-on:click="setNavigationBarActive"
              style="padding-left: 10px; padding-right: 10px"
              >menu</v-icon
            >
            <v-container class="navigation_title">
              <span
                style="
                  color: #4b4b4b;
                  font-size: 32px;
                  display: flex;
                  align-items: flex-start;
                  font-weight: bold;
                "
                >Project</span
              >
            </v-container>
          </v-row>
        </div>

        <v-row style="margin: 0">
          <v-col col="12" md="4" style="display: flex; flex-direction: column">
            <div style="margin-left: 1vw">
              <v-dialog
                v-model="dialog"
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
                    style="padding: 2px"
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
                    <div v-if="addSubmit == false">
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
                                <span style="">Groupmates</span>
                                <br />
                                <v-row
                                  style="
                                    padding-top: 12px;
                                    padding-right: 12px;
                                    padding-left: 12px;
                                  "
                                >
                                  <div v-if="tempGroupmates.length !== 0">
                                    <v-row>
                                      <div
                                        v-for="(user, index) in tempGroupmates"
                                        :key="user.id"
                                      >
                                        <v-chip
                                          style="
                                            margin-top: 16px;
                                            margin-left: 12px;
                                            margin-right: 12px;
                                          "
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
                                </v-row>
                                <br />
                                <br />
                                <v-row>
                                  <div>
                                    <v-dialog
                                      v-model="dialogPerson"
                                      max-width="600px"
                                    >
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-btn
                                          v-bind="attrs"
                                          v-on="on"
                                          outlined
                                          style="
                                            margin-left: 12px;
                                            margin-top: 5px;
                                          "
                                          color="#ff9d66"
                                          @click="dialogPerson = true"
                                        >
                                          <v-icon>person_add</v-icon>
                                        </v-btn>
                                      </template>
                                      <v-card style="padding: 20px">
                                        <v-card-actions>
                                          <v-text-field
                                            v-model="search"
                                            color="#ff9d66"
                                            label="Search your groupmates by entering their username or email"
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
                                                :src="searchAvatar"
                                              ></v-img>
                                            </v-list-item-avatar>
                                            <br />
                                            {{ searchName }}
                                            <br />
                                            {{ searchEmail }}
                                            <br />
                                            <v-list-item-action>
                                              <v-btn
                                                :disabled="checkAdd(searchId)"
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
                                              color="#ff9d66"
                                              text
                                              @click="dialogPerson = false"
                                            >
                                              Close
                                            </v-btn>
                                          </v-card-actions>
                                        </v-card>
                                      </v-card>
                                    </v-dialog>
                                  </div>
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
                              !valid ||
                              this.title == '' ||
                              this.modCode == '' ||
                              this.checkTempGroupmates() == 0 ||
                              this.displayDeadline == 'Deadline'
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
                    </div>

                    <v-dialog
                      v-model="addSubmit"
                      content-class="elevation-0"
                      max-width="600px"
                      min-height="300px"
                      :class="`rounded-lg`"
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      "
                    >
                      <v-sheet
                        outlined
                        color="#ff9d66"
                        style="
                          padding: 3px;
                          min-width: 600px;
                          max-width: 600px;
                          min-height: 300px;
                        "
                        :class="`rounded-xl`"
                      >
                        <v-card
                          outlined
                          :class="`rounded-xl`"
                          style="
                            padding: 40px;
                            min-height: 300px;
                            max-width: 600px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                          "
                        >
                          <span style="color: #4b4b4b; margin-bottom: 10px"
                            >Project has been created successfully. Invitations
                            will be sent to groupmates added.</span
                          >
                          <v-btn
                            text
                            color="#ff9d66"
                            @click="changeSubmitOnClose()"
                            >Close</v-btn
                          >
                        </v-card>
                      </v-sheet>
                    </v-dialog>
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
                flex: 1;
              "
            >
              <v-container :class="`rounded-lg`" style="flex: 1; padding: 0px">
                <v-card
                  style="padding: 8px ; padding-top: 20px !important; padding-bottom:12px;!important; flex: 1; height: 100%"
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
                  <div
                    v-if="this.$store.state.projectInvitations.length !== 0"
                    style="
                      display: flex;
                      flex-direction: row;
                      justify-content: center !important;
                    "
                  >
                    <v-slide-group
                      v-model="projectInvitationSlide"
                      style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center !important;
                      "
                      active-class="success"
                      show-arrows
                      center-active
                    >
                      <v-slide-item
                        v-for="projectInvitation in this.$store.state
                          .projectInvitations"
                        :key="projectInvitation.id"
                        style="
                          display: flex;
                          justify-content: center !important;
                        "
                      >
                        <v-card
                          outlined
                          color="white"
                          class="ma-2"
                          width="280"
                          :class="`rounded-xl`"
                          style="padding: 10px; padding-left: 10px"
                        >
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
                              {{ projectInvitation.modCode }}
                            </v-card-text>
                            <v-card-title
                              style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                            >
                              {{ projectInvitation.title }}
                            </v-card-title>
                            <v-card-text
                              style="display: flex; padding: 2px !important"
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
                                color: #999999;
                              "
                            >
                              <div>
                                <span color="#999999">
                                  <v-icon color="#999999">mdi-account</v-icon>

                                  {{ projectInvitation.creator }}
                                </span>
                              </div>
                            </v-card-text>
                            <v-card-actions style="padding: 0px; !important">
                              <v-row
                                style="padding-top: 20px !important"
                                align="center"
                                justify="center"
                              >
                                <v-btn
                                  text
                                  small
                                  color="#ff9d66"
                                  @click="acceptProject(projectInvitation)"
                                >
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
                              </v-row>
                            </v-card-actions>
                          </v-col>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                  </div>
                  <div
                    v-else
                    style="
                      padding-top: 9vh;
                      padding-bottom: 9vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <span style="font-weight: bold; color: white"
                      >You do not have any project invitation.</span
                    >
                  </div>
                </v-card>
              </v-container>
            </div>
          </v-col>

          <v-col col="12" md="8">
            <div style="display: flex; height: 100%; margin-right: 1vw">
              <div
                style="
                  min-width: 51vw;
                  height: 100%;
                  margin-right: auto;
                  margin-left: auto;
                  display: flex;
                  padding-bottom: 0;
                  width: 100%;
                "
              >
                <v-card
                  outlined
                  color="#FFE4CB"
                  style="
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    margin-right: 25px;
                  "
                  :class="`rounded-xl`"
                >
                  <div
                    style="
                      padding: 8px;
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                    "
                  >
                    <span
                      style="
                        margin-top: 10px;
                        color: #4b4b4b;
                        font-size: 20px;
                        display: flex;
                        align-items: flex-start;
                        font-weight: bold;
                      "
                      >Overview</span
                    >

                    <v-btn
                      align="right"
                      class="hide-on-sm"
                      text
                      style="
                        margin-top: 10px;
                        color: #4b4b4b;
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        font-weight: bold;
                      "
                      @click="tableView = true"
                    >
                      Table View
                    </v-btn>
                  </div>

                  <div v-if="length" style="display: flex; flex-direction: row">
                    <v-sheet
                      :class="`rounded-xl`"
                      class="mx-auto"
                      elevation="0"
                      min-width="50vw"
                      style="background-color: #ffe4cb"
                    >
                      <v-slide-group
                        v-model="projectSlide"
                        active-class="success"
                        show-arrows
                      >
                        <v-slide-item
                          v-for="(project, index) in this.$store.state.projects"
                          :key="project.id"
                          v-slot="{ active, toggle }"
                        >
                          <v-card
                            :class="`rounded-xl`"
                            :color="active ? undefined : 'white'"
                            class="ma-2"
                            height="230"
                            @click="
                              toggle;
                              passCurrSelectedProject(project);
                              assignCurrProject(project);
                              getMeetingConfirmationProject(project);
                              getMeetingPendingProject(project);
                              getMeetingInvProject(project);
                              getConfirmedMeetingProject(project);
                            "
                            style="
                              padding: 10px;
                              padding-left: 14px;
                              min-width: 330px;
                            "
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
                                  style="display: flex; padding: 2px !important"
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
                                <div
                                  style="
                                    padding-top: 3px;
                                    padding-bottom: 0px !important;
                                    display: inline-flex;
                                    flex-direction: row-reverse;
                                    justify-content: flex-end;
                                    padding-left: 12px;
                                  "
                                >
                                  <div
                                    v-for="avatar in project.groupmatesAvatar"
                                    :key="avatar.id"
                                  >
                                    <div
                                      style="
                                        margin-left: -15px;
                                        padding-bottom: 0px !important;
                                        padding-top: 3px !important;
                                        padding-left: 3px !important;
                                        padding-right: 3px !important;
                                      "
                                    >
                                      <v-avatar
                                        :size="30"
                                        style="border: 2px solid #fff"
                                      >
                                        <v-img :src="avatar"></v-img
                                      ></v-avatar>
                                    </div>
                                  </div>
                                </div>
                              </v-col>
                              <div
                                style="
                                  display: flex;
                                  align-items: center;
                                  padding: 5px !important;
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
                              </div>
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
                                style="
                                  padding: 3px;
                                  padding-right: 10px;
                                  padding-bottom: 0px !important;
                                "
                                >groups</v-icon
                              >
                              {{ project.confirmedMeetingLength }} Scheduled
                              Meeting</span
                            >

                            <div
                              style="
                                display: flex;
                                justify-content: space-between;
                              "
                            >
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
                                  style="
                                    padding: 3px;
                                    padding-right: 10px;
                                    padding-top: 0px !important;
                                  "
                                  >check_circle</v-icon
                                >
                                {{ project.incompletedTodoLength }} Incompleted
                                Todo
                              </span>
                              <div style="display: flex">
                                <v-dialog
                                  v-model="display[project.title]"
                                  content-class="elevation-0"
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
                                      <div v-if="editSubmit == false">
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
                                                  <span style=""
                                                    >Groupmates</span
                                                  >
                                                  <br />
                                                  <v-row
                                                    style="
                                                      padding-top: 12px;
                                                      padding-right: 12px;
                                                      padding-left: 12px;
                                                    "
                                                  >
                                                    <div
                                                      v-if="
                                                        tempGroupmates.length !==
                                                        0
                                                      "
                                                    >
                                                      <v-row>
                                                        <div
                                                          v-for="(
                                                            user, index
                                                          ) in tempGroupmates"
                                                          :key="user.id"
                                                        >
                                                          <v-chip
                                                            style="
                                                              margin-top: 16px;
                                                              margin-left: 12px;
                                                              margin-right: 12px;
                                                            "
                                                            color="#ff9d66"
                                                            text-color="white"
                                                            :input-value="
                                                              user.id
                                                            "
                                                            v-if="
                                                              user.chipValue
                                                            "
                                                            close
                                                            @click:close="
                                                              remove(
                                                                user,
                                                                index
                                                              )
                                                            "
                                                          >
                                                            <v-avatar
                                                              left
                                                              class="
                                                                white--text
                                                              "
                                                            >
                                                              <v-img
                                                                :src="
                                                                  user.avatar
                                                                "
                                                              ></v-img>
                                                            </v-avatar>
                                                            <span>{{
                                                              user.name
                                                            }}</span>
                                                          </v-chip>
                                                        </div>
                                                      </v-row>
                                                    </div>
                                                  </v-row>
                                                  <br />
                                                  <br />

                                                  <v-row>
                                                    <div>
                                                      <v-dialog
                                                        v-model="
                                                          groupmateDialogEdit
                                                        "
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
                                                            style="
                                                              margin-left: 12px;
                                                              margin-top: 5px;
                                                            "
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
                                                        <v-card
                                                          style="padding: 20px"
                                                        >
                                                          <v-card-actions>
                                                            <v-text-field
                                                              v-model="search"
                                                              color="#ff9d66"
                                                              label="Search your groupmates by entering their username or email"
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
                                                                v-if="
                                                                  searchName
                                                                "
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

                                                              <v-list-item-action>
                                                                <v-btn
                                                                  :disabled="
                                                                    checkAdd(
                                                                      searchId
                                                                    )
                                                                  "
                                                                  v-if="
                                                                    searchId
                                                                  "
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
                                                                color="#ff9d66"
                                                                text
                                                                @click="
                                                                  groupmateDialogEdit = false
                                                                "
                                                              >
                                                                Close
                                                              </v-btn>
                                                            </v-card-actions>
                                                          </v-card>
                                                        </v-card>
                                                      </v-dialog>
                                                    </div>
                                                  </v-row>
                                                </v-col>

                                                <v-col cols="12">
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
                                      </div>
                                      <v-dialog
                                        v-model="editSubmit"
                                        content-class="elevation-0"
                                        max-width="600px"
                                        min-height="300px"
                                        :class="`rounded-lg`"
                                        style="
                                          display: flex;
                                          justify-content: center;
                                          align-items: center;
                                        "
                                      >
                                        <v-sheet
                                          outlined
                                          color="#ff9d66"
                                          style="
                                            padding: 3px;
                                            min-width: 600px;
                                            max-width: 600px;
                                            min-height: 300px;
                                          "
                                          :class="`rounded-xl`"
                                        >
                                          <v-card
                                            outlined
                                            :class="`rounded-xl`"
                                            style="
                                              padding: 40px;
                                              min-height: 300px;
                                              max-width: 600px;
                                              display: flex;
                                              justify-content: center;
                                              align-items: center;
                                              flex-direction: column;
                                            "
                                          >
                                            <span
                                              style="
                                                color: #4b4b4b;
                                                margin-bottom: 10px;
                                              "
                                              >Project details have updated
                                              successfully.</span
                                            >
                                            <v-btn
                                              text
                                              color="#ff9d66"
                                              @click="changeSubmitOnClose()"
                                              >Close</v-btn
                                            >
                                          </v-card>
                                        </v-sheet>
                                      </v-dialog>
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
                  <div
                    v-else
                    style="padding:85px; display:flex' align-items: center; justify-content: center"
                    class="empty_message"
                  >
                    <span
                      style="
                        font-color: #4b4b4b;
                        font-weight: bold;
                        font-size: 16px;
                      "
                      >You do not have any project yet. Create a new one or
                      accept any project invitation</span
                    >
                  </div>
                  <div>
                    <span
                      style="
                        margin-top: 17px;
                        color: #4b4b4b;
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        font-weight: light;
                        margin-right: 3vw;
                        justify-content: flex-end;
                      "
                      class="description"
                      >Click any project to see more details</span
                    >
                  </div>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row
          style="margin-left: 1vw; margin-right: 1vw"
          v-if="currTodos.length !== 0 || currProject !== null"
        >
          <v-col :class="`rounded-xl`" style="width: 100%">
            <v-card
              outlined
              color="#FFE4CB"
              style="padding: 20px; padding-left: 30px; width: 100%"
              :class="`rounded-xl project-card`"
            >
              <div style="display: flex; justify-content: space-between">
                <span
                  style="
                    color: #ff9d66;
                    font-weight: bold;
                    padding: 10px;
                    font-size: 20px;
                    display: flex;
                    justify-content: flex-start;
                  "
                >
                  {{ currProject }}</span
                >
                <div
                  style="
                    padding-top: 3px;
                    padding-bottom: 0px !important;
                    display: inline-flex;
                    flex-direction: row-reverse;
                    justify-content: flex-end;
                    padding-left: 12px;
                  "
                >
                  <div
                    v-for="avatar in currProjectObject.groupmatesAvatar"
                    :key="avatar.id"
                  >
                    <div
                      style="
                        margin-left: -15px;
                        padding-bottom: 0px !important;
                        padding-top: 3px !important;
                        padding-left: 3px !important;
                        padding-right: 3px !important;
                      "
                    >
                      <v-avatar :size="30" style="border: 2px solid #fff">
                        <v-img :src="avatar"></v-img
                      ></v-avatar>
                    </div>
                  </div>
                </div>
              </div>

              <v-card
                outlined
                color="#ff9d66"
                style="padding: 20px; overflow-y: scroll; max-height: 61vh"
                :class="`rounded-xl project-card`"
              >
                <v-tabs
                  :class="`rounded-xl`"
                  style="padding: 10px"
                  v-model="tab"
                  fixed-tabs
                  color="white"
                  background-color="#ff9d66"
                  dark
                >
                  <v-tab> Meetings </v-tab>
                  <v-tab> Todos </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" style="background-color: #ff9d66">
                  <v-tab-item style="background-color: #ff9d66">
                    <div
                      style="background-color: #ffe4cb; border-radius: 24px"
                      class="rounded-xl"
                    >
                      <v-card
                        color="#FFE4CB"
                        outlined
                        :class="`rounded-xl`"
                        style="padding: 10px"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                          class="project-meeting-bar"
                        >
                          <v-card-title>Meetings</v-card-title>
                          <v-btn outlined
                            ><router-link
                              style="text-decoration: none; color: inherit"
                              :to="{
                                name: 'Meeting',
                                params: { dialog: true },
                              }"
                              >Add meeting</router-link
                            ></v-btn
                          >
                        </div>
                        <v-row style="display: flex; justify-content: center">
                          <v-tabs
                            style="padding: 10px"
                            v-model="tabMeeting"
                            fixed-tabs
                            color="#4b4b4b"
                            background-color="#ffe4cb"
                          >
                            <v-tab> Invitations </v-tab>
                            <v-tab> Pending </v-tab>
                            <v-tab>Confirmation</v-tab>
                            <v-tab>Scheduled</v-tab>
                          </v-tabs>
                          <v-tabs-items
                            v-model="tabMeeting"
                            style="background-color: #ffe4cb"
                          >
                            <v-tab-item style="background-color: #ffe4cb">
                              <v-container
                                style="
                                  border-radius: 24px;
                                  padding-bottom: 0px !important;
                                "
                                :class="`rounded-xl`"
                              >
                                <v-card
                                  color="#FFE4CB"
                                  outlined
                                  :class="`rounded-xl`"
                                  style="padding: 10px"
                                >
                                  <div v-if="invitationLength > 0" style="">
                                    <v-sheet
                                      :class="`rounded-xl`"
                                      class="mx-auto"
                                      elevation="0"
                                      style="background-color: #ffe4cb"
                                    >
                                      <v-slide-group
                                        v-model="invitationsSlide"
                                        active-class="success"
                                        show-arrows
                                      >
                                        <v-slide-item
                                          v-for="meetingInv in getMeetingInvProject(
                                            currProjectObject
                                          )"
                                          :key="meetingInv.id"
                                          v-slot="{ active }"
                                        >
                                          <v-card
                                            :class="`rounded-xl`"
                                            :color="
                                              active ? undefined : 'white'
                                            "
                                            class="ma-2"
                                            height="255"
                                            width="300"
                                            style="
                                              padding: 10px;
                                              padding-left: 14px;
                                            "
                                          >
                                            <v-row style="padding: 5px">
                                              <v-col
                                                col="12"
                                                md="12"
                                                style="
                                                  display: flex;
                                                  flex-direction: column;
                                                "
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
                                                  {{ meetingInv.projectTitle }}
                                                </v-card-text>
                                                <v-card-title
                                                  style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                                >
                                                  {{ meetingInv.title }}
                                                </v-card-title>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      <v-icon
                                                        color="#ff9d66"
                                                        width="20px;"
                                                        >calendar_today</v-icon
                                                      >
                                                      {{
                                                        meetingInv.startDate.toLocaleDateString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                          }
                                                        )
                                                      }}
                                                      -
                                                      {{
                                                        meetingInv.endDate.toLocaleDateString(
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
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      <v-icon
                                                        color="#ff9d66"
                                                        width="20px;"
                                                        >schedule</v-icon
                                                      >
                                                      {{ meetingInv.startTime }}
                                                      -
                                                      {{ meetingInv.endTime }}
                                                      ({{
                                                        meetingInv.timeLength
                                                      }}
                                                      hrs)</span
                                                    >
                                                  </div>
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <v-row
                                                    style="
                                                      display: flex;
                                                      align-items: center;
                                                    "
                                                  >
                                                    <v-col
                                                      cols="12"
                                                      md="7"
                                                      style="display: flex"
                                                    >
                                                      <div>
                                                        <span style="">
                                                          <v-icon
                                                            color="#ff9d66"
                                                            width="20px;"
                                                            >place</v-icon
                                                          >
                                                          {{
                                                            meetingInv.venue
                                                          }}</span
                                                        >
                                                      </div>
                                                    </v-col>
                                                    <v-col
                                                      cols="12"
                                                      md="5"
                                                      style="
                                                        display: flex;
                                                        padding-top: 6px !important;
                                                        justify-content: center;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          padding-bottom: 0px !important;
                                                          display: inline-flex;
                                                          flex-direction: row-reverse;
                                                          justify-content: flex-end;
                                                          padding-left: 12px;
                                                        "
                                                      >
                                                        <div
                                                          v-for="groupmate in meetingInv.groupmates"
                                                          :key="groupmate.id"
                                                        >
                                                          <div
                                                            style="
                                                              margin-left: -15px;
                                                              padding-bottom: 0px !important;
                                                              padding-top: 3px !important;
                                                              padding-left: 3px !important;
                                                              padding-right: 3px !important;
                                                            "
                                                          >
                                                            <v-avatar
                                                              :size="30"
                                                              style="
                                                                border: 2px
                                                                  solid #fff;
                                                              "
                                                            >
                                                              <v-img
                                                                :src="
                                                                  groupmate.avatar
                                                                "
                                                              ></v-img
                                                            ></v-avatar>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </v-col>
                                                  </v-row>
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      Created by
                                                      {{
                                                        meetingInv.creator
                                                      }}</span
                                                    >
                                                  </div>
                                                </v-card-text>
                                                <v-card-actions
                                                  style="padding: 0px; !important"
                                                >
                                                  <v-row
                                                    style="
                                                      padding-top: 20px !important;
                                                    "
                                                    align="center"
                                                    justify="center"
                                                  >
                                                    <v-btn
                                                      text
                                                      small
                                                      color="#ff9d66"
                                                      @click="
                                                        goMeetingInv(meetingInv)
                                                      "
                                                    >
                                                    </v-btn>
                                                    <v-btn
                                                      small
                                                      text
                                                      color="#999999"
                                                      @click="
                                                        declineMeeting(
                                                          meetingInv
                                                        )
                                                      "
                                                    >
                                                      Decline
                                                    </v-btn>
                                                  </v-row>
                                                </v-card-actions>
                                              </v-col>
                                            </v-row>
                                          </v-card>
                                        </v-slide-item>
                                      </v-slide-group>
                                    </v-sheet>
                                  </div>
                                  <div
                                    v-else
                                    style="padding:85px; display:flex' align-items: center; justify-content: center"
                                    class="empty_message"
                                  >
                                    <span
                                      style="
                                        color: #4b4b4b !important;
                                        font-weight: bold;
                                        font-size: 16px;
                                      "
                                      >You do not have any meeting invitation
                                      for this project yet.</span
                                    >
                                  </div>
                                </v-card>
                              </v-container>
                            </v-tab-item>
                            <v-tab-item style="background-color: #ffe4cb">
                              <v-container
                                style="
                                  border-radius: 24px;
                                  padding-bottom: 0px !important;
                                "
                                :class="`rounded-xl`"
                              >
                                <v-card
                                  color="#FFE4CB"
                                  outlined
                                  :class="`rounded-xl`"
                                  style="padding: 10px"
                                >
                                  <div v-if="pendingLength > 0" style="">
                                    <v-sheet
                                      :class="`rounded-xl`"
                                      class="mx-auto"
                                      elevation="0"
                                      style="background-color: #ffe4cb"
                                    >
                                      <v-slide-group
                                        v-model="pendingSlide"
                                        active-class="success"
                                        show-arrows
                                      >
                                        <v-slide-item
                                          v-for="pending in getMeetingPendingProject(
                                            currProjectObject
                                          )"
                                          :key="pending.id"
                                          v-slot="{ active }"
                                        >
                                          <v-card
                                            :class="`rounded-xl`"
                                            :color="
                                              active ? undefined : 'white'
                                            "
                                            class="ma-2"
                                            height="255"
                                            width="300"
                                            style="
                                              padding: 10px;
                                              padding-left: 14px;
                                            "
                                          >
                                            <v-row style="padding: 5px">
                                              <v-col
                                                col="12"
                                                md="12"
                                                style="
                                                  display: flex;
                                                  flex-direction: column;
                                                "
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
                                                  {{ pending.projectTitle }}
                                                </v-card-text>
                                                <v-card-title
                                                  style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                                >
                                                  {{ pending.title }}
                                                </v-card-title>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      <v-icon
                                                        color="#ff9d66"
                                                        width="20px;"
                                                        >calendar_today</v-icon
                                                      >
                                                      {{
                                                        pending.startDate.toLocaleDateString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                          }
                                                        )
                                                      }}
                                                      -
                                                      {{
                                                        pending.endDate.toLocaleDateString(
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
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      <v-icon
                                                        color="#ff9d66"
                                                        width="20px;"
                                                        >schedule</v-icon
                                                      >
                                                      {{ pending.startTime }}
                                                      -
                                                      {{ pending.endTime }}
                                                      ({{
                                                        pending.timeLength
                                                      }}
                                                      hrs)</span
                                                    >
                                                  </div>
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <v-row
                                                    style="
                                                      display: flex;
                                                      align-items: center;
                                                    "
                                                  >
                                                    <v-col
                                                      cols="12"
                                                      md="7"
                                                      style="display: flex"
                                                    >
                                                      <div>
                                                        <span style="">
                                                          <v-icon
                                                            color="#ff9d66"
                                                            width="20px;"
                                                            >place</v-icon
                                                          >
                                                          {{
                                                            pending.venue
                                                          }}</span
                                                        >
                                                      </div>
                                                    </v-col>
                                                    <v-col
                                                      cols="12"
                                                      md="5"
                                                      style="
                                                        display: flex;
                                                        padding-top: 6px !important;
                                                        justify-content: center;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          padding-bottom: 0px !important;
                                                          display: inline-flex;
                                                          flex-direction: row-reverse;
                                                          justify-content: flex-end;
                                                          padding-left: 12px;
                                                        "
                                                      >
                                                        <div
                                                          v-for="groupmate in pending.groupmates"
                                                          :key="groupmate.id"
                                                        >
                                                          <div
                                                            style="
                                                              margin-left: -15px;
                                                              padding-bottom: 0px !important;
                                                              padding-top: 3px !important;
                                                              padding-left: 3px !important;
                                                              padding-right: 3px !important;
                                                            "
                                                          >
                                                            <v-avatar
                                                              :size="30"
                                                              style="
                                                                border: 2px
                                                                  solid #fff;
                                                              "
                                                            >
                                                              <v-img
                                                                :src="
                                                                  groupmate.avatar
                                                                "
                                                              ></v-img
                                                            ></v-avatar>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </v-col>
                                                  </v-row>
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      Created by
                                                      {{
                                                        pending.creator
                                                      }}</span
                                                    >
                                                  </div>
                                                </v-card-text>
                                                <v-card-actions
                                                  style="padding: 0px; !important"
                                                >
                                                  <v-row
                                                    style="
                                                      padding-top: 20px !important;
                                                    "
                                                    align="center"
                                                    justify="center"
                                                  >
                                                    <v-btn
                                                      text
                                                      small
                                                      color="#ff9d66"
                                                      @click="
                                                        goMeetingPending(
                                                          pending
                                                        )
                                                      "
                                                    >
                                                      View
                                                    </v-btn>
                                                    <v-btn
                                                      small
                                                      text
                                                      color="#999999"
                                                      @click="
                                                        quitMeeting(pending)
                                                      "
                                                    >
                                                      Quit Meeting
                                                    </v-btn>
                                                  </v-row>
                                                </v-card-actions>
                                              </v-col>
                                            </v-row>
                                          </v-card>
                                        </v-slide-item>
                                      </v-slide-group>
                                    </v-sheet>
                                  </div>
                                  <div
                                    v-else
                                    style="padding:85px; display:flex' align-items: center; justify-content: center"
                                    class="empty_message"
                                  >
                                    <span
                                      style="
                                        color: #4b4b4b;
                                        font-weight: bold;
                                        font-size: 16px;
                                      "
                                      >You do not have any pending meeting for
                                      this project yet.</span
                                    >
                                  </div>
                                </v-card>
                              </v-container>
                            </v-tab-item>
                            <v-tab-item style="background-color: #ffe4cb">
                              <v-container
                                style="
                                  border-radius: 24px;
                                  padding-bottom: 0px !important;
                                "
                                :class="`rounded-xl`"
                              >
                                <v-card
                                  color="#FFE4CB"
                                  outlined
                                  :class="`rounded-xl`"
                                  style="padding: 10px"
                                >
                                  <div v-if="confirmationLength > 0" style="">
                                    <v-sheet
                                      :class="`rounded-xl`"
                                      class="mx-auto"
                                      elevation="0"
                                      style="background-color: #ffe4cb"
                                    >
                                      <v-slide-group
                                        v-model="confirmationSlide"
                                        active-class="success"
                                        show-arrows
                                      >
                                        <v-slide-item
                                          v-for="confirmation in getMeetingConfirmationProject(
                                            currProjectObject
                                          )"
                                          :key="confirmation.id"
                                          v-slot="{ active }"
                                        >
                                          <v-card
                                            :class="`rounded-xl`"
                                            :color="
                                              active ? undefined : 'white'
                                            "
                                            class="ma-2"
                                            height="255"
                                            width="300"
                                            style="
                                              padding: 10px;
                                              padding-left: 14px;
                                            "
                                          >
                                            <v-row style="padding: 5px">
                                              <v-col
                                                col="12"
                                                md="12"
                                                style="
                                                  display: flex;
                                                  flex-direction: column;
                                                "
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
                                                  {{
                                                    confirmation.projectTitle
                                                  }}
                                                </v-card-text>
                                                <v-card-title
                                                  style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                                >
                                                  {{ confirmation.title }}
                                                </v-card-title>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      <v-icon
                                                        color="#ff9d66"
                                                        width="20px;"
                                                        >calendar_today</v-icon
                                                      >
                                                      {{
                                                        confirmation.startDate.toLocaleDateString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                          }
                                                        )
                                                      }}
                                                      -
                                                      {{
                                                        confirmation.endDate.toLocaleDateString(
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
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      <v-icon
                                                        color="#ff9d66"
                                                        width="20px;"
                                                        >schedule</v-icon
                                                      >
                                                      {{
                                                        confirmation.startTime
                                                      }}
                                                      -
                                                      {{ confirmation.endTime }}
                                                      ({{
                                                        confirmation.timeLength
                                                      }}
                                                      hrs)</span
                                                    >
                                                  </div>
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <v-row
                                                    style="
                                                      display: flex;
                                                      align-items: center;
                                                    "
                                                  >
                                                    <v-col
                                                      cols="12"
                                                      md="7"
                                                      style="display: flex"
                                                    >
                                                      <div>
                                                        <span style="">
                                                          <v-icon
                                                            color="#ff9d66"
                                                            width="20px;"
                                                            >place</v-icon
                                                          >
                                                          {{
                                                            confirmation.venue
                                                          }}</span
                                                        >
                                                      </div>
                                                    </v-col>
                                                    <v-col
                                                      cols="12"
                                                      md="5"
                                                      style="
                                                        display: flex;
                                                        padding-top: 6px !important;
                                                        justify-content: center;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          padding-bottom: 0px !important;
                                                          display: inline-flex;
                                                          flex-direction: row-reverse;
                                                          justify-content: flex-end;
                                                          padding-left: 12px;
                                                        "
                                                      >
                                                        <div
                                                          v-for="groupmate in confirmation.groupmates"
                                                          :key="groupmate.id"
                                                        >
                                                          <div
                                                            style="
                                                              margin-left: -15px;
                                                              padding-bottom: 0px !important;
                                                              padding-top: 3px !important;
                                                              padding-left: 3px !important;
                                                              padding-right: 3px !important;
                                                            "
                                                          >
                                                            <v-avatar
                                                              :size="30"
                                                              style="
                                                                border: 2px
                                                                  solid #fff;
                                                              "
                                                            >
                                                              <v-img
                                                                :src="
                                                                  groupmate.avatar
                                                                "
                                                              ></v-img
                                                            ></v-avatar>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </v-col>
                                                  </v-row>
                                                </v-card-text>
                                                <v-card-text
                                                  style="
                                                    display: flex;
                                                    padding: 2px !important;
                                                    padding-bottom: 7px !important;
                                                  "
                                                >
                                                  <div>
                                                    <span style="">
                                                      Created by
                                                      {{
                                                        confirmation.creator
                                                      }}</span
                                                    >
                                                  </div>
                                                </v-card-text>
                                                <v-card-actions
                                                  style="padding: 0px; !important"
                                                >
                                                  <v-row
                                                    style="
                                                      padding-top: 20px !important;
                                                    "
                                                    align="center"
                                                    justify="center"
                                                  >
                                                    <v-btn
                                                      text
                                                      small
                                                      color="#ff9d66"
                                                      @click="
                                                        goMeetingConfirmation(
                                                          confirmation
                                                        )
                                                      "
                                                    >
                                                      View
                                                    </v-btn>
                                                    <v-btn
                                                      small
                                                      text
                                                      color="#999999"
                                                      @click="
                                                        quitMeeting(
                                                          confirmation
                                                        )
                                                      "
                                                    >
                                                      Quit Meeting
                                                    </v-btn>
                                                  </v-row>
                                                </v-card-actions>
                                              </v-col>
                                            </v-row>
                                          </v-card>
                                        </v-slide-item>
                                      </v-slide-group>
                                    </v-sheet>
                                  </div>
                                  <div
                                    v-else
                                    style="padding:85px; display:flex' align-items: center; justify-content: center"
                                    class="empty_message"
                                  >
                                    <span
                                      style="
                                        color: #4b4b4b;
                                        font-weight: bold;
                                        font-size: 16px;
                                      "
                                      >You do not have any meeting confirmation
                                      for this project yet.</span
                                    >
                                  </div>
                                </v-card>
                              </v-container>
                            </v-tab-item>
                            <v-tab-item style="background-color: #ffe4cb">
                              <v-container
                                style="
                                  border-radius: 24px;
                                  padding-bottom: 0px !important;
                                "
                                :class="`rounded-xl`"
                              >
                                <v-card
                                  color="#FFE4CB"
                                  outlined
                                  :class="`rounded-xl`"
                                  style="padding: 10px"
                                >
                                  <div
                                    v-if="confirmedMeetingLength > 0"
                                    style=""
                                  >
                                    <v-sheet
                                      :class="`rounded-xl`"
                                      class="mx-auto"
                                      elevation="0"
                                      style="background-color: #ffe4cb"
                                    >
                                      <v-slide-group
                                        v-model="confirmedSlide"
                                        active-class="success"
                                        show-arrows
                                      >
                                        <v-slide-item
                                          v-for="meeting in getConfirmedMeetingProject(
                                            currProjectObject
                                          )"
                                          :key="meeting.id"
                                        >
                                          <v-card
                                            color="white"
                                            outlined
                                            min-width="230"
                                            max-width="230"
                                            style="
                                  
                                          padding: 20px;
                                          display: flex;
                                          flex-direction: column;
                                          justify-content: flex-start;
                                          align-items: flex-start;
                                          margin-bottom:16px;
                                          font-size: 14px; !important;
                                          margin-right:14px !important
                                        
                                        "
                                            :class="`rounded-xl`"
                                          >
                                            <span style="padding-bottom: 7px"
                                              >{{
                                                meeting.project.get("modCode")
                                              }}
                                              {{
                                                meeting.project.get("title")
                                              }}</span
                                            >
                                            <span
                                              style="
                                                padding-bottom: 7px;
                                                font-weight: bold;
                                                font-size: 15px !important;
                                              "
                                              >{{ meeting.title }}</span
                                            >
                                            <div
                                              style="
                                                padding-bottom: 0px !important;
                                                display: inline-flex;
                                                flex-direction: row-reverse;
                                                justify-content: flex-end;
                                                padding-left: 12px;
                                              "
                                            >
                                              <div
                                                v-for="groupmate in meeting.groupmates"
                                                :key="groupmate.id"
                                              >
                                                <div
                                                  style="
                                                    margin-left: -15px;
                                                    padding-bottom: 0px !important;
                                                    padding-top: 3px !important;
                                                    padding-left: 3px !important;
                                                    padding-right: 3px !important;
                                                  "
                                                >
                                                  <v-avatar
                                                    :size="30"
                                                    style="
                                                      border: 2px solid #fff;
                                                    "
                                                  >
                                                    <v-img
                                                      :src="groupmate.avatar"
                                                    ></v-img
                                                  ></v-avatar>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              style="padding-bottom: 7px"
                                              v-if="
                                                meeting.selectedStartDate
                                                  .toDate()
                                                  .toLocaleDateString() !==
                                                meeting.selectedEndDate
                                                  .toDate()
                                                  .toLocaleDateString()
                                              "
                                            >
                                              <span style="padding-bottom: 7px"
                                                ><v-icon
                                                  :size="20"
                                                  color="#ff9d66"
                                                  >calendar_today</v-icon
                                                >
                                                {{
                                                  meeting.selectedStartDate
                                                    .toDate()
                                                    .toLocaleDateString(
                                                      "en-US",
                                                      {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                      }
                                                    )
                                                }}
                                                -
                                                {{
                                                  meeting.selectedEndDate
                                                    .toDate()
                                                    .toLocaleDateString(
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
                                            <div
                                              v-else
                                              style="padding-bottom: 7px"
                                            >
                                              <span style="padding-bottom: 7px"
                                                ><v-icon
                                                  :size="20"
                                                  color="#ff9d66"
                                                  >calendar_today</v-icon
                                                >
                                                {{
                                                  meeting.selectedStartDate
                                                    .toDate()
                                                    .toLocaleDateString(
                                                      "en-US",
                                                      {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                      }
                                                    )
                                                }}
                                              </span>
                                            </div>

                                            <span style="padding-bottom: 7px"
                                              ><v-icon
                                                :size="20"
                                                color="#ff9d66"
                                                >mdi-clock-time-four-outline</v-icon
                                              >

                                              {{
                                                meeting.selectedStartDate
                                                  .toDate()
                                                  .toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                  })
                                              }}
                                              -
                                              {{
                                                meeting.selectedEndDate
                                                  .toDate()
                                                  .toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                  })
                                              }}
                                            </span>

                                            <span style=""
                                              ><v-icon color="#ff9d66"
                                                >place</v-icon
                                              >
                                              {{ meeting.venue }}</span
                                            >
                                            <!-- <span><v-icon color="#ff9d66">place</v-icon> 
                                    {{meeting.venue}} </span> -->
                                          </v-card>
                                        </v-slide-item>
                                      </v-slide-group>
                                    </v-sheet>
                                  </div>
                                  <div
                                    v-else
                                    style="padding:85px; display:flex' align-items: center; justify-content: center"
                                    class="empty_message"
                                  >
                                    <span
                                      style="
                                        color: #4b4b4b;
                                        font-weight: bold;
                                        font-size: 16px;
                                      "
                                      >You do not have any confirmed meeting for
                                      this project yet.</span
                                    >
                                  </div>
                                </v-card>
                              </v-container>
                            </v-tab-item>
                          </v-tabs-items>
                        </v-row>
                      </v-card>
                    </div>
                  </v-tab-item>
                  <v-tab-item style="background-color: #ff9d66">
                    <v-card
                      outlined
                      style="padding: 10px"
                      color="#FFE4CB"
                      :class="`rounded-xl`"
                    >
                      <div
                        style="display: flex; justify-content: space-between"
                        class="project-meeting-bar"
                      >
                        <v-card-title>Todos</v-card-title>
                        <v-dialog
                          v-model="Taskdialog"
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
                                  Taskdialog = true;
                                  getProjectMenu();
                                  prefillProject();
                                "
                              >
                                <span style="color: #ff9d66; font-weight: bold">
                                  + Add New Todo</span
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
                              <v-form
                                ref="form"
                                v-model="valid"
                                lazy-validation
                              >
                                <v-card-title :class="`rounded-xl`">
                                  <span class="headline">Add New Todo</span>
                                </v-card-title>

                                <v-card-text>
                                  <v-container :class="`rounded-xl`">
                                    <v-row>
                                      <v-col cols="12" :class="`rounded-xl`">
                                        <v-text-field
                                          label="Todo Title*"
                                          required
                                          :rules="nameRules"
                                          color="#ff9d66"
                                          v-model="TaskmyTodo"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12" :class="`rounded-xl`">
                                        <v-select
                                          :items="projects"
                                          item-text="title"
                                          item-value="id"
                                          label="Module Project*"
                                          required
                                          color="#ff9d66"
                                          v-model="TaskmyProject"
                                          @input="renderGroupmates()"
                                          :rules="[
                                            (v) => !!v || 'Project is required',
                                          ]"
                                        >
                                        </v-select>
                                      </v-col>
                                      <v-col
                                        cols="12"
                                        align="left"
                                        :class="`rounded-xl`"
                                      >
                                        <!-- <span style="color: rgb(113, 113, 113)"
                                >Person In Charge</span
                              > -->
                                        <div v-if="TasktempGroupmates">
                                          <v-combobox
                                            :disabled="
                                              this.TaskmyProject == null
                                            "
                                            item-text="name"
                                            item-value="id"
                                            v-model="TaskgroupmatesChips"
                                            item-color="#ff9d66"
                                            :items="TasktempGroupmates"
                                            chips
                                            clearable
                                            label="Person In Charge*"
                                            :rules="[
                                              (v) =>
                                                !!v ||
                                                'Person In Charge is required',
                                            ]"
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
                                                :input-value="selected"
                                                close
                                                @click="parent.selectItem(item)"
                                                @click:close="Taskremove(item)"
                                              >
                                                <v-avatar
                                                  left
                                                  class="white--text"
                                                >
                                                  <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                                  <v-img
                                                    :src="item.avatar"
                                                  ></v-img>
                                                </v-avatar>
                                                <span>{{ item.name }}</span>
                                              </v-chip>
                                            </template>
                                          </v-combobox>
                                        </div>
                                      </v-col>

                                      <v-col cols="12" :class="`rounded-xl`">
                                        <v-menu
                                          required
                                          v-model="TaskmenuAdd"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          transition="scale-transition"
                                          offset-y
                                          color="#ff9d66"
                                          min-width="auto"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              required
                                              :rules="[
                                                (v) =>
                                                  (!!v && v) !== 'Deadline' ||
                                                  'Deadline is required',
                                              ]"
                                              v-model="TaskdisplayDeadline"
                                              label="Deadline*"
                                              prepend-icon="mdi-calendar"
                                              v-bind="attrs"
                                              v-on="on"
                                              color="#ff9d66"
                                            ></v-text-field>
                                          </template>
                                          <v-date-picker
                                            :disabled="TaskdateSwitchValue == 1"
                                            color="#ff9d66"
                                            v-model="TaskmyDeadline"
                                            @input="
                                              TaskmenuAdd = false;
                                              changeTaskDisplayDeadline();
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
                                                v-model="TaskdateSwitchValue"
                                                color="#ff9d66"
                                                :label="`Someday`"
                                                @change="
                                                  changeTaskDisplayDeadline()
                                                "
                                              ></v-switch>
                                            </div>
                                          </v-date-picker>
                                        </v-menu>
                                        <v-row style="padding-top: 5px">
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
                                                TaskdateSwitchValue == 1
                                              "
                                              inset
                                              hide-details
                                              v-model="TaskswitchValue"
                                              color="#ff9d66"
                                              :label="`Include Time`"
                                            ></v-switch>
                                          </v-col>
                                          <v-col cols="12" md="6">
                                            <v-menu
                                              ref="Taskmenu3"
                                              v-model="Taskmenu3"
                                              color="#ff9d66"
                                              :close-on-content-click="false"
                                              :nudge-right="40"
                                              :return-value.sync="
                                                TaskmyDeadlineTime
                                              "
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
                                                    TaskswitchValue == 0 ||
                                                    TaskdateSwitchValue == 1
                                                  "
                                                  v-model="TaskmyDeadlineTime"
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
                                                v-if="Taskmenu3"
                                                v-model="TaskmyDeadlineTime"
                                                full-width
                                                color="#ff9d66"
                                                format="24hr"
                                                @click:minute="
                                                  $refs.Taskmenu3.save(
                                                    TaskmyDeadlineTime
                                                  )
                                                "
                                              ></v-time-picker>
                                            </v-menu>
                                          </v-col>
                                        </v-row>
                                      </v-col>

                                      <v-col cols="12" :class="`rounded-xl`">
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
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    justify="center"
                                    color="#ff9d66"
                                    text
                                    @click="
                                      Taskdialog = false;
                                      clearTodoInfo();
                                    "
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    color="#ff9d66"
                                    :disabled="
                                      !valid ||
                                      this.TaskmyTodo == '' ||
                                      this.TaskmyProject == null ||
                                      this.TaskdisplayDeadline == 'Deadline' ||
                                      this.TaskgroupmatesChips.length == 0
                                    "
                                    text
                                    @click="
                                      Taskdialog = false;
                                      TodocheckTimeAdd();
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
                      <br />

                      <v-tabs
                        style="padding: 10px"
                        v-model="tabTodo"
                        class="zero-padding"
                        fixed-tabs
                        color="#4b4b4b"
                        background-color="#ffe4cb"
                      >
                        <v-tab> Your Todos </v-tab>
                        <v-tab> Groupmates' Todos </v-tab>
                      </v-tabs>
                      <v-tabs-items
                        v-model="tabTodo"
                        style="background-color: #ffe4cb"
                      >
                        <v-tab-item style="background-color: #ffe4cb">
                          <div v-if="currTodos.length !== 0">
                            <div
                              v-for="(todo, index) in orderedTasks"
                              :key="todo.id"
                            >
                              <template>
                                <v-list-item
                                  style="display: block"
                                  class="project-card"
                                >
                                  <v-card
                                    outlined
                                    color="white"
                                    style="margin: auto"
                                    :class="`rounded-xl zero-padding`"
                                  >
                                    <v-row style="margin: 0px">
                                      <v-col
                                        cols="2"
                                        align="center"
                                        justify="center"
                                        class="centerAlign todo_divider"
                                        style="
                                          padding-top: 20px;
                                          padding-bottom: 20px;
                                          font-weight: bold;
                                          font-size: 20px;
                                          flex-direction: column;
                                          padding: 0px;
                                        "
                                      >
                                        <div v-if="todo.finalDeadline !== null">
                                          <span
                                            style="margin-left: 3vw"
                                            class="todo_item"
                                            v-bind:class="{
                                              completed: todo.complete,
                                            }"
                                            >{{
                                              todo.finalDeadline.toLocaleDateString(
                                                "en-US",
                                                {
                                                  month: "short",
                                                  day: "2-digit",
                                                }
                                              )
                                            }}</span
                                          >
                                        </div>
                                        <div v-else>
                                          <span
                                            style="margin-left: 3vw"
                                            class="todo_item"
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
                                              todo.finalDeadline.toLocaleTimeString(
                                                [],
                                                {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                }
                                              )
                                            }}
                                          </span>
                                        </div>
                                      </v-col>
                                      <v-col cols="1" class="todo_divider">
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
                                      <v-col cols="9">
                                        <v-row>
                                          <v-col
                                            cols="12"
                                            md="5"
                                            align="left"
                                            class="leftAlign todo-background"
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
                                            <div v-else>
                                              <span
                                                style="
                                                  font-weight: lighter;
                                                  font-size: 14px;
                                                "
                                                v-bind:class="{
                                                  completed: todo.complete,
                                                }"
                                                >No notes</span
                                              >
                                            </div>
                                          </v-col>
                                          <v-col
                                            cols="5"
                                            md="4"
                                            align="right"
                                            class="centerAlign todo-item"
                                            style="
                                              padding-top: 20px;
                                              padding-bottom: 20px;
                                            "
                                          >
                                            <v-row style="margin: 0px">
                                              <div
                                                class="centerAlign"
                                                style="
                                                  padding-top: 3px;
                                                  padding-bottom: 0px !important;
                                                  display: inline-flex;
                                                  align-items: center;
                                                  flex-direction: row-reverse;
                                                  justify-content: flex-end;
                                                  padding-left: 12px;
                                                "
                                              >
                                                <div
                                                  v-for="groupmate in todo.TaskgroupmatesChips"
                                                  :key="groupmate.id"
                                                >
                                                  <div
                                                    style="
                                                      margin-left: -15px;
                                                      padding-bottom: 0px !important;
                                                      padding-top: 3px !important;
                                                      padding-left: 3px !important;
                                                      padding-right: 3px !important;
                                                    "
                                                  >
                                                    <v-avatar
                                                      :size="30"
                                                      style="
                                                        border: 2px solid #fff;
                                                      "
                                                    >
                                                      <v-img
                                                        :src="groupmate.avatar"
                                                      ></v-img
                                                    ></v-avatar>
                                                  </div>
                                                </div>
                                              </div>
                                            </v-row>
                                          </v-col>
                                          <v-col
                                            cols="2"
                                            md="1"
                                            align="right"
                                            class="centerAlign todo-item"
                                          >
                                            <v-list-item-action>
                                              <v-dialog
                                                v-model="
                                                  Taskdisplay[todo.title]
                                                "
                                                content-class="elevation-0"
                                                max-width="600px"
                                                :class="`rounded-lg`"
                                              >
                                                <template
                                                  v-slot:activator="{
                                                    on,
                                                    attrs,
                                                  }"
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
                                                                :rules="
                                                                  nameRules
                                                                "
                                                                v-model="
                                                                  TaskmyTodo
                                                                "
                                                                color="#ff9d66"
                                                              ></v-text-field>
                                                            </v-col>
                                                            <v-col cols="12">
                                                              <v-select
                                                                :items="
                                                                  projects
                                                                "
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
                                                              <!-- <span
                                                          style="
                                                            color: rgb(
                                                              113,
                                                              113,
                                                              113
                                                            );
                                                          "
                                                          >Person In
                                                          Charge</span
                                                        > -->
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
                                                                  :rules="[
                                                                    (v) =>
                                                                      !!v ||
                                                                      'Person In Charge is required',
                                                                  ]"
                                                                  chips
                                                                  clearable
                                                                  label="Person In Charge*"
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
                                                                      class="
                                                                        ma-2
                                                                      "
                                                                      color="#ff9d66"
                                                                      text-color="white"
                                                                      v-bind="
                                                                        attrs
                                                                      "
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
                                                                :nudge-right="
                                                                  40
                                                                "
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
                                                                    v-bind="
                                                                      attrs
                                                                    "
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
                                                                        todo
                                                                          .title
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
                                                                        v-on="
                                                                          on
                                                                        "
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
                                                                          $refs[
                                                                            y
                                                                          ];
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
                                                                v-model="
                                                                  TaskmyNote
                                                                "
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
                                            cols="2"
                                            md="1"
                                            align="left"
                                            class="centerAlign todo-item"
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
                                            md="1"
                                            class="centerAlign"
                                            style="background-color: #ff9d66"
                                            :class="`rounded-r-xl todo-item`"
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
                                      </v-col>
                                      <!--  -->
                                    </v-row>
                                  </v-card>
                                </v-list-item>
                              </template>

                              <br />
                            </div>
                          </div>
                          <div v-else>
                            <span style="color: #4b4b4b; font-weight: bold">
                              You do not have any todo yet.
                            </span>
                          </div>
                        </v-tab-item>
                        <v-tab-item style="background-color: #ffe4cb">
                          <div v-if="currGroupmateTodos.length !== 0">
                            <div
                              v-for="todo in orderedGroupmatesTask"
                              :key="todo.id"
                            >
                              <template>
                                <v-list-item
                                  style="display: block"
                                  class="zero-padding"
                                >
                                  <v-card
                                    outlined
                                    color="white"
                                    style="margin: auto"
                                    :class="`rounded-xl`"
                                  >
                                    <v-row style="margin: 0px">
                                      <!-- todo -->
                                      <v-col
                                        cols="2"
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
                                            class="todo_item"
                                            >{{
                                              todo.finalDeadline.toLocaleDateString(
                                                "en-US",
                                                {
                                                  month: "short",
                                                  day: "2-digit",
                                                }
                                              )
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
                                              todo.finalDeadline.toLocaleTimeString(
                                                [],
                                                {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                }
                                              )
                                            }}
                                          </span>
                                        </div>
                                      </v-col>
                                      <v-col cols="1" class="todo_divider">
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
                                      <v-col cols="9" class="todo_divider">
                                        <v-row class="todo-item__row">
                                          <v-col
                                            cols="12"
                                            md="6"
                                            align="left"
                                            class="leftAlign todo-background"
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
                                            <div v-else>
                                              <span
                                                style="
                                                  font-weight: lighter;
                                                  font-size: 14px;
                                                "
                                                v-bind:class="{
                                                  completed: todo.complete,
                                                }"
                                                >No notes</span
                                              >
                                            </div>
                                          </v-col>
                                          <v-col
                                            cols="7"
                                            md="3"
                                            align="right"
                                            class="centerAlign todo-item"
                                            style="
                                              padding-top: 20px;
                                              padding-bottom: 20px;
                                            "
                                          >
                                            <v-row style="margin: 0px">
                                              <div
                                                class="centerAlign"
                                                style="
                                                  padding-top: 3px;
                                                  padding-bottom: 0px !important;
                                                  display: inline-flex;
                                                  align-items: center;
                                                  flex-direction: row-reverse;
                                                  justify-content: flex-end;
                                                  padding-left: 12px;
                                                "
                                              >
                                                <div
                                                  v-for="groupmate in todo.TaskgroupmatesChips"
                                                  :key="groupmate.id"
                                                >
                                                  <div
                                                    style="
                                                      margin-left: -15px;
                                                      padding-bottom: 0px !important;
                                                      padding-top: 3px !important;
                                                      padding-left: 3px !important;
                                                      padding-right: 3px !important;
                                                    "
                                                  >
                                                    <v-avatar
                                                      :size="30"
                                                      style="
                                                        border: 2px solid #fff;
                                                      "
                                                    >
                                                      <v-img
                                                        :src="groupmate.avatar"
                                                      ></v-img
                                                    ></v-avatar>
                                                  </div>
                                                </div>
                                              </div>
                                            </v-row>
                                          </v-col>
                                          <!-- todo -->
                                          <v-col
                                            cols="12"
                                            md="3"
                                            class="centerAlign"
                                            style="background-color: #ff9d66"
                                            :class="`rounded-r-xl`"
                                          >
                                            <v-card outlined color="#ff9d66">
                                              <span
                                                style="
                                                  color: white;
                                                  font-weight: bold;
                                                "
                                                >{{
                                                  todo.complete
                                                    ? "Completed"
                                                    : "Incompleted"
                                                }}</span
                                              >
                                            </v-card>
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-card>
                                </v-list-item>
                              </template>

                              <br />
                            </div>
                          </div>
                          <div v-else>
                            <span style="color: #4b4b4b; font-weight: bold">
                              Your groupmates do not have any todo yet.
                            </span>
                          </div>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
        <div
          v-else
          height="40vh"
          style="
            padding: 8vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          "
        >
          <v-img src="@/assets/project_cartoon.png" width="250"></v-img>
          <br />
          <span style="font-weight: bold; font-size: 24px"
            >You have not selected any project yet.</span
          >
        </div>

        <!-- Original Project Display -->
        <v-dialog v-model="tableView" content-class="elevation-0">
          <div>
            <v-container>
              <v-card
                outlined
                color="#FFE4CB"
                style="padding: 20px"
                :class="`rounded-xl`"
              >
                <div align="left">
                  <v-btn icon color="#ff9d66" @click="tableView = false">
                    <v-icon color="#ff9d66">mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-virtual-scroll
                  :items="items"
                  :bench="100"
                  height="61vh"
                  item-height="80"
                >
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
                              <!-- todo -->
                              <v-col
                                cols="2"
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
                              <v-col cols="1">
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
                                  <div
                                    style="
                                      padding-top: 3px;
                                      padding-bottom: 0px !important;
                                      display: inline-flex;
                                      flex-direction: row-reverse;
                                      justify-content: flex-end;
                                      padding-left: 12px;
                                    "
                                  >
                                    <div
                                      v-for="avatar in project.groupmatesAvatar"
                                      :key="avatar.id"
                                    >
                                      <div
                                        style="
                                          margin-left: -15px;
                                          padding-bottom: 0px !important;
                                          padding-top: 3px !important;
                                          padding-left: 3px !important;
                                          padding-right: 3px !important;
                                        "
                                      >
                                        <v-avatar
                                          :size="30"
                                          style="border: 2px solid #fff"
                                        >
                                          <v-img :src="avatar"></v-img
                                        ></v-avatar>
                                      </div>
                                    </div>
                                  </div>
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
                                    v-model="displayTable[project.title]"
                                    content-class="elevation-0"
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
                                                  <span style=""
                                                    >Groupmates</span
                                                  >
                                                  <br />
                                                  <v-row
                                                    style="
                                                      padding-top: 12px;
                                                      padding-right: 12px;
                                                      padding-left: 12px;
                                                    "
                                                  >
                                                    <div
                                                      v-if="
                                                        tempGroupmates.length !==
                                                        0
                                                      "
                                                    >
                                                      <v-row>
                                                        <div
                                                          v-for="(
                                                            user, index
                                                          ) in tempGroupmates"
                                                          :key="user.id"
                                                        >
                                                          <v-chip
                                                            style="
                                                              margin-top: 16px;
                                                              margin-left: 12px;
                                                              margin-right: 12px;
                                                            "
                                                            color="#ff9d66"
                                                            text-color="white"
                                                            :input-value="
                                                              user.id
                                                            "
                                                            v-if="
                                                              user.chipValue
                                                            "
                                                            close
                                                            @click:close="
                                                              remove(
                                                                user,
                                                                index
                                                              )
                                                            "
                                                          >
                                                            <v-avatar
                                                              left
                                                              class="
                                                                white--text
                                                              "
                                                            >
                                                              <v-img
                                                                :src="
                                                                  user.avatar
                                                                "
                                                              ></v-img>
                                                            </v-avatar>
                                                            <span>{{
                                                              user.name
                                                            }}</span>
                                                          </v-chip>
                                                        </div>
                                                      </v-row>
                                                    </div>
                                                  </v-row>
                                                  <br />
                                                  <br />

                                                  <v-row>
                                                    <div>
                                                      <v-dialog
                                                        v-model="
                                                          groupmateDialogEditTable
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
                                                            style="
                                                              margin-left: 12px;
                                                              margin-top: 5px;
                                                            "
                                                            color="#ff9d66"
                                                            @click="
                                                              groupmateDialogEditTable = true
                                                            "
                                                          >
                                                            <v-icon
                                                              >person_add</v-icon
                                                            >
                                                          </v-btn>
                                                        </template>
                                                        <v-card
                                                          style="padding: 20px"
                                                        >
                                                          <v-card-actions>
                                                            <v-text-field
                                                              v-model="search"
                                                              color="#ff9d66"
                                                              label="Search your groupmates by entering their username or email"
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
                                                                v-if="
                                                                  searchName
                                                                "
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

                                                              <v-list-item-action>
                                                                <v-btn
                                                                  :disabled="
                                                                    checkAdd(
                                                                      searchId
                                                                    )
                                                                  "
                                                                  v-if="
                                                                    searchId
                                                                  "
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
                                                                color="#ff9d66"
                                                                text
                                                                @click="
                                                                  groupmateDialogEditTable = false
                                                                "
                                                              >
                                                                Close
                                                              </v-btn>
                                                            </v-card-actions>
                                                          </v-card>
                                                        </v-card>
                                                      </v-dialog>
                                                    </div>
                                                  </v-row>
                                                </v-col>

                                                <v-col cols="12">
                                                  <v-menu
                                                    v-model="
                                                      menuTable[project.title]
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
                                                        menuTable[
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
                                                          'timeMenuTable' +
                                                          index
                                                        "
                                                        v-model="
                                                          timeTable[
                                                            project.title
                                                          ]
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
                                                              'timeMenuTable' +
                                                              index.toString();
                                                            a = $refs[y];
                                                            a[0].save(
                                                              myDeadlineTime
                                                            );
                                                            timeTable[
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
                                                displayTable[
                                                  project.title
                                                ] = false;
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
                                                displayTable[
                                                  project.title
                                                ] = false;
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
                              <!-- todo -->
                              <v-col
                                cols="12"
                                class="centerAlign"
                                style="background-color: #ff9d66"
                                :class="`rounded-r-xl`"
                              >
                                <v-btn
                                  outlined
                                  color="white"
                                  @click="
                                    passCurrSelectedProject(project);
                                    assignCurrProject(project);
                                    getMeetingConfirmationProject(project);
                                    getMeetingPendingProject(project);
                                    getMeetingInvProject(project);
                                    tableView = false;
                                  "
                                >
                                  Select
                                </v-btn>
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
          </div>
        </v-dialog>
      </v-column>
    </div>
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
    TaskmenuAdd: false,
    Taskmenu3: false,
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
    Taskdialog: false,
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
    searchAvatar: null,

    navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "check_circle" },
      { title: "Project", href: "./project", icon: "work" },
      { title: "Meeting", href: "./meeting", icon: "groups" },
      { title: "Profile", href: "./profile", icon: "account_circle" },
    ],
    currTodos: [],
    currMeetings: [],
    Taskmenu: {},
    TaskmyTodo: "",
    TaskmyProject: null,
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
    tableView: false,
    displayTable: [],
    groupmateDialogEditTable: false,
    menuTable: [],
    timeTable: [],
    addSubmit: false,
    editSubmit: false,
    invitationLength: 0,
    pendingLength: 0,
    confirmationLength: 0,
    confirmedMeetingLength: 0,
    projectInv: [],
    tabMeeting: null,
    invitationsSlide: null,
    pendingSlide: null,
    confirmationSlide: null,
    confirmedSlide: null,
    currGroupmateTodos: [],
    tabTodo: null,
    isNavigationBarActive: false,
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
    this.currTodos = [];
  },

  async mounted() {
    console.log("hello");
    await this.$store.dispatch("getProjects");
    await this.$store.dispatch("getProjectInvitations");
    console.log(this.$store.state.projectInvitations);
    this.remainingTodo();
    this.currTodos = [];
    console.log(this.currTodos);
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
    orderedGroupmatesTask: function () {
      return _.orderBy(
        this.currGroupmateTodos,
        ["complete", "finalDeadline"],
        ["asc", "asc"]
      );
    },
  },

  // beforeMount(){
  //   this.$store.getters.getProjects
  // },

  methods: {
    setNavigationBarActive() {
      console.log(this.isNavigationBarActive);
      this.isNavigationBarActive = !this.isNavigationBarActive;
    },
    getMeetingInvProject(project) {
      console.log(project);
      const invArray = this.$store.state.meetingInvitations;
      const projectMeetingInv = [];
      for (let i = 0; i < invArray.length; i++) {
        console.log(invArray[i]);
        if (invArray[i].project.id == project.id) {
          projectMeetingInv.push(invArray[i]);
        }
      }
      this.invitationLength = projectMeetingInv.length;
      return _.orderBy(
        projectMeetingInv,
        ["startDate", "endDate"],
        ["asc", "asc"]
      );
    },

    getMeetingPendingProject(project) {
      const pendingArray = this.$store.state.meetingPendings;
      const projectPendingArray = [];
      for (let i = 0; i < pendingArray.length; i++) {
        if (pendingArray[i].project.id == project.id) {
          projectPendingArray.push(pendingArray[i]);
        }
      }
      this.pendingLength = projectPendingArray.length;
      return _.orderBy(
        projectPendingArray,
        ["startDate", "endDate"],
        ["asc", "asc"]
      );
    },

    getMeetingConfirmationProject(project) {
      const conArray = this.$store.state.meetingConfirmations;
      const projectConArray = [];
      for (let i = 0; i < conArray.length; i++) {
        if (conArray[i].project.id == project.id) {
          projectConArray.push(conArray[i]);
        }
      }
      this.confirmationLength = projectConArray.length;
      return _.orderBy(
        projectConArray,
        ["startDate", "endDate"],
        ["asc", "asc"]
      );
    },

    getConfirmedMeetingProject(project) {
      const conArray = this.$store.state.confirmedMeetings;
      const projectConArray = [];
      for (let i = 0; i < conArray.length; i++) {
        if (conArray[i].project.id == project.id) {
          projectConArray.push(conArray[i]);
        }
      }
      this.confirmedMeetingLength = projectConArray.length;
      return _.orderBy(
        projectConArray,
        ["startDate", "endDate"],
        ["asc", "asc"]
      );
    },

    assignCurrProject(project) {
      this.currProjectObject = project;
      this.currProject = project.modCode + " " + project.title;
    },

    prefillProject() {
      console.log(this.currProjectObject);
      this.TaskmyProject = this.currProjectObject.id;
      console.log(this.TaskmyProject);
      console.log(this.TaskmyProject.id);
      this.renderGroupmates();
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

    TodocheckTimeAdd() {
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
      this.addTodo();
    },

    checkTempGroupmates() {
      let counter = 0;
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (this.tempGroupmates[i].chipValue == true) {
          counter += 1;
        }
      }
      return counter;
    },

    async renderGroupmates() {
      const docRef = await db
        .collection("project")
        .doc(this.TaskmyProject)
        .get();
      const data = await docRef.get("confirmedInvitations");
      this.TasktempGroupmates = [];
      console.log(this.TaskmyProject);
      console.log(docRef);
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const currGroupmate = await data[i].get();
        this.TasktempGroupmates.push({
          id: currGroupmate.id,
          name: currGroupmate.get("name"),
          object: currGroupmate,
          avatar: currGroupmate.get("photoURL")
            ? currGroupmate.get("photoURL")
            : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
        });
      }

      console.log(this.$store.state.user);
    },
    async getPIC(PIC) {
      this.TaskvarPIC = [];
      console.log(PIC);
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();
        this.TaskvarPIC.push({
          id: docRef.id,
          name: docRef.get("name"),
          object: docRef,
          avatar: docRef.get("photoURL")
            ? docRef.get("photoURL")
            : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
        });
      }
      console.log(this.TaskvarPIC);
      return this.TaskvarPIC;
    },

    async getPICId(PIC) {
      this.TaskvarPICId = [];
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();

        this.TaskvarPICId.push(docRef.id);
      }

      return this.TaskvarPICId;
    },

    async addFinalPIC(task) {
      if (this.TaskgroupmatesChips.length == 0) {
        this.TaskgroupmatesChips = this.TaskoldGroupmatesChipsObject;
      }
      this.TaskgroupmatesChipsId = [];
      for (let i = 0; i < this.TaskgroupmatesChips.length; i++) {
        this.TaskgroupmatesChipsId.push(this.TaskgroupmatesChips[i].id);
      }
      console.log(this.TaskgroupmatesChipsId);

      for (let i = 0; i < this.TaskgroupmatesChipsId.length; i++) {
        if (
          this.TaskoldGroupmatesChips.includes(this.TaskgroupmatesChipsId[i])
        ) {
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
        if (
          this.TaskgroupmatesChipsId.includes(this.TaskoldGroupmatesChips[i])
        ) {
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

    async goMeetingInv(meetingInv) {
      await this.$router.push("/meeting");

      this.$router.Meeting.passCurrSelectedMeetingInv(meetingInv);
      console.log("passnow");

      this.$router.Meeting.getBlockedTimeSlot(meetingInv);
      console.log("passagain");
    },

    async goMeetingPending(pending) {
      await this.$router.push("/meeting");
      this.$router.Meeting.passCurrSelectedMeetingPending(pending);
      this.$router.Meeting.getBlockedTimeSlot(pending);
    },

    async goMeetingConfirmation(confirmation) {
      await this.$router.push("/meeting");
      this.$router.Meeting.passCurrSelectedMeetingConfirmation(confirmation);
      this.$router.Meeting.getBlockedTimeSlot(confirmation);
    },

    async declineMeeting(meetingInv) {
      this.$router.Meeting.declineMeeting(meetingInv);
    },

    async quitMeeting(meeting) {
      this.$router.Meeting.quitMeeting(meeting);
    },

    async addTodo() {
      this.errors = "";

      const response = await db.collection("todo").add({
        task: this.TaskmyTodo,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        complete: false,
        deadlineTime: this.TaskmyDeadlineTime,
        deadlineDate: this.TaskmyDeadline,
        switchValue: this.TaskswitchValue,
        dateSwitchValue: this.TaskdateSwitchValue,
        // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
        deadline: this.TaskfinalDeadline,
        displayDeadline: this.TaskdisplayDeadline,
        PIC: [],
        note: this.TaskmyNote,
        project: db.collection("project").doc(this.TaskmyProject),
      });
      await this.addFinalPIC(response);
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({ todo: firebase.firestore.FieldValue.arrayUnion(response) });

      await db
        .collection("project")
        .doc(this.TaskmyProject)
        .update({ todos: firebase.firestore.FieldValue.arrayUnion(response) })
        .catch((error) => console.log(error));

      this.$store.dispatch("getTasks");
      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      this.$store.dispatch("assignTodoDashboardCalendar");
      this.EditpassCurrSelectedProject(this.TaskmyProject);
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
      (this.TasktempGroupmates = []), this.clearTodoInfo();
    },

    async deleteTask(task) {
      console.log(task);
      console.log(this.$store.state.user.uid);
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
      this.EditpassCurrSelectedProject(task.project);
      await db.collection("todo").doc(task.id).delete();
      this.$store.dispatch("getTasks");
      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      this.$store.dispatch("assignTodoDashboardCalendar");
    },

    completeTask: function (task) {
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      });
      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTasks");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      this.$store.dispatch("assignTodoDashboardCalendar");
    },

    removeTask(item) {
      this.TaskgroupmatesChips.splice(
        this.TaskgroupmatesChips.indexOf(item),
        1
      );
      this.TaskgroupmatesChips = [...this.TaskgroupmatesChips];
      console.log(this.TaskgroupmatesChips);
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
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      this.$store.dispatch("assignTodoDashboardCalendar");
      console.log(this.TaskmyProject);
      console.log(this.TaskoldMyProject);
      this.EditpassCurrSelectedProject(this.TaskoldMyProject);
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
      this.TasktempGroupmates = [];
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
      this.TaskmyProject = null;
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
      this.TasktempGroupmates = [];
    },

    async fillTodoInfo(task) {
      console.log(task);
      console.log(task.task);
      console.log(task.PIC);
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
      this.TaskoldGroupmatesChipsObject = task.TaskoldGroupmatesChipsObject;
      console.log(task.PIC);
      console.log(this.oldGroupmatesChips);
      console.log(this.TaskmyTodo);
    },
    async passCurrSelectedProjectOriginal(project) {
      console.log(project);
      this.currTodos = [];
      this.currGroupmateTodos = [];
      const todos = project.todos;
      for (let i = 0; i < todos.length; i++) {
        const data = await db.collection("todo").doc(todos[i].id).get();
        const PIC = await this.getPICId(data.get("PIC"));
        if (PIC.includes(this.$store.state.user.uid)) {
          console.log(await this.getPICId(data.get("PIC")));
          this.currTodos.push({
            id: data.id,
            title: data.get("task"),
            complete: data.get("complete"),
            note: data.get("note"),
            finalDeadline: data.get("deadline")
              ? data.get("deadline").toDate()
              : null,

            project: data.get("project").id,
            oldProject: data.get("project").id,
            TaskmyDeadline: data.get("deadlineDate"),
            TaskmyDeadlineTime: data.get("deadlineTime"),
            TaskswitchValue: data.get("switchValue"),
            TaskdateSwitchValue: data.get("dateSwitchValue"),
            TaskdisplayDeadline: data.get("displayDeadline"),
            TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChipsObject: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          });
        } else {
          this.currGroupmateTodos.push({
            id: data.id,
            title: data.get("task"),
            complete: data.get("complete"),
            note: data.get("note"),
            finalDeadline: data.get("deadline")
              ? data.get("deadline").toDate()
              : null,

            project: data.get("project").id,
            oldProject: data.get("project").id,
            TaskmyDeadline: data.get("deadlineDate"),
            TaskmyDeadlineTime: data.get("deadlineTime"),
            TaskswitchValue: data.get("switchValue"),
            TaskdateSwitchValue: data.get("dateSwitchValue"),
            TaskdisplayDeadline: data.get("displayDeadline"),
            TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChipsObject: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          });
        }
      }

      console.log(this.currTodos);
    },

    async passCurrSelectedProject(project) {
      console.log(project);
      this.currTodos = [];
      this.currGroupmateTodos = [];
      const todos = project.todos;
      for (let i = 0; i < todos.length; i++) {
        let newDate = "";

        const data = await db.collection("todo").doc(todos[i].id).get();
        if (data.get("deadline")) {
          const currLocalDate = data
            .data()
            .deadline.toDate()
            .toLocaleDateString()
            .substr(0, 10);
          const currYear = currLocalDate.substr(6);
          const currMonth = currLocalDate.substr(3, 2);
          const currDate = currLocalDate.substr(0, 2);
          console.log(currLocalDate);
          console.log(currYear);
          console.log(currMonth);
          console.log(currDate);
          newDate = currYear + "-" + currMonth + "-" + currDate;
        }
        const PIC = await this.getPICId(data.get("PIC"));
        if (PIC.includes(this.$store.state.user.uid)) {
          console.log(await this.getPICId(data.get("PIC")));

          this.currTodos.push({
            id: data.id,
            title: data.get("task"),
            complete: data.get("complete"),
            note: data.get("note"),
            finalDeadline: data.get("deadline")
              ? data.get("deadline").toDate()
              : null,

            project: data.get("project").id,
            oldProject: data.get("project").id,
            TaskmyDeadline: data.get("deadline") ? newDate : "",
            TaskmyDeadlineTime: data.get("deadline")
              ? data.get("deadline").toDate().toLocaleTimeString().substr(0, 5)
              : "00:00",
            TaskswitchValue: data.get("includeTime")
              ? data.get("includeTime")
              : data.get("switchValue"),
            TaskdateSwitchValue: data.get("deadline") ? false : true,
            TaskdisplayDeadline: data.get("deadline") ? newDate : "Someday",
            TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChipsObject: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          });
        } else {
          this.currGroupmateTodos.push({
            id: data.id,
            title: data.get("task"),
            complete: data.get("complete"),
            note: data.get("note"),
            finalDeadline: data.get("deadline")
              ? data.get("deadline").toDate()
              : null,

            project: data.get("project").id,
            oldProject: data.get("project").id,
            TaskmyDeadline: data.get("deadline") ? newDate : "",
            TaskmyDeadlineTime: data.get("deadline")
              ? data.get("deadline").toDate().toLocaleTimeString().substr(0, 5)
              : "00:00",
            TaskswitchValue: data.get("includeTime")
              ? data.get("includeTime")
              : data.get("switchValue"),
            TaskdateSwitchValue: data.get("deadline") ? false : true,
            TaskdisplayDeadline: data.get("deadline") ? newDate : "Someday",
            TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChipsObject: await this.getPIC(data.get("PIC")),
            TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          });
        }
      }

      console.log(this.currTodos);
    },

    async EditpassCurrSelectedProject(projectID) {
      console.log(projectID);
      this.currTodos = [];
      const docRef = await db.collection("project").doc(projectID).get();
      const todos = await docRef.get("todos");
      for (let i = 0; i < todos.length; i++) {
        let newDate = "";

        const data = await db.collection("todo").doc(todos[i].id).get();
        if (data.get("deadline")) {
          const currLocalDate = data
            .data()
            .deadline.toDate()
            .toLocaleDateString()
            .substr(0, 10);
          const currYear = currLocalDate.substr(6);
          const currMonth = currLocalDate.substr(3, 2);
          const currDate = currLocalDate.substr(0, 2);
          console.log(currLocalDate);
          console.log(currYear);
          console.log(currMonth);
          console.log(currDate);
          newDate = currYear + "-" + currMonth + "-" + currDate;
        }
        this.currTodos.push({
          id: data.id,
          title: data.get("task"),
          complete: data.get("complete"),
          note: data.get("note"),
          finalDeadline: data.get("deadline")
            ? data.get("deadline").toDate()
            : null,
          project: data.get("project").id,
          oldProject: data.get("project").id,
          TaskmyDeadline: data.get("deadline") ? newDate : "",
          TaskmyDeadlineTime: data.get("deadline")
            ? data.get("deadline").toDate().toLocaleTimeString().substr(0, 5)
            : "00:00",
          TaskswitchValue: data.get("includeTime")
            ? data.get("includeTime")
            : data.get("switchValue"),
          TaskdateSwitchValue: data.get("deadline") ? false : true,
          TaskdisplayDeadline: data.get("deadline") ? newDate : "Someday",
          TaskgroupmatesChips: await this.getPIC(data.get("PIC")),
          TaskoldGroupmatesChips: await this.getPICId(data.get("PIC")),
          TaskoldGroupmatesChipsObject: await this.getPIC(data.get("PIC")),
        });
        console.log(data.get("deadline"));
      }

      console.log(this.currTodos);
    },

    async addCurrUserToTempGroupmates() {
      this.tempGroupmates = [];
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
        avatar: docRef.get("photoURL")
          ? docRef.get("photoURL")
          : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
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

    changeSubmitOnClose() {
      this.addSubmit = false;
      this.editSubmit = false;
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
      this.tempGroupmates = [];
      this.oldGroupmates = [];
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
      this.addSubmit = true;
      this.errors = "";
      const response = await db.collection("project").add({
        _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        creator: db.collection("user").doc(this.$store.state.user.uid),
        title: this.title,
        todos: [],
        progress: 0,
        // deadlineTime: this.myDeadlineTime,
        // deadlineDate: this.myDeadline,
        includeTime: this.switchValue,
        // dateSwitchValue: this.dateSwitchValue,
        deadline: this.finalDeadline,
        // displayDeadline: this.displayDeadline,
        confirmedInvitations: [],
        invitations: [],
        groupmates_declined: [],
        moduleCode: this.modCode,
      });
      await this.addGroupmatesToProject(response);
      await this.addForGroupmates(response);
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          project: firebase.firestore.FieldValue.arrayUnion(response),
        });
      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");

      this.title = "";
      this.modCode = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.finalGroupmates = [];
      this.tempGroupmates = [];
      this.oldGroupmates = [];
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
        await db
          .collection("user")
          .doc(this.$store.state.user.uid)
          .update({
            todo: firebase.firestore.FieldValue.arrayRemove(
              db.collection("todo").doc(project.todos[i].id)
            ),
          });
      }
      await db
        .collection("project")
        .doc(project.id)
        .update({
          groupmates: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });

      this.currTodos = [];
      this.currProject = null;
      this.$store.dispatch("getProjects");
    },

    async editProject(project) {
      this.editSubmit = true;
      this.errors = "";
      const response = await db.collection("project").doc(project.id).update({
        title: this.title,
        progress: this.progress,
        _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // deadlineTime: this.myDeadlineTime,
        // deadlineDate: this.myDeadline,
        includeTime: this.switchValue,
        confirmedInvitations: [],
        // dateSwitchValue: this.dateSwitchValue,
        deadline: this.finalDeadline,
        // displayDeadline: this.displayDeadline,
        moduleCode: this.modCode,
        todos: this.todos,
      });

      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      if (this.currProjectObject !== null) {
        if (project.id == this.currProjectObject.id) {
          this.currProject = this.modCode + " " + this.title;
        }
      }

      this.addForGroupmates(project);
      this.addGroupmatesToProject(project);
      this.title = "";
      this.modCode = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.finalGroupmates = [];
      this.tempGroupmates = [];
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.oldGroupmates = [];
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
              (this.searchId = doc.id),
              (this.searchAvatar = doc.data().photoURL
                ? doc.data().photoURL
                : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1");

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
            this.searchAvatar = doc.data().photoURL
              ? doc.data().photoURL
              : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1";

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
              avatar: doc.get("photoURL")
                ? doc.get("photoURL")
                : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
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
              avatar: doc.get("photoURL")
                ? doc.get("photoURL")
                : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
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
      if (this.finalGroupmates.length == 0) {
        this.finalGroupmates = this.oldGroupmates;
      }
      console.log(this.oldGroupmates);
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        if (this.oldGroupmates.includes(this.finalGroupmates[i])) {
          console.log("they have the project record already");
        } else if (this.finalGroupmates[i] !== this.$store.state.user.uid) {
          db.collection("user")
            .doc(this.finalGroupmates[i])
            .update({
              project_invited: firebase.firestore.FieldValue.arrayUnion(
                db.collection("project").doc(project.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.oldGroupmates.length; i++) {
        if (this.finalGroupmates.includes(this.oldGroupmates[i])) {
          console.log("they are still remaining in the project");
        } else {
          db.collection("user")
            .doc(this.oldGroupmates[i])
            .update({
              project: firebase.firestore.FieldValue.arrayRemove(
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
      this.searchAvatar = null;
      this.search = "";
      this.tempGroupmates = [];
    },

    async addGroupmatesToProject(project) {
      console.log(this.oldGroupmates);
      console.log(this.finalGroupmates);
      console.log(project);
      if (this.finalGroupmates.length == 0) {
        this.finalGroupmates = this.oldGroupmates;
      }

      for (let i = 0; i < this.finalGroupmates.length; i++) {
        if (
          this.finalGroupmates[i] == this.$store.state.user.uid ||
          this.oldGroupmates.includes(this.finalGroupmates[i])
        ) {
          db.collection("project")
            .doc(project.id)
            .update({
              confirmedInvitations: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])
              ),
            });
        } else {
          db.collection("project")
            .doc(project.id)
            .update({
              invitations: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])
              ),
            });
        }
      }

      for (let i = 0; i < this.oldGroupmates.length; i++) {
        if (this.finalGroupmates.includes(this.oldGroupmates[i])) {
          console.log("they are still remaining in the project");
        } else {
          db.collection("project")
            .doc(project.id)
            .update({
              confirmedInvitations: firebase.firestore.FieldValue.arrayRemove(
                db.collection("user").doc(this.oldGroupmates[i])
              ),
            });
        }
      }
    },

    checkAdd(searchID) {
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (
          this.tempGroupmates[i].id === searchID &&
          this.tempGroupmates[i].chipValue == true
        ) {
          return true;
        }
      }
      return false;
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
        avatar: user.get("photoURL")
          ? user.get("photoURL")
          : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
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
        this.searchAvatar = null;
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
          avatar: docRef.get("photoURL")
            ? docRef.get("photoURL")
            : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
        });
      }
      console.log(this.varGroupmates);
      return this.varGroupmates;
    },

    async getGroupmatesId(groupmates) {
      for (let i = 0; i < groupmates.length; i++) {
        const docRef = await groupmates[i].get();

        this.varGroupmatesId.push(docRef.id);
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

    async acceptProject(projectInvitation) {
      db.collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          project_invited: firebase.firestore.FieldValue.arrayRemove(
            db.collection("project").doc(projectInvitation.id)
          ),
        })
        .then(this.$store.dispatch("getProjectInvitations"));

      db.collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          project: firebase.firestore.FieldValue.arrayUnion(
            db.collection("project").doc(projectInvitation.id)
          ),
        })
        .then(this.$store.dispatch("getProjects"));

      db.collection("project")
        .doc(projectInvitation.id)
        .update({
          confirmedInvitations: firebase.firestore.FieldValue.arrayUnion(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
      db.collection("project")
        .doc(projectInvitation.id)
        .update({
          invitations: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });

      this.$store.dispatch("getProjectInvitations");
      this.$store.dispatch("getProjects");
    },

    async declineProject(projectInvitation) {
      db.collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          project_invited: firebase.firestore.FieldValue.arrayRemove(
            db.collection("project").doc(projectInvitation.id)
          ),
        })
        .then(this.$store.dispatch("getProjectInvitations"));

      db.collection("project")
        .doc(projectInvitation.id)
        .update({
          groupmates_declined: firebase.firestore.FieldValue.arrayUnion(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
      db.collection("project")
        .doc(projectInvitation.id)
        .update({
          groupmates_invited: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
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
  height: 100vh !important;
  position: sticky;
}

.content {
  max-width: calc(100% - 256px);
}

.navigation_button {
  display: none;
}

.navigation_title {
  margin: 0;
}
@media only screen and (max-width: 1200px) {
  .navigation_button {
    display: inline-flex;
  }

  .navigation_title {
    width: 0;
  }

  .v-navigation-drawer__border {
    max-width: 0 !important;
    min-width: 0 !important;
    padding: 0 !important;
    transition: width 1s;
    transition-timing-function: ease-in;
  }
  .v-navigation-drawer__border.isActive {
    max-width: 256px !important;
    min-width: 256px !important;
    padding: 18 !important;
    transition: width 1s;
    transition-timing-function: ease-in;
  }

  .content {
    max-width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  .hide-on-sm {
    display: none !important;
  }
  .description {
    justify-content: center !important;
  }
  .project-card {
    overflow-y: hidden !important;
    padding: 10px !important;
    max-height: 100% !important;
  }
  .project-meeting-bar {
    flex-direction: column;
    padding-bottom: 10px;
  }
  .empty_message {
    padding: 10px !important;
  }

  .zero-padding {
    padding: 0 !important;
  }

  .todo_item {
    margin-left: 0;
    font-size: 16px;
  }
  .todo-background {
    height: 100% !important;
    padding-bottom: 0px !important;
  }

  >>> .v-input--selection-controls__input {
    margin-right: 0px !important;
    /* margin-right: 8px; */
  }
  .todo-item {
    height: 45px;
  }
  .todo-item.rounded-r-xl {
    background-color: transparent !important;
    padding-left: 0px;
  }
  .todo-item__row {
    margin: 0px;
  }

  .todo_divider {
    padding: 0px;
  }
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

>>> .v-slide-group__next,
>>> .v-slide-group__prev {
  align-items: center;
  display: flex;
  flex: 0 1 32px;
  justify-content: center;
  min-width: 32px !important ;
}
</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: white !default
</style>
