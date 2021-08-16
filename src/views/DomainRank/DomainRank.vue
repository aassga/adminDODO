<template>
  <div class="content">
    <div class="top clearfix">
      <div class="btn-box">
        <span class="enter-btn" @click="openKey">输入关键字</span>
        <div class="upload">
          <el-upload
            ref="upload"
            action="/key/upload"
            :show-file-list="false"
            :limit="1"
            :auto-upload="true"
            :before-upload="beforeUploadForm"
            :http-request="fileUpload"
            :on-success="fileSuccess"
          >
            <!-- <div class="upload-btn">请上传csv<span>未选择任何档案</span></div> -->
            <div class="upload-btn">请上传csv<span>选取</span></div>
          </el-upload>
        </div>
        <!-- <span class="import-btn">汇入档案</span> -->
        <!-- <span class="url-btn" @click="openUrl">添加新域名</span> -->
      </div>
    </div>
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
        :selection="'selection'"
        @clickButton="clickButton"
        @selectionChange="selectionChange"
        @pageChange="pageChange"
      >
        <div class="more" slot="more" v-if="this.delList.length">
          <span class="del" @click="del">删除</span>
        </div>
      </Tables>
    </div>
    <div class="del-box">
      <Dailog
        title="删除资讯"
        :width="'16%'"
        :height="100"
        :show.sync="delShow"
      >
        <div slot="content" class="content">
          <span class="text">勾选资讯已删除</span>
        </div>
      </Dailog>
    </div>
    <div class="addKey">
      <Dailog
        :title="title"
        :width="'32%'"
        :show.sync="keyShow"
        @closeDialog="onCloseKey"
      >
        <div slot="content" class="content">
          <el-form :model="formData" :rules="rules" ref="formData" class="form">
            <el-form-item prop="key">
              <el-input
                v-if="!isEdit"
                type="textarea"
                size="medium"
                resize="none"
                :rows="minRows1"
                placeholder="请输入关键字"
                @input="textareaChange"
                v-model="formData.key"
              >
              </el-input>
              <el-input
                v-if="isEdit"
                type="textarea"
                size="medium"
                resize="none"
                :rows="minRows2"
                placeholder="请输入关键字"
                @input="textareaChange"
                v-model="formData.key"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <p class="tip" v-if="!isEdit">(各关键字间以一字一行为分隔)</p>
          <div class="footer">
            <span class="cancel" @click="cancel">取消</span>
            <span class="confirm" @click="submit('formData')">确定</span>
          </div>
        </div>
      </Dailog>
    </div>
  </div>
</template>

<script>
import Tables from "../../components/tables/table";
import Dailog from "../../components/dialogs/dialog";
import { getKeyList, deleteKey, setKey, uploadKey, editKey } from "@/api";
export default {
  name: "DomainRank",
  components: { Tables, Dailog },
  data() {
    var checkKey = (rule, val, cb) => {
      if (this.formData.key === "") {
        return cb(new Error("请输入关键字！"));
      } else {
        cb();
      }
    };
    return {
      params: {
        sortBy: "key",
        sortAsc: "desc",
        page: 1,
        pageCount: 10,
      },
      minRows1: 8,
      minRows2: 2,
      fileName: "",
      formData: {
        id: "",
        key: "",
      },
      rules: {
        key: [{ validator: checkKey, trigger: "blur" }],
      },
      isEdit: false,
      title: "",
      formLabelWidth: "14%",
      keyText: "",
      urlShow: false,
      keyShow: false,
      delShow: false,
      fileList: [],
      table: {
        curPage: "domainRank",
        label: "序号",
        loading: false,
        // page: 1,
        rows: 10,
        total: 0,
        columns: [
          {
            label: "关键字",
            key: "key",
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
      // params: {},
      delList: "",
    };
  },
  mounted() {
    // this.params = { sortBy: "key", sortAsc: "desc", page: 1, pageCount: 10 };
    this.getData(this.params);
  },
  methods: {
    // 开始上传前验证
    beforeUploadForm(file) {
      // 验证文件类型
      // console.log(file);
      this.fileName = file.name;
      let extension = file.name.split(".")[1] === "csv";
      if (!extension) {
        this.$alert("请选择.csv文件", "温馨提示", {
          confirmButtonText: "确定",
        });
      }
      return extension;
    },

    // 提交图片
    fileUpload(param, type) {
      // console.log(param);
      // console.log(type);
      let formData = new FormData();
      formData.append("file", param.file, this.fileName);
      uploadKey(formData).then((res) => {
        if (res.code === 200 && res.status === "success") {
          this.$message({
            message: "文件上传成功！",
            type: "success",
          });
        } else {
          this.$message({
            message: "文件上传失败，请重新上传！",
            type: "warning",
          });
        }
        this.fileSuccess();
      });
    },
    fileSuccess(res, file) {
      this.$refs.upload.clearFiles();
      this.params.page = this.table.page;
      this.getData(this.params);
    },
    getData(params) {
      this.table.loading = true;
      getKeyList(params)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.table.loading = false;
          } else {
            let text = res.message;
            this.$alert(`${text}`, "温馨提示", {
              confirmButtonText: "确定",
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

    // 翻页
    pageChange(val) {
      // this.table.page = val;
      this.params.page = val;
      this.getData(this.params);
    },

    clickButton(val) {
      // console.log(val);
      this.title = "编辑";
      this.keyShow = true;
      this.isEdit = true;
      this.formData.key = val.row.key;
      this.formData.id = val.row.id;
    },

    //选择列表
    //當勾選框發生變化時
    selectionChange(val) {
      this.delList = val;
    },
    //删除列表
    del() {
      this.$confirm("此操作将永久删除所选列, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let arr = [];
          this.delList.forEach((item) => {
            arr.push(item.id);
          });
          let str = arr.join(",");
          var bodyFormData = new FormData();
          bodyFormData.append("id_dot", str);
          deleteKey(bodyFormData).then((res) => {
            if (res.code === 200 && res.status === "success") {
              if (this.delList.length === 10)
                this.params.page = this.table.page - 1;
              else this.params.page = this.table.page;
              this.getData(this.params);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.delList = [];
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    onCloseKey() {
      this.$refs.formData.resetFields();
    },
    //打开设置关键字
    openKey() {
      this.formData.key = "";
      this.formData.id = "";
      this.keyShow = true;
      this.isEdit = false;
      this.title = "设置关键字";
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            // let bodyFormData = new FormData();
            // bodyFormData.append("key", this.formData.key);
            setKey(this.formData).then((res) => {
              if (res.code === 200 && res.status === "success") {
                this.keyShow = false;
                this.$message({
                  message: "关键字添加成功！",
                  type: "success",
                });
                this.formData.key = "";
                this.formData.id = "";
                this.params.page = this.table.page;
                this.getData(this.params);
              }
            });
          } else {
            // let bodyFormData = new FormData();
            // bodyFormData.append("id", this.formData.id);
            // bodyFormData.append("key", this.formData.key);
            editKey(this.formData).then((res) => {
              if (res.code === 200 && res.status === "success") {
                this.keyShow = false;
                this.$message({
                  message: "编辑关键字成功！",
                  type: "success",
                });
                this.formData.key = "";
                this.formData.id = "";
                this.params.page = this.table.page;
                this.getData(this.params);
              }
            });
          }
        } else {
          console.log("error submit!");
          return;
        }
      });
    },
    cancel() {
      this.keyShow = false;
      this.$refs.formData.resetFields();
    },
    textareaChange(val) {
      if (val == " ") this.formData.key = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  margin: 0 auto;
  width: 66vw;
  height: 121px;
  border-bottom: solid 1px #eaeaea;
  .btn-box {
    width: 345px;
    float: right;
    display: flex;
    justify-content: flex-start;
    margin: 41px 0 0 0;
    .upload {
      margin-left: 20px;
      .upload-btn {
        width: 218px;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        border: solid 1px #cccccc;
        background-color: #ffffff;
        font-size: 12px;
        color: #868e96;
        span {
          float: right;
          display: inline-block;
          width: 60px;
          height: 40px;
          line-height: 40px;
          border-left: solid 1px #cccccc;
          background-color: #eceeef;
          color: #868e96;
        }
      }
    }
    .enter-btn,
    .import-btn,
    .url-btn {
      display: inline-block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
    }
    .enter-btn {
      background: #82cb86;
      border: 1px solid #75a679;
    }
    .import-btn {
      background: #fd9789;
      border: 1px solid #cc8780;
      margin-left: 15px;
    }
    .url-btn {
      background: #4495e4;
      border: 1px solid #0f73cb;
      margin-left: 15px;
    }
  }
}
.table {
  .more {
    .del {
      display: inline-block;
      width: 60px;
      height: 25px;
      line-height: 25px;
      padding: 1px 13px 4px 14px;
      border-radius: 4px;
      background-color: #f0ad4e;
      font-size: 16px;
      color: #fff;
      text-align: center;
      cursor: pointer;
    }
  }
}
.del-box {
  .el-dialog__wrapper {
    top: 22%;
  }
  .content {
    width: 100%;
    text-align: center;
    .text {
      display: inline-block;
      margin-top: 38px;
      font-size: 18px;
      font-weight: 500;
      color: #ffa782;
    }
  }
}
.gutter {
  display: initial !important;
}
</style>