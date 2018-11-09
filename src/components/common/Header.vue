<template>
    <div>
        <header>
            <div>
                <div class="header">
                    <div class="container center">
                        <span class="backBtn" @click="back">
                            <img src="../../assets/img/back_arrow.png" width="10px" />
                            返回
                        </span>
					            <span class="til">{{title}}</span>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "投票系统"
    }
  },
  methods: {
    back: function() {
      const host = "http://localhost:8080";
      this.$router.push("/index/"+sessionStorage.getItem('uuid'));
    }
  }
};
</script>

<style>
.header {
  width: 100%;
  height: 44px;
  line-height: 44px;
  color: #fff;
  background: #3cb371;
  position: fixed;
  top: 0;
}
.header .til {
  font-size: 16px;
}
.container {
  margin: 0 15px;
}
.center {
  text-align: center;
}
.backBtn {
  position: absolute;
  left: 15px;
}
.backBtn img {
  width: 8px;
  margin-right: 5px;
}
</style>
