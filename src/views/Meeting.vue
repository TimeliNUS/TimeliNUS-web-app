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
      </v-col>

      <v-col col="12" md="10">
        <div>
          <div>
            <v-container style="padding-bottom: 0px">
              <span
                style="
                  margin-top: 10px;
                  color: #4b4b4b;
                  font-size: 32px;
                  display: flex;
                  align-items: flex-start;
                  font-weight: bold;
                "
                >Meetings</span
              >
            </v-container>
          </div>

          <v-row>
            <v-col col="12" md="4">
              <div style="margin-left: 1vw">
                <v-dialog
                  v-model="dialog"
                  content-class="elevation-0"
                  max-width="700px"
                  min-width="700px"
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
                          getProjectMenu();
                        "
                      >
                        <span style="color: #ff9d66; font-weight: bold">
                          + Add New Meeting</span
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
                        <div v-if="meetingSubmit == false">
                          <v-card-title
                            :class="`rounded-xl`"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <span style="color: #ff9d66" class="headline"
                              >Add New Meeting</span
                            >

                            <v-btn
                              color="#ff9d66"
                              v-if="newMeetingType == 'import'"
                              plain
                              @click="
                                clearAddMeetingInfo();
                                changeMeetingCreationType();
                              "
                              >Switch to Direct Meeting Creation</v-btn
                            >
                            <v-btn
                              color="#ff9d66"
                              v-if="newMeetingType == 'direct'"
                              plain
                              @click="
                                clearAddMeetingInfo();
                                changeMeetingCreationType();
                              "
                              >Switch to finding common timeslot</v-btn
                            >
                          </v-card-title>
                          <div
                            v-if="newMeetingType == null"
                            style="padding: 3px"
                          >
                            <v-radio-group
                              v-model="tempNewMeetingType"
                              row
                              style="padding: 12px"
                            >
                              <v-radio
                                color="#ff9d66"
                                label="Import calendar and find common available timeslot to create meeting"
                                value="import"
                                style="padding-bottom: 10px"
                              ></v-radio>
                              <span
                                style="
                                  font-size: 14px;
                                  margin-left: 35px;
                                  padding-bottom: 30px;
                                  padding-right: 12px;
                                "
                                >All participants will be required to import
                                their calendar or specify their
                                available/occupied timeslot in order to find the
                                common available time to create a meeting.
                                Creators will be required to select and confirm
                                the meeting timeslot after all participants have
                                imported their calendar.</span
                              >

                              <v-radio
                                color="#ff9d66"
                                label="Directly add a confirmed meeting"
                                value="direct"
                                style="padding-bottom: 10px"
                              ></v-radio>
                              <span
                                style="
                                  font-size: 14px;
                                  margin-left: 35px;
                                  padding-right: 12px;
                                "
                                >Meeting creator will directly create a meeting
                                with the date and time confirmed. Participants
                                will be automatically added into the meeting
                                without the needs of importing calendar or
                                accepting the meeting.</span
                              >
                            </v-radio-group>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="#ff9d66"
                                @click="
                                  clearInfo();
                                  dialog = false;
                                "
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                :disabled="tempNewMeetingType == null"
                                text
                                color="#ff9d66"
                                @click="confirmNewMeetingType()"
                              >
                                Confirm
                              </v-btn>
                            </v-card-actions>
                          </div>
                          <div v-if="newMeetingType == 'import'">
                            <v-card-text>
                              <v-container :class="`rounded-xl`">
                                <v-row>
                                  <v-col
                                    cols="12"
                                    :class="`rounded-xl`"
                                    style="
                                      padding-top: 0px;
                                      padding-bottom: 0px;
                                    "
                                  >
                                    <v-subheader
                                      style="font-size: 16px; font-weight: bold"
                                      class="pl-0"
                                      height="0px"
                                    >
                                      <span style="color: #ff9d66"
                                        >Meeting creation by finding common
                                        available timeslot</span
                                      >
                                    </v-subheader>
                                  </v-col>
                                  <v-col cols="12" :class="`rounded-xl`">
                                    <v-text-field
                                      label="Meeting Title*"
                                      required
                                      :rules="nameRules"
                                      color="#ff9d66"
                                      v-model="meetingTitle"
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
                                      v-model="meetingProject"
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
                                    <div v-if="tempGroupmates">
                                      <v-combobox
                                        :disabled="this.meetingProject == null"
                                        item-text="name"
                                        item-value="id"
                                        v-model="groupmatesChips"
                                        item-color="#ff9d66"
                                        :items="tempGroupmates"
                                        chips
                                        clearable
                                        label="Participants*"
                                        multiple
                                        color="#ff9d66"
                                        :rules="[
                                          (v) =>
                                            !!v || 'Participants are required',
                                        ]"
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
                                            @click:close="remove(item)"
                                          >
                                            <v-avatar left class="white--text">
                                              <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                              <v-img :src="item.avatar"></v-img>
                                            </v-avatar>
                                            <span>{{ item.name }}</span>
                                          </v-chip>
                                        </template>
                                      </v-combobox>
                                    </div>
                                  </v-col>

                                  <v-col cols="12" :class="`rounded-xl`">
                                    <v-subheader class="pl-0">
                                      How long will the meeting take? (in hrs)*
                                    </v-subheader>
                                    <v-slider
                                      v-model="meetingDuration"
                                      step="0.5"
                                      max="6"
                                      min="0"
                                      color="#ff9d66"
                                      thumb-label
                                      :rules="[
                                        (v) =>
                                          v !== 0 ||
                                          'Meeting duration is required',
                                      ]"
                                    ></v-slider>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    :class="`rounded-xl`"
                                    style="padding-bottom: 12px"
                                  >
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
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-text-field
                                          style="padding-bottom: 20px"
                                          required
                                          :rules="[
                                            (v) =>
                                              (!!v && v) !==
                                                'Meeting Date Range' ||
                                              'Meeting Date Range is required',
                                          ]"
                                          v-model="displayMeetingDateRange"
                                          hint="Select one day if the meeting must be on that day. Select two days to specify the possible meeting date range"
                                          label="Meeting Date Range*"
                                          prepend-icon="mdi-calendar"
                                          v-bind="attrs"
                                          v-on="on"
                                          color="#ff9d66"
                                          persistent-hint
                                        ></v-text-field>
                                      </template>
                                      <v-date-picker
                                        color="#ff9d66"
                                        range
                                        v-model="meetingDateRange"
                                      >
                                        <v-btn
                                          outlined
                                          color="#ff9d66"
                                          @click="menuAdd = false"
                                        >
                                          Close
                                        </v-btn>
                                      </v-date-picker>
                                    </v-menu>
                                    <v-row style="padding-top: 5px">
                                      <v-col
                                        cols="12"
                                        md="6"
                                        style="display: flex"
                                      >
                                        <v-menu
                                          ref="menuStartTime"
                                          v-model="menuStartTime"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="meetingStartTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              v-model="meetingStartTime"
                                              label="Start*"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                              :rules="[
                                                (v) =>
                                                  !!v ||
                                                  'Meeting Start Time is required',
                                              ]"
                                            ></v-text-field>
                                          </template>
                                          <v-time-picker
                                            scrollable
                                            v-if="menuStartTime"
                                            v-model="meetingStartTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            :max="meetingEndTime"
                                            @click:minute="
                                              $refs.menuStartTime.save(
                                                meetingStartTime
                                              )
                                            "
                                          ></v-time-picker>
                                        </v-menu>
                                      </v-col>
                                      <v-col cols="12" md="6">
                                        <v-menu
                                          ref="menuEndTime"
                                          v-model="menuEndTime"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="meetingEndTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              v-model="meetingEndTime"
                                              label="End*"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                              :rules="[
                                                (v) =>
                                                  !!v ||
                                                  'Meeting End Time is required',
                                              ]"
                                            ></v-text-field>
                                          </template>
                                          <v-time-picker
                                            scrollable
                                            v-if="menuEndTime"
                                            :min="meetingStartTime"
                                            v-model="meetingEndTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            @click:minute="
                                              $refs.menuEndTime.save(
                                                meetingEndTime
                                              )
                                            "
                                          ></v-time-picker>
                                        </v-menu>
                                      </v-col>
                                      <v-col cols="12" md="12">
                                        <v-subheader class="pl-0">
                                          Meeting Type*
                                        </v-subheader>
                                        <v-radio-group
                                          v-model="meetingVenue"
                                          row
                                          :rules="[
                                            (v) =>
                                              !!v || 'Meeting Type is required',
                                          ]"
                                        >
                                          <v-radio
                                            color="#ff9d66"
                                            label="Online"
                                            value="Online"
                                          ></v-radio>

                                          <v-radio
                                            color="#ff9d66"
                                            label="Offline"
                                            value="Offline"
                                          ></v-radio>
                                        </v-radio-group>
                                        <div v-if="meetingVenue == 'Online'">
                                          <!-- <v-subheader class="pl-0">
                                      Online Type*
                                    </v-subheader> -->
                                          <v-radio-group
                                            v-model="meetingTypeDetails"
                                            row
                                            :rules="[
                                              (v) =>
                                                !!v ||
                                                'Online Type is required',
                                            ]"
                                          >
                                            <v-radio
                                              color="#ff9d66"
                                              label="Zoom"
                                              value="Zoom"
                                            ></v-radio>

                                            <v-radio
                                              color="#ff9d66"
                                              label="Microsoft Teams"
                                              value="Microsoft Teams"
                                            ></v-radio>
                                            <v-radio
                                              color="#ff9d66"
                                              label="Others"
                                              value="Others"
                                            ></v-radio>
                                            <v-text-field
                                              color="#ff9d66"
                                              :disabled="
                                                this.meetingTypeDetails !==
                                                'Others'
                                              "
                                              :rules="[
                                                (v) => !!v || 'Please specify:',
                                              ]"
                                              v-model="othersSpecify"
                                              label="Please specify: "
                                            >
                                            </v-text-field>
                                          </v-radio-group>
                                          <small
                                            >Automatic online meeting link
                                            creation is online supported for
                                            Zoom now.</small
                                          >
                                        </div>
                                        <div v-if="meetingVenue == 'Offline'">
                                          <v-text-field
                                            color="#ff9d66"
                                            :rules="[
                                              (v) => !!v || 'Please specify',
                                            ]"
                                            v-model="offlineSpecify"
                                            label="Please specify the offline meeting venue:"
                                          ></v-text-field>

                                          <small
                                            >Automatic online meeting link
                                            creation is online supported for
                                            Zoom now.</small
                                          >
                                        </div>
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
                                  this.meetingTitle == '' ||
                                  this.meetingProject == null ||
                                  this.groupmatesChips.length == 0 ||
                                  this.meetingVenue == '' ||
                                  (this.meetingVenue == 'Online' &&
                                    this.meetingTypeDetails == '') ||
                                  (this.meetingVenue == 'Online' &&
                                    this.meetingTypeDetails == 'Others' &&
                                    this.othersSpecify == '') ||
                                  (this.meetingVenue == 'Offline' &&
                                    this.offlineSpecify == '') ||
                                  this.meetingDateRange.length == 0 ||
                                  this.meetingDuration < 0.5
                                "
                                text
                                @click="
                                  dialog = false;
                                  addMeeting();
                                "
                              >
                                Save
                              </v-btn>
                            </v-card-actions>
                          </div>

                          <div v-if="this.newMeetingType == 'direct'">
                            <v-card-text>
                              <v-container :class="`rounded-xl`">
                                <v-row>
                                  <v-col
                                    cols="12"
                                    :class="`rounded-xl`"
                                    style="
                                      padding-top: 0px;
                                      padding-bottom: 0px;
                                    "
                                  >
                                    <v-subheader
                                      style="font-size: 16px; font-weight: bold"
                                      class="pl-0"
                                      height="0px"
                                    >
                                      <span style="color: #ff9d66"
                                        >Direct meeting creation</span
                                      >
                                    </v-subheader>
                                  </v-col>
                                  <v-col cols="12" :class="`rounded-xl`">
                                    <v-text-field
                                      label="Meeting Title*"
                                      required
                                      :rules="nameRules"
                                      color="#ff9d66"
                                      v-model="meetingTitle"
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
                                      v-model="meetingProject"
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
                                    <div v-if="tempGroupmates">
                                      <v-combobox
                                        :disabled="this.meetingProject == null"
                                        item-text="name"
                                        item-value="id"
                                        v-model="groupmatesChips"
                                        item-color="#ff9d66"
                                        :items="tempGroupmates"
                                        chips
                                        clearable
                                        label="Participants*"
                                        multiple
                                        color="#ff9d66"
                                        :rules="[
                                          (v) =>
                                            !!v || 'Participants are required',
                                        ]"
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
                                            @click:close="remove(item)"
                                          >
                                            <v-avatar left class="white--text">
                                              <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                              <v-img :src="item.avatar"></v-img>
                                            </v-avatar>
                                            <span>{{ item.name }}</span>
                                          </v-chip>
                                        </template>
                                      </v-combobox>
                                    </div>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    :class="`rounded-xl`"
                                    style="padding-bottom: 12px"
                                  >
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
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-text-field
                                          style="padding-bottom: 20px"
                                          required
                                          :rules="[
                                            (v) =>
                                              (!!v && v) !== 'Meeting Date' ||
                                              'Meeting Date is required',
                                          ]"
                                          v-model="displayMeetingDateRange"
                                          hint="Select two days if the meeting is across days"
                                          label="Meeting Date*"
                                          prepend-icon="mdi-calendar"
                                          v-bind="attrs"
                                          v-on="on"
                                          color="#ff9d66"
                                          persistent-hint
                                        ></v-text-field>
                                      </template>
                                      <v-date-picker
                                        color="#ff9d66"
                                        range
                                        v-model="meetingDateRange"
                                      >
                                        <v-btn
                                          outlined
                                          color="#ff9d66"
                                          @click="menuAdd = false"
                                        >
                                          Close
                                        </v-btn>
                                      </v-date-picker>
                                    </v-menu>
                                    <v-row style="padding-top: 5px">
                                      <v-col
                                        cols="12"
                                        md="6"
                                        style="display: flex"
                                      >
                                        <v-menu
                                          ref="menuStartTime"
                                          v-model="menuStartTime"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="meetingStartTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              v-model="meetingStartTime"
                                              label="Start*"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                              :rules="[
                                                (v) =>
                                                  !!v ||
                                                  'Meeting Start Time is required',
                                              ]"
                                            ></v-text-field>
                                          </template>
                                          <v-time-picker
                                            scrollable
                                            v-if="menuStartTime"
                                            v-model="meetingStartTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            :max="meetingEndTime"
                                            @click:minute="
                                              $refs.menuStartTime.save(
                                                meetingStartTime
                                              )
                                            "
                                          ></v-time-picker>
                                        </v-menu>
                                      </v-col>
                                      <v-col cols="12" md="6">
                                        <v-menu
                                          ref="menuEndTime"
                                          v-model="menuEndTime"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="meetingEndTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              v-model="meetingEndTime"
                                              label="End*"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                              :rules="[
                                                (v) =>
                                                  !!v ||
                                                  'Meeting End Time is required',
                                              ]"
                                            ></v-text-field>
                                          </template>
                                          <v-time-picker
                                            scrollable
                                            v-if="menuEndTime"
                                            :min="meetingStartTime"
                                            v-model="meetingEndTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            @click:minute="
                                              $refs.menuEndTime.save(
                                                meetingEndTime
                                              )
                                            "
                                          ></v-time-picker>
                                        </v-menu>
                                      </v-col>
                                      <v-col cols="12" md="12">
                                        <v-subheader class="pl-0">
                                          Meeting Type*
                                        </v-subheader>
                                        <v-radio-group
                                          v-model="meetingVenue"
                                          row
                                          :rules="[
                                            (v) =>
                                              !!v || 'Meeting Type is required',
                                          ]"
                                        >
                                          <v-radio
                                            color="#ff9d66"
                                            label="Online"
                                            value="Online"
                                          ></v-radio>

                                          <v-radio
                                            color="#ff9d66"
                                            label="Offline"
                                            value="Offline"
                                          ></v-radio>
                                        </v-radio-group>
                                        <div v-if="meetingVenue == 'Online'">
                                          <!-- <v-subheader class="pl-0">
                                      Online Type*
                                    </v-subheader> -->
                                          <v-radio-group
                                            v-model="meetingTypeDetails"
                                            row
                                            :rules="[
                                              (v) =>
                                                !!v ||
                                                'Online Type is required',
                                            ]"
                                          >
                                            <v-radio
                                              color="#ff9d66"
                                              label="Zoom"
                                              value="Zoom"
                                            ></v-radio>

                                            <v-radio
                                              color="#ff9d66"
                                              label="Microsoft Teams"
                                              value="Microsoft Teams"
                                            ></v-radio>
                                            <v-radio
                                              color="#ff9d66"
                                              label="Others"
                                              value="Others"
                                            ></v-radio>
                                            <v-text-field
                                              color="#ff9d66"
                                              :disabled="
                                                this.meetingTypeDetails !==
                                                'Others'
                                              "
                                              :rules="[
                                                (v) => !!v || 'Please specify:',
                                              ]"
                                              v-model="othersSpecify"
                                              label="Please specify: "
                                            >
                                            </v-text-field>
                                          </v-radio-group>
                                          <small
                                            >Automatic online meeting link
                                            creation is online supported for
                                            Zoom now.</small
                                          >
                                        </div>
                                        <div v-if="meetingVenue == 'Offline'">
                                          <v-text-field
                                            color="#ff9d66"
                                            :rules="[
                                              (v) => !!v || 'Please specify',
                                            ]"
                                            v-model="offlineSpecify"
                                            label="Please specify the offline meeting venue:"
                                          ></v-text-field>

                                          <small
                                            >Automatic online meeting link
                                            creation is online supported for
                                            Zoom now.</small
                                          >
                                        </div>
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
                                  this.meetingTitle == '' ||
                                  this.meetingProject == null ||
                                  this.groupmatesChips.length == 0 ||
                                  this.meetingVenue == '' ||
                                  (this.meetingVenue == 'Online' &&
                                    this.meetingTypeDetails == '') ||
                                  (this.meetingVenue == 'Online' &&
                                    this.meetingTypeDetails == 'Others' &&
                                    this.othersSpecify == '') ||
                                  (this.meetingVenue == 'Offline' &&
                                    this.offlineSpecify == '') ||
                                  this.meetingDateRange.length == 0
                                "
                                text
                                @click="
                                  dialog = false;
                                  addConfirmedMeeting();
                                "
                              >
                                Save
                              </v-btn>
                            </v-card-actions>
                          </div>
                        </div>
                        <v-dialog
                          v-model="meetingSubmit"
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
                              <span style="margin-bottom: 10px; color: #4b4b4b"
                                >Meeting has been created. Invitations will be
                                sent to participants if importing calendar is
                                required.</span
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
                      </v-form>
                    </v-card>
                  </v-sheet>
                </v-dialog>
              </div>
              <br />
              <div>
                <v-btn-toggle
                  v-model="calOrList"
                  rounded
                  outlined
                  style="margin-left: 1vw"
                  background-color="white"
                  color="#ff7200"
                  mandatory
                >
                  <v-btn
                    :value="0"
                    color="white"
                    style="min-width: 12vw; border-color: #ff9d66 !important"
                  >
                    <v-icon color="#ff9d66">event</v-icon>
                  </v-btn>
                  <v-btn
                    :value="1"
                    color="white"
                    style="min-width: 12vw; border-color: #ff9d66 !important"
                  >
                    <v-icon color="#ff9d66">view_list</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
              <br />

              <div
                v-if="this.calOrList == 0"
                style="
                  margin-left: 1vw;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <v-date-picker
                  ref="picker"
                  v-model="displayMeetingCalendar"
                  :events="this.$store.state.meetingCalendar"
                  event-color="blue"
                  color="#ff9d66"
                  width="400"
                  style="max-width: 400px; min-width: 400px"
                  @click="loadMeetingsCalendar()"
                ></v-date-picker>

                <v-card
                  width="400"
                  outlined
                  color="#FFE4CB"
                  style="padding: 14px; display: flex; flex-direction: column"
                  :class="`rounded-b-xl`"
                >
                  <v-card-text style="display:flex; font-size:20px; font-weight: bold">
                    {{ displayMeetingCalendar }}
                  </v-card-text>
                  <div v-if="checkTodayMeetingLength()">
                    <div
                      v-for="meeting in this.$store.state.confirmedMeetings"
                      :key="meeting.id"
                    >
                      <div v-if="checkMeetingDate(meeting)">
                        <v-card
                          color="white"
                          outlined
                          style="
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: flex-start;
                            margin-bottom: 16px !important;
                            font-size: 14px;
                          "
                          :class="`rounded-xl`"
                          @click="popupMeetingDetails(meeting); "
                        >
                          <span
                            >{{ meeting.project.get("modCode") }}
                            {{ meeting.project.get("title") }}</span
                          >
                          <span>{{ meeting.title }}</span>
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
                                  style="border: 2px solid #fff"
                                >
                                  <v-img :src="groupmate.avatar"></v-img
                                ></v-avatar>
                              </div>
                            </div>
                          </div>

                          <div
                            style="display: flex; justify-content: flex-start"
                          >
                            <span
                              ><v-icon color="#ff9d66"
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
                              }} </span
                            ><span style="margin-left: 2vw"
                              ><v-icon color="#ff9d66">place</v-icon>
                              {{ meeting.venue }}</span
                            >
                          </div>
                          <!-- <span><v-icon color="#ff9d66">place</v-icon> 
                  {{meeting.venue}} </span> -->
                        </v-card>
                        <v-dialog v-if="currSelectedPopupMeeting !== null && currSelectedPopupMeeting == meeting" v-model="currSelectedPopupMeeting" content-class="elevation-0"
                        persistent
                          max-width="600px"
                          min-height="300px"
                          :class="`rounded-lg`"
                          style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          ">
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
                                min-width: 550px;
                                max-width: 600px;
                                display: flex;
                                justify-content: center;
                                align-items: flex-start;
                                flex-direction: column;
                              "
                            >
                          
                           <div style="text-align:left; display:flex; align-items: center; justify-content: space-between; min-width: 520px">
                            <span style="font-weight: bold; padding:5px; font-size: 36px; margin-bottom: -10px;">{{ meeting.title }}</span>
                           <v-btn icon color="#ff9d66" @click="closePopUpMeeting()">
                                  <v-icon color="#ff9d66">mdi-close</v-icon>
                                </v-btn>
                           </div>


                          <span style="padding:5px; color: #4b4b4b; margin-bottom: 20px"
                        >{{ meeting.project.get("modCode") }}
                        {{ meeting.project.get("title") }}</span
                      >
                   
                      <span style="font-weight:bold; padding:5px; font-size: 24px">Details:</span>
                      <div
                        style="
                          padding-bottom: 10px !important;
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
                            <v-avatar :size="30" style="border: 2px solid #fff">
                              <v-img :src="groupmate.avatar"></v-img
                            ></v-avatar>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="
                          meeting.selectedStartDate
                            .toDate()
                            .toLocaleDateString() !==
                          meeting.selectedEndDate.toDate().toLocaleDateString()
                        "
                      >
                        <span style="padding:5px; color: #4b4b4b; margin-bottom:5px;"
                          ><v-icon color="#ff9d66">calendar_today</v-icon>
                          {{
                            meeting.selectedStartDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}
                          -
                          {{
                            meeting.selectedEndDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}</span
                        >
                      </div>
                      <div v-else>
                        <span style="padding: 5px; color: #4b4b4b; margin-bottom:5px"
                          ><v-icon color="#ff9d66">calendar_today</v-icon>
                          {{
                            meeting.selectedStartDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}
                        </span>
                      </div>
                      <div style="display: flex; justify-content: flex-start">
                        <span style="padding: 5px; color: #4b4b4b"
                          ><v-icon color="#ff9d66"
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
                          }} </span
                        >
                      </div>
                      <span style="padding: 5px; color: #4b4b4b"
                          ><v-icon color="#ff9d66">place</v-icon>
                          {{ meeting.venue }}</span
                        >

                        <div style="max-width: 500px;word-break:break-all; display:flex; align-items: flex-start; text-align: initial; font-size: 14px!important">
                        <span v-if="updateMeetingLink == '' && meeting.isOnlineVenue == true" style="padding: 5px; color: #4b4b4b; display:flex; align-items: flex-start; text-align: initial;"
                          ><v-icon color="#ff9d66" style="padding-right: 5px">link</v-icon>
                          
                          {{ meeting.meetingLink }}</span
                        >
                       
                        <span v-if="updateMeetingLink !== '' && meeting.isOnlineVenue == true" style="padding: 5px; color: #4b4b4b; 
                        display:flex; 
                        align-items: flex-start; 
                        text-align: initial;
                        font-size:14px !important; 
                        "
                          ><v-icon color="#ff9d66" style="padding-right:5px">link</v-icon>
                         {{ updateMeetingLink }}</span
                        >
                        <span v-if="meeting.isOnlineVenue !== true" style="padding: 5px; color: #4b4b4b; display:flex; align-items: flex-start; text-align: initial;"
                          ><v-icon color="#ff9d66" style="padding-right: 5px">link</v-icon>
                          
                          <v-btn color="#ff9d66" outlined small  href="https://aces.nus.edu.sg/fbs/ADFSLogin" target="_blank">NUS Facility Booking System</v-btn></span
                        >
                        
                        
                        </div>
                        <v-dialog v-model="dialogNewLink[meeting.title]" max-width="600px" v-if="meeting.isOnlineVenue == true">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              outlined
                              
                              small
                              style="margin-left: 25px"
                              color="#ff9d66"
                              
                            >
                              <v-icon rounded small >edit</v-icon> <span style="color: #ff9d66"> Edit Meeting Link</span>
                            </v-btn>
                          </template>
                          <v-card style="padding: 20px">
                          
                            <v-text-field
                              label="New Meeting Link"
                              v-model="tempUpdateMeetingLink"
                              color="#ff9d66"
                            ></v-text-field>
                        
                            <v-spacer></v-spacer>
                            
                            <v-card-actions
                              style="dispaly: flex; justify-content: flex-end"
                            >
                              <v-btn
                                color="#ff9d66"
                                text
                                @click="
                                  dialogNewLink[meeting.title] = false;
                                  clearUpdateMeetingLink();
                                "
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                color="#ff9d66"
                                text
                                @click="
                                  dialogNewLink[meeting.title] = false;
                                  passinNewMeetingLink();
                                "
                              >
                                Save
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        
                          </v-card>
                          </v-sheet>

                        </v-dialog>
                      </div>
                    </div>
                  </div>
                  <div v-else style="font-weight:bold; color: #4b4b4b">
                    <span> You do not have any meeting this day. </span>
                  </div>
                </v-card>
              </div>
              <div
                v-else
                style="margin-left: 1vw; display: flex; justify-content: center"
              >
                <v-card
                  width="400"
                  outlined
                  color="#FFE4CB"
                  style="
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    max-height: 98vh;
                    min-height: 72vh;
                    overflow-y: scroll;
                  "
                  :class="`rounded-xl`"
                  
                >

                <div v-if="orderedConfirmedMeetings.length !== 0">
                  <div
                    v-for="meeting in orderedConfirmedMeetings"
                    :key="meeting.id"
                  >
                    <v-card
                      color="white"
                      outlined
                      style="
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        margin-bottom: 16px;
                        font-size: 14px;
                      "
                      :class="`rounded-xl`"
                      @click="popupMeetingDetails(meeting); "
                    >
                      <span
                        >{{ meeting.project.get("modCode") }}
                        {{ meeting.project.get("title") }}</span
                      >
                      <span>{{ meeting.title }}</span>
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
                            <v-avatar :size="30" style="border: 2px solid #fff">
                              <v-img :src="groupmate.avatar"></v-img
                            ></v-avatar>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="
                          meeting.selectedStartDate
                            .toDate()
                            .toLocaleDateString() !==
                          meeting.selectedEndDate.toDate().toLocaleDateString()
                        "
                      >
                        <span
                          ><v-icon color="#ff9d66">calendar_today</v-icon>
                          {{
                            meeting.selectedStartDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}
                          -
                          {{
                            meeting.selectedEndDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}</span
                        >
                      </div>
                      <div v-else>
                        <span
                          ><v-icon color="#ff9d66">calendar_today</v-icon>
                          {{
                            meeting.selectedStartDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}
                        </span>
                      </div>
                      <div style="display: flex; justify-content: flex-start">
                        <span
                          ><v-icon color="#ff9d66"
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
                          }} </span
                        ><span style="margin-left: 2vw"
                          ><v-icon color="#ff9d66">place</v-icon>
                          {{ meeting.venue }}</span
                        >
                      </div>
                      <!-- <span><v-icon color="#ff9d66">place</v-icon> 
                  {{meeting.venue}} </span> -->
                  
                    </v-card>
                    <v-dialog v-if="currSelectedPopupMeeting !== null && currSelectedPopupMeeting == meeting" v-model="currSelectedPopupMeeting" content-class="elevation-0"
                        persistent
                          max-width="600px"
                          min-height="300px"
                          :class="`rounded-lg`"
                          style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          ">
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
                                min-width: 550px;
                                max-width: 600px;
                                display: flex;
                                justify-content: center;
                                align-items: flex-start;
                                flex-direction: column;
                              "
                            >
                           
                           <div style="display:flex; align-items: center; justify-content: space-between; min-width: 520px">
                            <span style="font-weight: bold; padding:5px; font-size: 36px; margin-bottom: -10px;">{{ meeting.title }}</span>
                           <v-btn icon color="#ff9d66" @click="closePopUpMeeting()">
                                  <v-icon color="#ff9d66">mdi-close</v-icon>
                                </v-btn>
                           </div>


                          <span style="padding:5px; color: #4b4b4b; margin-bottom: 20px"
                        >{{ meeting.project.get("modCode") }}
                        {{ meeting.project.get("title") }}</span
                      >
                   
                      <span style="font-weight:bold; padding:5px; font-size: 24px">Details:</span>
                      <div
                        style="
                          padding-bottom: 10px !important;
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
                            <v-avatar :size="30" style="border: 2px solid #fff">
                              <v-img :src="groupmate.avatar"></v-img
                            ></v-avatar>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="
                          meeting.selectedStartDate
                            .toDate()
                            .toLocaleDateString() !==
                          meeting.selectedEndDate.toDate().toLocaleDateString()
                        "
                      >
                        <span style="padding:5px; color: #4b4b4b; margin-bottom:5px;"
                          ><v-icon color="#ff9d66">calendar_today</v-icon>
                          {{
                            meeting.selectedStartDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}
                          -
                          {{
                            meeting.selectedEndDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}</span
                        >
                      </div>
                      <div v-else>
                        <span style="padding: 5px; color: #4b4b4b; margin-bottom:5px"
                          ><v-icon color="#ff9d66">calendar_today</v-icon>
                          {{
                            meeting.selectedStartDate
                              .toDate()
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                          }}
                        </span>
                      </div>
                      <div style="display: flex; justify-content: flex-start">
                        <span style="padding: 5px; color: #4b4b4b"
                          ><v-icon color="#ff9d66"
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
                          }} </span
                        >
                      </div>
                      <span style="padding: 5px; color: #4b4b4b"
                          ><v-icon color="#ff9d66">place</v-icon>
                          {{ meeting.venue }}</span
                        >

                        <div style="max-width: 500px;word-break:break-all; display:flex; align-items: flex-start; text-align: initial; font-size: 14px!important">
                        <span v-if="updateMeetingLink == ''  && meeting.isOnlineVenue == true" style="padding: 5px; color: #4b4b4b; display:flex; align-items: flex-start; text-align: initial;"
                          ><v-icon color="#ff9d66" style="padding-right: 5px">link</v-icon>
                          {{ meeting.meetingLink }}</span
                        >
                        <span v-if="updateMeetingLink !== '' && meeting.isOnlineVenue == true" style="padding: 5px; color: #4b4b4b; 
                        display:flex; 
                        align-items: flex-start; 
                        text-align: initial;
                        font-size:14px !important; 
                        "
                          ><v-icon color="#ff9d66" style="padding-right:5px">link</v-icon>
                         {{ updateMeetingLink }}</span
                        >
                        <span v-if="meeting.isOnlineVenue !== true" style="padding: 5px; color: #4b4b4b; display:flex; align-items: flex-start; text-align: initial;"
                          ><v-icon color="#ff9d66" style="padding-right: 5px">link</v-icon>
                          
                          <v-btn color="#ff9d66" outlined small  href="https://aces.nus.edu.sg/fbs/ADFSLogin" target="_blank">NUS Facility Booking System</v-btn></span
                        >
                        
                        </div>
                        <v-dialog v-model="dialogNewLink2[meeting.title]" max-width="600px" v-if="meeting.isOnlineVenue == true">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              outlined
                              
                              small
                              style="margin-left: 25px"
                              color="#ff9d66"
                              
                            >
                              <v-icon rounded small >edit</v-icon> <span style="color: #ff9d66"> Edit Meeting Link</span>
                            </v-btn>
                          </template>
                          <v-card style="padding: 20px">
                            <v-text-field
                              label="New Meeting Link"
                              v-model="tempUpdateMeetingLink"
                              color="#ff9d66"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-card-actions
                              style="dispaly: flex; justify-content: flex-end"
                            >
                              <v-btn
                                color="#ff9d66"
                                text
                                @click="
                                  dialogNewLink2[meeting.title] = false;
                                  clearUpdateMeetingLink();
                                "
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                color="#ff9d66"
                                text
                                @click="
                                  dialogNewLink2[meeting.title] = false;
                                  passinNewMeetingLink();
                                "
                              >
                                Save
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        
                          </v-card>
                          </v-sheet>

                        </v-dialog>
                    
                  </div>
                </div>
                <div v-else>
                  <span style="color: #4b4b4b; font-weight: bold; padding-top: 34vh"> You do not have any meeting yet. </span><br/>
                   <span> Create one or accept a meeting invitation.</span>
                </div>
                </v-card>
              </div>
            </v-col>

            <v-col col="12" md="8">
              <div style="display: flex; flex-direction:column; justify-content:flex-start">
                <v-container
                  style="margin-right: auto; margin-left: auto; display: flex;padding-left: 0px!important"
                  max-width="51vw"
                  color="#ffe4cb"
                  min-width="51vw"
                >
                  <v-card
                    max-width="51vw"
                    min-width="51vw"
                    color="#ffe4cb"
                    outlined
                    style="padding: 14px; display: flex; flex-direction: column"
                    :class="`rounded-xl`"
                  >
                    <v-tabs
                      style="padding: 10px"
                      v-model="tab"
                      fixed-tabs
                      color="#4b4b4b"
                      background-color="#ffe4cb"
                    >
                      <v-tab> Invitations </v-tab>
                      <v-tab> Pending </v-tab>
                      <v-tab>Confirmation</v-tab>
                    </v-tabs>
                    <v-tabs-items
                      v-model="tab"
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
                            <div v-if="invitationLength" style="">
                              <v-sheet
                                :class="`rounded-xl`"
                                class="mx-auto"
                                elevation="0"
                                max-width="50vw"
                                style="background-color: #ffe4cb"
                              >
                                <v-slide-group
                                  v-model="invitationsSlide"
                                  active-class="success"
                                  show-arrows
                                >
                                  <v-slide-item
                                    v-for="meetingInv in orderedMeetingInv"
                                    :key="meetingInv.id"
                                    v-slot="{ active }"
                                  >
                                    <v-card
                                      :class="`rounded-xl`"
                                      :color="active ? undefined : 'white'"
                                      class="ma-2"
                                      height="255"
                                      width="300"
                                      style="padding: 10px; padding-left: 14px"
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
                                                {{ meetingInv.startTime }} -
                                                {{ meetingInv.endTime }} ({{
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
                                                    {{ meetingInv.venue }}</span
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
                                                          border: 2px solid #fff;
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
                                                {{ meetingInv.creator }}</span
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
                                                  passCurrSelectedMeetingInv(
                                                    meetingInv
                                                  );
                                                  getBlockedTimeSlot(
                                                    meetingInv
                                                  );
                                                  checkExistingCalendar();
                                                "
                                              >
                                                Import Calendar
                                              </v-btn>
                                              <v-btn
                                                small
                                                text
                                                color="#999999"
                                                @click="
                                                  declineMeeting(meetingInv)
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

                                <div
                                  style="
                                    display: flex;
                                    justify-content: flex-end;
                                  "
                                >
                                  <v-btn
                                    align="right"
                                    text
                                    style="
                                      margin-top: 10px;
                                      color: #4b4b4b;
                                      font-size: 16px;
                                      display: flex;
                                      align-items: center;
                                      font-weight: bold;
                                      margin-right: 3vw;
                                    "
                                    @click="invitationTableView = true"
                                    >Grid View</v-btn
                                  >
                                </div>
                              </v-sheet>
                            </div>
                            <div
                              v-else
                              style="padding:85px; display:flex' align-items: center; justify-content: center"
                            >
                             <span
                                        style="
                                          color: #4b4b4b;
                                          font-weight: bold;
                                          font-size: 16px;
                                        "
                                        >You do not have any meeting invitation yet.</span
                                      >
                            </div>

                            <v-dialog
                              v-model="invitationTableView"
                              content-class="elevation-0"
                            >
                              <div>
                                <v-container>
                                  <v-card
                                    outlined
                                    color="#FFE4CB"
                                    style="padding: 20px"
                                    :class="`rounded-xl`"
                                  >
                                    <div align="left">
                                      <v-btn
                                        icon
                                        color="#ff9d66"
                                        @click="invitationTableView = false"
                                      >
                                        <v-icon color="#ff9d66"
                                          >mdi-close</v-icon
                                        >
                                      </v-btn>
                                    </div>

                                    <div v-if="invitationLength" style="">
                                      <v-sheet
                                        :class="`rounded-xl`"
                                        class="mx-auto"
                                        elevation="0"
                                        max-width="50vw"
                                        style="
                                          background-color: #ffe4cb;
                                          display: flex;
                                          flex-wrap: wrap;
                                          justify-content: center;
                                        "
                                      >
                                        <div
                                          v-for="meetingInv in orderedMeetingInv"
                                          :key="meetingInv.id"
                                        >
                                          <v-card
                                            :class="`rounded-xl`"
                                            :color="'white'"
                                            class="ma-2"
                                            height="255"
                                            width="300"
                                            style="
                                              padding: 10px;
                                              padding-left: 14px;
                                              margin: 10px;
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
                                                        passCurrSelectedMeetingInv(
                                                          meetingInv
                                                        );
                                                        getBlockedTimeSlot(
                                                          meetingInv
                                                        );
                                                         checkExistingCalendar();
                                                        invitationTableView = false;
                                                      "
                                                    >
                                                      Import Calendar
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
                                        </div>
                                      </v-sheet>
                                    </div>
                                    <div
                                      v-else
                                      style="padding:85px; display:flex' align-items: center; justify-content: center"
                                    >
                                      <span
                                        style="
                                          color: #4b4b4b;
                                          font-weight: bold;
                                          font-size: 16px;
                                        "
                                        >You do not have any meeting invitation yet.</span
                                      >
                                    </div>
                                  </v-card>
                                </v-container>
                              </div>
                            </v-dialog>
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
                            <div v-if="pendingLength" style="">
                              <v-sheet
                                :class="`rounded-xl`"
                                class="mx-auto"
                                elevation="0"
                                max-width="50vw"
                                style="background-color: #ffe4cb"
                              >
                                <v-slide-group
                                  v-model="pendingSlide"
                                  active-class="success"
                                  show-arrows
                                >
                                  <v-slide-item
                                    v-for="pending in orderedMeetingPending"
                                    :key="pending.id"
                                    v-slot="{ active }"
                                  >
                                    <v-card
                                      :class="`rounded-xl`"
                                      :color="active ? undefined : 'white'"
                                      class="ma-2"
                                      height="255"
                                      width="300"
                                      style="padding: 10px; padding-left: 14px"
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
                                                {{ pending.startTime }} -
                                                {{ pending.endTime }} ({{
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
                                                    {{ pending.venue }}</span
                                                  >
                                                </div>
                                              </v-col>
                                              <v-col
                                                cols="12"
                                                md="5"
                                                style="
                                                  display: flex;
                                                  padding-top: 6px !important ;
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
                                                          border: 2px solid #fff;
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
                                                {{ pending.creator }}</span
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
                                                  passCurrSelectedMeetingPending(
                                                    pending
                                                  );
                                                  getBlockedTimeSlot(pending);
                                                "
                                              >
                                                View
                                              </v-btn>
                                              <v-btn
                                                small
                                                text
                                                color="#999999"
                                                @click="quitMeeting(pending)"
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
                                <div
                                  style="
                                    display: flex;
                                    justify-content: flex-end;
                                  "
                                >
                                  <v-btn
                                    align="right"
                                    text
                                    style="
                                      margin-top: 10px;
                                      color: #4b4b4b;
                                      font-size: 16px;
                                      display: flex;
                                      align-items: center;
                                      font-weight: bold;
                                      margin-right: 3vw;
                                    "
                                    @click="pendingTableView = true"
                                    >Grid View</v-btn
                                  >
                                </div>
                              </v-sheet>
                            </div>
                            <div
                              v-else
                              style="padding:85px; display:flex' align-items: center; justify-content: center"
                            >
                              <span
                                        style="
                                          color: #4b4b4b;
                                          font-weight: bold;
                                          font-size: 16px;
                                        "
                                        >You do not have any pending meeting yet.</span
                                      >
                            </div>
                          </v-card>

                          <v-dialog
                            v-model="pendingTableView"
                            content-class="elevation-0"
                          >
                            <div>
                              <v-container>
                                <v-card
                                  outlined
                                  color="#FFE4CB"
                                  style="padding: 20px"
                                  :class="`rounded-xl`"
                                >
                                  <div align="left">
                                    <v-btn
                                      icon
                                      color="#ff9d66"
                                      @click="pendingTableView = false"
                                    >
                                      <v-icon color="#ff9d66">mdi-close</v-icon>
                                    </v-btn>
                                  </div>

                                  <div v-if="pendingLength" style="">
                                    <v-sheet
                                      :class="`rounded-xl`"
                                      class="mx-auto"
                                      elevation="0"
                                      max-width="50vw"
                                      style="
                                        background-color: #ffe4cb;
                                        display: flex;
                                        flex-wrap: wrap;
                                        justify-content: center;
                                      "
                                    >
                                      <div
                                        v-for="pending in orderedMeetingPending"
                                        :key="pending.id"
                                      >
                                        <v-card
                                          :class="`rounded-xl`"
                                          :color="'white'"
                                          class="ma-2"
                                          height="255"
                                          width="300"
                                          style="
                                            padding: 10px;
                                            padding-left: 14px;
                                            margin: 10px;
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
                                                    {{ pending.startTime }} -
                                                    {{ pending.endTime }} ({{
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
                                                              border: 2px solid
                                                                #fff;
                                                              border-color: #ffffff !important;
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
                                                    {{ pending.creator }}</span
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
                                                      passCurrSelectedMeetingPending(
                                                        pending
                                                      );
                                                      getBlockedTimeSlot(
                                                        pending
                                                      );
                                                      pendingTableView = false;
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
                                      </div>
                                    </v-sheet>
                                  </div>
                                  <div
                                    v-else
                                    style="padding:85px; display:flex' align-items: center; justify-content: center"
                                  >
                                    <span
                                        style="
                                          color: #4b4b4b;
                                          font-weight: bold;
                                          font-size: 16px;
                                        "
                                        >You do not have any pending meeting yet.</span
                                      >
                                  </div>
                                </v-card>
                              </v-container>
                            </div>
                          </v-dialog>
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
                            <div v-if="confirmationLength" style="">
                              <v-sheet
                                :class="`rounded-xl`"
                                class="mx-auto"
                                elevation="0"
                                max-width="50vw"
                                style="background-color: #ffe4cb"
                              >
                                <v-slide-group
                                  v-model="confirmationSlide"
                                  active-class="success"
                                  show-arrows
                                >
                                  <v-slide-item
                                    v-for="confirmation in orderedMeetingConfirmation"
                                    :key="confirmation.id"
                                    v-slot="{ active }"
                                  >
                                    <v-card
                                      :class="`rounded-xl`"
                                      :color="active ? undefined : 'white'"
                                      class="ma-2"
                                      height="255"
                                      width="300"
                                      style="padding: 10px; padding-left: 14px"
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
                                            {{ confirmation.projectTitle }}
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
                                                {{ confirmation.startTime }} -
                                                {{ confirmation.endTime }} ({{
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
                                                          border: 2px solid #fff;
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
                                                {{ confirmation.creator }}</span
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
                                                  passCurrSelectedMeetingConfirmation(
                                                    confirmation
                                                  );
                                                  getBlockedTimeSlot(
                                                    confirmation
                                                  );
                                                "
                                              >
                                                View
                                              </v-btn>
                                              <v-btn
                                                small
                                                text
                                                color="#999999"
                                                @click="
                                                  quitMeeting(confirmation)
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
                                <div
                                  style="
                                    display: flex;
                                    justify-content: flex-end;
                                  "
                                >
                                  <v-btn
                                    align="right"
                                    text
                                    style="
                                      margin-top: 10px;
                                      color: #4b4b4b;
                                      font-size: 16px;
                                      display: flex;
                                      align-items: center;
                                      font-weight: bold;
                                      margin-right: 3vw;
                                    "
                                    @click="confirmationTableView = true"
                                    >Grid View</v-btn
                                  >
                                </div>
                              </v-sheet>
                            </div>
                            <div
                              v-else
                              style="padding:85px; display:flex' align-items: center; justify-content: center"
                            >
                              <span
                                style="
                                  color: #4b4b4b;
                                  font-weight: bold;
                                  font-size: 16px;
                                "
                                >You do not have any meeting confirmation yet.</span
                              >
                            </div>
                            <v-dialog
                              v-model="confirmationTableView"
                              content-class="elevation-0"
                            >
                              <div>
                                <v-container>
                                  <v-card
                                    outlined
                                    color="#FFE4CB"
                                    style="padding: 20px"
                                    :class="`rounded-xl`"
                                  >
                                    <div align="left">
                                      <v-btn
                                        icon
                                        color="#ff9d66"
                                        @click="confirmationTableView = false"
                                      >
                                        <v-icon color="#ff9d66"
                                          >mdi-close</v-icon
                                        >
                                      </v-btn>
                                    </div>

                                    <div v-if="confirmationLength" style="">
                                      <v-sheet
                                        :class="`rounded-xl`"
                                        class="mx-auto"
                                        elevation="0"
                                        max-width="50vw"
                                        style="
                                          background-color: #ffe4cb;
                                          display: flex;
                                          flex-wrap: wrap;
                                          justify-content: center;
                                        "
                                      >
                                        <div
                                          v-for="confirmation in orderedMeetingConfirmation"
                                          :key="confirmation.id"
                                        >
                                          <v-card
                                            :class="`rounded-xl`"
                                            :color="'white'"
                                            class="ma-2"
                                            height="255"
                                            width="300"
                                            style="
                                              padding: 10px;
                                              padding-left: 14px;
                                              margin: 10px;
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
                                                        passCurrSelectedMeetingConfirmation(
                                                          confirmation
                                                        );
                                                        getBlockedTimeSlot(
                                                          confirmation
                                                        );
                                                        confirmationTableView = false;
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
                                        </div>
                                      </v-sheet>
                                    </div>
                                    <div
                                      v-else
                                      style="padding:85px; display:flex' align-items: center; justify-content: center"
                                    >
                                      <span
                                        style="
                                          color: #4b4b4b;
                                          font-weight: bold;
                                          font-size: 16px;
                                        "
                                        >You do not have any meeting confirmation yet.</span
                                      >
                                    </div>
                                  </v-card>
                                </v-container>
                              </div>
                            </v-dialog>
                          </v-card>
                        </v-container>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card>
                </v-container>
              </div>

              <div v-if="currMeetingInv !== null">
                <!-- <v-container :class="`rounded-xl`" style="max-width:1450px !important; width: 80vw;  margin-left: 0.5vw; margin-right:3vw;"> -->
                <v-card
                  outlined
                  color="#FFE4CB"
                  style="max-height: 70vh;min-width:51vw; max-width: 51vw; margin-bottom:20px"
                  :class="`rounded-xl`"
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <v-card-title
                      style="
                        color: #ff9d66;
                        font-weight: bold;
                        padding: 10px;
                        padding-left: 35px !important;
                        font-size: 20px;
                        display: flex;
                        justify-content: flex-start;
                      "
                    >
                      {{ currMeetingInv.title }}</v-card-title
                    >
                    <div
                      style="
                        padding-top: 3px;
                        padding-bottom: 0px !important;
                        display: inline-flex;
                        flex-direction: row-reverse;
                        justify-content: flex-end;
                        padding-left: 12px;
                        padding-right: 12px;
                      "
                    >
                      <div
                        v-for="groupmate in currMeetingInv.groupmates"
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
                          <v-avatar :size="30" style="border: 2px solid #fff">
                            <v-img :src="groupmate.avatar"></v-img
                          ></v-avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                  <v-card
                    outlined
                    color="#ff9d66"
                    style="padding: 20px; max-height: 70vh; min-height:60vh"
                    :class="`rounded-lg`"
                  >
                    <v-card-title style="color: #ffffff">
                      Current Timetable
                    </v-card-title>
                    <v-row>
                      <v-col col="12" md="6">
                        <div class="schedule-vue-sample" style="">
                          <div class="col-md-12 control-section">
                            <div class="content-wrapper" style="">
                              <ejs-schedule
                                :startHour="currMeetingInv.startTime"
                                :endHour="currMeetingInv.endTime"
                                :minDate="currMeetingInv.startDate"
                                :maxDate="currMeetingInv.endDate"
                                class="scheduleHeight"
                                style="
                                  height: 450px !important;
                                  overflow-y: scroll;
                                "
                                id="ScheduleConfirmed"
                                :selectedDate="selectedDate"
                                :eventSettings="eventSettings"
                                :currentView="currentView"
                                :readonly="readonly"
                              ></ejs-schedule>
                            </div>
                            <v-row style="padding-left: 10px; margin-top: 20px;">
                          <v-card-title
                            style="
                              font-weight: bold !important;
                              color: white;
                              display: flex;
                              padding-top: 0px !important;
                              padding-bottom: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              font-size: 18px !important;
                            "
                          >
                            Quick Links:
                          </v-card-title>
                          <v-card-actions>
                            <a href="https://calendar.google.com/calendar/u/0/r" target="_blank">
                              <v-img
                                width="50px"
                                src="@/assets/google_calendar.png"
                              ></v-img>
                            </a>
                            <a
                              href="https://nusmods.com/timetable/sem-1"
                              target="_blank"
                            >
                              <v-img
                                width="50px"
                                src="@/assets/NUSMods_logo.png"
                              ></v-img>
                            </a>
                          </v-card-actions>
                        </v-row>
                          </div>
                        </div>
                      </v-col>
                      <v-divider vertical></v-divider>
                      <v-col col="12" md="6">
                        <v-card-title
                          style="
                            display: flex;
                            padding-bottom: 0px !important;
                            padding-top: 3px !important;
                            padding-left: 10px !important;
                            padding-right: 3px !important;
                            color: white;
                            font-size: 18px !important;
                            font-weight: bold !important;
                            margin-bottom: 10px;
                          "
                        >
                          Import Calendar
                        </v-card-title>

                        <v-card-title
                          style="
                            font-weight: bold !important;
                            color: white;
                            display: flex;
                            padding-top: 0px !important;
                            padding-bottom: 3px !important;
                            padding-left: 10px !important;
                            padding-right: 3px !important;
                            font-size: 18px !important;
                          "
                        >
                          NUSMods:
                        </v-card-title>
                        <v-card-actions>
                          <v-radio-group
                            v-model="importCalendarChoice"
                            class="random-abc"
                          >
                            <v-radio
                              color="white"
                              dark
                              label="Use default calendar"
                              value="existingCalendar"
                            ></v-radio>
                            <v-row style="margin-top: 5px; padding-left: 10px">
                              <v-text-field
                              min-width="10vw"
                              max-width="10vw"
                                outlined
                                dense
                                v-model="existingCalendarURL"
                                id="output"
                                color="white"
                                :disabled="
                                  importCalendarChoice == 'newCalendar' ||
                                  importCalendarChoice == null
                                "
                              >
                              </v-text-field>

                              <v-btn
                                outlined
                                small
                                style="margin: 8px"
                                color="white"
                                :disabled="
                                  importCalendarChoice == 'newCalendar' ||
                                  importCalendarChoice == null || importedCalendar == true
                                "
                                @click="
                                  importCalendar(
                                    link,
                                    currMeetingInv
                                  )
                                "
                              >
                                Import
                              </v-btn>
                            </v-row>

                            <v-radio
                              dark
                              color="white"
                              label="Import a new calendar"
                              value="newCalendar"
                            ></v-radio>
                            <v-row style="margin-top: 5px; padding-left: 10px">
                              <v-text-field
                              min-width="10vw"
                              max-width="10vw"
                                :disabled="
                                  importCalendarChoice == 'existingCalendar' ||
                                  importCalendarChoice == null
                                "
                                color="white"
                                v-model="newCalendarURL"
                                outlined
                                dense
                              ></v-text-field>
                              <v-btn
                                outlined
                                small
                                style="margin: 8px"
                                color="white"
                                :disabled="
                                  importCalendarChoice == 'existingCalendar' ||
                                  importCalendarChoice == null || importedCalendar == true
                                "
                                @click="
                                  importCalendar(
                                    link,
                                    currMeetingInv
                                  ); assignExistingCalendar()
                                "
                              >
                                Import
                              </v-btn>
                            </v-row>
                            <v-row style="margin-top: 5px; padding-left: 10px">
                              <span style="color: white; font-size: 14px; ">Save it as default calendar?</span>
                              <v-switch hide-details :disabled="
                                  importCalendarChoice == 'existingCalendar' ||
                                  importCalendarChoice == null || newCalendarURL == null
                                " style="padding-left: 15px " color="white" v-model="assignExistingCalendarSwitch" 
                              
                              ></v-switch>
                            </v-row>
                          </v-radio-group>
                          <v-dialog
                          v-model="tempImportedCalendar"
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
                              <span style="margin-bottom: 10px; color: #4b4b4b"
                                >Calendar has been imported and uploaded to server. 
                                Click "Done" button after you have imported Google calendar (if any) and added extra timeslot (if any) to confirm that you have finished the importing process. </span
                              >
                              <v-btn
                                text
                                color="#ff9d66"
                                @click="tempImportedCalendar = false"
                                >Close</v-btn
                              >
                            </v-card>
                          </v-sheet>
                        </v-dialog>

                        </v-card-actions>
                        
                        <v-row style="padding-left: 10px">
                          <v-card-title
                            style="
                              font-weight: bold !important;
                              color: white;
                              display: flex;
                              padding-top: 0px !important;
                              padding-bottom: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              font-size: 18px !important;
                            "
                          >
                            Google Calendar:
                          </v-card-title>
                          <v-card-actions>
                            <v-btn
                              outlined
                              color="white"
                              style="padding-left: 10px"
                              @click="isLinkedToGoogle ? importGoogleCalendar() : linkWithGoogle()"
                            >
                              {{isLinkedToGoogle ? "Use synced Google Calendar" : "Login to Google"}}
                            </v-btn>
                            <v-dialog
                          v-model="googleSyncedDialog"
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
                              <span style="margin-bottom: 10px; color: #4b4b4b"
                                >The dates and time of your busy events in Google calendar has been uploaded to the server.
                                Click "Done" button after you have imported NUSMods calendar (if any) and added extra timeslot (if any) to confirm that you have finished the importing process.</span
                              >
                              <v-btn
                                text
                                color="#ff9d66"
                                @click="googleSyncedDialog = false"
                                >Close</v-btn
                              >
                            </v-card>
                          </v-sheet>
                        </v-dialog>
                           
                          </v-card-actions>
                        </v-row>
                        <v-row style="margin-top: 20px; padding-left: 20px; padding-right:20px; margin-botton: 10px;">
                          
                          
                          
                          
                          <v-dialog
                  v-model="dialogExtraSlot"
                  readonly
                  content-class="elevation-0"
                  max-width="700px"
                  min-width="700px"
                  :class="`rounded-lg`"
                >
                  <template
                    v-slot:activator="{ on, attrs }"
                    :class="`rounded-lg`"
                  >
                    
                      <v-btn
                        :class="`rounded-lg`"
                        style="padding-right: 0px; padding-left: 20px; padding-right:20px; margin-bottom:15px;"
                        color="white"
                        block
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          dialogExtraSlot = true;
                          
                        "
                      >
                        Manage Extra Timeslot
                      </v-btn>
                    
                  </template>
                  <v-sheet
                    outlined
                    color="#ff9d66"
                    style="padding: 3px"
                    :class="`rounded-xl`"
                  >
                    <v-card outlined :class="`rounded-xl`">
                      <v-form ref="form">
                        <div>
                          <v-card-title
                            :class="`rounded-xl`"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <span style="color: #ff9d66" class="headline"
                              >Add Extra Occupied Timeslot</span
                            >

                           
                          </v-card-title>
                          
                          <div >
                            <v-card-text>
                              <v-container :class="`rounded-xl`">
                                <v-row>
                                
                                 
                                  
                                  <v-col
                                    cols="12"
                                    :class="`rounded-xl`"
                                    style="padding-bottom: 12px"
                                  >
                                    <v-menu
                                      required
                                      v-model="menuExtraDate"
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
                                          style="padding-bottom: 20px"
                                          required
                                          
                                          v-model="displayExtraDate"
                                          label="Date of the extra timeslot*"
                                          prepend-icon="mdi-calendar"
                                          v-bind="attrs"
                                          v-on="on"
                                          color="#ff9d66"
                                        ></v-text-field>
                                      </template>
                                      <v-date-picker
                                        color="#ff9d66"
                                        :max="currMeetingInv.displayMeetingDateRange.substr(13)"
                                        :min="currMeetingInv.displayMeetingDateRange.substr(0,10)"
                                        
                                        v-model="meetingExtraDate"
                                      >
                                      
                                        <v-btn
                                          outlined
                                          color="#ff9d66"
                                          @click="menuExtraDate = false"
                                        >
                                          Close
                                        </v-btn>
                                      </v-date-picker>
                                    </v-menu>
                                    <v-row style="padding-top: 5px">
                                      <v-col
                                        cols="12"
                                        md="6"
                                        style="display: flex"
                                      >
                                        <v-menu
                                          ref="menuExtraStartTime"
                                          v-model="menuExtraStartTime"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="meetingExtraStartTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              v-model="meetingExtraStartTime"
                                              label="Start*"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                              :rules="[
                                                (v) =>
                                                  !!v ||
                                                  'Start Time is required',
                                              ]"
                                            ></v-text-field>
                                          </template>
                                          <v-time-picker
                                            scrollable
                                            v-if="menuExtraStartTime"
                                            v-model="meetingExtraStartTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            :max="meetingExtraEndTime"
                                            @click:minute="
                                              $refs.menuExtraStartTime.save(
                                                meetingExtraStartTime
                                              )
                                            "
                                          ></v-time-picker>
                                        </v-menu>
                                      </v-col>
                                      <v-col cols="12" md="6">
                                        <v-menu
                                          ref="menuExtraEndTime"
                                          v-model="menuExtraEndTime"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="meetingExtraEndTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-text-field
                                              v-model="meetingExtraEndTime"
                                              label="End*"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                              :rules="[
                                                (v) =>
                                                  !!v ||
                                                  'Meeting End Time is required',
                                              ]"
                                            ></v-text-field>
                                          </template>
                                          <v-time-picker
                                            scrollable
                                            v-if="menuExtraEndTime"
                                            :min="meetingExtraStartTime"
                                            v-model="meetingExtraEndTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            @click:minute="
                                              $refs.menuExtraEndTime.save(
                                                meetingExtraEndTime
                                              )
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
                             {{meetingExtraDate}}
                             {{meetingExtraStartTime}}
                             {{meetingExtraEndTime}}
                              <v-btn
                                color="#ff9d66"
                                :disabled="this.meetingExtraDate == null"
                                @click="addTempExtraTimeslot()"
                                text
                                
                              >
                                Add
                              </v-btn>
                            </v-card-actions>
                          </div>

                          <v-divider></v-divider>
                          <div>
                          <v-card-title
                            :class="`rounded-xl`"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <span style="color: #ff9d66" 
                              >Extra timeslot added</span
                            >
                            
                            

                           
                          </v-card-title>
                          <div v-if="this.tempTimeslots.length !== 0">
                    
                          <div v-for="timeslot in orderedTimeslots" :key="timeslot.id">
                            
                            <span>{{timeslot.start.substr(0,10)}}    {{timeslot.start.substr(10)}} - {{timeslot.end.substr(10)}}</span>
                            <v-btn icon color="#ff9d66" @click="removeTimeslot(timeslot)"><v-icon>mdi-close</v-icon></v-btn>

                          </div>
                          </div>
                          <div v-else>
                            <span>No any extra timeslot added.</span>

                          </div>
                          </div>

                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                justify="center"
                                color="#ff9d66"
                                text
                                @click="
                                  dialogExtraSlot = false;
                                  clearTimeSlot();
                                "
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                color="#ff9d66"
                                :disabled="
                                this.tempTimeslots.length == 0
                                  
                                "
                                text
                                @click="
                                  dialogExtraSlot = false;
                                  addTimeSlot();
                                "
                              >
                                Save
                              </v-btn>
                            </v-card-actions>

                          
                        </div>
                        
                      </v-form>
                    </v-card>
                  </v-sheet>
                </v-dialog>
                         

                          </v-row>
<v-dialog
                          v-model="savedTimeSlot"
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
                              <span style="margin-bottom: 10px; color: #4b4b4b"
                                >Additional occupied timeslots have been added successfully and uploaded to the server.
                                Click "Done" button after you have imported NUSMods Calendar (if any) and Google calendar (if any) to confirm that you have finished the importing process.</span
                              >
                              <v-btn
                                text
                                color="#ff9d66"
                                @click="savedTimeSlot = false"
                                >Close</v-btn
                              >
                            </v-card>
                          </v-sheet>
                        </v-dialog>
                           
                        
                        <v-row style="display:flex; justify-content:center; margin-top: 20px; padding-left: 10px; margin-botton: 10px;">
                             <v-btn color="white" :class="`elevation-0`" @click="doneMeetingInv(); doneMeetingDialog = true">
                               <span style="color:#ff9d66; font-weight:bold" >Done and confirm</span></v-btn>
                             </v-row>
                              <v-dialog
                          v-model="doneMeetingDialog"
                          content-class="elevation-0"
                          max-width="600px"
                          min-height="300px"
                          readonly
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
                              <span style="margin-bottom: 10px; color: #4b4b4b"
                                >Import process has been done. The meeting will be a pending meeting waiting for other groupmates to complete the import process.
                                It will be a meeting confirmation otherwise waiting for confirming the actual meeting date and time.</span
                              >
                              <v-btn
                                text
                                color="#ff9d66"
                                @click=" dispatchFunctions()"
                                >Close</v-btn
                              >
                            </v-card>
                          </v-sheet>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card>
                <!-- </v-container> -->
              </div>
              <div v-if="currMeetingPending !== null">
                <!-- <v-container :class="`rounded-xl`" style="max-width:1450px !important; width: 80vw;  margin-left: 0.5vw; margin-right:3vw;"> -->
                <v-card
                  outlined
                  color="#FFE4CB"
                  style="max-height: 70vh; min-width:51vw; max-width: 51vw; margin-bottom:20px"
                  :class="`rounded-xl`"
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <v-card-title
                      style="
                        color: #ff9d66;
                        font-weight: bold;
                        padding: 10px;
                        padding-left: 35px !important;
                        font-size: 20px;
                        display: flex;
                        justify-content: flex-start;
                      "
                    >
                      {{ currMeetingPending.title }}</v-card-title
                    >
                    <div
                      style="
                        padding-top: 3px;
                        padding-bottom: 0px !important;
                        display: inline-flex;
                        flex-direction: row-reverse;
                        justify-content: flex-end;
                        padding-left: 12px;
                        padding-right:12px;
                      "
                    >
                      <div
                        v-for="groupmate in currMeetingPending.groupmates"
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
                          <v-avatar :size="30" style="border: 2px solid #fff">
                            <v-img :src="groupmate.avatar"></v-img
                          ></v-avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                  <v-card
                    outlined
                    color="#ff9d66"
                    style="padding: 20px; max-height: 70vh; min-height:60vh"
                    :class="`rounded-lg`"
                  >
                    <v-card-title style="color: #ffffff">
                      Current Timetable
                    </v-card-title>
                    <v-row>
                      <v-col col="12" md="6">
                        <div class="schedule-vue-sample" style="">
                          <div class="col-md-12 control-section">
                            <div class="content-wrapper" style="">
                              <ejs-schedule
                                :startHour="currMeetingPending.startTime"
                                :endHour="currMeetingPending.endTime"
                                :minDate="currMeetingPending.startDate"
                                :maxDate="currMeetingPending.endDate"
                                class="scheduleHeight"
                                style="
                                  height: 450px !important;
                                  overflow-y: scroll;
                                "
                                id="ScheduleConfirmed"
                                :selectedDate="selectedDate"
                                :eventSettings="eventSettings"
                                :currentView="currentView"
                                :readonly="readonly"
                                :allowMultiple="allowMultiple"
                              ></ejs-schedule>
                            </div>
                            <v-row style="padding-left: 10px; margin-top: 20px;">
                          <v-card-title
                            style="
                              font-weight: bold !important;
                              color: white;
                              display: flex;
                              padding-top: 0px !important;
                              padding-bottom: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              font-size: 18px !important;
                            "
                          >
                            Quick Links:
                          </v-card-title>
                          <v-card-actions>
                            <a href="https://calendar.google.com/calendar/u/0/r" target="_blank">
                              <v-img
                                width="50px"
                                src="@/assets/google_calendar.png"
                              ></v-img>
                            </a>
                            <a
                              href="https://nusmods.com/timetable/sem-1"
                              target="_blank"
                            >
                              <v-img
                                width="50px"
                                src="@/assets/NUSMods_logo.png"
                              ></v-img>
                            </a>
                          </v-card-actions>
                        </v-row>
                          </div>
                        </div>
                      </v-col>
                      <v-divider vertical></v-divider>
                      <v-col col="12" md="6">
                        <v-card-title
                          style="
                            display: flex;
                            padding-bottom: 0px !important;
                            padding-top: 3px !important;
                            padding-left: 10px !important;
                            padding-right: 3px !important;
                            color: white;
                            font-size: 18px !important;
                            font-weight: bold !important;
                            margin-bottom: 20px;
                          "
                        >
                          <v-icon color="white">check_circle_outline</v-icon
                          ><span style="margin-left: 20px">
                            Imported calendar:</span
                          >
                        </v-card-title>
                        <div
                          style="
                            display: flex;
                            padding-bottom: 0px !important;
                            padding-top: 3px !important;
                            padding-left: 10px !important;
                            padding-right: 3px !important;
                            color: white;
                            font-size: 16px !important;
                            font-weight: bold !important;
                        
                          "
                          v-for="groupmate in currMeetingPending.confirmed_groupmates"
                          :key="groupmate.id"
                        >
                          <v-row
                            style="
                              display: flex;
                              padding-bottom: 0px !important;
                              padding-top: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              color: white;
                              font-size: 16px !important;
                              font-weight: bold !important;
                              margin-bottom: 20px;
                              align-items: center;
                            "
                          >
                            <v-avatar size="40"
                              ><v-img :src="groupmate.avatar"></v-img
                            ></v-avatar>
                            <span style="margin-left: 10px">{{
                              groupmate.name
                            }}</span>
                          </v-row>
                        </div>

                        <v-card-title
                          style="
                            display: flex;
                            padding-bottom: 0px !important;
                            padding-top: 3px !important;
                            padding-left: 10px !important;
                            padding-right: 3px !important;
                            color: white;
                            font-size: 18px !important;
                            font-weight: bold !important;
                            margin-bottom: 20px;
                          "
                        >
                          <v-icon color="white">highlight_off</v-icon
                          ><span style="margin-left: 20px">
                            Have not imported calendar:</span
                          >
                        </v-card-title>
                        <div
                          style="
                            display: flex;
                            padding-bottom: 0px !important;
                            padding-top: 3px !important;
                            padding-left: 10px !important;
                            padding-right: 3px !important;
                            color: white;
                            font-size: 16px !important;
                            font-weight: bold !important;
                            
                          "
                          v-for="groupmate in currMeetingPending.invited_groupmates"
                          :key="groupmate.id"
                        >
                          <v-row
                            style="
                              display: flex;
                              padding-bottom: 0px !important;
                              padding-top: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              color: white;
                              font-size: 16px !important;
                              font-weight: bold !important;
                              margin-bottom: 20px;
                              align-items: center;
                            "
                          >
                            <v-avatar size="40"
                              ><v-img :src="groupmate.avatar"></v-img
                            ></v-avatar>
                            <span style="margin-left: 10px">{{
                              groupmate.name
                            }}</span>
                          </v-row>
                        </div>
                        
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card>
                <!-- </v-container> -->
              </div>
              <div v-if="currMeetingConfirmation !== null">
                <!-- <v-container :class="`rounded-xl`" style="max-width:1450px !important; width: 80vw;  margin-left: 0.5vw; margin-right:3vw;"> -->
                <v-card
                  outlined
                  color="#FFE4CB"
                  style="max-height: 70vh;min-width:51vw; max-width: 51vw; margin-bottom:20px"
                  :class="`rounded-xl`"
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <v-card-title
                      style="
                        color: #ff9d66;
                        font-weight: bold;
                        padding: 10px;
                        padding-left: 35px !important;
                        font-size: 20px;
                        display: flex;
                        justify-content: flex-start;
                      "
                    >
                      {{ currMeetingConfirmation.title }}</v-card-title
                    >
                    <div
                      style="
                        padding-top: 3px;
                        padding-bottom: 0px !important;
                        padding-right: 12px;
                        display: inline-flex;
                        flex-direction: row-reverse;
                        justify-content: flex-end;
                        padding-left: 12px;
                      "
                    >
                      <div
                        v-for="groupmate in currMeetingConfirmation.groupmates"
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
                          <v-avatar :size="30" style="border: 2px solid #fff">
                            <v-img :src="groupmate.avatar"></v-img
                          ></v-avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                  <v-card
                    outlined
                    color="#ff9d66"
                    style="padding: 20px; max-height: 70vh; min-height:60vh"
                    :class="`rounded-lg`"
                  >
                    <v-card-title style="color: #ffffff">
                      Current Timetable
                    </v-card-title>
                    <v-row>
                      <v-col col="12" md="7">
                        <div class="schedule-vue-sample" style="">
                          <div class="col-md-12 control-section">
                            <div class="content-wrapper" style="">
                              <!-- <hi></hi> -->
                              <ejs-schedule
                                :timeScale="timeScale"
                                class="scheduleHeight"
                                style="
                                  height: 450px !important;
                                  overflow-y: scroll;
                                "
                                id="ScheduleConfirmed"
                                :startHour="currMeetingConfirmation.startTime"
                                :endHour="currMeetingConfirmation.endTime"
                                :minDate="currMeetingConfirmation.startDate"
                                :maxDate="currMeetingConfirmation.endDate"
                                :selectedDate="selectedDate"
                                :eventSettings="eventSettings"
                                :currentView="currentView"
                                :readonly="readonly"
                                :showQuickInfo="readonly"
                                :cellDoubleClick="onDoubleClick"
                                :cellClick="onCellClick"
                                :select="getSelectedCellTimes"
                              >
                              </ejs-schedule>
                            </div>
                            <v-row style="padding-left: 10px; margin-top: 20px;">
                          <v-card-title
                            style="
                              font-weight: bold !important;
                              color: white;
                              display: flex;
                              padding-top: 0px !important;
                              padding-bottom: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              font-size: 18px !important;
                            "
                          >
                            Quick Links:
                          </v-card-title>
                          <v-card-actions>
                            <a href="https://calendar.google.com/calendar/u/0/r" target="_blank">
                              <v-img
                                width="50px"
                                src="@/assets/google_calendar.png"
                              ></v-img>
                            </a>
                            <a
                              href="https://nusmods.com/timetable/sem-1"
                              target="_blank"
                            >
                              <v-img
                                width="50px"
                                src="@/assets/NUSMods_logo.png"
                              ></v-img>
                            </a>
                          </v-card-actions>
                        </v-row>
                          </div>
                        </div>
                      </v-col>
                      <v-divider vertical></v-divider>
                      <v-col col="12" md="5">
                        <div
                          style="
                            min-height: 38vh;
                            max-height: 38vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                          "
                        >
                        <div v-if="this.$store.state.user.uid == currMeetingConfirmation.creatorID">
                          <v-row style="padding-left: 10px">
                            <v-card-title
                              style="
                                font-weight: bold !important;
                                color: white;
                                display: flex;
                                padding-top: 0px !important;
                                padding-bottom: 3px !important;
                                padding-left: 10px !important;
                                padding-right: 3px !important;
                                font-size: 22px !important;
                              "
                            >
                              Selected Timeslot:
                            </v-card-title>
                            <br />
                          </v-row>
                          <v-row style="padding-left: 10px">
                            <div v-if="displaySelectedStartTime">
                              <v-card-text
                                style="
                              font-weight: bold !important;
                              color: white;
                              display: flex;
                              padding-top: 0px !important;
                              padding-bottom: 3px !important;
                              padding-left: 10px !important;
                              padding-right: 3px !important;
                              font-size: 18px !important;
                              flex-direction: column !important
                              justify-content: flex-start;
                            "
                              >
                                <div
                                  v-if="
                                    displaySelectedTimeDifference !==
                                    currMeetingConfirmation.timeLength *
                                      60 *
                                      60 *
                                      1000
                                  "
                                >
                                  <span
                                    style="
                                      display: flex;
                                      justify-content: flex-start;
                                      margin-bottom: 10px;
                                      font-size: 16px;
                                      font-weight: bold;
                                      text-align: left;
                                    "
                                  >
                                    <v-icon
                                      style="margin-right: 10px; color: white"
                                      >error_outline</v-icon
                                    >
                                    Duration is not the same as specified
                                    previously:
                                  </span>
                                  <span
                                    style="
                                      display: flex;
                                      justify-content: flex-start;
                                      margin-bottom: 10px;
                                      font-size: 16px;
                                      font-weight: normal;
                                      text-align: left;
                                    "
                                  >
                                    Current duration:
                                    {{
                                      displaySelectedTimeDifference /
                                      1000 /
                                      60 /
                                      60
                                    }}
                                    hrs
                                  </span>
                                  <span
                                    style="
                                      display: flex;
                                      justify-content: flex-start;
                                      margin-bottom: 10px;
                                      font-size: 16px;
                                      font-weight: normal;
                                      text-align: left;
                                    "
                                  >
                                    Duration specified:
                                    {{ currMeetingConfirmation.timeLength }}
                                    hrs</span
                                  >
                                  <br />
                                </div>

                                <span
                                  style="
                                    display: flex;
                                    justify-content: flex-start;
                                    margin-bottom: 10px;
                                  "
                                  >Start:
                                  {{
                                    displaySelectedStartTime.toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                      }
                                    )
                                  }},
                                  {{
                                    displaySelectedStartTime.toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  }}</span
                                >
                                <span
                                  style="
                                    display: flex;
                                    justify-content: flex-start;
                                    margin-bottom: 10px;
                                  "
                                  >End:
                                  {{
                                    displaySelectedStartTime.toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                      }
                                    )
                                  }},
                                  {{
                                    displaySelectedEndTime.toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  }}
                                </span>
                              </v-card-text>
                              <div v-if="currMeetingConfirmation.venue == 'Zoom'">
                              <v-card-actions style="display:flex; flex-direction:column">
                                <v-checkbox dark outlined v-model="automateZoomLink" @change="checkZoom()" label="Generate zoom link automatically"
                                  />
                                <span v-if="automateZoomLink == true && linkedToZoom == false " style="color:white"> You have not linked to zoom yet</span>
                                <v-btn v-if="automateZoomLink == true && linkedToZoom == false" text small color="white" @click="redirectToZoomLogin()">Click here to link with zoom</v-btn>
                              </v-card-actions>
                              </div>
                              <v-card-actions>
                                <v-btn dark outlined @click="confirmMeeting() ; confirmedMeetingDialog = true " :disabled="(automateZoomLink == true && linkedToZoom == false)"
                                  >Confirm</v-btn
                                >
                              </v-card-actions>
                              <v-dialog
                          v-model="confirmedMeetingDialog"
                          content-class="elevation-0"
                          max-width="600px"
                          min-height="300px"
                          readonly
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
                              <span style="margin-bottom: 10px; color: #4b4b4b"
                                >Meeting has been confirmed. It is added to the meeting calendar and meeting list on the left.</span
                              >
                              <v-btn
                                text
                                color="#ff9d66"
                                @click="dispatchFunctions()"
                                >Close</v-btn
                              >
                            </v-card>
                          </v-sheet>
                        </v-dialog>
                           
                        
                            </div>
                            <div v-else>
                              <v-card-text
                                style="
                                  font-weight: bold !important;
                                  color: white;
                                  display: flex;
                                  padding-top: 0px !important;
                                  padding-bottom: 3px !important;
                                  padding-left: 10px !important;
                                  padding-right: 3px !important;
                                  font-size: 18px !important;
                                "
                              >
                                <span
                                  style="
                                    display: flex;
                                    justify-content: flex-start;
                                  "
                                >
                                  Have not selected any timeslot yet
                                </span>
                              </v-card-text>
                            </div>
                          </v-row>
                       
                       
                        </div>
                        <div v-else>
                          <v-row style="padding-left:10px">
                            <span style="color:white; font-weight:bold">Only the meeting creator can confirm the meeting dates and time</span>
                          </v-row>
                        </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card>
                <!-- </v-container> -->
              </div>
              <div
                v-if="
                  currMeetingInv == null &&
                  currMeetingConfirmation == null &&
                  currMeetingPending == null
                "
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: column;
                  margin-top: 15vh; margin-bottom: 15vh;
                "
              >
                <v-img
                  src="@/assets/meeting_cartoon.png"
                  width="150"
                  style="margin: 30px; "
                ></v-img>
                <span style="font-weight: bold; font-size: 18px">
                  You have not selected any meeting invitation, pending meeting
                  or meeting confirmation yet
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../main.ts";
// import BlockEvent from "../components/block-event.vue"
import _ from "lodash";
import { findCommonTime, findGoogleCommonTime, createZoomMeeting, isLinkedToZoom } from "../services/firebaseService.ts";
import axios from "axios";
import Vue from "vue";
import { extend } from "@syncfusion/ej2-base";
// import { getBlockedTimeSlot } from '../services/dataSource';
import {
  Schedule,
  SchedulePlugin,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  TimelineViews,
  TimelineMonth,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-vue-schedule";
Vue.use(SchedulePlugin);

export default {
  name: "Meeting.vue",
  // components:{
  //   BlockEvent
  // },
  // props: ['eventSettingsList'],
  data: () => ({
    dialogExtraSlot: false,
    calOrList: undefined,
    timeScale: {
      enable: true,
      interval: 60,
      slotCount: 2,
    },
    selectedDate: new Date(),
    readonly: false,
    selectedTarget: null,
    eventSettings: {},
    currentView: "Week",
    dialog: false,
    nameRules: [(v) => !!v || "Todo title is required"],
    dialogEdit: false,
    myDeadline: new Date().toISOString().substr(0, 10),
    menu: [],
    modal: false,
    menu2: false,
    menu3: false,
    menu4: false,
    timeMenu: false,
    value: 0,
    myTodo: "",
    errors: "",
    complete: false,
    myNote: "",
    myProject: null,
    display: {},
    switchValue: false,
    myDeadlineTime: "00:00",
    displayDeadline: "Deadline",
    finalDeadline: new Date().toISOString().substr(0, 10),
    menuEdit: {},
    valid: true,
    time: [],
    menuAdd: false,
    menuExtraDate: false,
    menuExtraStartTime: false,
    menuExtraEndTime: false,
    meetingExtraDate: null,
    meetingExtraStartTime: "00:00",
    meetingExtraEndTime: "23:59",
    dateSwitchValue: false,
    meetingVenue: "",
    tempGroupmates: [],
    navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "check_circle" },
      { title: "Project", href: "./project", icon: "work" },
      { title: "Meeting", href: "./meeting", icon: "groups" },
      { title: "Profile", href: "./profile", icon: "account_circle" },
    ],
    projects: [],
    input: {
      task: "", // or pre-fill with other default value like `lorem`
    },
    groupmatesChips: [],
    oldGroupmatesChips: [],
    varPIC: [],
    varPICId: [],
    groupmatesChipsId: [],
    meetingTitle: "",
    meetingProject: null,
    meetingDuration: 0,
    meetingSlide: null,
    meetingDateRange: [],
    meetingStartTime: "00:00",
    meetingEndTime: "23:59",
    menuStartTime: false,
    menuEndTime: false,
    tab: null,
    invitationsSlide: null,
    meetingCalendar: [],
    notes: [],
    automateZoomLink: false,
    linkedToZoom: null,

    displayMeetingCalendar: new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
    currMeetingInv: null,
    currMeetingPending: null,
    currMeetingConfirmation: null,
    importCalendarChoice: null,
    newCalendarURL: null,
    existingCalendarURL: null,
    pendingSlide: null,
    confirmationSlide: null,
    cellDate: null,
    cellStartTime: null,
    cellEndTime: null,
    selectedStartTime: null,
    selectedEndTime: null,
    meetingTypeDetails: "",
    othersSpecify: "",
    offlineSpecify: "",
    newMeetingType: null,
    tempNewMeetingType: null,
    meetingSubmit: false,
    invitationTableView: false,
    pendingTableView: false,
    confirmationTableView: false,
    assignExistingCalendarSwitch: false,
    popupMeeting: {},
    currSelectedPopupMeeting: null,
    tempUpdateMeetingLink: "",
    updateMeetingLink: "",
    dialogNewLink: {},
    dialogNewLink2: {},
    popupMeeting2: {},
    tempTimeslots: [],
    savedTimeSlot: false,
    importedCalendar: false,
    tempImportedCalendar: false,
    tempImportStartDate: null,
    tempImportEndDate: null,
    tempImportLink: null,
    isLinkedToGoogle: false,
    googleSyncedDialog: false,
    confirmedMeetingDialog: false,
    doneMeetingDialog: false,
  }),

  // created: async function(){
  //           await getBlockedTimeSlot().then(result => this.eventSettings = { dataSource: extend([], result, null, true) });
  //       },
  provide: {
    schedule: [Day, Week, WorkWeek, Month, Agenda, Resize],
  },

  computed: {
    displayMeetingDateRange() {
      if (this.meetingDateRange.length == 0) {
        if (this.newMeetingType == "import") {
          return "Meeting Date Range";
        } else {
          return "Meeting Date";
        }
      } else {
        if (this.meetingDateRange[0] > this.meetingDateRange[1]) {
          let newMeetingDateRange = [];
          newMeetingDateRange.push(this.meetingDateRange[1]);
          newMeetingDateRange.push(this.meetingDateRange[0]);
          return newMeetingDateRange.join("~");
        }
        return this.meetingDateRange.join(" ~ ");
      }
    },

     displayExtraDate() {
      if (this.meetingExtraDate == null) {
        return "Date of the extra timeslot"
      } else {
        return this.meetingExtraDate
      }
    },

    displaySelectedStartTime() {
      return this.selectedStartTime;
    },

    displaySelectedEndTime() {
      return this.selectedEndTime;
    },

    displaySelectedTimeDifference() {
      const Difference_In_Time =
        this.selectedEndTime.getTime() - this.selectedStartTime.getTime();
      console.log(Difference_In_Time);
              console.log(this.selectedStartTime.toISOString())

      return Difference_In_Time;
    },

    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1);
    },
    invitationLength() {
      return this.$store.state.meetingInvitations.length;
    },
    pendingLength() {
      return this.$store.state.meetingPendings.length;
    },
    confirmationLength() {
      return this.$store.state.meetingConfirmations.length;
    },
    orderedConfirmedMeetings: function () {
      return _.orderBy(
        this.$store.state.confirmedMeetings,
        ["projectTitle", "selectedStartDate", "selectedEndDate"],
        ["asc", "asc", "asc"]
      );
    },
    orderedMeetingInv: function () {
      return _.orderBy(
        this.$store.state.meetingInvitations,
        ["startDate", "projectTitle", "endDate"],
        ["asc", "asc", "asc"]
      );
    },

    orderedMeetingPending: function () {
      return _.orderBy(
        this.$store.state.meetingPendings,
        ["startDate", "projectTitle", "endDate"],
        ["asc", "asc", "asc"]
      );
    },

    orderedMeetingConfirmation: function () {
      return _.orderBy(
        this.$store.state.meetingConfirmations,
        ["startDate", "projectTitle", "endDate"],
        ["asc", "asc", "asc"]
      );
    },

    orderedTimeslots: function(){
      return _.orderBy(this.tempTimeslots, ["start","end"])
    },

    remaining() {
      return this.$store.getters.remaining;
    },
    totalTask() {
      return this.$store.getters.totalTask;
    },
    totalTaskDone() {
      return this.$store.getters.totalTaskDone;
    },
    totalTaskProgress() {
      const progress = this.$store.getters.totalTaskProgress;
      console.log(progress);
      if (progress == null || progress == undefined || isNaN(progress)) {
        return 0;
      } else {
        return progress;
      }
    },
  },

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = !!user;
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
    this.$router.Meeting = this;

    this.dialog = this.$route.params.dialog;
    // this.$store.dispatch('getTasks');
    // async function getBlockedTimeSlot(meeting){
    //   this.getBlockedTimeSlot(meeting).then(result => this.eventSettings = { dataSource: extend([], result, null, true) });

    // }
    // async function getBlockedTimeSlot(meeting) {
    //   this.getBlockedTimeSlot(meeting).then(
    //     (result) =>
    //       (this.eventSettings = { dataSource: extend([], result, null, true) })
    //   );
    // }
  },

  mounted() {
    console.log(this.$store.state.confirmedMeetings);

    // this.meetingCalendar = this.$store.state.confirmedMeetings.map((meeting) => {
    //   console.log(this.$store.state.confirmedMeetings)
    //   console.log(meeting)
    //   if (meeting !== null ) {

    //     const currLocalDate = meeting.selectedStartDate.toDate().toLocaleDateString().substr(0, 10);
    //     const currYear = currLocalDate.substr(6);
    //     const currMonth = currLocalDate.substr(3, 2);
    //     const currDate = currLocalDate.substr(0, 2);
    //     console.log(currLocalDate);
    //     console.log(currYear);
    //     console.log(currMonth);
    //     console.log(currDate);
    //     const newDate = currYear + "-" + currMonth + "-" + currDate;
    //     console.log(newDate);
    //     return newDate;
    //   }
    // });
    // this.$store.dispatch("getTasks");
  },

  methods: {
     redirectToZoomLogin() {
      window.location.href = 
      'https://zoom.us/oauth/authorize?response_type=code&client_id=5NM6HEpT4CWNO0zQ9s0fg&redirect_uri=http://localhost:5001/timelinus-2021/asia-east2/zoomAuth&state={"client":"web", "id": "' + this.$store.state.user.uid + '"}';
    },
    
    dispatchFunctions(){
      if(this.doneMeetingDialog == true){
      this.doneMeetingDialog = false; 
      this.$store.dispatch("getMeetingInvitations");
      this.$store.dispatch("getMeetingPendings");
      this.$store.dispatch("getMeetingConfirmations");
      this.currMeetingInv = null;
      this.importedCalendar = false;
      this.tempImportedCalendar = false;
      this.savedTimeSlot = false
      } else { 
      this.confirmedMeetingDialog = false;
      this.currMeetingConfirmation = null; 
      this.$store.dispatch("getConfirmedMeeting")
      this.$store.dispatch("getMeetingConfirmations")
      this.$store.dispatch("assignMeetingCalendar")
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      this.$store.dispatch("assignTodoDashboardCalendar");
      }


      

    },

    async checkZoom(){
      if(this.automateZoomLink == true){
        this.linkedToZoom = await isLinkedToZoom(this.$store.state.user.uid)

      }
      console.log(this.automateZoomLink)
      console.log(this.linkedToZoom)
    },

    doneMeetingInv(){
      db.collection('meeting').doc(this.currMeetingInv.id).update({
        invitations: firebase.firestore.FieldValue.arrayRemove(db.collection('user').doc(this.$store.state.user.uid))
      })
      db.collection('meeting').doc(this.currMeetingInv.id).update({
        confirmedInvitations: firebase.firestore.FieldValue.arrayUnion(db.collection('user').doc(this.$store.state.user.uid))
      })
     
      
    },

    removeTimeslot: function(timeslot){
              var index = _.findIndex(this.tempTimeslots, timeslot);
              this.tempTimeslots.splice(index, 1);
            },

    async addTimeSlot(){
      for(let i=0; i<this.tempTimeslots.length; i++){
        
        await db.collection('meeting').doc(this.currMeetingInv.id).update({
        timeslot: firebase.firestore.FieldValue.arrayUnion(
          {start: firebase.firestore.Timestamp.fromDate(
          new Date(this.tempTimeslots[i].start.substr(0,10) + "T" + this.tempTimeslots[i].start.substr(10) + ":00+08:00")
          ),
          end: firebase.firestore.Timestamp.fromDate(
          new Date(this.tempTimeslots[i].end.substr(0,10) + "T" + this.tempTimeslots[i].end.substr(10) + ":00+08:00")
          )}
        )
      })
      }
      this.getBlockedTimeSlot(this.currMeetingInv)
      this.clearTimeSlot()
      this.savedTimeSlot = true
      
    },

    clearTimeSlot(){
      this.tempTimeslots = []
      this.meetingExtraStartTime = "00:00"
      this.meetingExtraEndTime = "23:59"
      this.meetingExtraDate = null
      

    },

    addTempExtraTimeslot(){
      this.tempTimeslots.push({
        start: this.displayExtraDate + this.meetingExtraStartTime,
        end: this.displayExtraDate + this.meetingExtraEndTime
      })

      console.log("meetingExtraStartTime")
      this.meetingExtraStartTime = "00:00"
      this.meetingExtraEndTime = "23:59"
      this.meetingExtraDate = null
      this.orderedTimeslots()


      
    },
    closePopUpMeeting(){
      this.$store.dispatch("getConfirmedMeeting")
      this.currSelectedPopupMeeting = null;
      this.tempUpdateMeetingLink = "";
      this.updateMeetingLink = "";
    },
    async passinNewMeetingLink() {
      this.updateMeetingLink = this.tempUpdateMeetingLink
      await db.collection("meeting").doc(this.currSelectedPopupMeeting.id).update({
        meetingLink: this.updateMeetingLink,
      });
      this.tempUpdateMeetingLink = ""
    },

    clearUpdateMeetingLink(){
      this.tempUpdateMeetingLink = ""
    },

    popupMeetingDetails(meeting){
      console.log(this.calOrList)
        this.currSelectedPopupMeeting = meeting;
        
    },
    
    async checkExistingCalendar(){
      const user = await db.collection('user').doc(this.$store.state.user.uid).get()
      this.isLinkedToGoogle = (user.get("googleRefreshToken") != null)
      console.log(user)
      const calendar = user.get("calendar") ? user.get("calendar") : null
      console.log(calendar)
      if (calendar !== null){
        this.existingCalendarURL = calendar
      }
    },

    async assignExistingCalendar(){
      if(this.assignExistingCalendarSwitch == true){
        db.collection('user').doc(this.$store.state.user.uid).update({
          calendar: this.newCalendarURL
        })
      }
    },

    changeSubmitOnClose() {
      this.meetingSubmit = false;
    },

    changeMeetingCreationType() {
      if (this.newMeetingType == "import") {
        this.newMeetingType = "direct";
      } else if (this.newMeetingType == "direct") {
        this.newMeetingType = "import";
      }
    },
    checkTodayMeetingLength() {
      for (let i = 0; i < this.$store.state.confirmedMeetings.length; i++) {
        const data = this.$store.state.confirmedMeetings[i];

        const currLocalDate = data.selectedStartDate
          .toDate()
          .toLocaleDateString()
          .substr(0, 10);
        const currYear = currLocalDate.substr(6);
        const currMonth = currLocalDate.substr(3, 2);
        const currDate = currLocalDate.substr(0, 2);
        console.log(currLocalDate);
        console.log(currYear);
        console.log(currMonth);
        console.log(currDate);
        const newDate = currYear + "-" + currMonth + "-" + currDate;
        if (newDate == this.displayMeetingCalendar) {
          return true;
        }
      }
      return false;
    },
    checkMeetingDate(meeting) {
      const currLocalDate = meeting.selectedStartDate
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      const newDate = currYear + "-" + currMonth + "-" + currDate;
      if (newDate == this.displayMeetingCalendar) {
        return true;
      }

      return false;
    },
    async confirmMeeting() {
     if(this.automateZoomLink == true && this.linkedToZoom == true){
       const Difference_In_Time =
        this.selectedEndTime.getTime() - this.selectedStartTime.getTime()
        console.log(Difference_In_Time)
        console.log(this.selectedStartTime.toISOString())
      const zoomLink = await createZoomMeeting(this.selectedStartTime.toISOString(), Difference_In_Time/60/1000, this.currMeetingConfirmation.id, this.$store.state.user.uid )
     }
      db.collection("meeting")
        .doc(this.currMeetingConfirmation.id)
        .update({
          selectedStartDate: firebase.firestore.Timestamp.fromDate(
            this.selectedStartTime
          ),
          selectedEndDate: firebase.firestore.Timestamp.fromDate(
            this.selectedEndTime
          ),
          isConfirmed: true,
        });
      console.log(this.currMeetingConfirmation);
      

    },
    meetingMinDate(meeting) {
      return meeting.startDate;
    },

    meetingMaxDate(meeting) {
      return meeting.endDate;
    },

    mouseupHandler(e) {
      var target = e.target.classList.contains("e-work-cells");
      var selectedCells =
        this.scheduleObj.element.querySelectorAll(".e-selected-cell");
      if (selectedCells.length > 1 && target) {
        var activeCellsData = this.scheduleObj.getCellDetails(
          this.scheduleObj.getSelectedElements()
        );
        this.scheduleObj.openEditor(activeCellsData, "Add");
      }
      console.log(selectedCells);
    },
    componentDidMount() {
      document.addEventListener("mouseup", this.mouseupHandler.bind(this));
    },
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.mouseupHandler.bind(this));
    },
    onDoubleClick(args) {
      console.log(args);
      args.cancel = true;
      return;
    },
    onCellClick: function () {
      const scheduleObj =
        document.querySelector(".e-schedule").ej2_instances[0];
      let cellDetails = scheduleObj.getCellDetails(
        scheduleObj.activeCellsData.element
      );
      console.log(
        scheduleObj.getCellDetails(scheduleObj.activeCellsData.element)
      );
      console.log(cellDetails);
      this.cellDate = cellDetails.startTime.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      console.log(this.cellDate);
      this.cellStartTime = cellDetails.startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(this.cellStartTime);
      this.cellEndTime = cellDetails.endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(this.cellEndTime);
      const doc = document.querySelector("#ScheduleConfirmed").ej2_instances[0];
      console.log(doc);
    },
    onResizeStart(args) {
      console.log(this.currMeetingConfirmation.timeLength);
      args.interval = this.currMeetingConfirmation.timeLength * 60;
    },

    getSelectedCellTimes() {
      const doc = document.querySelector("#ScheduleConfirmed").ej2_instances[0];
      console.log(doc);
      const activeCells = doc.activeCellsData;
      const startTime = activeCells.startTime;
      const endTime = activeCells.endTime;
      this.selectedStartTime = startTime;
      this.selectedEndTime = endTime;
      console.log(this.selectedStartTime);
    },

    async getBlockedTimeSlot(meeting) {
      const array = await db.collection("meeting").doc(meeting.id).get();
      const timeslot = await array.get("timeslot");
      let pushTimeSlot = [];
      let counter = 0;
      console.log(timeslot);

      for (let i = 0; i < timeslot.length; i++) {
        console.log(timeslot[i].start.toDate().toLocaleDateString());
        const currStart = timeslot[i].start.toDate().toLocaleDateString();
        const currStartYear = parseInt(currStart.substr(6, 4));
        const currStartMonth = parseInt(currStart.substr(3, 2)) - 1;
        const currStartDate = parseInt(currStart.substr(0, 2));

        const currEnd = timeslot[i].end.toDate().toLocaleDateString();
        const currEndYear = parseInt(currEnd.substr(6, 4));
        const currEndMonth = parseInt(currEnd.substr(3, 2)) - 1;
        const currEndDate = parseInt(currEnd.substr(0, 2));

        pushTimeSlot.push({
          Id: counter,
          Subject: "",
          StartTime: new Date(timeslot[i].start.toDate()),
          EndTime: new Date(timeslot[i].end.toDate()),
          IsBlock: true,
        });
        counter += 1;
      }
      this.$set(this.eventSettings, "dataSource", []);
      this.eventSettings.dataSource.push(...pushTimeSlot);
      // this.eventSettings.push(pushTimeSlot)
      console.log("hello !" + JSON.stringify(pushTimeSlot));
      console.log(pushTimeSlot);
      // console.log(this.eventSettingsList);
      console.log(this.eventSettings);
      // console.log(document.getElementById("Schedule"))
      // console.log(document.getElementById("Schedule").ej2_instance)
      let scheduleObj =
        document.querySelector("#ScheduleConfirmed").ej2_instances[0];

      // console.log(scheduleObj);
      scheduleObj.eventSettings.dataSource = pushTimeSlot;
      return pushTimeSlot;
    },
    async loadMeetingsCalendar() {
      this.currMeetingsLoaded = this.displayMeetingCalendar;
    },

    checkMeetingDetails() {
      if (this.offlineSpecify !== "" && this.meetingVenue == "Offline") {
        this.meetingTypeDetails = this.offlineSpecify;
      } else if (this.othersSpecify !== "" && this.meetingVenue == "Online") {
        this.meetingTypeDetails = this.othersSpecify;
      }
    },

    remove(item) {
      this.groupmatesChips.splice(this.groupmatesChips.indexOf(item), 1);
      this.groupmatesChips = [...this.groupmatesChips];
      console.log(this.groupmatesChips);
    },

    async fillInfo(task) {
      this.myTodo = task.task;
      this.myProject = task.project.id;
      this.oldMyProject = task.project.id;
      this.myDeadline = task.deadlineDate;
      this.myDeadlineTime = task.deadlineTime;
      this.myNote = task.note;
      this.complete = task.complete;
      this.switchValue = task.switchValue;
      this.finalDeadline = task.deadline;
      this.dateSwitchValue = task.dateSwitchValue;
      this.displayDeadline = task.displayDeadline;
      this.groupmatesChips = await this.getPIC(task.PIC);
      this.oldGroupmatesChipsObject = await this.getPIC(task.PIC);
      this.oldGroupmatesChips = await this.getPICId(task.PIC);
      console.log(this.oldGroupmatesChips);
      console.log(this.complete);
    },

    async getPIC(PIC) {
      console.log(PIC);
      this.varPIC = [];
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();
        this.varPIC.push({
          id: docRef.id,
          name: docRef.get("name"),
          object: docRef,
          avatar: docRef.get("photoURL")
            ? docRef.get("photoURL")
            : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
        });
      }
      console.log(this.varPIC);
      return this.varPIC;
    },

    async getPICId(PIC) {
      this.varPICId = [];
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();

        this.varPICId.push(docRef.id);
      }

      return this.varPICId;
    },

    clearInfo() {
      (this.meetingTitle = ""),
        (this.meetingProject = null),
        (this.meetingDuration = 0),
        (this.meetingSlide = null),
        (this.meetingDateRange = []),
        (this.meetingStartTime = "00:00"),
        (this.meetingEndTime = "23:59"),
        (this.menuStartTime = false),
        (this.menuEndTime = false),
        (this.tab = null),
        (this.invitationsSlide = null),
        (this.meetingCalendar = []),
        (this.dateSwitchValue = false);
      this.groupmatesChips = [];
      this.varPIC = [];
      this.varPICId = [];
      this.oldGroupmatesChips = [];
      this.newMeetingType = null;
      this.tempNewMeetingType = null;
      this.othersSpecify = "";
      this.offlineSpecify = "";
      this.meetingVenue = "";
      this.meetingTypeDetails = "";
    },

    clearAddMeetingInfo() {
      (this.meetingTitle = ""),
        (this.meetingProject = null),
        (this.meetingDuration = 0),
        (this.meetingSlide = null),
        (this.meetingDateRange = []),
        (this.meetingStartTime = "00:00"),
        (this.meetingEndTime = "23:59"),
        (this.menuStartTime = false),
        (this.menuEndTime = false),
        (this.tab = null),
        (this.invitationsSlide = null),
        (this.meetingCalendar = []),
        (this.dateSwitchValue = false);
      this.groupmatesChips = [];
      this.varPIC = [];
      this.varPICId = [];
      this.oldGroupmatesChips = [];

      this.othersSpecify = "";
      this.offlineSpecify = "";
      this.meetingVenue = "";
      this.meetingTypeDetails = "";
    },

    validate() {
      this.$refs.form.validate();
    },

    checkTimeAdd() {
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

      console.log(this.myProject);
      console.log(this.finalDeadline);
      console.log(this.displayDeadline);
      this.addTodo();
    },

    checkEdit(task) {
      if (this.switchValue == false) {
        console.log(this.myDeadlineTime);
        this.myDeadlineTime = "00:00";
        console.log(this.myDeadlineTime);
      }
      if (this.displayDeadline == "Someday") {
        this.finalDeadline = null;
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(
          new Date(this.myDeadline + "T" + this.myDeadlineTime + ":00+08:00")
        );
      }
      this.editTask(task);
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
    checkTempGroupmates() {
      let counter = 0;
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (this.tempGroupmates[i].chipValue == true) {
          counter += 1;
        }
      }
      return counter;
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
    async addTodo() {
      this.errors = "";
      console.log(this.myProject);

      const response = await db.collection("todo").add({
        task: this.myTodo,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        complete: this.complete,
        deadlineTime: this.myDeadlineTime,
        deadlineDate: this.myDeadline,
        switchValue: this.switchValue,
        dateSwitchValue: this.dateSwitchValue,
        // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
        deadline: this.finalDeadline,
        displayDeadline: this.displayDeadline,
        PIC: [],
        note: this.myNote,
        project: db.collection("project").doc(this.myProject),
      });
      await this.addFinalPIC(response);
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({ todo: firebase.firestore.FieldValue.arrayUnion(response) });

      await db
        .collection("project")
        .doc(this.myProject)
        .update({ todos: firebase.firestore.FieldValue.arrayUnion(response) })
        .catch((error) => console.log(error));

      await this.$store.dispatch("getProjects");
      await this.$store.dispatch("getTasks");

      this.myTodo = "";
      this.myProject = "";
      this.myNote = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.groupmatesChips = [];
      this.clearInfo();
    },

    async addMeeting() {
      let projectTitle = ""
      console.log(this.meetingProject)
      for(let i=0; i<this.projects.length; i++){
          console.log(this.projects[i].title)
        if (this.projects[i].id == this.meetingProject) {
          projectTitle = this.projects[i].title
        }
      }
      console.log(projectTitle)
 
      this.meetingSubmit = true;
      this.checkMeetingDetails();
      if (this.meetingDateRange[0] > this.meetingDateRange[1]) {
        let newMeetingDateRange = [];
        newMeetingDateRange.push(this.meetingDateRange[1]);
        newMeetingDateRange.push(this.meetingDateRange[0]);
        this.meetingDateRange = newMeetingDateRange;
        this.displayMeetingDateRange;
      }
      if (this.meetingDateRange.length == 1) {
        this.meetingDateRange.push(this.meetingDateRange[0]);
        this.displayMeetingDateRange;
      }
      console.log(this.groupmatesChips);
      console.log(this.meetingDateRange);
      console.log(this.displayMeetingDateRange);
      const response = await db.collection("meeting").add({
        title: this.meetingTitle,
        _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        startDate: firebase.firestore.Timestamp.fromDate(
          new Date(this.meetingDateRange[0] + "T" + "00:00" + ":00+08:00")
        ),
        endDate: firebase.firestore.Timestamp.fromDate(
          new Date(this.meetingDateRange[1] + "T" + "00:00" + ":00+08:00")
        ),
        startTime: this.meetingStartTime,
        endTime: this.meetingEndTime,
        timeLength: this.meetingDuration,
        displayMeetingDateRange: this.displayMeetingDateRange,
        groupmates: await this.addGroupmatesToMeeting(response),
        invitations: await this.addGroupmatesToMeeting(response),
        confirmedInvitations: [],
        meetingVenue: this.meetingTypeDetails,
        isOnlineVenue: this.meetingVenue == "Online" ? true : false,
        timeslot: [],
        project:{id: this.meetingProject, title: projectTitle, reference: db.collection("project").doc(this.meetingProject)},
        author: db.collection("user").doc(this.$store.state.user.uid),
        isConfirmed: false,
        selectedStartDate: null,
        selectedEndDate: null,
      });
      // await this.addMeetingGroupmates(response);
      this.$store.dispatch("getMeetingInvitations");
      this.$store.dispatch("getMeetingPendings");
      await db
        .collection("project")
        .doc(this.meetingProject)
        .update({
          meetings: firebase.firestore.FieldValue.arrayUnion(response),
        })
        .catch((error) => console.log(error));

      this.meetingTitle = "";
      this.meetingProject = null;
      this.meetingDateRange = [];
      this.meetingVenue = "";
      this.meetingDuration = 0;
      this.meetingStartTime = "00:00";
      this.meetingEndTime = "23:59";
      this.meetingSlide = null;
      this.groupmatesChips = [];
      this.oldGroupmatesChips = [];
      this.groupmatesChipsId = [];
      this.varPIC = [];
      this.varPICId = [];
      this.clearInfo();
    },

    async addConfirmedMeeting() {
      let projectTitle = ""
      console.log(this.meetingProject)
      for(let i=0; i<this.projects.length; i++){
          console.log(this.projects[i].title)
        if (this.projects[i].id == this.meetingProject) {
          projectTitle = this.projects[i].title
        }
      }
      console.log(projectTitle)
 
      this.meetingSubmit = true;
      this.checkMeetingDetails();

      if (this.meetingDateRange[0] > this.meetingDateRange[1]) {
        let newMeetingDateRange = [];
        newMeetingDateRange.push(this.meetingDateRange[1]);
        newMeetingDateRange.push(this.meetingDateRange[0]);
        this.meetingDateRange = newMeetingDateRange;
        this.displayMeetingDateRange;
      }
      if (this.meetingDateRange.length == 1) {
        this.meetingDateRange.push(this.meetingDateRange[0]);
        this.displayMeetingDateRange;
      }
      console.log(this.meetingDateRange);
      console.log(this.displayMeetingDateRange);
      console.log(this.startTime);
      console.log(this.endTime);
      const response = await db.collection("meeting").add({
        title: this.meetingTitle,
        _createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        startTime: this.meetingStartTime,
        endTime: this.meetingEndTime,
        confirmedInvitations: await this.addGroupmatesToMeeting(response),
        invitations: [],
        meetingVenue: this.meetingTypeDetails,
        isOnlineVenue: this.meetingVenue == "Online" ? true : false,
        timeslot: [],
        project:{id: this.meetingProject, title: projectTitle, reference: db.collection("project").doc(this.meetingProject)},
        author: db.collection("user").doc(this.$store.state.user.uid),
        isConfirmed: true,
        startDate: firebase.firestore.Timestamp.fromDate(
          new Date(this.meetingDateRange[0] + "T" + "00:00" + ":00+08:00")
        ),
        endDate: firebase.firestore.Timestamp.fromDate(
          new Date(this.meetingDateRange[1] + "T" + "00:00" + ":00+08:00")
        ),
        selectedStartDate: firebase.firestore.Timestamp.fromDate(
          new Date(
            this.meetingDateRange[0] + "T" + this.meetingStartTime + ":00+08:00"
          )
        ),
        selectedEndDate: firebase.firestore.Timestamp.fromDate(
          new Date(
            this.meetingDateRange[1] + "T" + this.meetingEndTime + ":00+08:00"
          )
        ),
        displayMeetingDateRange: this.displayMeetingDateRange,
      });
      // await this.addMeetingGroupmates(response);
      this.$store.dispatch("assignMeetingCalendar")
      this.$store.dispatch("getConfirmedMeeting");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
      this.$store.dispatch("assignTodoDashboardCalendar");

      await db
        .collection("project")
        .doc(this.meetingProject)
        .update({
          meetings: firebase.firestore.FieldValue.arrayUnion(response),
        })
        .catch((error) => console.log(error));

      this.meetingTitle = "";
      this.meetingProject = null;
      this.meetingDateRange = [];
      this.meetingVenue = "";
      this.meetingDuration = 0;
      this.meetingStartTime = "00:00";
      this.meetingEndTime = "23:59";
      this.meetingSlide = null;
      this.groupmatesChips = [];
      this.oldGroupmatesChips = [];
      this.groupmatesChipsId = [];
      this.varPIC = [];
      this.varPICId = [];
      this.clearInfo();
    },

    async addGroupmatesToProject(project) {
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
              groupmates: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])
              ),
            });
        } else {
          db.collection("project")
            .doc(project.id)
            .update({
              groupmates_invited: firebase.firestore.FieldValue.arrayUnion(
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
              groupmates: firebase.firestore.FieldValue.arrayRemove(
                db.collection("user").doc(this.oldGroupmates[i])
              ),
            });
        }
      }
    },

    async deleteTask(task) {
      console.log(this.$store.state.user.uid);
      console.log(task.id);
      console.log(task.project.id);
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
        .doc(task.project.id)
        .update({
          todos: firebase.firestore.FieldValue.arrayRemove(
            db.collection("todo").doc(task.id)
          ),
        });
      await db.collection("todo").doc(task.id).delete();
      await this.$store.dispatch("getTasks");
    },

    completeTask: function (task) {
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      });
    },

    async editTask(task) {
      console.log(task.id);
      console.log(this.dateSwitchValue);
      const response = await db
        .collection("todo")
        .doc(task.id)
        .update({
          task: this.myTodo,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          complete: this.complete,
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          dateSwitchValue: this.dateSwitchValue,
          // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
          deadline: this.finalDeadline,
          displayDeadline: this.displayDeadline,
          note: this.myNote,
          project: db.collection("project").doc(this.myProject),
          PIC: [],
        });

      await this.addFinalPIC(task);
      if (this.oldMyProject !== this.myProject) {
        await db
          .collection("project")
          .doc(this.myProject)
          .update({
            todos: firebase.firestore.FieldValue.arrayUnion(
              db.collection("todo").doc(task.id)
            ),
          })
          .catch((error) => console.log(error));
        await db
          .collection("project")
          .doc(this.oldMyProject)
          .update({
            todos: firebase.firestore.FieldValue.arrayRemove(
              db.collection("todo").doc(task.id)
            ),
          })
          .catch((error) => console.log(error));
      }

      this.$store.dispatch("getTasks");
      this.myTodo = "";
      this.myProject = "";
      this.myNote = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.groupmatesChips = [];
      this.varPIC = [];
      this.varPICId = [];
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

    async confirmNewMeetingType() {
      this.newMeetingType = this.tempNewMeetingType;
    },

    async renderGroupmates() {
      this.tempGroupmates = [];
      this.groupmatesChips = [];
      const docRef = await db
        .collection("project")
        .doc(this.meetingProject)
        .get();
      const data = await docRef.get("groupmates");
      for (let i = 0; i < data.length; i++) {
        const currGroupmate = await data[i].get();
        this.tempGroupmates.push({
          id: currGroupmate.id,
          name: currGroupmate.get("name"),
          object: currGroupmate,
          avatar: currGroupmate.get("photoURL")
            ? currGroupmate.get("photoURL")
            : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
        });
      }

      console.log(this.tempGroupmates);
      console.log(this.$store.state.user);
    },

    async addGroupmatesToMeeting() {
      if (this.groupmatesChips.length == 0) {
        this.groupmatesChips = this.oldGroupmatesChipsObject;
      }
      this.newGroupmatesChips = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        if (this.groupmatesChips[i].id == this.$store.state.user.uid) {
          this.newGroupmatesChips.push(this.groupmatesChips[i]);
          break;
        }
      }
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        if (this.groupmatesChips[i].id !== this.$store.state.user.uid) {
          this.newGroupmatesChips.push(this.groupmatesChips[i]);
        }
      }
      this.groupmatesChips = this.newGroupmatesChips;
      this.groupmatesChipsId = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        this.groupmatesChipsId.push(
          db.collection("user").doc(this.groupmatesChips[i].id)
        );
      }
      console.log(this.groupmatesChipsId);
      return this.groupmatesChipsId;
    },

    async addMeetingGroupmates(meeting) {
      if (this.groupmatesChips.length == 0) {
        this.groupmatesChips = this.oldGroupmatesChipsObject;
      }
      this.newGroupmatesChips = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        if (this.groupmatesChips[i].id == this.$store.state.user.uid) {
          this.newGroupmatesChips.push(this.groupmatesChips[i]);
          break;
        }
      }
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        if (this.groupmatesChips[i].id !== this.$store.state.user.uid) {
          this.newGroupmatesChips.push(this.groupmatesChips[i]);
        }
      }

      this.groupmatesChips = this.newGroupmatesChips;
      this.groupmatesChipsId = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        this.groupmatesChipsId.push(this.groupmatesChips[i].id);
      }
      console.log(this.groupmatesChipsId);

      for (let i = 0; i < this.groupmatesChips.length; i++) {
        db.collection("meeting")
          .doc(meeting.id)
          .update({
            groupmates: firebase.firestore.FieldValue.arrayUnion(
              db.collection("user").doc(this.groupmatesChips[i].id)
            ),
          });
      }
    },

    async passCurrSelectedMeetingInv(meetingInv) {
      console.log(meetingInv);
      this.currMeetingPending = null;
      this.currMeetingConfirmation = null;
      this.currMeetingInv = meetingInv;
    },

    async passCurrSelectedMeetingPending(pending) {
      this.currMeetingInv = null;
      this.currMeetingConfirmation = null;
      this.currMeetingPending = pending;
    },
    async passCurrSelectedMeetingConfirmation(confirmation) {
      this.currMeetingInv = null;
      this.currMeetingPending = null;
      this.currMeetingConfirmation = confirmation;
    },

    async declineMeeting(meetingInv) {
      console.log(meetingInv);
      db.collection("meeting")
        .doc(meetingInv.id)
        .update({
          invitations: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
      this.$store.dispatch("getMeetingInvitations");
      this.currMeetingInv = null;
      db.collection("meeting")
        .doc(meetingInv.id)
        .update({
          groupmates: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
      const getData = await db.collection("meeting").doc(meetingInv.id).get();
      const groupmatesLength = getData.get("groupmates");
      const getProject = await meetingInv.project;
      if (groupmatesLength == 0) {
        db.collection("project")
          .doc(getProject.id)
          .update({
            meetings: firebase.firestore.FieldValue.arrayRemove(
              db.collection("meeting").doc(meetingInv.id)
            ),
          });
        db.collection("meeting").doc(meetingInv.id).delete();
      }
    },

    async quitMeeting(meeting) {
      db.collection("meeting")
        .doc(meeting.id)
        .update({
          confirmedInvitations: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
      this.$store.dispatch("getMeetingPendings");
      this.$store.dispatch("getMeetingConfirmations");
      this.currMeetingConfirmation = null;
      this.currMeetingPending = null;
      

      db.collection("meeting")
        .doc(meeting.id)
        .update({
          groupmates: firebase.firestore.FieldValue.arrayRemove(
            db.collection("user").doc(this.$store.state.user.uid)
          ),
        });
      const getData = await db.collection("meeting").doc(meeting.id).get();
      const groupmatesLength = getData.get("groupmates");
      const getProject = await meeting.project;
      if (groupmatesLength == 0) {
        db.collection("project")
          .doc(getProject.id)
          .update({
            meetings: firebase.firestore.FieldValue.arrayRemove(
              db.collection("meeting").doc(meeting.id)
            ),
          });
        db.collection("meeting").doc(meeting.id).delete();
      }

    },

    async tempImportCalendar(link,meetingInv){
      this.tempImportStartDate = new Date(
        meetingInv.displayMeetingDateRange.substr(0, 10) +
          "T" +
          meetingInv.startTime +
          ":00+08:00"
      ).toISOString();

      this.tempImportEndDate = new Date(
        meetingInv.displayMeetingDateRange.substr(13) +
          "T" +
          meetingInv.endTime +
          ":00+08:00"
      ).toISOString();
      
      this.tempImportLink = link;
      this.importedCalendar = true;
      this.tempImportedCalendar = true

    },

    async importCalendar(link,meeting) {
      this.tempImportCalendar(link,meeting);
      await findCommonTime(
        this.tempImportLink,
        this.tempImportStartDate,
        this.tempImportEndDate,
        this.currMeetingInv.id,
        this.$store.state.user.uid
      );
    },

    async importGoogleCalendar() {
      console.log(this.currMeetingInv)
      const res = await findGoogleCommonTime(
         new Date(
        this.currMeetingInv.displayMeetingDateRange.substr(0, 10) +
          "T" +
          this.currMeetingInv.startTime +
          ":00+08:00"
      ).toISOString(),
        new Date(
        this.currMeetingInv.displayMeetingDateRange.substr(13) +
          "T" +
          this.currMeetingInv.endTime +
          ":00+08:00"
      ).toISOString(),
        this.currMeetingInv.id,
        this.$store.state.user.uid
      );
      console.log(res);
      this.googleSyncedDialog = true;
      this.getBlockedTimeSlot(this.currMeetingInv)
    },

    async linkWithGoogle() {
      const authCode = await this.$gAuth.getAuthCode()
      const response = await axios.post('https://asia-east2-timelinus-2021.cloudfunctions.net/getGoogleToken', {}, {
        headers: {
          "auth_code": authCode,
        }
      })
      console.log(response);
      const credential = firebase.auth.GoogleAuthProvider.credential(response.data.id_token, response.data.access_token);
      await firebase.auth().currentUser?.linkWithCredential(credential).then((result) => {
        db.collection("user").doc(this.$store.state.user.uid).update({
          googleRefreshToken: response.data['refresh_token'],
          googleAccessTokenExpiry: firebase.firestore.Timestamp.fromMillis(Date.now() + response.data['expires_in'] * 1000 - 5),
          googleAccessToken: response.data['access_token'],
        })
      })
      this.isLinkedToGoogle = true;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css";

.scheduleHeight {
  height: 380px !important;
}

.schedule-vue-sample .block-events.e-schedule .template-wrap {
  width: 100%;
}

.schedule-vue-sample
  .block-events.e-schedule
  .e-vertical-view
  .e-resource-cells {
  height: 58px;
}

.schedule-vue-sample
  .block-events.e-schedule
  .e-timeline-view
  .e-resource-left-td,
.schedule-vue-sample
  .block-events.e-schedule
  .e-timeline-month-view
  .e-resource-left-td {
  width: 170px;
}

.schedule-vue-sample
  .block-events.e-schedule
  .e-resource-cells.e-child-node
  .employee-category,
.schedule-vue-sample
  .block-events.e-schedule
  .e-resource-cells.e-child-node
  .employee-name {
  padding: 5px;
}

.schedule-vue-sample .block-events.e-schedule .employee-image {
  width: 45px;
  height: 40px;
  float: left;
  border-radius: 50%;
  margin-right: 10px;
}

.schedule-vue-sample .block-events.e-schedule .employee-name {
  font-size: 13px;
}

.schedule-vue-sample .block-events.e-schedule .employee-designation {
  font-size: 10px;
}

/* .e-schedule .e-vertical-view .e-selected-cells {
        background-color: blue !important;
    } */

.e-schedule .e-vertical-view .e-selected-cell {
  background-color: #ffe4cb !important;
}

.e-schedule .e-vertical-view .e-work-cells {
  background-color: white;
}

.todo-item {
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}

/*.dialogCSS {*/
/* border-radius: 4px;*/
/* margin: 24px;*/
/* overflow-y: auto;*/
/* pointer-events: auto;*/
/* transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);*/
/* width: 100%;*/
/* z-index: inherit;*/
/* !* box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%); *!*/
/*}*/
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
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;
}

.theme--dark {
  color: #ffffff;
}

.theme--light.v-checkbox {
  color: #ffffff;
}

.v-card {
  color: #ff9d66;
  border: none;
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

.random-abc
  .v-input__control
  .v-input__slot
  .v-input--radio-group__input
  .v-input
  .v-input__append-outer {
  margin-top: 0px !important;
}

.selectedCalOrList {
  background-color: #ff9d66;
  color: #ff9d66;
}
</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: #FFD5A5 !default
$btn-active-opacity: 1 !default
</style>
