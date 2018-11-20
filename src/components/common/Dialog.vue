<template>
    <div :style="{display:display}">
        <div class="weui-mask"></div>
        <div class="weui-dialog">
            <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{title}}</strong></div>
            <div class="weui-dialog__hd">{{content}}</div>
            <div class="weui-dialog__ft">
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="hide">确定</a>
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
    },
    toGiftPage:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    hide: function() {
      this.$emit("dialogListener", {
        hide: "none"
      });
    }
  }
};
</script>

<style>
</style>
