import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { SchedulePlugin } from '@syncfusion/ej2-vue-schedule';



Vue.use(Vuetify);
Vue.use(SchedulePlugin);


export default new Vuetify({
  icons: {
    iconfont: "md",
  },
});
