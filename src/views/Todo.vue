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
                >Todos</span
              >
            </v-container>
          </div>
          <div>
            <v-container style="padding-top: 5px">
              <v-card
                color="#ff9d66"
                style="margin-left: auto; margin-right: auto"
                :class="`rounded-xl`"
                class="elevation-0"
              >
                <v-img
                  style="padding: 20px"
                  height="200px"
                  src="@/assets/todo_dashboard.png"
                >
                  <v-card-title style="padding-bottom: 0px">
                    <span
                      style="color: white; font-size: 28px; font-weight: bold"
                      >Your Overall Todos Progress</span
                    >
                  </v-card-title>
                  <v-card-text
                    style="
                      color: white;
                      display: flex;
                      font-weight: bold;
                      font-size: 36px;
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
                        class="progress-circular v-progress-circular__underlay"
                        :rotate="-90"
                        :size="100"
                        :width="10"
                        :value="this.totalTaskProgress * 100"
                        color="white"
                      >
                        <span style="font-size: 28px">{{
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
                      <span style="display: flex"
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
                </v-img>
              </v-card>
            </v-container>
          </div>

          <div>
            <v-container>
              <v-card
                outlined
                color="#FFE4CB"
                style="padding: 20px; overflow-y: scroll; max-height: 61vh"
                :class="`rounded-xl`"
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
                          getProjectMenu();
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
                      <v-form ref="form" v-model="valid" lazy-validation>
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
                                  v-model="myTodo"
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
                                  v-model="myProject"
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
                                <span style="color: rgb(113, 113, 113)"
                                  >Person In Charge</span
                                >
                                <div v-if="tempGroupmates">
                                  <v-combobox
                                    :disabled="this.myProject == null"
                                    item-text="name"
                                    item-value="id"
                                    v-model="groupmatesChips"
                                    item-color="#ff9d66"
                                    :items="tempGroupmates"
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
                                    style="display: flex; align-items: center"
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

                              <v-col cols="12" :class="`rounded-xl`">
                                <v-textarea
                                  name="input-7-1"
                                  label="Notes"
                                  rows="2"
                                  color="#ff9d66"
                                  v-model="myNote"
                                ></v-textarea>
                              </v-col>
                            </v-row>
                          </v-container>
                          <!--                    <small>*indicates required field</small>-->
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
                              this.myTodo == '' ||
                              this.myProject == null ||
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
                    </v-card>
                  </v-sheet>
                </v-dialog>
                <br />
                <div v-if="length">
                  <div v-for="(task, index) in orderedTasks" :key="task.id">
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
                              <div v-if="task.deadline !== null">
                                <span
                                  style="margin-left: 3vw"
                                  v-bind:class="{ completed: task.complete }"
                                  >{{
                                    task.deadline.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                    })
                                  }}</span
                                >
                              </div>
                              <div v-else>
                                <span
                                  style="margin-left: 3vw"
                                  v-bind:class="{ completed: task.complete }"
                                >
                                  Someday
                                </span>
                              </div>

                              <div v-if="task.deadline !== null">
                                <span
                                  class="centerAlign"
                                  style="margin-left: 3vw; font-size: 14px"
                                  v-bind:class="{ completed: task.complete }"
                                  >{{
                                    task.deadline.toLocaleTimeString([], {
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
                                style="padding-top: 20px; padding-bottom: 20px"
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
                                  v-bind:class="{ completed: task.complete }"
                                  >{{ task.task }}</span
                                >
                              </v-row>
                              <v-row style="margin: 0px">
                                <span
                                  style="font-weight: normal"
                                  v-bind:class="{ completed: task.complete }"
                                >
                                  {{ task.projectTitle }}</span
                                >
                              </v-row>
                              <v-row style="margin: 0px">
                                <span
                                  style="font-weight: lighter; font-size: 14px"
                                  v-bind:class="{ completed: task.complete }"
                                  >{{ task.note }}</span
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
                                  v-model="display[task.task]"
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
                                      @click="
                                        fillInfo(task);
                                        getProjectMenu();
                                      "
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
                                                  value="task.task"
                                                  :rules="nameRules"
                                                  v-model="myTodo"
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
                                                  @input="renderGroupmates"
                                                  color="#ff9d66"
                                                  v-model="myProject"
                                                  :rules="[
                                                    (v) =>
                                                      !!v ||
                                                      'Project is required',
                                                  ]"
                                                ></v-select>
                                              </v-col>
                                              <v-col
                                                cols="12"
                                                align="left"
                                                :class="`rounded-xl`"
                                              >
                                                <span
                                                  style="
                                                    color: rgb(113, 113, 113);
                                                  "
                                                  >Person In Charge</span
                                                >
                                                <div v-if="tempGroupmates">
                                                  <v-combobox
                                                    :disabled="
                                                      myProject == null
                                                    "
                                                    item-text="name"
                                                    item-value="id"
                                                    v-model="groupmatesChips"
                                                    item-color="#ff9d66"
                                                    :items="tempGroupmates"
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
                                                        :input-value="selected"
                                                        close
                                                        @click="
                                                          parent.selectItem(
                                                            item
                                                          )
                                                        "
                                                        @click:close="
                                                          remove(item)
                                                        "
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
                                                  v-model="menu[task.task]"
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
                                                    :disabled="
                                                      dateSwitchValue == 1
                                                    "
                                                    color="#ff9d66"
                                                    v-model="myDeadline"
                                                    @input="
                                                      menu[task.task] = false;
                                                      changeDisplayDeadline();
                                                    "
                                                  >
                                                    <v-switch
                                                      inset
                                                      hide-details
                                                      v-model="dateSwitchValue"
                                                      color="#ff9d66"
                                                      :label="`Someday`"
                                                      @change="
                                                        changeDisplayDeadline()
                                                      "
                                                    ></v-switch>
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
                                                      :ref="'timeMenu' + index"
                                                      v-model="time[task.task]"
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
                                                            switchValue == 0 ||
                                                            dateSwitchValue == 1
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
                                                        v-model="myDeadlineTime"
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
                                                            task.task
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
                                                  v-model="myNote"
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
                                              display[task.task] = false;
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
                                              display[task.task] = false;
                                              checkEdit(task);
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
                                  @click="deleteTask(task)"
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
                              <v-card outlined color="#ff9d66">
                                <v-checkbox
                                  class="centerAlign"
                                  :class="`theme--light`"
                                  color="white"
                                  hide-details
                                  dark
                                  v-model="task.complete"
                                  @click="completeTask(task)"
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
          </div>
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
  name: "Todo.vue",
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
    tempGroupmates: [],
    navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "done" },
      { title: "Project", href: "./project", icon: "work" },
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
  }),

  computed: {
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1);
    },
    length() {
      return this.$store.state.tasks.length;
    },
    orderedTasks: function () {
      return _.orderBy(
        this.$store.state.tasks,
        ["complete", "deadline"],
        ["asc", "asc"]
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
    this.$store.dispatch("getTasks");
  },

  methods: {
    remove(item) {
      this.groupmatesChips.splice(this.groupmatesChips.indexOf(item), 1);
      this.groupmatesChips = [...this.groupmatesChips];
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
      this.oldGroupmatesChips = await this.getPICId(task.PIC);
      console.log(this.oldGroupmatesChips);
      console.log(this.complete)
    },

    async getPIC(PIC) {
      console.log(PIC);
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
      const docRef = await db.collection("project").doc(this.myProject).get();
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

      console.log(this.$store.state.user);
    },

    async addFinalPIC(task) {
      this.groupmatesChipsId = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        this.groupmatesChipsId.push(this.groupmatesChips[i].id);
      }
      console.log(this.groupmatesChipsId);

      for (let i = 0; i < this.groupmatesChipsId.length; i++) {
        if (this.oldGroupmatesChips.includes(this.groupmatesChipsId[i])) {
          console.log("groupmate has already in charge the todo");
        } else {
          db.collection("user")
            .doc(this.groupmatesChipsId[i])
            .update({
              todo: firebase.firestore.FieldValue.arrayUnion(
                db.collection("todo").doc(task.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.oldGroupmatesChips.length; i++) {
        if (this.groupmatesChipsId.includes(this.oldGroupmatesChips[i])) {
          console.log("this groupmate is still in charge of the todo");
        } else {
          console.log(this.oldGroupmatesChips[i]);
          db.collection("user")
            .doc(this.oldGroupmatesChips[i])
            .update({
              todo: firebase.firestore.FieldValue.arrayRemove(
                db.collection("todo").doc(task.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        db.collection("todo")
          .doc(task.id)
          .update({
            PIC: firebase.firestore.FieldValue.arrayUnion(
              db.collection("user").doc(this.groupmatesChips[i].id)
            ),
          });
      }
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
</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: #FFD5A5 !default
</style>
