<template>
  <div style="background-color: #fff0df; font-family: DM Sans, sans-serif">
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
                        <v-card-title :class="`rounded-xl`">
                          <span style="color: #ff9d66" class="headline"
                            >Add New Meeting</span
                          >
                        </v-card-title>

                        <v-card-text>
                          <v-container :class="`rounded-xl`">
                            <v-row>
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
                                  :rules="[(v) => !!v || 'Project is required']"
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
                                    :rules="[(v) => !!v || 'Participants are required']"
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
                                    :rules="[(v) => v !== 0 || 'Meeting duration is required']"

                                ></v-slider>
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
                                          (!!v && v) !== 'Meeting Date Range' ||
                                          'Meeting Date Range is required',
                                      ]"
                                      v-model="displayMeetingDateRange"
                                      label="Meeting Date Range*"
                                      prepend-icon="mdi-calendar"
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#ff9d66"
                                    ></v-text-field>
                                    
                                  </template>
                                  <v-date-picker
                                    color="#ff9d66"
                                    range
                                    v-model="meetingDateRange"
                                    
                                  >
                                    <v-btn outlined color="#ff9d66" @click="menuAdd = false;">
                                        Close
                                    </v-btn>
                                  </v-date-picker>
                                </v-menu>
                                <v-row style="padding-top: 5px">
                                  <v-col cols="12" md="6" style="display: flex">
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
                                          :rules="[(v) => !!v || 'Meeting Start Time is required']"
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
                                          $refs.menuStartTime.save(meetingStartTime)
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
                                          :rules="[(v) => !!v || 'Meeting End Time is required']"
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
                                          $refs.menuEndTime.save(meetingEndTime)
                                        "
                                      ></v-time-picker>
                                    </v-menu>
                                  </v-col>
                                  <v-col cols="12" md="6">
                                    <v-subheader class="pl-0">
                                    Meeting Venue*
                                    </v-subheader>
                                    <v-radio-group
                                      v-model="meetingVenue"
                                      row
                                      :rules="[(v) => !!v || 'Meeting Venue is required']"
                                    >
                                      <v-radio
                                        color="#ff9d66"
                                        label="Zoom"
                                        value="Zoom"
                                        
                                      ></v-radio>
                                      
                                      <v-radio
                                      color="#ff9d66"
                                        label="Face To Face"
                                        value="Face To Face"
                                      ></v-radio>
                                    </v-radio-group>
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
                              !valid || this.meetingTitle == '' || this.meetingProject == null ||  
                              this.groupmatesChips.length == 0 || this.meetingVenue == '' || this.meetingDateRange.length == 0 || 
                              this.meetingDuration < 0.5"
                            
                            text
                            @click="
                              dialog = false;
                              addMeeting();
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
              <br>
              <div style="margin-left: 1vw">
                
                <v-date-picker
                ref="picker"
                  v-model="displayMeetingCalendar"
                  :events="meetingCalendar"
                  event-color="orange"
                  color="#ff9d66"
                  width="420"
                  @click="loadMeetingsCalendar()"
                ></v-date-picker>

                <div class="text-h6">
                  Month news ({{ pickerDate || 'change month...' }})
                </div>
                <div class="subheading">
                  Change month to see other news
                </div>
                <ul class="ma-4">
                  <li
                    
                  >
                    <!-- {{ currMeetingsLoaded }} -->
                    {{displayMeetingCalendar}}
                  </li>
                </ul>
              </div>
             
            </v-col>

            <v-col col="12" md="8">
              <div style="display: flex">
                <v-container
                  style="margin-right: auto; margin-left: auto; display: flex"
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
                  
                  style="padding:10px;"
                    v-model="tab"
                    fixed-tabs
                    color="#4b4b4b"
                    background-color="#ffe4cb"
                    
                  >
                    <v-tab> Invitations </v-tab>
                    <v-tab> Pending </v-tab>
                    <v-tab>Confirmation</v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab" style="background-color:#ffe4cb;">
                    <v-tab-item style="background-color:#ffe4cb;">
                      <v-container style=" border-radius:24px;" :class="`rounded-xl`">
                      <v-card color="#FFE4CB" outlined :class="`rounded-xl`" style="padding: 10px; overflow-y: scroll">
                        <div
                      v-if="invitationLength"
                      style=""
                    >
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
                            v-for="(meetingInv) in orderedMeetingInv"
                            :key="meetingInv.id"
                            v-slot="{ active }"
                          >
                          
                            <v-card
                              :class="`rounded-xl`"
                              :color="active ? undefined : 'white'"
                              class="ma-2"
                              height="255"
                              width="300"
                             
                              style="padding: 10px; padding-left:14px;"
                            >
                             <v-row style="padding: 5px">
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
                                    {{ meetingInv.projectTitle }}
                                  </v-card-text>
                                  <v-card-title
                                    style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                  >
                                    {{  meetingInv.title }}
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
                                        <v-icon color="#ff9d66" width="20px;"
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
                                        }} - {{
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
                                        <v-icon color="#ff9d66" width="20px;"
                                          >schedule</v-icon
                                        >
                                        {{
                                          meetingInv.startTime
                                        }} - {{
                                          meetingInv.endTime
                                        }}  ({{meetingInv.timeLength}} hrs)</span
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
                                        <v-icon color="#ff9d66" width="20px;"
                                          >place</v-icon
                                        >
                                        {{meetingInv.venue}}</span
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
                                        
                                        Created by {{meetingInv.creator}}</span
                                      >
                                    </div>
                                    
                                  </v-card-text>
                                  <v-card-actions  style="padding: 0px; !important" >
                                    <v-row
                                    style="padding-top: 20px!important; "
                                      align="center"
                                      justify="center"
                                    >
                                      <v-btn text small color="#ff9d66" @click="passCurrSelectedMeetingInv(meetingInv);
                                ">
                                        Import Calendar
                                      </v-btn>
                                      <v-btn
                                      small
                                        text
                                        color="#999999"
                                        @click="declineMeeting(meetingInv)"
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
                    <div v-else style="padding:85px; display:flex' align-items: center; justify-content: center">
                       <span style="font-color: #4b4b4b; font-weight: bold; font-size: 16px;">You do have any project yet. Create a new one or accept any project invitation</span>
                    </div>
                      </v-card>
                      </v-container>
                    </v-tab-item>
                    <v-tab-item style="background-color:#ffe4cb;">
                      <v-container style=" border-radius:24px;" :class="`rounded-xl`">
                      <v-card color="#FFE4CB" outlined :class="`rounded-xl`" style="padding: 10px; overflow-y: scroll">
                        <div
                      v-if="pendingLength"
                      style=""
                    >
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
                            v-for="(pending) in orderedMeetingPending"
                            :key="pending.id"
                            v-slot="{ active }"
                          >
                          
                            <v-card
                              :class="`rounded-xl`"
                              :color="active ? undefined : 'white'"
                              class="ma-2"
                              height="255"
                              width="300"
                             
                              style="padding: 10px; padding-left:14px;"
                            >
                             <v-row style="padding: 5px">
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
                                    {{ pending.projectTitle }}
                                  </v-card-text>
                                  <v-card-title
                                    style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                  >
                                    {{  pending.title }}
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
                                        <v-icon color="#ff9d66" width="20px;"
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
                                        }} - {{
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
                                        <v-icon color="#ff9d66" width="20px;"
                                          >schedule</v-icon
                                        >
                                        {{
                                          pending.startTime
                                        }} - {{
                                          pending.endTime
                                        }}  ({{pending.timeLength}} hrs)</span
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
                                        <v-icon color="#ff9d66" width="20px;"
                                          >place</v-icon
                                        >
                                        {{pending.venue}}</span
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
                                       
                                        Created by {{pending.creator}}</span
                                      >
                                    </div>
                                    
                                  </v-card-text>
                                  <v-card-actions  style="padding: 0px; !important" >
                                    <v-row
                                    style="padding-top: 20px!important; "
                                      align="center"
                                      justify="center"
                                    >
                                      <v-btn text small color="#ff9d66" @click="passCurrSelectedMeetingPending(pending);
                                ">
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
                      </v-sheet>
                    </div>
                    <div v-else style="padding:85px; display:flex' align-items: center; justify-content: center">
                       <span style="font-color: #4b4b4b; font-weight: bold; font-size: 16px;">You do have any project yet. Create a new one or accept any project invitation</span>
                    </div>
                      </v-card>
                      </v-container>
                    </v-tab-item>
                       <v-tab-item style="background-color:#ffe4cb;">
                      <v-container style=" border-radius:24px;" :class="`rounded-xl`">
                      <v-card color="#FFE4CB" outlined :class="`rounded-xl`" style="padding: 10px; overflow-y: scroll">
                        <div
                      v-if="confirmationLength"
                      style=""
                    >
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
                            v-for="(confirmation) in orderedMeetingConfirmation"
                            :key="confirmation.id"
                            v-slot="{ active }"
                          >
                          
                            <v-card
                              :class="`rounded-xl`"
                              :color="active ? undefined : 'white'"
                              class="ma-2"
                              height="255"
                              width="300"
                             
                              style="padding: 10px; padding-left:14px;"
                            >
                             <v-row style="padding: 5px">
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
                                    {{ confirmation.projectTitle }}
                                  </v-card-text>
                                  <v-card-title
                                    style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                  >
                                    {{  confirmation.title }}
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
                                        <v-icon color="#ff9d66" width="20px;"
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
                                        }} - {{
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
                                        <v-icon color="#ff9d66" width="20px;"
                                          >schedule</v-icon
                                        >
                                        {{
                                          confirmation.startTime
                                        }} - {{
                                          confirmation.endTime
                                        }}  ({{confirmation.timeLength}} hrs)</span
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
                                        <v-icon color="#ff9d66" width="20px;"
                                          >place</v-icon
                                        >
                                        {{confirmation.venue}}</span
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
                                        
                                        Created by {{confirmation.creator}}</span
                                      >
                                    </div>
                                    
                                  </v-card-text>
                                  <v-card-actions  style="padding: 0px; !important" >
                                    <v-row
                                    style="padding-top: 20px!important; "
                                      align="center"
                                      justify="center"
                                    >
                                      <v-btn text small color="#ff9d66" @click="passCurrSelectedMeetingConfirmation(confirmation);
                                ">
                                        View
                                      </v-btn>
                                      <v-btn
                                      small
                                        text
                                        color="#999999"
                                        @click="quitMeeting(confirmation)"
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
                    <div v-else style="padding:85px; display:flex' align-items: center; justify-content: center">
                       <span style="font-color: #4b4b4b; font-weight: bold; font-size: 16px;">You do have any project yet. Create a new one or accept any project invitation</span>
                    </div>
                      </v-card>
                      </v-container>
                    </v-tab-item>
                  </v-tabs-items>
                  </v-card>
                </v-container>
              </div>
            
            
             <div v-if="currMeetingInv!== null">
            <!-- <v-container :class="`rounded-xl`" style="max-width:1450px !important; width: 80vw;  margin-left: 0.5vw; margin-right:3vw;"> -->
              <v-card
                outlined
                color="#FFE4CB"
                style="max-height: 61vh; overflow-y: scroll; "
                :class="`rounded-xl`"
              >
                <span style="color:#ff9d66; font-weight:bold; padding: 10px; font-size: 20px; display:flex; justify-content:flex-start;"> 
                  {{currMeetingInv.title}}</span>
                <v-card
                  outlined
                  color="#ff9d66"
                  style="padding: 20px;  max-height: 61vh"
                  :class="`rounded-lg`"
                >
                <v-card-title color="#4b4b4b">
                  Current Timetable
                </v-card-title>
                <v-row>
                  <v-col col="12" md="6">
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
                          color:white;
                          font-size: 18px !important;
                          font-weight: bold !important;
                          margin-bottom: 20px;
                        "
                      >
                        Import Calendar
                      </v-card-title>
                      
                      <v-card-title
                        style="font-weight: bold !important; color:white;display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                      padding-left :10px !important; padding-right :3px !important; font-size: 18px !important;" 
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
                          label="Use existing/default calendar"
                          value="existingCalendar"
                          
                          
                        ></v-radio>
                        <v-row style="margin-top: 5px; padding-left: 10px;">
                        <v-text-field
                          outlined
                          dense
                          v-model="existingCalendarURL"
                          
                          id="output"
                           color="white"
                          :disabled="importCalendarChoice ==  'newCalendar' || importCalendarChoice == null"
                          
                        >
                        </v-text-field>

                        <v-btn outlined small style="margin: 8px;" color="white"
                        :disabled="importCalendarChoice ==  'newCalendar' || importCalendarChoice == null"
                        @click="importCalendar(existingCalendarURL, currMeetingInv)">
                            Import
                          </v-btn>
                       
                        </v-row>
                      
                        <v-radio
                        dark
                        color="white"
                          label="Import a new calendar"
                          value="newCalendar"
                        ></v-radio>
                        <v-row style="margin-top: 5px; padding-left: 10px;">
                        <v-text-field
                        :disabled="importCalendarChoice ==  'existingCalendar' || importCalendarChoice == null"
                          color="white"
                          v-model="newCalendarURL"
                          outlined
                          dense
                        ></v-text-field>
                        <v-btn outlined small style="margin: 8px;" color="white"
                        :disabled="importCalendarChoice ==  'existingCalendar' || importCalendarChoice == null"
                        @click="importCalendar(this.newCalendarURL, currMeetingInv)">
                            Import
                          </v-btn>
                      </v-row>
                      </v-radio-group>
                      
                    </v-card-actions>
                    <v-row style="padding-left: 10px;">
                      <v-card-title
                        style="font-weight: bold !important; color:white;display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                      padding-left :10px !important; padding-right :3px !important; font-size: 18px !important;" 
                      >
                        Google Calendar:
                      </v-card-title>
                      <v-card-actions>
                      <v-btn outlined color="white" style="padding-left:10px;">
                        Login to Google
                      </v-btn>
                      </v-card-actions>
                      </v-row>
                      <v-row style="padding-left: 10px;">
                      <v-card-title
                        style="font-weight: bold !important; color:white;display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                      padding-left :10px !important; padding-right :3px !important; font-size: 18px !important;" 
                      >
                        Quick Links:
                      </v-card-title>
                      <v-card-actions>
                      <a href="https://www.google.com" target="_blank">

                      <v-img width="50px" src="@/assets/google_calendar.png" ></v-img>
                      </a>
                      <a href="https://nusmods.com/timetable/sem-1" target="_blank">
                      <v-img width="50px" src="@/assets/NUSMods_logo.png"></v-img>
                      </a>
                      </v-card-actions>
                      </v-row>
                      
                  </v-col>
                </v-row>

              </v-card>
              </v-card>
            <!-- </v-container> -->
             </div>
             <div v-if="currMeetingPending!== null">
            <!-- <v-container :class="`rounded-xl`" style="max-width:1450px !important; width: 80vw;  margin-left: 0.5vw; margin-right:3vw;"> -->
              <v-card
                outlined
                color="#FFE4CB"
                style="max-height: 61vh; overflow-y: scroll; "
                :class="`rounded-xl`"
              >
                <span style="color:#ff9d66; font-weight:bold; padding: 10px; font-size: 20px; display:flex; justify-content:flex-start;"> 
                  {{currMeetingPending.title}}</span>
                <v-card
                  outlined
                  color="#ff9d66"
                  style="padding: 20px;  max-height: 61vh"
                  :class="`rounded-lg`"
                >
                <v-card-title color="#4b4b4b">
                  Current Timetable
                </v-card-title>
                <v-row>
                  <v-col col="12" md="6">
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col col="12" md="6">
                     
        
                      <v-row style="padding-left: 10px;">
                      <v-card-title
                        style="font-weight: bold !important; color:white;display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                      padding-left :10px !important; padding-right :3px !important; font-size: 18px !important;" 
                      >
                        Quick Links:
                      </v-card-title>
                      <v-card-actions>
                      <a href="https://www.google.com" target="_blank">

                      <v-img width="50px" src="@/assets/google_calendar.png" ></v-img>
                      </a>
                      <a href="https://nusmods.com/timetable/sem-1" target="_blank">
                      <v-img width="50px" src="@/assets/NUSMods_logo.png"></v-img>
                      </a>
                      </v-card-actions>
                      </v-row>
                      
                  </v-col>
                </v-row>

              </v-card>
              </v-card>
            <!-- </v-container> -->
             </div>
             <div v-if="currMeetingConfirmation!== null">
            <!-- <v-container :class="`rounded-xl`" style="max-width:1450px !important; width: 80vw;  margin-left: 0.5vw; margin-right:3vw;"> -->
              <v-card
                outlined
                color="#FFE4CB"
                style="max-height: 61vh; overflow-y: scroll; "
                :class="`rounded-xl`"
              >
                <span style="color:#ff9d66; font-weight:bold; padding: 10px; font-size: 20px; display:flex; justify-content:flex-start;"> 
                  {{currMeetingConfirmation.title}}</span>
                <v-card
                  outlined
                  color="#ff9d66"
                  style="padding: 20px;  max-height: 61vh"
                  :class="`rounded-lg`"
                >
                <v-card-title color="#4b4b4b">
                  Current Timetable
                </v-card-title>
                <v-row>
                  <v-col col="12" md="6">
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col col="12" md="6">
                     
        
                      <v-row style="padding-left: 10px;">
                      <v-card-title
                        style="font-weight: bold !important; color:white;display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                      padding-left :10px !important; padding-right :3px !important; font-size: 18px !important;" 
                      >
                        Quick Links:
                      </v-card-title>
                      <v-card-actions>
                      <a href="https://www.google.com" target="_blank">

                      <v-img width="50px" src="@/assets/google_calendar.png" ></v-img>
                      </a>
                      <a href="https://nusmods.com/timetable/sem-1" target="_blank">
                      <v-img width="50px" src="@/assets/NUSMods_logo.png"></v-img>
                      </a>
                      </v-card-actions>
                      </v-row>
                      
                  </v-col>
                </v-row>

              </v-card>
              </v-card>
            <!-- </v-container> -->
             </div>
             <div v-if="currMeetingInv== null && currMeetingConfirmation== null && currMeetingPending== null"
             style="display:flex; justify-content: center; align-items: center; flex-direction: column">
               <v-img src="@/assets/meeting_cartoon.png" width="150" style=" margin: 30px;"></v-img>
               <span style="font-weight: bold; font-size: 18px;"> You have not selected any meeting invitation, pending meeting or meeting confirmation yet </span>
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
import _ from "lodash";
import {findCommonTime} from "../services/firebaseService.ts";

export default {
  name: "Meeting.vue",
  data: () => ({
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
    dateSwitchValue: false,
    meetingVenue: "",
    tempGroupmates: [],
    navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "done" },
      { title: "Project", href: "./project", icon: "work" },
      { title: "Meeting", href: "./meeting", icon: "groups" },

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
    invitationsSlide:null,
    meetingCalendar: null,
    pickerDate: null,
    notes: [],
    allNotes: [
      'President met with prime minister',
      'New power plant opened',
      'Rocket launch announced',
      'Global warming discussion cancelled',
      'Company changed its location',
    ],
    displayMeetingCalendar: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    currMeetingInv: null,
    currMeetingPending: null,
    currMeetingConfirmation: null,
    importCalendarChoice: null,
    newCalendarURL: null,
    existingCalendarURL: null,
    pendingSlide: null,
    confirmationSlide: null,
    

  }),
  watch: {
      pickerDate (val) {
        this.notes = [
          this.allNotes[Math.floor(Math.random() * 5)],
          this.allNotes[Math.floor(Math.random() * 5)],
          this.allNotes[Math.floor(Math.random() * 5)],
        ].filter((value, index, self) => self.indexOf(value) === index)
      },
    },

  computed: {
      
    displayMeetingDateRange () {
      if(this.meetingDateRange.length == 0){
        return "Meeting Date Range"
      } else {
        if (this.meetingDateRange[0] > this.meetingDateRange[1]){
          let newMeetingDateRange = [];
          newMeetingDateRange.push(this.meetingDateRange[1])
          newMeetingDateRange.push(this.meetingDateRange[0])
          return newMeetingDateRange.join("~")
        }
        return this.meetingDateRange.join(' ~ ')

      }
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
    confirmationLength(){
      return this.$store.state.meetingConfirmations.length;

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
        ["asc", "asc","asc"]
      );
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
      console.log(progress)
      if (progress == null || progress == undefined ||  isNaN(progress) ){
        return 0
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
    // this.$store.dispatch('getTasks');
  },

  mounted() {
    this.meetingCalendar = [...Array(6)].map(() => {
        const day = Math.floor(Math.random() * 30)
        const d = new Date()
        d.setDate(day)
        return d.toISOString().substr(0, 10)
      })
    // this.$store.dispatch("getTasks");
  },

  methods: {
    async loadMeetingsCalendar(){
      this.currMeetingsLoaded = this.displayMeetingCalendar
    },

    remove(item) {
      this.groupmatesChips.splice(this.groupmatesChips.indexOf(item), 1);
      this.groupmatesChips = [...this.groupmatesChips];
      console.log(this.groupmatesChips)
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
      console.log(this.complete)
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
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
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
      this.myTodo = "";
      this.myProject = "";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.myDeadlineTime = "00:00";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.myNote = "";
      this.switchValue = false;
      this.displayDeadline = "Deadline";
      this.dateSwitchValue = false;
      this.groupmatesChips = [];
      this.varPIC = [];
      this.varPICId = [];
      this.oldGroupmatesChips = [];
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
    checkTempGroupmates(){
      let counter = 0;
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if(this.tempGroupmates[i].chipValue == true) {
          counter += 1
        }
      }
      return counter

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
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
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
      if (this.meetingDateRange[0] > this.meetingDateRange[1]){
        let newMeetingDateRange = [];
        newMeetingDateRange.push(this.meetingDateRange[1])
        newMeetingDateRange.push(this.meetingDateRange[0])
        this.meetingDateRange = newMeetingDateRange
        this.displayMeetingDateRange = this.meetingDateRange.join(' ~ ')
      }
      if (this.meetingDateRange.length == 1){
        this.meetingDateRange.push(this.meetingDateRange[0])
        this.displayMeetingDateRange = this.meetingDateRange.join(' ~ ')

      }
      console.log(this.groupmatesChips)
      const response = await db.collection("meeting").add({
        title: this.meetingTitle,
        _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        startDate: firebase.firestore.Timestamp.fromDate(new Date(this.meetingDateRange[0])),
        endDate: firebase.firestore.Timestamp.fromDate(new Date(this.meetingDateRange[1])),
        startTime: this.meetingStartTime,
        endTime: this.meetingEndTime,
        timeLength:this.meetingDuration,
        displayMeetingDateRange: this.displayMeetingDateRange,
        groupmates: await this.addGroupmatesToMeeting(response),
        meetingVenue: this.meetingVenue,
        timeslot:[],
        project: db.collection("project").doc(this.meetingProject),
        author: db.collection("user").doc(this.$store.state.user.uid)
      });
      // await this.addMeetingGroupmates(response);
      this.$store.dispatch("getMeetingInvitations")
      await db
        .collection("project")
        .doc(this.meetingProject)
        .update({ meetings: firebase.firestore.FieldValue.arrayUnion(response) })
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


    },

    async addGroupmatesToProject(project) {
      
      if (this.finalGroupmates.length == 0){
        this.finalGroupmates = this.oldGroupmates
      }
      
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        if (this.finalGroupmates[i] == this.$store.state.user.uid || this.oldGroupmates.includes(this.finalGroupmates[i])){
          db.collection("project")
            .doc(project.id)
            .update({
              groupmates: firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])
              ),
            });
        } else {
          db.collection("project").doc(project.id).update({groupmates_invited:firebase.firestore.FieldValue.arrayUnion(
                db.collection("user").doc(this.finalGroupmates[i])) })
        }
      }

      for (let i = 0; i < this.oldGroupmates.length; i++) {
        if (this.finalGroupmates.includes(this.oldGroupmates[i])) {
          console.log("they are still remaining in the project")
        
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

    async renderGroupmates() {
      this.tempGroupmates = [];
      this.groupmatesChips = [];
      const docRef = await db.collection("project").doc(this.meetingProject).get();
      const data = await docRef.get("groupmates");
      for (let i = 0; i < data.length; i++) {
        const currGroupmate = await data[i].get();
        this.tempGroupmates.push({
          id: currGroupmate.id,
          name: currGroupmate.get("name"),
          object: currGroupmate,
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        });
      }

      console.log(this.tempGroupmates)
      console.log(this.$store.state.user);
    },

    async addGroupmatesToMeeting(){
      if (this.groupmatesChips.length == 0){
        this.groupmatesChips = this.oldGroupmatesChipsObject
      }
      this.newGroupmatesChips = [];
      for(let i=0 ; i<this.groupmatesChips.length;i++){
        if(this.groupmatesChips[i].id == this.$store.state.user.uid){
          this.newGroupmatesChips.push(this.groupmatesChips[i])
          break;
        }
      }
      for(let i=0 ; i<this.groupmatesChips.length;i++){
        if(this.groupmatesChips[i].id !== this.$store.state.user.uid){
          this.newGroupmatesChips.push(this.groupmatesChips[i])
        }
      }
      this.groupmatesChips = this.newGroupmatesChips
      this.groupmatesChipsId = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        this.groupmatesChipsId.push(db.collection('user').doc(this.groupmatesChips[i].id));
      }
      console.log(this.groupmatesChipsId)
      return this.groupmatesChipsId 
    },

    async addMeetingGroupmates(meeting) {
      if (this.groupmatesChips.length == 0){
        this.groupmatesChips = this.oldGroupmatesChipsObject
      }
      this.newGroupmatesChips = [];
      for(let i=0 ; i<this.groupmatesChips.length;i++){
        if(this.groupmatesChips[i].id == this.$store.state.user.uid){
          this.newGroupmatesChips.push(this.groupmatesChips[i])
          break;
        }
      }
      for(let i=0 ; i<this.groupmatesChips.length;i++){
        if(this.groupmatesChips[i].id !== this.$store.state.user.uid){
          this.newGroupmatesChips.push(this.groupmatesChips[i])
        }
      }
      
      this.groupmatesChips = this.newGroupmatesChips
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

    async passCurrSelectedMeetingInv(meetingInv){
      console.log(meetingInv)
      this.currMeetingPending = null
      this.currMeetingConfirmation = null
      this.currMeetingInv = meetingInv
    },

    async passCurrSelectedMeetingPending(pending){
      this.currMeetingInv = null
      this.currMeetingConfirmation = null
      this.currMeetingPending = pending
    },
    async passCurrSelectedMeetingConfirmation(confirmation){
      this.currMeetingInv = null
      this.currMeetingPending = null
      this.currMeetingConfirmation = confirmation
    },


    
    async declineMeeting(meetingInv){
      console.log(meetingInv)
      db.collection('meeting').doc(meetingInv.id).update({
        invitations: firebase.firestore.FieldValue.arrayRemove(
          db.collection('user').doc(this.$store.state.user.uid)
        )
      })
      this.$store.dispatch("getMeetingInvitations")
      db.collection('meeting').doc(meetingInv.id).update({
        groupmates: firebase.firestore.FieldValue.arrayRemove(
          db.collection('user').doc(this.$store.state.user.uid)
        )
      })
      const getData = await db.collection('meeting').doc(meetingInv.id).get()
      const groupmatesLength = getData.get("groupmates")
      const getProject = await (meetingInv.project)
      if(groupmatesLength == 0){
        
        db.collection('project').doc(getProject.id).update({
          meetings: firebase.firestore.FieldValue.arrayRemove(
          db.collection('meeting').doc(meetingInv.id)
        )})
        db.collection('meeting').doc(meetingInv.id).delete()
      }
      
      
    },

    async quitMeeting(meeting){
      db.collection('meeting').doc(meeting.id).update({
        confirmedInvitations: firebase.firestore.FieldValue.arrayRemove(
          db.collection('user').doc(this.$store.state.user.uid)
        )
      })
      this.$store.dispatch("getMeetingPendings")
      this.$store.dispatch("getMeetingConfirmations")

      db.collection('meeting').doc(meeting.id).update({
        groupmates: firebase.firestore.FieldValue.arrayRemove(
          db.collection('user').doc(this.$store.state.user.uid)
        )
      })
      const getData = await db.collection('meeting').doc(meeting.id).get()
      const groupmatesLength = getData.get("groupmates")
      const getProject = await (meeting.project)
      if(groupmatesLength == 0){
        
        db.collection('project').doc(getProject.id).update({
          meetings: firebase.firestore.FieldValue.arrayRemove(
          db.collection('meeting').doc(meeting.id)
        )})
        db.collection('meeting').doc(meeting.id).delete()
      }
    },

    async importCalendar(link,meetingInv){
      let importStartDate= new Date(meetingInv.startDate + "T" + meetingInv.startTime + ":00+08:00").toISOString;
      let importEndDate = new Date(meetingInv.endDate + "T" + meetingInv.endTime + ":00+08:00").toISOString;;
      findCommonTime(link, importStartDate, importEndDate, meetingInv.id, this.$store.state.user.uid )
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");

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

.random-abc .v-input__control .v-input__slot .v-input--radio-group__input .v-input .v-input__append-outer{
  margin-top: 0px !important;
}
</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: #FFD5A5 !default
</style>
