<template>
  <div class="table">
    <!-- 表格开始 -->
    <el-table
      ref="table"
      v-loading="loading"
      element-loading-text="加载中"
      :data="data"
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
      @selection-change="selectionChange"
      @cell-click="copyUrl"
    >
      <!-- prop是对应列内容的字段名 width是对应列宽度 sortable是是否排序 label是对应列名称 -->
      <el-table-column
        v-if="selection !== ''"
        :type="selection"
        width="55"
      ></el-table-column>
      <!-- 排名 -->
      <el-table-column
        :label="label"
        type="index"
        width="50"
        :index="settingIndex"
        v-if="
          curPage == 'adRank' ||
          curPage == 'dashBoard' ||
          curPage == 'domainRank'
        "
      >
      </el-table-column>

      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.key"
        :width="item.width ? item.width : ''"
        :sortable="item.sortable ? true : false"
        :label="item.label"
        show-overflow-tooltip
      >
        <!-- 因为有些参数需要判定比如性别所以判断一下 -->
        <template slot-scope="scope">
          <span v-if="item.render">
            {{ item.render(scope.row) }}
          </span>
          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        v-if="tableOption.label"
        :label="tableOption.label"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <button
            class="btn"
            :style="{ 'background-color': item.bgColor }"
            v-for="(item, index) in tableOption.options"
            :key="index"
            :type="item.type"
            :icon="item.icon"
            @click="handleButton(item.methods, scope.row, scope.$index)"
            size="mini"
          >
            {{ item.label }}
          </button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <div class="more" style="margin-top: 26px">
      <slot name="more"></slot>
    </div>
    <!-- 翻页 -->
    <div style="margin-top: 20px" v-if="pageShow">
      <el-pagination
        v-if="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10]"
        :page-size="rows"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      // 预加载
      type: Boolean,
      default: false,
    },
    data: {
      // 表格数据
      type: Array,
      default: () => {
        return [];
      },
    },
    columns: {
      // 表头数据
      type: Array,
      default: () => {
        return [];
      },
    },
    tableOption: {
      // 表格操作
      type: Object,
      default: () => {
        return {};
      },
    },
    page: {
      // 当前页
      type: Number,
      default: () => {
        return 1;
      },
    },
    rows: {
      // 当前页展示数
      type: Number,
      default: () => {
        return 10;
      },
    },
    total: {
      // 总数
      type: Number,
      default: () => {
        return 0;
      },
    },
    selection: {
      type: String,
      default: "",
    },
    pageShow: {
      type: Boolean,
      default: true,
    },
    curPage: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  mounted() {},
  methods: {
    // 切换当前一页展示多少条
    handleSizeChange(val) {
      // console.log(val);
      this.$emit("sizeChange", val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.$emit("pageChange", val);
    },
    // 按钮点击事件
    // methods方法名 row当前点击列数据 index当前点击的index
    handleButton(methods, row, index) {
      this.$emit("clickButton", { methods: methods, row: row, index: index });
    },
    // 点击排序
    handleSortChange(val) {
      this.$emit("sortChange", val);
    },
    //多选
    selectionChange(val) {
      this.$emit("selectionChange", val);
    },
    //複製網址（暫時移除）
    copyUrl(raw, column, cell) {
      let obj = {
        raw,
        column,
        cell,
      };
      this.$emit("copyUrl", obj);
    },
    //自定義排名
    settingIndex(val) {
      let index = 0;
      if (this.curPage == "dashBoard") {
        index = (this.page - 1) * 30 + (val + 1);
      } else if (this.curPage == "adRank") {
        index = (this.page - 1) * this.rows + (val + 1);
      } else if (this.curPage == "domainRank") {
        index = (this.page - 1) * 10 + (val + 1);
      }
      return index;
    },
  },
};
</script>

<style lang="scss">
.has-gutter tr th {
  background: #eee;
}
.table {
  margin-top: 35px;
  padding-bottom: 35px;
  .btn {
    width: 60px;
    height: 25px;
    margin-right: 20px;
    outline: none;
    border: 0;
    font-size: 14px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
}
.el-table {
  margin: 10px 0;
  & td,
  & th {
    text-align: center;
  }
}
.el-pagination {
  text-align: center;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #0275d8 !important;
  color: #ffffff;
}
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next,
.el-pagination.is-background .el-pager li {
  margin: 0 3px !important;
  min-width: 41px !important;
  height: 42px;
  line-height: 42px;
  border: 1px solid #eceeef !important;
  background: #fff !important;
}
</style>
