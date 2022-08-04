<template>
  <div ref="home" class="home" :style="{
    height: screenStatus ? `${clientHeight}px` : `${clientWidth}px`,
    width: screenStatus ? `${clientWidth}px` : `${clientHeight}px`,
    top: screenStatus ? '0px' : homeTop,
    left: screenStatus ? '0px' : homeLeft,
    transform: screenStatus ? 'none' : 'rotate(90deg)',
    transformOrigin: '50% 50%',
    }"
  >
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
                v-for="td in tr"
                :key="td._id"
                :data-index="td.index"
                ref="td"
                :style="isFullScreen ? { opacity: 0 } : td.style"
                @click="(event) => mousedown(event, td)"
              >
                {{ td.font }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 图片区 -->
        <div
          class="air-area"
          ref="airArea"
          :style="{
            width: isFullScreen ? `${switchFullScreenH}px` : airWidth,
            height: isFullScreen ? `${switchFullScreenW}px` : airHeight,
            top: isFullScreen ? 0 : airTop,
            left: isFullScreen ? 0 : airLeft,
            bottom: isFullScreen ? 0 : airBottom,
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

        <!-- 图片全屏区 -->
        <div
          class="switch-area"
          ref="switchArea"
          :style="{
            width: switchWidth,
            height: switchHeight,
            top: switchTop,
            left: switchLeft,
          }"
          @click="hanndleSwitchArea"
        >
        </div>
        <!-- 前后按键 -->
        <div
          class="prev-btn"
          ref="prevBtn"
          @click="handlePrevNext('prev')"
          :style="{
            width: prevWidth,
            height: prevHeight,
            top: prevTop,
            left: prevLeft,
          }"
        >
        </div>
        <div
          class="next-btn"
          ref="nextBtn"
          @click="handlePrevNext('next')"
          :style="{
            width: nextWidth,
            height: nextHeight,
            top: nextTop,
            left: nextLeft,
          }"
        >
        </div>
      </foreignObject>

      <!-- 连线 -->
      <template>
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

        <template v-if="screenStatus">
          <line
            class="line"
            v-for="(item, index) in lineArr"
            :key="index"
            :x1="$refs.td[item.index].offsetLeft + 5"
            :y1="
              $refs.td[item.index].offsetTop + 10 + scrollY
            "
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
import { sleep } from "@/utils/"
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
      airBottom: 0,
      homeTop: 0,
      homeLeft: 0,
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
      isFullScreen: false,

      clientHeight: 0,
      clientWidth: 0,

      switchLeft: 0,
      switchTop: 0,
      switchWidth: 0,
      switchHeight: 0,

      prevLeft: 0,
      prevTop: 0,
      prevWidth: 0,
      prevHeight: 0,

      nextLeft: 0,
      nextTop: 0,
      nextWidth: 0,
      nextHeight: 0,

      switchFullScreenW: 0,
      switchFullScreenH: 0,

      prevNextFontList: [], // 前进后退栈列表
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
      .then(async () => {
        const { clientHeight, clientWidth } = document.documentElement;
        this.clientHeight = clientHeight;
        this.clientWidth = clientWidth;

        if (clientHeight < clientWidth) {
          this.screenStatus = true;
          await sleep(50);
          this.computedArea("Heng"); // 计算空白区域（横屏幕）
          this.computedSwitchArea("Heng"); // 计算空白区域（横屏幕）

          this.switchFullScreenH = clientWidth;
          this.switchFullScreenW = clientHeight;
        } else {
          this.homeTop = -(0 - (clientHeight - clientWidth) / 2) + "px";
          this.homeLeft = -((clientHeight - clientWidth) / 2) + "px";
          this.screenStatus = false;
          await sleep(50);
          this.computedArea("Shu"); // 计算空白区域（竖屏幕）
          this.computedSwitchArea("Shu"); // 计算空白区域（竖屏幕）

          this.switchFullScreenH = clientHeight;
          this.switchFullScreenW = clientWidth;
          
        }

        // 转屏幕兼容性处理
        let evt =
          "onorientationchange" in window ? "orientationchange" : "resize";

        window.addEventListener(evt, async () => {
          // 监听转屏
          await sleep(50);
          const clientHeight = document.documentElement.clientHeight;
          const clientWidth = document.documentElement.clientWidth;

          this.clientHeight = clientHeight;
          this.clientWidth = clientWidth;

          if (clientHeight < clientWidth) {
            this.screenStatus = true;
            await sleep(50);
            this.computedArea("Heng"); // 计算空白区域（横屏幕）
            this.computedSwitchArea("Heng"); // 计算空白区域（横屏幕）

            this.switchFullScreenH = clientWidth;
            this.switchFullScreenW = clientHeight;
          } else {
            this.homeTop = -(0 - (clientHeight - clientWidth) / 2) + "px";
            this.homeLeft = -((clientHeight - clientWidth) / 2) + "px";
            this.screenStatus = false;
            await sleep(50);
            this.computedArea("Shu"); // 计算空白区域（横屏幕）
            this.computedSwitchArea("Shu"); // 计算空白区域（横屏幕）

            this.switchFullScreenH = clientHeight;
            this.switchFullScreenW = clientWidth;

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

      for (let i = 0; i < queryArr.length; i++) {
        setTimeout(() => {
          this.$refs.td[queryArr[i]].click();
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
        this.openLink(td);
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
          .get(`/tableDataMobile`)
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
      const widthArr = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      const heightArr = [9, 39, 69, 99, 129, 159];

      let widthValue = 0;
      let heightValue = 0;

      // 参数为竖屏还是横屏
      if (shuHeng === "Heng") {
        widthArr.forEach((item) => {
          widthValue += this.$refs.td[item].offsetWidth;
        });
        heightArr.forEach((item) => {
          heightValue += this.$refs.td[item].offsetHeight;
        });
      } else if (shuHeng === "Shu") {
        widthArr.forEach((item) => {
          widthValue += this.$refs.td[item].offsetWidth;
        });
        heightArr.forEach((item) => {
          heightValue += this.$refs.td[item].offsetHeight;
        });
      }
      this.airLeft = this.$refs.td[9].offsetLeft + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border
      this.airTop = this.$refs.td[9].offsetTop + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border

      this.airWidth = widthValue + "px"; // (并且赋值) -3 是为了适应图片区的Border
      this.airHeight = heightValue + "px"; // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border
    },
    
    /**
     * 计算切换全屏按钮大小
     */
    computedSwitchArea(shuHeng) {
      const widthArr = [474, 475, 476, 477, 478, 479];
      const heightArr = [474, 504, 534];

      const prevWidthList = [360, 361, 362, 363, 364, 365];
      const prevHeightList = [360, 390, 420];

      const nextWidthList = [450, 451, 452, 453, 454, 455];
      const nextHeightList = [450, 480, 510];

      let widthValue = 0;
      let heightValue = 0;

      let prevWidthValue = 0;
      let prevHeightValue = 0;

      let nextWidthValue = 0;
      let nextHeightValue = 0;

      // 参数为竖屏还是横屏
      if (shuHeng === "Heng") {
        widthArr.forEach((item) => {
          widthValue += this.$refs.td[item].offsetWidth;
        });
        heightArr.forEach((item) => {
          heightValue += this.$refs.td[item].offsetHeight;
        });
        prevWidthList.forEach((item) => {
          prevWidthValue += this.$refs.td[item].offsetWidth;
        });
        prevHeightList.forEach((item) => {
          prevHeightValue += this.$refs.td[item].offsetHeight;
        });
        nextWidthList.forEach((item) => {
          nextWidthValue += this.$refs.td[item].offsetWidth;
        });
        nextHeightList.forEach((item) => {
          nextHeightValue += this.$refs.td[item].offsetHeight;
        });
      } else if (shuHeng === "Shu") {
        widthArr.forEach((item) => {
          widthValue += this.$refs.td[item].offsetWidth;
        });
        heightArr.forEach((item) => {
          heightValue += this.$refs.td[item].offsetHeight;
        });
        prevWidthList.forEach((item) => {
          prevWidthValue += this.$refs.td[item].offsetWidth;
        });
        prevHeightList.forEach((item) => {
          prevHeightValue += this.$refs.td[item].offsetHeight;
        });
        nextWidthList.forEach((item) => {
          nextWidthValue += this.$refs.td[item].offsetWidth;
        });
        nextHeightList.forEach((item) => {
          nextHeightValue += this.$refs.td[item].offsetHeight;
        });
      }

      this.switchLeft = this.$refs.td[474].offsetLeft + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border
      this.switchTop = this.$refs.td[474].offsetTop + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border
      this.prevLeft = this.$refs.td[360].offsetLeft + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border
      this.prevTop = this.$refs.td[360].offsetTop + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border
      this.nextLeft = this.$refs.td[450].offsetLeft + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border
      this.nextTop = this.$refs.td[450].offsetTop + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border

      this.switchWidth = widthValue + "px"; // (并且赋值) -3 是为了适应图片区的Border
      this.switchHeight = heightValue + "px"; // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border
      
      this.prevWidth = prevWidthValue + "px"; // (并且赋值) -3 是为了适应图片区的Border
      this.prevHeight = prevHeightValue + "px"; // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border
      this.nextWidth = nextWidthValue + "px"; // (并且赋值) -3 是为了适应图片区的Border
      this.nextHeight = nextHeightValue + "px"; // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border
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
        `/mcombination`,
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
        if (item !== "") {
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

    /**
     * 点击全屏按钮
     */
    hanndleSwitchArea: function () {
      this.isFullScreen = !this.isFullScreen;
    },

    handlePrevNext: function(flagStr) {
      if(flagStr === 'prev') {

        // 点击上一步
        if(this.clickFont.length > 1) {
          const popIndex = this.clickFont.pop();
          this.prevNextFontList.push(popIndex);

          const { to } = this.routeInfo;
          const query = to?.query?.font || '';

          const splitQuery = query.split(",");
          splitQuery.pop(); // 去除最后一个空白项
          splitQuery.pop(); // 去除最后一项Index
          const clickIndex = splitQuery.pop();
          const pushQuery = splitQuery.join(',') + ',';

          this.clickFont = splitQuery.map(item => Number(item));
          
          this.$nextTick(() => {
            this.$router.push({ query: { font: pushQuery } });
            this.$refs.td[clickIndex].click();
          });
          return
        }

        // 点击上一步 - 从最后一步开始
        if(this.clickFont.length === 1) {
          const popIndex = this.clickFont.pop();
          this.prevNextFontList.push(popIndex);

          this.clickFont = this.prevNextFontList.reverse();
          const clickIndex = this.clickFont.pop();
          this.prevNextFontList = [];

          const pushQuery = this.clickFont.join(',') + ',';
          this.clickFont = this.clickFont.map(item => Number(item));
          
          this.$nextTick(() => {
            this.$router.push({ query: { font: pushQuery } });
            this.$refs.td[clickIndex].click();
          });
        }
      }

      if(flagStr === 'next') {
        // 点击下一步
        if(this.prevNextFontList.length > 0) {
          const popIndex = this.prevNextFontList.pop();
          this.$refs.td[popIndex].click();
          return;
        }

        // 点击下一步 - 从头开始
        if(this.prevNextFontList.length === 0 && this.clickFont.length > 0) {
          this.prevNextFontList = this.clickFont.slice(1, this.clickFont.length).reverse();
          const headFontIndex = this.clickFont[0]; // 首字
          this.clickFont = [];
          this.$nextTick(() => {
            this.$router.push('/m');
            this.$refs.td[headFontIndex].click();
          });
        }
      }
    }
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

.td-active {
  opacity: 1 !important;
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
  transition: .3s all;
}

.switch-area {
  position: absolute;
  z-index: 1;
}

.prev-btn {
  position: absolute;
  z-index: 1;
}

.next-btn {
  position: absolute;
  z-index: 1;
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
  opacity: 1 !important;
}

.font-item > a.active_relation {
  color: red;
  background-color: skyblue;
  border-radius: 2px;
  opacity: 1 !important;
}

line {
  transition: all 0.3s;
}

.table td.active {
  color: green;
  background-color: pink;
  border-radius: 2px;
  opacity: 1 !important;
}

.table td.re-active {
  color: #fff;
  background-color: rgb(139, 86, 86);
  border-radius: 2px;
  opacity: 1 !important;
}

.table td.self-active {
  color: teal;
  background-color: yellow;
  border-radius: 2px;
  opacity: 1 !important;
}

.page-button {
  text-align: center;
}
</style>