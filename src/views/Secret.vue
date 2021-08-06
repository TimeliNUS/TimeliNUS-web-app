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

      <v-row
        class="content"
        style="flex: 1; margin: 0; flex-direction: column; flex-wrap: nowrap"
      >
        <v-row style="margin: 10px 0 0 12px">
          <v-icon
            class="navigation_button"
            large
            v-on:click="setNavigationBarActive"
            style="padding-left: 10px; padding-right: 10px"
            >menu</v-icon
          >
          <span
            class="dashboard_title"
            style="
              color: #4b4b4b;
              display: flex;
              align-items: flex-end;
              font-weight: bold;
              margin-top: 5px;
            "
          >
            Welcome! {{ this.$store.state.displayUser.name }}
          </span>
        </v-row>
        <v-row style="margin: 0">
          <v-col col="12" md="8">
            <v-row
              style="
                margin-right: auto;
                margin-left: auto;
                display: flex;
                justify-content: center;
              "
            >
              <v-col col="12">
                <v-card
                  min-height="38vh"
                  outlined
                  color="#FFE4CB"
                  style="display: flex; flex-direction: column; flex: 1"
                  :class="`rounded-xl`"
                  height="100%"
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
                        margin-left: 3vw;
                        color: #4b4b4b;
                        font-size: 20px;
                        display: flex;
                        align-items: flex-start;
                        font-weight: bold;
                      "
                      >Projects</span
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
                      @click="$router.push('/project')"
                    >
                      View All
                    </v-btn>
                  </div>
                  <div
                    v-if="projectLength"
                    class="project_list"
                    style="
                      display: flex;
                      flex-direction: row;
                      max-width: 60vw;
                      height: 80%;
                    "
                  >
                    <v-sheet
                      :class="`rounded-xl`"
                      class="mx-auto"
                      elevation="0"
                      max-width="100%"
                      height="100%"
                      style="background-color: #ffe4cb"
                    >
                      <v-slide-group
                        v-model="projectSlide"
                        active-class="success"
                        show-arrows
                        style="height: 100%"
                      >
                        <v-slide-item
                          v-for="project in this.$store.state.projects"
                          :key="project.id"
                          v-slot="{ active }"
                        >
                          <v-card
                            :class="`rounded-xl`"
                            :color="active ? undefined : 'white'"
                            class="ma-2"
                            height="100%"
                            width="250"
                            outlined
                            style="
                              padding: 10px;
                              padding-left: 14px;
                              display: flex;
                              flex-direction: column;
                            "
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
                            </v-row>
                            <v-row
                              style="padding: 13px; flex: 0; margin-bottom: 5px"
                            >
                              <span
                                style="
                                  display: flex;
                                  align-items: center;
                                  padding: 3px;
                                  padding-top:0px !important
                                  padding-bottom: 0px!important;
                                  font-size: 14px;
                                  color: #999999;
                                "
                                ><v-icon
                                  color="#999999"
                                  width="20px"
                                  style="padding: 3px; padding-right: 10px"
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
                                    padding-top: 0px;
                                    padding-bottom: 7px;
                                    font-size: 14px;
                                    align-items: center;
                                    color: #999999;
                                  "
                                  ><v-icon
                                    color="#999999"
                                    width="20px"
                                    style="padding: 3px; padding-right: 10px"
                                    >check_circle</v-icon
                                  >
                                  {{ project.incompletedTodoLength }}
                                  Incompleted Todo
                                </span>
                              </div>

                              <v-progress-linear
                                style="
                                  display: flex;
                                  justify-content: center;
                                  align-item: center;
                                "
                                :rotate="-90"
                                :size="60"
                                :width="8"
                                :value="project.progress * 100"
                                color="#ff7200"
                              >
                                <!-- <span style="font-weight: bold">{{
                                      Math.trunc(project.progress * 100) + "%"
                                    }}</span> -->
                              </v-progress-linear>
                            </v-row>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-sheet>
                  </div>
                  <div
                    v-else
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 11vh;
                    "
                  >
                    <span
                      style="color: #4b4b4b; font-weight: bold; font-size: 18px"
                      >You do not have any project yet. Create one or accept a
                      project invitation.</span
                    >
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-container
                  style="
                    margin-right: auto;
                    margin-left: auto;
                    display: flex;
                    justify-content: flex-start;
                    flex-direction: column;
                  "
                >
                  <div style="padding: 8px; display: flex; flex-direction: row">
                    <span
                      style="
                        margin-top: 10px;
                        color: #4b4b4b;
                        font-size: 20px;
                        display: flex;
                        align-items: flex-start;
                        font-weight: bold;
                      "
                      >Today's Meetings</span
                    >
                  </div>

                  <v-card
                    color="white"
                    outlined
                    :class="`rounded-xl`"
                    style="
                      padding: 10px;
                      font-size: 15px;
                      display: flex;
                      justify-content: center;
                      overflow-y: auto;
                    "
                    min-height="40vh"
                    max-height="40vh"
                  >
                    <div v-if="checkTodayMeetingLength()" style="width: 100%">
                      <div
                        v-for="meeting in this.$store.state.confirmedMeetings"
                        :key="meeting.id"
                        style="width: 100%"
                      >
                        <div
                          v-if="checkTodayMeetingOrNot(meeting)"
                          style="width: 100%"
                        >
                          <v-card
                            color="white"
                            outlined
                            style="
                              padding: 20px;
                              display: flex;
                              flex-direction: column;
                              justify-content: flex-start;
                              align-items: stretch;
                            "
                            :class="`rounded-xl`"
                          >
                            <span
                              style="
                                display: flex;
                                justify-content: flex-start;
                                padding-bottom: 5px;
                              "
                              >{{ meeting.project.get("modCode") }}
                              {{ meeting.project.get("title") }}</span
                            >
                            <span
                              style="
                                display: flex;
                                justify-content: flex-start;
                                padding-bottom: 5px;
                              "
                              >{{ meeting.title }}</span
                            >
                            <div
                              style="
                                padding-top: 3px;
                                padding-bottom: 5px;
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
                              style="
                                display: flex;
                                justify-content: space-between;
                                padding-bottom: 5px;
                              "
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
                            <div
                              style="display: flex; justify-content: flex-start"
                            >
                              <span
                                v-if="
                                  displaySelectedTimeDifference(
                                    meeting.selectedStartDate
                                  ) >= 0 &&
                                  Math.trunc(
                                    displaySelectedTimeDifference(
                                      meeting.selectedStartDate
                                    ) /
                                      1000 /
                                      60 /
                                      60
                                  ) > 0
                                "
                                ><v-icon color="#ff9d66"
                                  >hourglass_bottom</v-icon
                                >

                                In
                                {{
                                  Math.trunc(
                                    displaySelectedTimeDifference(
                                      meeting.selectedStartDate
                                    ) /
                                      1000 /
                                      60 /
                                      60
                                  )
                                }}
                                hours
                              </span>

                              <span
                                v-if="
                                  displaySelectedTimeDifference(
                                    meeting.selectedStartDate
                                  ) >= 0 &&
                                  Math.trunc(
                                    displaySelectedTimeDifference(
                                      meeting.selectedStartDate
                                    ) /
                                      1000 /
                                      60 /
                                      60
                                  ) == 0
                                "
                                ><v-icon color="#ff9d66"
                                  >hourglass_bottom</v-icon
                                >

                                In
                                {{
                                  Math.trunc(
                                    displaySelectedTimeDifference(
                                      meeting.selectedStartDate
                                    ) /
                                      1000 /
                                      60
                                  )
                                }}
                                minutes
                              </span>

                              <span
                                v-if="
                                  displaySelectedTimeDifference(
                                    meeting.selectedStartDate
                                  ) < 0 &&
                                  Math.trunc(
                                    displaySelectedTimeDifference(
                                      meeting.selectedStartDate
                                    ) /
                                      1000 /
                                      60 /
                                      60
                                  ) == 0
                                "
                                ><v-icon color="#ff9d66"
                                  >hourglass_bottom</v-icon
                                >
                                Expired by
                                {{
                                  Math.trunc(
                                    displaySelectedTimeDifference(
                                      meeting.selectedStartDate
                                    ) /
                                      1000 /
                                      60 /
                                      60
                                  ) * -1
                                }}
                                hours
                              </span>

                              <v-btn
                                v-if="
                                  meeting.isOnlineVenue == true &&
                                  meeting.meetingLink !== 'No meeting link'
                                "
                                style="margin-left: 2vw"
                                outlined
                                rounded
                                color="#ff9d66"
                                small
                                :href="meeting.meetingLink"
                                >Join Now</v-btn
                              >
                            </div>
                          </v-card>
                          <v-divider style="color: #ff9d66"></v-divider>
                        </div>
                      </div>
                    </div>
                    <div v-else style="padding-top: 18vh">
                      <span style="font-weight: bold; color: #4b4b4b">
                        You do not have any meeting this day.
                      </span>
                    </div>
                    <br />
                  </v-card>
                </v-container>
              </v-col>
              <v-col cols="12" md="6">
                <v-container
                  style="
                    margin-right: auto;
                    margin-left: auto;
                    display: flex;
                    justify-content: flex-start;
                    flex-direction: column;
                  "
                >
                  <div style="padding: 8px; display: flex; flex-direction: row">
                    <span
                      style="
                        margin-top: 10px;
                        color: #4b4b4b;
                        font-size: 20px;
                        display: flex;
                        align-items: flex-start;
                        font-weight: bold;
                      "
                      >Today's Todos</span
                    >
                  </div>
                  <v-card
                    color="#ff9d66"
                    outlined
                    :class="`rounded-xl`"
                    style="padding: 10px; overflow-y: auto"
                    min-height="40vh"
                    max-height="40vh"
                  >
                    <div v-if="checkTodayTaskDashboardLength()">
                      <v-card-text
                        style="
                          color: white;
                          display: flex;
                          font-weight: bold;

                          font-family: MuseoModerno, sans-serif;
                        "
                      >
                        <v-col
                          col="12"
                          md="6"
                          style="
                            padding-bottom: 16px;
                            display: flex;
                            justify-content: flex-end;
                          "
                        >
                          <v-progress-circular
                            class="
                              progress-circular
                              v-progress-circular__underlay
                            "
                            :rotate="-90"
                            :size="80"
                            :width="10"
                            :value="this.totalTaskProgress * 100"
                            color="white"
                          >
                            <span style="font-size: 18px">{{
                              Math.trunc(this.totalTaskProgress * 100) + "%"
                            }}</span>
                          </v-progress-circular>
                        </v-col>

                        <v-col
                          col="12"
                          md="6"
                          style="
                            display: flex;
                            justify-content: center;
                            flex-direction: column;
                          "
                        >
                          <span style="display: flex; font-size: 24px"
                            >{{ totalTaskDone }} / {{ totalTask }}</span
                          >
                          <span
                            style="
                              display: flex;
                              font-family: DM Sans, sans-serif;
                              font-size: 18px;
                              font-weight: bold;
                            "
                            >Completed</span
                          >
                        </v-col>
                      </v-card-text>
                      <div
                        v-for="project in this.$store.state.todayProjects"
                        :key="project.id"
                        style="margin-left: 0.5vw; margin-right: 0.5vw"
                      >
                        <div v-if="project.todos.length !== 0">
                          <v-card
                            outlined
                            color="white"
                            :class="`rounded-xl`"
                            style="text-align: left; padding: 20px"
                          >
                            <div style="padding: 5px">
                              <span style="color: #ff9d66"
                                >{{ project.modCode }} {{ project.title }}</span
                              >
                            </div>
                            <v-divider style="padding: 5px"></v-divider>

                            <div
                              v-for="todo in project.todos"
                              :key="todo.id"
                              style="
                                padding: 5px;
                                display: flex;
                                justify-content: space-between;
                              "
                            >
                              <span
                                style="padding: 5px; color: #ff9d66"
                                v-bind:class="{ completed: todo.complete }"
                                >{{ todo.task }}</span
                              >

                              <v-checkbox
                                class="centerAlign"
                                color="#ff9d66"
                                hide-details
                                style="margin-top: 0px !important"
                                v-model="todo.complete"
                                @click="completeTask(todo)"
                              />
                            </div>
                          </v-card>
                          <br />
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      style="
                        padding-top: 18vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <span style="color: white; font-weight: bold"
                        >You don't have any todos today.</span
                      >
                    </div>
                  </v-card>
                </v-container>
              </v-col>
            </v-row>
          </v-col>
          <v-col col="12" md="4">
            <div
              style="
                margin-right: auto;
                margin-left: auto;
                display: flex;
                justify-content: flex-start;
                flex-direction: column;
                height: 100%;
              "
            >
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  height: 100%;
                "
              >
                <v-date-picker
                  ref="picker"
                  v-model="date"
                  :events="dashboardCalendar()"
                  :event-color="(date) => checkEvents(date)"
                  color="#ff9d66"
                  width="100%"
                  height="100"
                >
                </v-date-picker>
                <v-card
                  width="100%"
                  min-height="45vh"
                  outlined
                  color="#FFE4CB"
                  style="
                    padding: 14px;
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    font-size: 15px;
                    overflow-y: scroll;
                    overflow: hidden;
                    margin-bottom: 36px;
                  "
                  :class="`rounded-b-xl`"
                >
                  <v-card-text
                    style="
                      font-weight: bold;
                      font-size: 18px;
                      display: flex;
                      text-align: left;
                    "
                  >
                    Meetings on {{ date }}
                  </v-card-text>
                  <div v-if="checkThisDayMeetingLength()">
                    <div
                      v-for="meeting in this.$store.state.confirmedMeetings"
                      :key="meeting.id"
                    >
                      <div v-if="checkMeetingDate(meeting)">
                        <v-card
                          color="white"
                          outlined
                          style="
                            color: #ff9d66;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: stretch !important;
                            margin-bottom: 16px !important;
                            font-size: 15px;
                          "
                          :class="`rounded-xl`"
                        >
                          <span
                            style="display: flex; justify-content: flex-start"
                            >{{ meeting.project.get("modCode") }}
                            {{ meeting.project.get("title") }}</span
                          >
                          <span
                            style="
                              text-align: left;
                              display: flex;
                              justify-content: flex-start;
                            "
                            >{{ meeting.title }}</span
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
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
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
                            ><span style="margin-left: 1vw"
                              ><v-icon color="#ff9d66">place</v-icon>
                              {{ meeting.venue }}</span
                            >
                          </div>
                          <!-- <span><v-icon color="#ff9d66">place</v-icon> 
              {{meeting.venue}} </span> -->
                        </v-card>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    style="
                      display: flex;
                      padding-left: 16px;
                      padding-bottom: 16px;
                    "
                  >
                    <span> You don't have any meeting this day. </span>
                  </div>
                  <v-card-text
                    style="
                      font-weight: bold;
                      font-size: 18px;
                      display: flex;
                      text-align: left;
                    "
                  >
                    Todos on {{ date }}
                  </v-card-text>

                  <div v-if="checkTodayTaskLength()">
                    <div
                      v-for="project in this.$store.state.calendarProjects"
                      :key="project.id"
                    >
                      <div
                        v-if="
                          project.todos.length !== 0 &&
                          checkTodoDate(project.todos)
                        "
                      >
                        <!-- <v-card outlined color="white" :class="`rounded-xl`" style="text-align:left; padding: 20px;">
                        <div style="padding:5px;">
                        <span style="color: #ff9d66;" >{{project.modCode}} {{project.title}}</span>
                        </div>
                        <v-divider style="padding:5px;"></v-divider>
                        
                        <div v-for="todo in project.todos" :key="todo.id" style="padding:5px; display:flex; justify-content:space-between;">
                          <div v-if="changeTodoDate(todo.deadline) === date">
                          <span style="padding:5px; color: #ff9d66" v-bind:class="{ completed: todo.complete }">{{todo.task}}</span>
                          <v-checkbox
                              class="centerAlign"
                              color="#ff9d66"
                              hide-details
                              style="margin-top:0px !important;"
                              v-model="todo.complete"
                              @click="completeTask(todo)"
                            />
                          
                          </div>
                        </div>

                      </v-card> -->

                        <!-- <div style="padding:5px;"> -->
                        <v-expansion-panels flat>
                          <v-expansion-panel
                            flat
                            :class="`rounded-lg`"
                            style="
                              margin-bottom: 10px;
                              min-width: 300px;
                              max-width: 300px;
                              box-shadow: none !important;
                            "
                          >
                            <v-expansion-panel-header style="color: #ff9d66"
                              >{{ project.modCode }}
                              {{ project.title }}</v-expansion-panel-header
                            >

                            <v-expansion-panel-content>
                              <v-divider style="padding: 5px"></v-divider>

                              <div v-for="todo in project.todos" :key="todo.id">
                                <div
                                  v-if="changeTodoDate(todo.deadline) === date"
                                  style="
                                    padding: 5px;
                                    display: flex;
                                    justify-content: space-between;
                                  "
                                >
                                  <span
                                    style="padding: 5px; color: #ff9d66"
                                    v-bind:class="{
                                      completed: todo.complete,
                                    }"
                                    >{{ todo.task }}</span
                                  >
                                  <v-checkbox
                                    class="centerAlign"
                                    color="#ff9d66"
                                    hide-details
                                    style="margin-top: 0px !important"
                                    v-model="todo.complete"
                                    @click="completeTask(todo)"
                                  />
                                </div>
                                <div
                                  v-else
                                  style="
                                    padding: 0px;
                                    display: flex;
                                    justify-content: space-between;
                                  "
                                ></div>
                              </div>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </div>

                      <!-- <br> -->
                      <!-- </div> -->
                    </div>
                  </div>
                  <div v-else style="display: flex; padding-left: 16px">
                    <span>You don't have any todo this day.</span>
                  </div>
                </v-card>
              </div>
              <div></div>
            </div>
          </v-col>
        </v-row>
      </v-row>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../main.ts";
import _ from "lodash";

export default {
  name: "Secret.vue",

  data() {
    return {
      projectSlide: null,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      events: null,
      navItems: [
        { title: "Dashboard", href: "./secret", icon: "dashboard" },
        { title: "Todo", href: "./todo", icon: "check_circle" },
        { title: "Project", href: "./project", icon: "work" },
        { title: "Meeting", href: "./meeting", icon: "groups" },
        { title: "Profile", href: "./profile", icon: "account_circle" },
      ],
      chips: [],
      groupmates: [
        {
          title: "Jin 1",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        },
        {
          title: "Jin 2",
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        },
        {
          title: "Jin 3",
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        },
        {
          title: "Jin 4",
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        },
      ],
      search: "",
      users: [],
      usersNew: [],
      searchName: "",
      searchEmail: "",
      searchId: "",
      searchAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      isNavigationBarActive: false,
    };
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
  },

  computed: {
    orderedConfirmedMeetings: function () {
      return _.orderBy(
        this.$store.state.confirmedMeetings,
        ["projectTitle", "selectedStartDate", "selectedEndDate"],
        ["asc", "asc", "asc"]
      );
    },
    projectLength() {
      return this.$store.state.projects.length;
    },
    remaining() {
      return this.$store.getters.todayRemaining;
    },
    totalTask() {
      return this.$store.getters.todayTaskNumber;
    },
    totalTaskDone() {
      return this.$store.getters.todayTaskDone;
    },

    totalTaskProgress() {
      const progress = this.$store.getters.todayTaskProgress;
      console.log(progress);
      if (progress == null || progress == undefined || isNaN(progress)) {
        return 0;
      } else {
        return progress;
      }
    },
  },

  mounted() {
    // this.events = this.$store.state.tasks.map((todo) => {
    //   if (todo !== null && todo.deadline !== null) {
    //     console.log(todo);
    //     console.log(todo.deadline);
    //     console.log(todo.deadline.toLocaleDateString().substr(0, 10));
    //     const currLocalDate = todo.deadline.toLocaleDateString().substr(0, 10);
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
    // const day = Math.floor(Math.random() * 30)
    // const d = new Date()
    // d.setDate(day)
    // this.$store.dispatch("getTasks");
  },

  methods: {
    setNavigationBarActive() {
      console.log(this.isNavigationBarActive);
      this.isNavigationBarActive = !this.isNavigationBarActive;
    },
    checkTodayMeetingOrNot(meeting) {
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
      const today = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      console.log(today);
      if (newDate == today) {
        return true;
      }

      return false;
    },
    displaySelectedTimeDifference(startTime) {
      console.log(startTime);
      const now = new Date();
      const Difference_In_Time = startTime.toDate().getTime() - now.getTime();
      console.log(Difference_In_Time);
      return Difference_In_Time;
    },

    checkEvents(date) {
      let meeting = false;
      let todo = false;
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
        if (newDate == date) {
          meeting = true;
          break;
        }
      }

      for (let i = 0; i < this.$store.state.tasks.length; i++) {
        console.log(this.$store.state.tasks);
        const data = this.$store.state.tasks[i];
        console.log(data);
        console.log(date);
        if (data.deadline !== null) {
          const currLocalDate = data.deadline
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
          const PICid = [];
          // for(let j=0; j< data.PIC.length; j++){
          //   const pplID = data.PIC[j].id
          //   console.log(pplID)
          //   PICid.push(pplID)
          // }
          // console.log(PICid)

          if (newDate == date) {
            if (data.task == "try adding project") {
              console.log("tryaddingproject");
            }
            todo = true;
            break;
          }
        }
      }

      if (todo && meeting) {
        return ["#31f5a0", "blue"];
      } else if (todo) {
        return "#31f5a0";
      } else if (meeting) {
        return "blue";
      }
    },
    dashboardCalendar() {
      const calendar = [];
      for (let i = 0; i < this.$store.state.todoDashboardCalendar.length; i++) {
        console.log(data);
        const data = this.$store.state.todoDashboardCalendar[i];
        calendar.push(data.date);
      }
      console.log(calendar);
      return calendar;
    },
    calendarColor() {
      console.log(this.$store.state.todoDashboardCalendar);
      return "yellow";
      // if(meeting && todo){
      //   return ['yellow','blue']
      // } else if (meeting && todo==false){
      //   return 'yellow'
      // } else {
      //   return 'blue'
      // }
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
        const today = new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
        if (newDate == today) {
          return true;
        }
      }
      return false;
    },

    checkThisDayMeetingLength() {
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

        if (newDate == this.date) {
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
      if (newDate == this.date) {
        return true;
      }

      return false;
    },
    checkTodayTaskDashboardLength() {
      for (let i = 0; i < this.$store.state.tasks.length; i++) {
        console.log(this.$store.state.tasks);
        const data = this.$store.state.tasks[i];
        console.log(data);
        if (data.deadline !== null) {
          const currLocalDate = data.deadline
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
          const today = new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .substr(0, 10);
          // const PIC = await this.getPICId(data.PIC)
          const PICid = [];
          for (let j = 0; j < data.PIC.length; j++) {
            const pplID = data.PIC[j].id;
            console.log(pplID);
            PICid.push(pplID);
          }
          console.log(PICid);
          if (newDate == today && PICid.includes(this.$store.state.user.uid)) {
            return true;
          }
        }
      }
      return false;
    },

    async getPICId(PIC) {
      const TaskvarPICId = [];
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();
        TaskvarPICId.push(docRef.id);
      }

      return TaskvarPICId;
    },

    checkTodayTaskLength() {
      for (let i = 0; i < this.$store.state.tasks.length; i++) {
        console.log(this.$store.state.tasks);
        const data = this.$store.state.tasks[i];
        console.log(data);
        if (data.deadline !== null) {
          const currLocalDate = data.deadline
            .toLocaleDateString()
            .substr(0, 10);
          const currYear = currLocalDate.substr(6);
          const currMonth = currLocalDate.substr(3, 2);
          const currDate = currLocalDate.substr(0, 2);
          console.log(currLocalDate);
          console.log(currYear);
          console.log(currMonth);
          console.log(currDate);
          // const PIC = await this.getPICId(data.PIC)
          const newDate = currYear + "-" + currMonth + "-" + currDate;

          console.log(
            data.PIC.includes(
              db.collection("user").doc(this.$store.state.user.uid)
            )
          );
          console.log(db.collection("user").doc(this.$store.state.user.uid));
          console.log(data.PIC);
          console.log(
            newDate == this.date &&
              data.PIC.includes(
                db.collection("user").doc(this.$store.state.user.uid)
              )
          );
          const PICid = [];
          for (let j = 0; j < data.PIC.length; j++) {
            const pplID = data.PIC[j].id;
            console.log(pplID);
            PICid.push(pplID);
          }
          console.log(PICid);
          if (
            newDate == this.date &&
            PICid.includes(this.$store.state.user.uid)
          ) {
            console.log("true");
            return true;
          }
        }
      }
      console.log("false");
      return false;
    },
    checkTodoDate(todos) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].deadline !== null) {
          const currLocalDate = todos[i].deadline
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
          if (newDate == this.date) {
            return true;
          }
        }
      }
      return false;
    },

    changeTodoDate(date) {
      if (date !== null) {
        const currLocalDate = date.toLocaleDateString().substr(0, 10);
        const currYear = currLocalDate.substr(6);
        const currMonth = currLocalDate.substr(3, 2);
        const currDate = currLocalDate.substr(0, 2);
        console.log(currLocalDate);
        console.log(currYear);
        console.log(currMonth);
        console.log(currDate);
        const newDate = currYear + "-" + currMonth + "-" + currDate;
        return newDate;
      }
    },
    redirectToProject() {
      this.$router.push("/project");
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    onQueryChange(event) {
      // can be this.query.length === 0 as well
      if (this.search.length === 0 || this.search != this.searchName) {
        this.searchName = "";
        this.searchId = "";
        this.searchEmail = "";
      }
    },
    async signOut() {
      try {
        const data = await firebase.auth().signOut();
        console.log(data);
        this.$router.replace({ name: "Login" });
      } catch (err) {
        console.log(err);
      }
    },

    completeTask: function (task) {
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      });
      this.$store.dispatch("getProjects");
      this.$store.dispatch("getTasks");
      this.$store.dispatch("getTodayProjects");
      this.$store.dispatch("getCalendarProjects");
    },

    async getMatchedUserbyEmail() {
      db.collection("user")
        .where("email", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            (this.searchName = doc.data().name),
              (this.searchEmail = doc.data().email),
              (this.searchId = doc.id);

            this.users.push({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            });
            console.log(this.users);
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    async getMatchedUserbyName() {
      db.collection("user")
        .where("name", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            (this.searchName = doc.data().name),
              (this.searchEmail = doc.data().email),
              (this.searchId = doc.id);

            this.users.push({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            });
            console.log(this.users);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
  },
};
</script>

<style scoped>
.checkboxCol {
  color: white;
  background-color: #ff7200;
}

.avatar-bg {
  background-color: white;
  border-color: white;
}

.progress-circular >>> circle {
  stroke-linecap: round;
}

.centerAlign {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftAlign {
  display: flex;
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

.v-list--rounded .v-list-item,
.v-list--rounded .v-list-item::before,
.v-list--rounded .v-list-item > .v-ripple__container {
  border-radius: 20px !important;
}

.v-navigation-drawer__border {
  background-color: rgba(255, 255, 255, 1);
  border-color: white;
  color: white;
  height: 100vh !important;
  position: sticky;
}

.content {
  margin-left: 25px;
  max-width: calc(100% - 256px);
}

.navigation_button {
  display: none !important;
}

.navigation_title {
  margin: 0;
}

.dashboard_title {
  font-size: 32px;
  margin-left: 10px;
}

@media only screen and (max-width: 1200px) {
  .navigation_button {
    display: inline-flex !important;
  }

  .navigation_title {
    width: 0;
  }

  .dashboard_title {
    font-size: 20px;
    margin-left: 0px;
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
    margin-left: 0;
    max-width: 100%;
  }

  .project_list {
    max-width: 100% !important;
  }
}

.v-picker .div {
  width: 100% !important;
}

>>> .v-slide-group__next,
>>> .v-slide-group__prev {
  align-items: center;
  display: flex;
  flex: 0 1 32px;
  justify-content: center;
  min-width: 32px !important ;
}

/* .avatars {
  display: inline-flex;
  flex-direction: row-reverse;
}

.avatar {
  position: relative;
  border: 2px solid #fff;

  overflow: hidden;

}

.avatar:not(:last-child) {
  margin-left: -60px;
}

.avatar v-img {
  width: 100%;
  display: block;
} */
</style>
