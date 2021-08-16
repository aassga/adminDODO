<template>
  <div class="content">
    <div class="tableTop">
      <el-button type="primary" @click="openUser">添加用户</el-button>
    </div>
    <div class="table">
      <Tables
        :data="table.data"
        :columns="table.columns"
        :pageShow="false"
        :loading="table.loading"
        @clickButton="clickButton"
        :tableOption="table.tableOption"
      >
      </Tables>
    </div>
    <div class="addUser">
      <Dailog
        :title="title"
        :width="'35%'"
        :show.sync="userShow"
        @closeDialog="onCloseKey"
      >
        <div slot="content" class="user-content">
          <el-form :model="formData" :rules="rules" ref="formData" class="form">
            <el-form-item
              label="用户名"
              prop="name"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="formData.name"
                placeholder="请输入用户名"
                @input="nameChange"
                style="width: 60%"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="信箱"
              prop="email"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="formData.email"
                placeholder="请输入信箱"
                @input="changeEmail"
                style="width: 60%"
              ></el-input>
            </el-form-item>
            <div v-if="!isEdit">
              <el-form-item
                label="请输入密码"
                prop="password"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="formData.password"
                  @input="changePwd"
                  placeholder="请输入密码"
                  style="width: 60%"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="重复密码"
                prop="password_confirmation"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="formData.password_confirmation"
                  @input="changePwdCon"
                  placeholder="请输入重复密码"
                  style="width: 60%"
                ></el-input>
              </el-form-item>
            </div>
            <div v-if="isEdit">
              <el-form-item
                label="请输入原密码"
                prop="old_password"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="formData.old_password"
                  placeholder="请输入密码"
                  @input="changeOldPwd"
                  style="width: 60%"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="请输入新密码"
                prop="password"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="formData.password"
                  placeholder="请输入密码"
                  @input="changePwd"
                  style="width: 60%"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="重复新密码"
                prop="password_confirmation"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="formData.password_confirmation"
                  @input="changePwdCon"
                  placeholder="请输入重复密码"
                  style="width: 60%"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item label="权限" :label-width="formLabelWidth">
              <el-select
                v-model="formData.role"
                placeholder="请选择"
                style="width: 30%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="footer">
            <span class="submit" @click="submitForm('formData')">确定</span>
            <span class="back" @click="back">返回</span>
          </div>
        </div>
      </Dailog>
    </div>
  </div>
</template>

<script>
import Tables from "../../components/tables/table";
import Dailog from "../../components/dialogs/dialog";
import {
  getUserList,
  getUserInfo,
  addRegister,
  delelteUser,
  updateUser,
} from "@/api";
import { spawn } from "child_process";
export default {
  name: "Settings",
  components: { Tables, Dailog },
  data() {
    var checkName = (rule, val, cb) => {
      if (!this.formData.name || this.formData.name === "") {
        return cb(new Error("请输入用户名"));
      } else {
        cb();
      }
    };
    var checkEmail = (rule, val, cb) => {
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!this.formData.email || this.formData.email == "") {
        return cb(new Error("请输入信箱地址"));
      } else if (!reg.test(this.formData.email.trim())) {
        return cb(new Error("请输入正确的箱邮"));
      } else {
        cb();
      }
    };
    var checkOldPwd = (rule, val, cb) => {
      if (!this.formData.old_password || this.formData.old_password == "") {
        return cb(new Error("请输入原密码"));
      } else if (this.formData.old_password.trim().length < 8) {
        return cb(new Error("原密码最少八位"));
      } else {
        cb();
      }
    };
    var checkPwd1 = (rule, val, cb) => {
      if (!this.formData.password || this.formData.password == "") {
        return cb(new Error("请输入密码"));
      } else if (this.formData.password.trim().length < 8) {
        return cb(new Error("密码最少八位"));
      } else {
        cb();
      }
    };
    var checkPwd2 = (rule, val, cb) => {
      if (
        !this.formData.password_confirmation ||
        this.formData.password_confirmation == ""
      ) {
        return cb(new Error("请再次输入密码"));
      } else if (this.formData.password_confirmation.trim().length < 8) {
        return cb(new Error("密码最少八位"));
      } else if (
        this.formData.password_confirmation.trim() !==
        this.formData.password.trim()
      ) {
        return cb(new Error("两次输入密码不一致!"));
      } else {
        cb();
      }
    };
    return {
      formLabelWidth: "30%",
      userShow: false,
      title: "添加用户",
      isEdit: false,
      options: [
        {
          value: 1,
          label: "Admin",
        },
        {
          value: 2,
          label: "Guest",
        },
      ],
      formData: {
        id: null,
        name: "",
        email: "",
        password: "",
        old_password: "",
        password_confirmation: "",
        old_password: "",
        role: 1,
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        old_password: [{ validator: checkOldPwd, trigger: "blur" }],
        password: [{ validator: checkPwd1, trigger: "blur" }],
        password_confirmation: [{ validator: checkPwd2, trigger: "blur" }],
        // role: [
        //     { validator: checkRole, trigger: 'change' }
        // ],
      },
      table: {
        loading: false,
        page: 1,
        rows: 10,
        total: 0,
        columns: [
          {
            label: "ID",
            key: "id",
            width: "60",
          },
          {
            label: "用户名",
            key: "name",
          },
          {
            label: "权限",
            key: "role",
            width: "100",
            render: (row) => {
              return row.role === 1 ? "Admin" : "Guest";
            },
          },
          {
            label: "信箱",
            key: "email",
          },
          {
            label: "最后登录时间",
            key: "updated_at",
          },
          {
            label: "访问次数",
            key: "visit_times",
            width: "100",
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
            {
              label: "删除",
              bgColor: "#fac167",
              methods: "del",
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.getData();
  },

  methods: {
    //获取用户数据
    getData() {
      this.table.loading = true;
      getUserList()
        .then((res) => {
          if (res !== undefined && res.code === 200) {
            this.table.data = res.data;
            this.table.loading = false;
          } else {
            let text = res.message;
            this.$alert(`${text}`, "温馨提示", {
              confirmButtonText: "确定",
            });
            this.table.data = [];
            this.table.loading = false;
          }
        })
        .catch((err) => {
          this.table.loading = false;
        });
    },
    //添加用户
    openUser() {
      this.userShow = true;
      this.isEdit = false;
      this.title = "添加新用户";
      this.formData.name = "";
      this.formData.email = "";
      this.formData.password = null;
      this.formData.password_confirmation = null;
      this.formData.role = 1;
    },
    back() {
      this.userShow = false;
      this.formData.name = "";
      this.formData.email = "";
      this.formData.password = null;
      this.formData.password_confirmation = null;
      this.formData.role = 1;
      this.$refs.formData.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            addRegister(this.formData).then((res) => {
              if (res !== undefined && res.code === 200) {
                this.userShow = false;
                this.$message({
                  message: "添加用户成功！",
                  type: "success",
                });
                this.getData();
              } else {
                let text = res.message;
                this.$alert(`${text}`, "温馨提示", {
                  confirmButtonText: "确定",
                });
              }
            });
          }
          if (this.isEdit) {
            updateUser(this.formData).then((res) => {
              if (res !== undefined && res.code === 200) {
                this.userShow = false;
                this.$message({
                  message: "用户信息更新成功！",
                  type: "success",
                });
                this.getData();
              } else {
                let text = res.message;
                this.$alert(`${text}`, "温馨提示", {
                  confirmButtonText: "确定",
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onCloseKey() {
      this.$refs.formData.resetFields();
    },
    clickButton(val) {
      if (val.methods === "edit") {
        this.userShow = true;
        this.title = "编辑";
        this.isEdit = true;
        this.formData.id = val.row.id;
        this.formData.name = val.row.name;
        this.formData.email = val.row.email;
        this.formData.old_password = null;
        this.formData.password = null;
        this.formData.password_confirmation = null;
        this.formData.role = val.row.role;
      }
      if (val.methods === "del") {
        this.$confirm("此操作将永久删除该用户, 是否继续?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let formData = new FormData();
            formData.append("id", val.row.id);
            delelteUser(formData).then((res) => {
              if (res !== undefined && res.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除用户成功!",
                });
                this.getData();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    nameChange(val) {
      this.formData.name = val.replace(/[, ]/g, "");
    },
    changeEmail(val) {
      this.formData.email = val.replace(/[, ]/g, "");
    },
    changeOldPwd(val) {
      this.formData.old_password = val.replace(/[, ]/g, "");
    },
    changePwd(val) {
      this.formData.password = val.replace(/[, ]/g, "");
    },
    changePwdCon(val) {
      this.formData.password_confirmation = val.replace(/[, ]/g, "");
    },
  },
};
</script>

<style lang="scss" scoped>
.tableTop {
  display: flex;
  justify-content: flex-end;
  margin: 41px 0 0 0;
}
.user-content {
  width: 600px;
  margin: 0 auto;
  .el-form {
    .el-form-item__label {
      color: #868e96;
    }
    .el-form-item__content {
      margin-left: 35% !important;
    }
    .el-input--suffix .el-input__inner {
      color: #868e96;
    }
  }
  .footer {
    text-align: center;
    margin: 30px 40px 0 0;
    span {
      display: inline-block;
      width: 65px;
      height: 38px;
      line-height: 38px;
      opacity: 0.76;
      border-radius: 4px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
    }
    .submit {
      border: solid 1px #5595c8;
      background-color: #66afe9;
      color: #fff;
      margin-right: 20px;
    }
    .back {
      border: solid 1px #868e96;
      background-color: #ffffff;
      color: #868e96;
    }
  }
}
</style>