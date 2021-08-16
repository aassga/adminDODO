<template>
  <div class="my-modal">
    <el-dialog
      :title="title"
      :width="width"
      :visible.sync="visible"
      :show="show"
      center
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="content mt20" style="position: relative" :style="_height">
        <slot name="content"></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: "",
    },
    height: {
      type: [String, Number],
    },
    title: {
      type: String,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: false,
      visible: this.show,
    };
  },
  computed: {
    _height(val) {
      return "height:" + this.height + "px";
    },
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-dialog {
  border-radius: 5px;
  box-shadow: 0 7px 36px 0 rgba(48, 48, 48, 0.13);
  border: solid 1.1px #efefef;
}
.el-dialog__header {
  border: solid 1px #eaeaea;
  padding: 10px;
  .el-dialog__title {
    font-size: 16px;
    font-weight: 500;
  }
}
.el-dialog__headerbtn {
  top: 12px;
}
</style>
