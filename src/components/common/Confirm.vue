<template>
    <div class="weui_dialog_confirm" :style="{display:display}">
        <div class="weui_mask"></div>
        <div class="weui_dialog">
            <div class="weui_dialog_hd">
            <strong class="weui_dialog_title">{{title}}</strong>
            </div>
            <div class="weui_dialog_bd">{{content}}<br>...</div>
            <div class="weui_dialog_ft">
                <a href="javascript:;" class="weui_btn_dialog default" @click="hide">取消</a>
                <a href="javascript:;" class="weui_btn_dialog primary">确定</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    display: {
      type: String,
      default: ""
    }
  },
  methods: {
    hide: function() {
      this.$emit("confirmListener", {
        hide: "none"
      });
    }
  }
};
</script>

<style>
</style>
