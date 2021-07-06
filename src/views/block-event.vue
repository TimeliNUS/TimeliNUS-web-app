<template>
  <div class="schedule-vue-sample">
    <div class="col-md-12 control-section">
      <div class="content-wrapper">
        <ejs-schedule
          id="Schedule"
          :selectedDate="selectedDate"
          :eventSettings="eventSettings"
          :currentView="currentView"
          :readonly="readonly"
        ></ejs-schedule>
      </div>
    </div>
  </div>
  <!-- <div class="col-md-12 control-section">
            <div class="schedule-container">
                <ejs-schedule id='Schedule' ref="ScheduleObj" height="650px" :cssClass='cssClass' :selectedDate='selectedDate' :eventSettings='eventSettings'
                    :group='group' :currentView='currentView' :resourceHeaderTemplate='resourceHeaderTemplate'>
                    <e-views>
                        <e-view option="Day"></e-view>
                        <e-view option="TimelineDay"></e-view>
                        <e-view option="TimelineMonth"></e-view>
                    </e-views>
                    <e-resources>
                        <e-resource field='EmployeeId' title='Employees' name='Employee' :dataSource='employeeDataSource'
                            textField='Text' idField='Id' groupIDField='GroupId' colorField='Color'>
                        </e-resource>
                    </e-resources>
                </ejs-schedule>
            </div>
            
        </div> -->
  <!-- </div> -->
</template>
<style>
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css";
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
</style>

<script>
import firebase from "firebase";
import { db } from "../main.ts";
import Vue from "vue";
import { extend } from "@syncfusion/ej2-base";
import { getBlockedTimeSlot } from "../services/dataSource";
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

// var resourceHeaderVue = Vue.component("resource-headerTemplate", {
//     template: '<div className="template-wrap"><div class="employee-category"><div><img class="employee-image" :src="getImage" :alt="getImage"/></div><div class="employee-name">' +
//               '{{getEmployeeName(data)}}</div><div class="employee-designation">{{getEmployeeDesignation(data)}}</div></div></div>',
//     data() {
//         return {
//             data: {}
//         };
//     },
//     computed: {
//         getImage: function() {
//             return './source/schedule/images/' + this.getEmployeeName(this.data).toLowerCase() + '.png';
//         }
//     },
//     methods: {
//         getEmployeeName: function (data) {
//             let value = JSON.parse(JSON.stringify(data));
//             return (value.resourceData) ? value.resourceData[value.resource.textField] : value.resourceName;
//         },
//         getEmployeeDesignation: function (data) {
//             let value = JSON.parse(JSON.stringify(data));
//             return value.resourceData.Designation;
//         }
//     }
// });

export default {
  name: "BlockEvent.vue",
  data: () => {
    return {
      selectedDate: new Date(),
      readonly: false,
      eventSettings: [],
      currentView: "Week",
    };
  },
  created: async function () {
    await getBlockedTimeSlot().then(
      (result) =>
        (this.eventSettings = { dataSource: extend([], result, null, true) })
    );
  },

  provide: {
    schedule: [Day, Week, WorkWeek, Month],
  },
};
</script>
