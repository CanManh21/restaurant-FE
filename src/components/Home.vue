<template>
  <div>
    <v-container style="background: #f3f4f3;" fluid grid-list-md>
      <div class="ps-3 pt-3 pe-3 pb-3 mb-5 rounded-lg box">
        <v-select style="width: 200px;" :items="['Tháng', 'Quý', 'Năm']" label="Thống kê theo" outlined dense hide-details
          class="d-inline-block ms-3" v-model="total_overview_filter"></v-select>
        <v-select style="width: 200px;" v-if="total_overview_filter == 'Tháng'" :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
          label="Tháng" outlined dense hide-details class="d-inline-block ms-3" v-model="total_overview_filter_month">
        </v-select>
        <v-select style="width: 200px;" v-if="total_overview_filter == 'Quý'" :items="[1, 2, 3, 4]" label="Quý" outlined
          dense hide-details class="d-inline-block ms-3" v-model="total_overview_filter_quarter"></v-select>
        <v-select style="width: 200px;" :items="years" label="Năm" outlined dense hide-details
          class="d-inline-block ms-3" v-model="total_overview_filter_year"></v-select>
        <v-select style="width: 200px;" :items="['Tổng', 'Điện', 'Nước', 'Rọn Phòng']" label="Chi tiết" outlined dense
          hide-details :class="(screenWidth < 950 ? '' : 'float-end ') + 'd-inline-block ms-3'"
          v-model="total_overview_filter_detail"></v-select>
      </div>
      <v-row wrap>
        <v-col :cols="responsive?12:9">
          <div style="overflow: auto;white-space: nowrap;" class="ps-3 pt-3 pe-3 pb-3 rounded-lg box">
            <Bar style="min-width: 800px;" :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
              :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles"
              :width="width" :height="height" />
          </div>
        </v-col>
        <v-col class="ms-0" :cols="responsive?12:3">
          <div class="ps-3 pt-3 pe-3 pb-3 rounded-lg total_over_view box">
            <h4 class="text-h5 mb-3">
              Tổng quan
            </h4>
            <v-row>
              <v-col cols="12">
                <v-card elevation="2" outlined class="rounded-lg white--text" color="" style="background: #373e98;">
                  <v-card-title>
                    Thanh Liên
                  </v-card-title>
                  <v-card-text>
                    <p class="text-h5 white--text">300.000.000 VND</p>
                    <span class="mb-0 white--text">Doanh Thu {{ total_overview_filter_detail }}</span>
                    <a><span class="float-end link text-decoration-underline  white--text">Chi tết</span></a>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card elevation="2" outlined class="rounded-lg white--text" style="background: #f16775;">
                  <v-card-title>
                    Hồng Liên 1 tầng
                  </v-card-title>
                  <v-card-text>
                    <p class="text-h5 white--text">300.000.000 VND</p>
                    <span class="mb-0 white--text">Doanh Thu {{ total_overview_filter_detail }}</span>
                    <a><span class="float-end link text-decoration-underline  white--text">Chi tết</span></a>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card elevation="2" outlined class="rounded-lg white--text" style="background: #ceb92c;">
                  <v-card-title>
                    Hồng Liên 2 tầng
                  </v-card-title>
                  <v-card-text>
                    <p class="text-h5 white--text">300.000.000 VND</p>
                    <span class="mb-0 white--text">Doanh Thu {{ total_overview_filter_detail }}</span>
                    <a><span class="float-end link text-decoration-underline  white--text">Chi tết</span></a>
                  </v-card-text>
                </v-card>
              </v-col>

            </v-row>

          </div>
        </v-col>

      </v-row>


    </v-container>
  </div>
</template>

<script>
import {
  screenHeight
} from "../Mixins/screenheight";
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  mixins: [screenHeight],
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
      default: 205
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => { }
    },
    plugins: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      chartData: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',],
        datasets: [
          { label: 'Thanh Liên', backgroundColor: '#373e98', data: [200, 20000, 30000, 200, 20000, 30000, 200, 20000, 30000, 200, 20000, 30000,] },
          { label: 'Hồng Liên 1 tầng', backgroundColor: '#f16775', data: [4000, 2000, 7000, 4000, 2000, 7000, 4000, 2000, 7000, 4000, 2000, 7000,] },
          { label: 'Hồng Liên 2 tầng', backgroundColor: '#fee36e', data: [200, 2000, 10000, 200, 2000, 10000, 200, 2000, 10000, 200, 2000, 10000,] },
        ]
      },
      chartOptions: {
        responsive: true
      },
      responsive: false,
      screen_size: 1,
      total_overview_filter: 'Tháng',
      total_overview_filter_detail: 'Tổng',
      total_overview_filter_month: (new Date()).getMonth() + 1,
      total_overview_filter_year: (new Date()).getFullYear(),
      total_overview_filter_quarter: ((new Date()).getMonth() + 1) < 4 ? 1 : ((new Date()).getMonth() + 1) < 7 ? 2 : ((new Date()).getMonth() + 1) < 10 ? 3 : 4,
      years: [],
    }
  },

  methods: {
    onResize() {
      if (window.innerWidth > 700) {
        this.responsive = false;
        this.screen_size = 1;
      }
      else if (window.innerWidth > 500) {
        this.responsive = true;
        this.screen_size = 2;
      } else {
        this.responsive = true;
        this.screen_size = 3;
      }
    },
    load_year() {
      const date = new Date();
      this.years = [];
      for (var i = 0; i < 21; i++) {
        this.years.push(date.getFullYear() - i);
      }
    }

  },
  created() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.load_year();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style>
.box {
  border: 1px solid rgb(0 0 0 / 5%);
  background: white;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);
}
</style>
