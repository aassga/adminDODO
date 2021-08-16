<template>
  <div class="content">
    <!-- 表格欄位 -->
    <div class="table">
      <Tables
        :data="table.data"
        :columns="table.columns"
        :page="table.page"
        :rows="table.rows"
        :total="table.total"
        :loading="table.loading"
        :tableOption="table.tableOption"
        :curPage="table.curPage"
        :label="table.label"
        @clickButton="clickButton"
        @pageChange="pageChange"
        @copyUrl="copyUrl"
      >
      </Tables>
    </div>
    <!-- 新增備註 -->
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
import { setDashboardRemark } from "@/api";
import { getAdList } from "_api/index.js";

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
        page: 1,
        pageCount: 30,
        engine: localStorage.getItem("engine"),
      },
      formData: {
        id: "",
        remark: "",
      },
      textarea: "",
      keyText: "",
      keyShow: false,
      title: "",
      table: {
        loading: false,
        label: "排名",
        rows: 30,
        total: 0,
        curPage: "dashBoard",
        columns: [
          {
            label: "广告页面",
            key: "url",
            href:true
          },
          {
            label: "排名占有量",
            key: "pm_count",
          },
          // {
          //   label: "登录时间",
          //   key: "flag_date",
          // },
          {
            label: "備註",
            key: "remark",
          },
        ],
        data: [],
        // 表格操作
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
    getData(params) {
      this.table.loading = true;

      getAdList(params)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.table.loading = false;

            this.table.data.forEach((item) => {
              item.created_at = this.$moment(item.created_at * 1000).format(
                "YYYY-MM-DD"
              );
            });
          }
        })
        .catch((err) => {
          this.table.data = [];
          this.table.total = 0;
          this.table.loading = false;
        });
    },
    // 翻页
    pageChange(val) {
      this.params.page = val;
      this.getData(this.params);
    },
    clickButton(val) {
      // console.log(val)
      this.title = "编辑";
      this.keyShow = true;
      this.formData.id = val.row.id;
      this.formData.remark = val.row.remark;
    },
    openKey() {
      this.keyShow = true;
    },
    submit() {
      setDashboardRemark(this.formData).then((res) => {
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
      let copyUrl = raw.url;
      if (column.label == "广告页面") {
        urlCopy(copyUrl);
      }
    },
  },
  mounted() {
    this.getData(this.params);
  },
  computed: {
    ...mapState(["token", "engine"]),
  },
  watch: {
    engine(n, o) {
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