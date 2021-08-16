<template>
  <div class="content">
    <!-- 搜尋抬頭 -->
    <div class="tableHead">
      <div>
        <el-input placeholder="关键词" v-model="paramsData.key"></el-input>
      </div>
      <div>
        <el-input placeholder="网址" v-model="paramsData.domain"></el-input>
      </div>
      <div>
        <el-input placeholder="最终页面" v-model="paramsData.url"></el-input>
      </div>
      <div>
        <el-input placeholder="广告版" v-model="paramsData.ad_url"></el-input>
      </div>
      <div>
        <!-- 下拉選單 -->
        <div>
          <el-select
            v-model="paramsData.pageCount"
            @change="handleSizeChange"
            placeholder="10"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div><el-button type="primary" @click="search">查询</el-button></div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <Tables
        :data="table.data"
        :columns="table.columns"
        :page="table.page"
        :rows="table.rows"
        :total="table.total"
        :loading="table.loading"
        :curPage="table.curPage"
        :label="table.label"
        @pageChange="handleCurrentChange"
        @copyUrl="copyUrl"
      >
      </Tables>
    </div>
  </div>
</template>

<script>
import Tables from "../../components/tables/table";
import urlCopy from "@/libs/utils/urlCopy.js";
import { getBaiduList } from "@/api";
import { mapState } from "vuex";
import { getLocal } from "_util/utils.js";
export default {
  name: "Home",
  data() {
    return {
      paramsData: {
        key: "",
        domain: "",
        url: "",
        ad_url: "",
        sortBy: "key",
        sortAsc: "asc",
        engine: getLocal("engine"),
        page: 1,
        pageCount: 10,
      },
      options: [
        {
          value: "10",
          label: "10",
        },
        {
          value: "20",
          label: "20",
        },
        {
          value: "30",
          label: "30",
        },
        {
          value: "50",
          label: "50",
        },
        {
          value: "75",
          label: "75",
        },
        {
          value: "100",
          label: "100",
        },
      ],
      table: {
        loading: false,
        curPage: "Home",
        page: 1,
        rows: 10,
        total: 0,
        data: [],
        columns: [
          {
            label: "关键词",
            key: "key",
          },
          {
            label: "排名",
            key: "rank",
          },
          {
            label: "排名网址",
            key: "domain",
            href:true
          },
          {
            label: "最终页面",
            key: "url",
            href:true
          },
          {
            label: "广告版",
            key: "ad_url",
            href:true
          },
        ],
      },
    };
  },
  components: {
    Tables,
  },
  computed: {
    ...mapState(["token", "engine"]),
  },
  //更改引擎
  watch: {
    engine(n, o) {
      this.paramsData.engine = n;
      this.getData(this.paramsData);
    },
  },
  methods: {
    getData(params) {
      this.table.loading = true;
      getBaiduList(params)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.table.loading = false;
          } else {
            let text = res.message;
            this.$alert(`${text}`, "温馨提示", {
              confirmButtonText: "確定",
            });
            this.table.data = [];
            this.table.total = 0;
            this.table.loading = false;
          }
        })
        .catch((err) => {
          this.table.data = [];
          this.table.total = 0;
          this.table.loading = false;
        });
    },
    search() {
      this.paramsData.page = 1;
      this.table.page = 1;
      this.getData(this.paramsData);
    },
    //更改當前頁數
    handleCurrentChange(val) {
      this.table.page = val;
      this.paramsData.page = val;
      this.getData(this.paramsData);
    },
    // 更改當前顯示數量
    handleSizeChange(val) {
      this.table.rows = val;
      this.paramsData.pageCount = val;
      this.paramsData.page = 1;
      this.table.page = 1;
      this.getData(this.paramsData);
    },
    // 複製網址
    copyUrl({ raw, column, cell }) {
      let copyUrl = "";
      if (column.label == "排名网址" || column.label == "广告版") {
        copyUrl = cell.getElementsByClassName("cell")[0].outerText;

        urlCopy(copyUrl);
      } else if (column.label == "最终页面") {
        copyUrl = raw.base_url;
        urlCopy(copyUrl);
      }
    },
  },
  mounted() {
    this.getData(this.paramsData);
  },
};
</script>

<style lang="scss">
.gutter {
  display: initial !important;
}
</style>
