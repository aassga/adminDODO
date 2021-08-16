<template>
  <div class="content">
    <div class="tableHead">
      <div>
        <el-input
          v-model="keyWords"
          placeholder="网址"
          style="width: 500px"
        ></el-input>
      </div>
      <div>
        <el-select
          v-model="value"
          style="width: 120px"
          placeholder="每頁顯示數量"
          @change="pageChangeNum"
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
      <div><el-button type="primary" @click="search()">查询</el-button></div>
    </div>
    <div class="table">
      <Tables
        :data="table.data"
        :rows="table.rows"
        :page="table.page"
        :columns="table.columns"
        :tableOption="table.tableOption"
        style="width: 100%"
        :loading="table.loading"
        :curPage="table.curPage"
        :label="table.label"
        @clickButton="editButton"
        @sortChange="sortChange"
        @pageChange="pageChange"
        @copyUrl="copyUrl"
        :total="table.total"
      >
      </Tables>
    </div>
    <div class="addKey">
      <Dailog
        title="设置備註欄內容"
        :width="'32%'"
        :height="310"
        :show.sync="keyShow"
      >
        <div slot="content" class="content">
          <el-form :model="formData" class="form">
            <el-input
              type="textarea"
              :rows="10"
              maxlength="200"
              show-word-limit
              placeholder="请输入備註欄內容"
              v-model="formData.remark"
            >
            </el-input>
          </el-form>
          <p class="tip">最多可輸入200字</p>
          <div class="footer">
            <span class="cancel" @click="cancel">取消</span>
            <span class="confirm" @click="submit">保存</span>
          </div>
        </div>
      </Dailog>
    </div>
  </div>
</template>

<script>
import Tables from "../../components/tables/table";
import Dailog from "../../components/dialogs/dialog";
import urlCopy from "@/libs/utils/urlCopy.js";
import { mapState } from "vuex";
import { setAdrankRemark } from "@/api";
import { getDomainList } from "_api/index.js";
import { getLocal } from "_util/utils.js";

export default {
  name: "AdRank",
  components: {
    Tables,
    Dailog,
  },
  data() {
    return {
      params: {
        sortBy: "pm_count",
        sortAsc: "desc",
        domain: "",
        page: 1,
        pageCount: 10,
        engine: getLocal("engine"),
      },
      formData: {
        id: "",
        remark: "",
      },
      value: 10,
      keyText: "",
      textArea: "",
      keyWords: "",
      keyShow: false,
      currentPage: 1,
      title: "",
      options: [
        {
          value: 10,
          label: "10",
        },
        {
          value: 20,
          label: "20",
        },
        {
          value: 30,
          label: "30",
        },
      ],
      table: {
        loading: false,
        label: "排名",
        rows: 10,
        total: 0,
        curPage: "adRank",
        columns: [
          {
            label: "域名",
            key: "domain",
            href:true
          },
          {
            label: "排名佔有量",
            key: "pm_count",
            sortable: true,
          },
          {
            label: "PC权重",
            key: "baidu_pc_br",
            sortable: true,
          },
          {
            label: "PC预估流量",
            key: "baidu_pc_uvcount",
            sortable: true,
          },
          {
            label: "移动权重",
            key: "baidu_m_br",
            sortable: true,
          },
          {
            label: "移动预估流量",
            key: "baidu_m_uvcount",
            sortable: true,
          },
          {
            label: "建站时间",
            key: "created_at",
            sortable: true,
          },
          {
            label: "備註",
            key: "remark",
          },
        ],
        data: [],
        tableOption: {
          label: "操作",
          options: [
            {
              label: "编辑",
              bgColor: "#5bbfdf",
              methods: "edit",
            },
          ],
        },
      },
    };
  },
  methods: {
    moment: function () {
      return moment();
    },
    getData(params) {
      this.table.loading = true;
      getDomainList(params)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.table.data.forEach((item) => {
              item.created_at = this.$moment(item.created_at * 1000).format(
                "YYYY-MM-DD"
              );
            });
            this.table.loading = false;
          }
        })
        .catch((err) => {
          this.table.data = [];
          this.table.total = 0;
          this.table.loading = false;
        });
    },
    pageChange(val) {
      this.params.page = val;
      this.currentPage = val;
      this.getData(this.params);
    },
    search() {
      this.params.page = 1;
      this.currentPage = 1;
      this.table.rows = this.value;
      this.params.domain = this.keyWords;
      this.params.pageCount = this.value;
      this.getData(this.params);
    },
    editButton(val) {
      this.title = "编辑";
      this.keyShow = true;
      this.formData.id = val.row.id;
      this.formData.remark = val.row.remark;
    },
    openKey() {
      this.keyShow = true;
    },
    submit() {
      setAdrankRemark(this.formData).then((res) => {
        if (res.code === 200 && res.status === "success") {
          this.addKey = false;
          this.$message({
            message: "编辑关键字成功！",
            type: "success",
          });
          this.params.page = 1;
          this.getData(this.params);
          this.keyShow = false;
        } else if (res.code === 400 && res.status === "error") {
          this.addKey = false;
          this.$message({
            message: "備註欄位不可為空白！",
            type: "success",
          });
        }
      });
    },
    cancel() {
      this.keyText = "";
      this.keyShow = false;
    },
    copyUrl({ raw, column }) {
      let copyUrl = raw.domain;
      if (column.label == "域名") {
        urlCopy(copyUrl);
      }
    },
    //排序
    sortChange({ prop, order }) {
      this.params.sortBy = prop;
      this.params.sortAsc = order == "descending" ? "desc" : "asc";
      this.getData(this.params);
    },
    //更改當前顯示數量
    pageChangeNum(val) {
      //前筆數開始範圍
      this.value = val;
      this.table.rows = this.value;
      this.params.page = 1;
      this.params.pageCount = this.value;
      this.getData(this.params);
      this.currentPage = 1;
    },
  },
  mounted() {
    this.getData(this.params);
  },
  computed: {
    ...mapState(["token", "engine"]),
  },
  watch: {
    engine(n) {
      this.currentPage = 1;
      this.params.page = 1;
      this.params.engine = n;
      this.getData(this.params);
      this.$forceUpdate();
    },
  },
};
</script>
   
<style lang="scss" scoped>
.tip {
  margin: 15px 0px 0px 0 !important;
}
</style>