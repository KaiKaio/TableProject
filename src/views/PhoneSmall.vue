<template>
  <div ref="home" class="home">
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <foreignObject class="foreign" x="0" y="0" width="100%" height="100%">
        <table
          class="table"
          cellpadding="0"
          cellspacing="0"
          style="border-spacing: 0px"
        >
          <tbody>
            <tr ref="tr" v-for="(tr, index) in dataTable" :key="index">
              <td
                v-for="(td, index) in tr"
                :key="index"
                :data-index="td.index"
                ref="td"
                :style="td.style"
                @click="(event) => mousedown(event, td)"
              >
                {{ td.font }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空白区 -->
        <div
          class="air-area"
          ref="airArea"
          :style="{
            zIndex: isVideoSources ? 0 : -1,
            backgroundImage: 'url(' + (isVideoSources ? '' : imgSrc) + ')',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }"
        >
          <video controls class="videoWrapper" v-if="isVideoSources">
            <source :src=imgSrc>
          </video>
        </div>
      </foreignObject>

      <!-- 连线 -->
      <template>
        /> -->
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
          </marker>

          <marker
            id="markerArrow"
            markerWidth="4"
            markerHeight="4"
            refX="0"
            refY="2"
            orient="auto"
          >
            <path d="M0,0 L0,4 L4,2 z" style="fill: red" />
          </marker>
        </defs>

        <template v-if="screenStatus === true">
          <line
            class="line"
            v-for="(item, index) in lineArr"
            :key="index"
            :x1="$refs.td[item.index].getBoundingClientRect().left + 5"
            :y1="
              $refs.td[item.index].getBoundingClientRect().top + 10 + scrollY
            "
            :x2="$refs.td[item.to].getBoundingClientRect().left + 5"
            :y2="$refs.td[item.to].getBoundingClientRect().top + 10 + scrollY"
            :style="{
              stroke: 'green',
              opacity: 0.9,
              strokeWidth: 1,
            }"
            marker-end="url(#markerArrow)"
          />
        </template>

        <template v-else>
          <line
            class="line"
            v-for="(item, index) in lineArr"
            :key="index"
            :x1="$refs.td[item.index].offsetLeft + 5"
            :y1="$refs.td[item.index].offsetTop + 10 + scrollY"
            :x2="$refs.td[item.to].offsetLeft + 5"
            :y2="$refs.td[item.to].offsetTop + 10 + scrollY"
            :style="{
              stroke: 'green',
              opacity: 0.9,
              strokeWidth: 1,
            }"
            marker-end="url(#markerArrow)"
          />
        </template>
      </template>
    </svg>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "M",
  data() {
    return {
      scrolled: false, // 监听是否滚动
      scrollY: 0, // 滚动数值
      dataTable: [], // 整个表格的数据
      Item: {}, // 已经选中的的字体（单体）
      activeFonts: [], // 高亮的字体（集合）
      lineArr: [], // 关系线段（集合）
      clickFont: [], // 已经选中的的字体（集合）
      combination: [], // Ajax 组合键 返回数据
      rightClickTd: "", // 长按选中的字体
      airWidth: 0, // 图片（空白）区宽度
      airHeight: 0, // 图片（空白）区高度
      airLeft: 0, // 图片（空白）区距离左侧距离
      airTop: 0, // 图片（空白）区距离顶部距离
      imgSrc: "", // Ajax 返回的图片地址
      delFont: [], // 被删除的字（集合）（历史）
      screenStatus: false, // 全屏状态（ False为竖屏，True为横屏 ）
      startTime: "", // 长按字体开始时间
      endTime: "", // 长按字体结束时间

      changeStorage: [], // Change 变字存储数组
      customBgColorList: [], // 自定义背景色列表

      routeInfo: {},

      prevHandleItem: {},

      isVideoSources: false,
      clickTimes: 0,
    };
  },

  computed: {
    ...mapState({
      queryFont: (state) => state.queryFont,
    }),
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("popstate", this.popstate, false);
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("popstate", this.popstate, false);
  },

  mounted() {
    // 安卓阻止菜单出现
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    this.requestData()
      .then(() => {
        let _home = this.$refs.home;
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        if (width < height) {
          _home.style.height = width + "px";
          _home.style.width = height + "px";
          _home.style.top = (height - width) / 2 + "px";
          _home.style.left = 0 - (height - width) / 2 + "px";
          _home.style.transform = "rotate(90deg)";
          _home.style.transformOrigin = "50% 50%";
          this.computedArea("Shu"); // 计算空白区域（竖屏幕）
        } else {
          _home.style.height = height + "px";
          _home.style.width = width + "px";
          _home.style.top = "0px";
          _home.style.left = "0px";
          _home.style.transform = "none";
          _home.style.transformOrigin = "50% 50%";
          this.computedArea("Heng"); // 计算空白区域（横屏幕）
        }

        // 转屏幕兼容性处理
        let evt =
          "onorientationchange" in window ? "orientationchange" : "resize";

        window.addEventListener(evt, () => {
          // 监听转屏
          let width = document.documentElement.clientWidth;
          let height = document.documentElement.clientHeight;
          if (width < height) {
            _home.style.height = width + "px";
            _home.style.width = height + "px";

            _home.style.top = "0px";
            _home.style.left = "0px";

            _home.style.transform = "none";
            _home.style.transformOrigin = "50% 50%";

            this.screenStatus = true;
            this.computedArea("Heng"); // 计算空白区域
          } else {
            _home.style.height = height + "px";
            _home.style.width = width + "px";

            _home.style.top = -((height - width) / 2) + "px";
            _home.style.left = -(0 - (height - width) / 2) + "px";

            _home.style.transform = "rotate(90deg)";
            _home.style.transformOrigin = "50% 50%";

            this.screenStatus = false;
            this.computedArea("Shu"); // 计算空白区域
          }
        });

        this.fetchQuery(); // 初次进入查询地址栏是否有参数
      })
      .catch((err) => {
        throw err;
      });
  },

  methods: {
    popstate() {
      const { to } = this.routeInfo;
      const toQuery = to?.query?.font || "";
      if (toQuery) {
        let toList = toQuery.split(",");
        toList.pop(); // 删除最后一个元素 ','
        const popIndex = toList.pop();

        toList = toList.map((item) => {
          return (item = item / 1);
        });

        this.clickFont = toList;

        const tr = Math.floor(popIndex / 30); // 行数
        const td = popIndex % 30; // 列数

        this.clickTdChildItem(this.dataTable[tr][td]);
        return;
      }
      // 清除本字高亮
      this.clear();
    },

    // 查询地址栏是否有参数
    fetchQuery() {
      let query = this.queryFont;
      let queryArr = query.split(",");
      queryArr.pop(); // 删除最后一个元素

      // let tr = 0;
      // let td = 0;
      for (let i = 0; i < queryArr.length; i++) {
        setTimeout(() => {
          // tr = Math.floor(queryArr[i] / 30); // 行数
          // td = queryArr[i] % 30; // 列数)
          // this.clickTdChildItem(this.dataTable[tr][td]);
          console.dir(this.$refs.td[queryArr[i]], "this.$refs.td[queryArr[i]]");
          this.$refs.td[queryArr[i]].click();
          // this.simulateClick(this.$refs.td[queryArr[i]]);
        }, 1000 * i);
      }
    },

    handleScroll() {
      this.scrolled = window.scrollY > 0;
      this.scrollY = window.scrollY;
    },

    mousedown(e, td) {
      this.clickTimes++;
      if (this.clickTimes === 2) {
        this.clickTimes = 0;
        this.openLink(td)
      }
      setTimeout(() => {
        if (this.clickTimes === 1) {
          this.clickTimes = 0;
          this.clickTdChildItem(td); // 执行点字逻辑
        }
      }, 200);
    },

    // 进入超链接
    openLink(td) {
      console.log("xxx");
      this.rightClickTd = td;
      if (this.rightClickTd.link != "") {
        window.location.href = "https://" + this.rightClickTd.link;
        return;
      }
      window.alert("此字体并未设置超链接");
    },

    /**
     * @method 重置点击
     */
    clear() {
      this.lineArr = [];
      this.clickFont = [];
      this.queryLinkFont = [];
      this.combination = "";
      // 重置变字
      this.changeStorage.reverse().forEach((item) => {
        this.dataTable[item.trLine][item.tdCol].font = item.font;
      });
      this.changeStorage = [];
    },

    /**
     * @method 请求表格数据
     */
    requestData() {
      return new Promise((resolve, reject) => {
        this.$axios
          .get(`http://www.dooor.com/api/tableDataMobile`)
          .then((res) => {
            this.dataTable = res.data.data;
            resolve("获取成功");
          })
          .catch(() => {
            reject("获取失败");
          });
      });
    },

    // 计算空白图片区 （横屏）
    computedArea(shuHeng) {
      // 参数为竖屏还是横屏
      if (shuHeng === "Heng") {
        let widthArr = [282, 283, 284, 285, 286, 287];
        let widthValue = 0;
        widthArr.map((item) => {
          widthValue += this.$refs.td[item].getBoundingClientRect().width;
        });

        let heightArr = [282, 312, 342, 372, 402, 432];
        let heightValue = 0;
        heightArr.map((item) => {
          heightValue += this.$refs.td[item].getBoundingClientRect().height;
        });

        this.airWidth = widthValue; // 赋值宽度
        this.airHeight = heightValue; // 赋值高度

        this.$refs.airArea.style.width = this.airWidth - 3 + "px"; // (并且赋值) -3 是为了适应图片区的Border
        this.$refs.airArea.style.height = this.airHeight - 3 + "px"; // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border

        this.airLeft = this.$refs.td[282].getBoundingClientRect().left; // 计算图片区距离页面最左的距离
        this.$refs.airArea.style.left = this.airLeft + 3 + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border

        this.airTop = this.$refs.td[282].getBoundingClientRect().top; // 计算距离页面顶部的距离
        this.$refs.airArea.style.top = this.airTop + 3 + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border
      } else if (shuHeng === "Shu") {
        let widthArr = [282, 283, 284, 285, 286, 287];
        let widthValue = 0;
        widthArr.map((item) => {
          widthValue += this.$refs.td[item].getBoundingClientRect().height;
        });

        let heightArr = [282, 312, 342, 372, 402, 432];
        let heightValue = 0;
        heightArr.map((item) => {
          heightValue += this.$refs.td[item].getBoundingClientRect().width;
        });

        this.airWidth = widthValue; // 赋值宽度
        this.airHeight = heightValue; // 赋值高度

        this.$refs.airArea.style.width = this.airWidth - 3 + "px"; // (并且赋值) -3 是为了适应图片区的Border
        this.$refs.airArea.style.height = this.airHeight - 3 + "px"; // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border

        this.airLeft = this.$refs.td[282].getBoundingClientRect().top; // 计算图片区距离页面最左的距离
        this.$refs.airArea.style.left = this.airLeft + 3 + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border

        this.airTop = this.$refs.td[432].getBoundingClientRect().left; // 计算距离页面顶部的距离
        this.$refs.airArea.style.top = "initial"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border
        this.$refs.airArea.style.bottom = this.airTop + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border
      }

      // 设置清除区
      // this.clearWidth = this.$refs.td[495].getBoundingClientRect().width
      // this.clearHeight = this.$refs.td[495].getBoundingClientRect().height
      // this.$refs.clearArea.style.width = this.clearWidth * 5  + 'px'
      // this.$refs.clearArea.style.height = this.clearHeight * 4 + 'px'
      // this.$refs.clearArea.style.top = this.$refs.td[495].getBoundingClientRect().top + 'px'
    },

    /**
     * @method 点击字体逻辑
     */
    async clickTdChildItem(item) {
      // 处理相关样式放在最前
      // 1. 关系线段数组重置为空
      this.lineArr = [];
      // 2. 消除Active样式
      this.clearActiveStyle(this.activeFonts, this.prevHandleItem);
      // 3. 恢复初始化自定义背景色
      this.resetCustomBgColor();

      // 替换记录点击字体
      this.prevHandleItem = item;

      const { index, img, relation } = item;

      // 已经点击中的字体存入该数组中, 用于传输Ajax查询组合键
      this.clickFont.push(index);

      // === 处理点击字 Start ===
      this.$refs.td[index].className = "active"; // 1. 高亮点击字;
      this.customBgColorList.push({
        // 2. 存入所点击字初始化自定义背景色;
        index,
        bgColor: this.$refs.td[index].style.backgroundColor,
      });
      this.$refs.td[index].style.backgroundColor = ""; // 3. 去除初始化自定义背景色;
      // === 处理点击字 End ===

      // 点击字体存入该数组中, 用于存入 Route-query
      let fontArrStr = "";
      this.clickFont.forEach((item) => {
        fontArrStr += item + ",";
      });
      this.$router.push({ query: { font: fontArrStr } });

      // 单个字处理
      if (this.clickFont.length === 1) {
        this.changeFont(item.change); // 执行变字逻辑
        this.changeImgUrl(img); // 赋值显示图片
        this.handleRelation(relation); // 处理Relation字段
        return;
      }

      // 多个字处理
      let executedLock = false;
      if (this.clickFont.length > 1) {
        executedLock = await this.multiClickFont(); // 多次点击字体（ 发送组合键查询Ajax ）
      }

      // 无组合结果 => 进入重置逻辑
      if (!executedLock) {
        this.clear();
        this.clickTdChildItem(item);
      }
    },

    async multiClickFont() {
      const secondResult = await this.$axios.post(
        `http://www.dooor.com/api/mcombination`,
        { data: this.clickFont }
      );
      const {
        data: { data },
      } = secondResult;
      if (data.length > 0) {
        this.combination = data[0];
        const { change, img, relation } = this.combination;
        this.changeFont(change); // 执行变字逻辑
        this.changeImgUrl(img); // 赋值显示图片
        this.handleRelation(relation); // 处理Relation字段
        return true;
      } else {
        return false;
      }
    },

    /**
     * 赋值显示图片
     * @param {String} imgUrl 图片连接
     */
    changeImgUrl(imgUrl = "") {
      if (this.imgSrc !== imgUrl) {
        this.imgSrc = imgUrl || "";
      }

      const pointIndex = imgUrl.lastIndexOf(".");
      const fileType = imgUrl.substring(pointIndex);
      if (
        fileType === ".mp4" ||
        fileType === ".rmvb" ||
        fileType === ".avi" ||
        fileType === ".ts"
      ) {
        this.isVideoSources = true;
      } else {
        this.isVideoSources = false;
      }
    },

    /**
     * @method 高亮relation字体
     * @param {Array} fontList 高亮字列表
     */
    relationActiveFont: function (fontList) {
      const uniqueList = Array.from(new Set(fontList));
      uniqueList.forEach((item) => {
        if (item != "") {
          // 存入自定义背景色
          this.customBgColorList.push({
            index: item,
            bgColor: this.$refs.td[item].style.backgroundColor,
          });
          this.$refs.td[item].style.backgroundColor = "";

          // 高亮
          this.$refs.td[item].className += " re-active";
        }
      });
    },

    handleRelation(relation) {
      relation.forEach((item) => {
        // 将 `Relaiton` 字段的每一个字存入 ActiveFonts 数组变量当中
        this.activeFonts.push(item.index);
        this.activeFonts.push(item.to);
        // 关系字连线
        if ((item.index || item.index === 0) && (item.to || item.to === 0)) {
          this.lineArr.push(item);
        }
      });
      this.relationActiveFont(this.activeFonts);
    },

    /**
     * @method 变字逻辑
     * @param {Array} changelist 所需变字列表
     */
    changeFont(changeList = []) {
      changeList.map((item) => {
        // 改变字体
        let index = item.index;
        let trLine = Math.floor(index / 30);
        let tdCol = index % 30;

        this.changeStorage.push({
          trLine: trLine,
          tdCol: tdCol,

          font: JSON.parse(JSON.stringify(this.dataTable[trLine][tdCol].font)),
        });

        this.dataTable[trLine][tdCol].font = item.change; // 改变字体
      });
    },

    /**
     * @method 清除高亮字体
     * @param {Array} fontList 高亮字列表
     */
    clearActiveStyle: function (fontList = [], handleItem) {
      const { index } = handleItem;
      if (index || index === 0) {
        // 清除上一个本字高亮
        this.$refs.td[index].className = "";
      }

      const uniqueList = Array.from(new Set(fontList));
      uniqueList.forEach((item) => {
        // 如果表格的某个子中有active样式，则清空
        this.$refs.td[item].className = "";
      });
      this.activeFonts = []; // 清空 ActiveFonts 数组变量中的数据
    },

    /**
     * @method 恢复自定义背景色
     */
    resetCustomBgColor: function () {
      let list = this.customBgColorList || [];
      list.forEach((item) => {
        this.$refs.td[item.index].style.backgroundColor = item.bgColor;
      });
      this.customBgColorList = [];
    },
  },

  watch: {
    $route(to, from) {
      this.routeInfo = {
        to,
        from,
      };
    },
  },
};
</script>

<style scope>
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.fadeSelect-enter-active,
.fadeSelect-leave-active {
  transition: opacity 0.5s;
}
.fadeSelect-enter, .fadeSelect-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.home {
  position: relative;
}

.air-area {
  position: absolute;
}

.clear-area {
  position: absolute;
  left: 0rem;
  background: #fff;
}

.table {
  width: 100%;
  height: 100%;
}

.table td {
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  position: relative;
}

.table td .select-menus {
  position: absolute;
  top: 0px;
  left: 100%;
  background-color: darkcyan;
  color: #fff;
  padding: 2px;
  border-radius: 4px;
  z-index: 1;
  font-weight: 200;
  box-shadow: 2px 2px 9px #aaa;
}

.table td .select-menus::before {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid darkcyan;
  content: "";
  display: block;
  position: absolute;
  left: -4px;
  top: 4px;
}

#LineCanvas {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  border: 1px solid red;
  z-index: 1;
}

.font-item > a {
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.font-item > a.active {
  color: green;
  background-color: yellow;
  border-radius: 2px;
}

.font-item > a.active_relation {
  color: red;
  background-color: skyblue;
  border-radius: 2px;
}

line {
  transition: all 0.3s;
}

.table td.active {
  color: green;
  background-color: pink;
  border-radius: 2px;
}

.table td.re-active {
  color: #fff;
  background-color: rgb(139, 86, 86);
  border-radius: 2px;
}

.table td.self-active {
  color: teal;
  background-color: yellow;
  border-radius: 2px;
}

.page-button {
  text-align: center;
}
</style>