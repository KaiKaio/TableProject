<template>
  <div class="home">
    <div id="copy-text" style="opacity: 0; position: fixed; top: -999px; left: -999px;">{{ copyText }}</div>

    <transition-group name="fade-transform" mode="out-in">
      <!-- 加载中 -->
      <template v-if="!loadComplete">
        <div
          key="load"
          style="width: 99vw; height: 99vh; margin: 0 auto; text-align: center"
        >
          <h1 style="font-size: 3rem; line-height: initial">www.dooor.com</h1>
          <div style="line-height: initial; font-size: rem">
            请等待，数据正在加载中...
          </div>

          <div class="progress">
            <div class="progress-bar" :style="progressData"></div>
          </div>

          <div style="line-height: initial; font-size: 2rem; color: #222">
            {{ progressData.width }}
          </div>
        </div>
      </template>

      <!-- 载入完成 -->
      <template v-else>
        <svg
          key="complete"
          ref="svg"
          width="100%"
          height="100%"
          v-contextmenu:contextmenu
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <foreignObject
            ref="foreignObject"
            class="foreign"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <div xmlns="http://www.w3.org/1999/xhtml">
              <table
                ref="tableWrapper"
                class="table"
                cellpadding="0"
                cellspacing="0"
                style="border-spacing: 0px"
              >
                <tbody>
                  <tr ref="tr" v-for="(tr, index) in dataTable" :data-trindex="index" :key="index">
                    <td
                      v-for="(td) in tr"
                      @click="clickTdChildItem(td)"
                      :key="td._id"
                      :data-index="td.index"
                      ref="td"
                      :style="isFullScreen ? { opacity: 0 } : `${td.style};`"
                      @mousedown.right="mousedown(td)"
                    >
                      <span v-if="td.font === ''" style="visibility: hidden"
                        >占</span
                      >
                      <span v-else>{{ td.font }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 空白区 -->
            <div
              class="air-area"
              ref="airArea"
              :style="{
                width: isFullScreen ? `${fullScreenW}px` : `${airWidth}px`,
                height: isFullScreen ? `${fullScreenH}px` : `${airHeight}px`,
                top: isFullScreen ? 0 : airTop + 'px',
                left: isFullScreen ? 0 : airLeft + 'px',
                bottom: isFullScreen ? 0 : airBottom + 'px',
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

            <button :disabled="preDisabled" @click="handlePrevNext('prev')" ref="prevBtn" class="handle-btn">上页</button>
            <button :disabled="nextDisabled" @click="handlePrevNext('next')" ref="nextBtn" class="handle-btn">下页</button>
            <button ref="screenBtn" @click="hanndleSwitchArea" class="handle-btn">全屏</button>
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

            <line
              class="line"
              v-for="(item, index) in lineArr"
              :key="index"
              :x1="
                $refs.td[item.index].getBoundingClientRect().left + 5 + scrollX
              "
              :y1="
                $refs.td[item.index].getBoundingClientRect().top + 10 + scrollY
              "
              :x2="$refs.td[item.to].getBoundingClientRect().left + 5 + scrollX"
              :y2="$refs.td[item.to].getBoundingClientRect().top + 10 + scrollY"
              :style="{
                stroke: 'green',
                opacity: 0.9,
                strokeWidth: 1,
              }"
              marker-end="url(#markerArrow)"
            />
          </template>
        </svg>

        <v-contextmenu key="menu" ref="contextmenu">
          <v-contextmenu-item @click="openLink">打开超链接</v-contextmenu-item>
          <v-contextmenu-item @click="clear">清除已选数据</v-contextmenu-item>
          <v-contextmenu-item @click="handleCopyContent">复制到剪贴板</v-contextmenu-item>
          <v-contextmenu-item>取消</v-contextmenu-item>
        </v-contextmenu>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { db } from '@/utils/db';

export default {
  name: "Home",
  data() {
    return {
      scrolled: false, // 监听是否滚动
      scrollY: 0, // 滚动数值
      scrollX: 0,

      isFullScreen: false,
      fullScreenH: 0,
      fullScreenW: 0,
      airWidth: 0,
      airHeight: 0,
      airTop: 0,
      airLeft: 0,
      airBottom: 0,

      relationline: [],
      activeItem: "",
      dataTable: [],
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      timer: false,

      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,

      renderLines: [],

      activeFonts: [],
      lineArr: [],

      // 已经点击中的字体存入
      clickFont: [],

      // 组合键返回数据
      combination: {},

      copyText: " ",

      // 右键选中的Td
      rightClickTd: "",

      loadComplete: false,

      progressData: { width: "0%" },
      countAdd: "0", // 进度条值

      queryLinkFont: [], // 已选中的字，加入到数组中
      imgSrc: "",

      changeStorage: [], // Change 变字存储数组
      customBgColorList: [], // 自定义背景色列表

      routeInfo: {},

      prevHandleItem: {},

      isVideoSources: false,

      prevNextFontList: [], // 前进后退栈列表
    };
  },

  computed: {
    ...mapState({
      queryFont: (state) => state.queryFont,
    }),

    preDisabled: function() {
      if(this.clickFont.length === 0 && this.prevNextFontList.length === 0) {
        return 'disabled'
      } else {
        return false
      }
    },

    nextDisabled: function() {
      if(this.clickFont.length === 0 && this.prevNextFontList.length === 0) {
        return 'disabled'
      } else {
        return false
      }
    },
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
    // window.addEventListener('popstate', this.popstate, false);

    this.requestData().then(() => {
      this.loadComplete = true;
      this.$nextTick(() => {
        this.$refs.svg.setAttribute(
          "width",
          this.$refs.tableWrapper.clientWidth
        );
        this.$refs.svg.setAttribute(
          "height",
          this.$refs.tableWrapper.clientHeight
        );

        this.computedArea(); // 计算图片区
        this.fetchQuery(); // 执行Query操作
      });
    }).catch(() => {
      // console.error(err, 'Error')
    });
  },

  methods: {
    saveItemToIndexDB(item) {
      return new Promise((resolve) => {
        db.tableData.put({
          index: 'table',
          info: item
        }).then(() => resolve())
      })
    },

    hanndleSwitchArea () {
      this.isFullScreen = !this.isFullScreen;

      const { clientWidth, clientHeight } =  document.querySelector('table')
      this.fullScreenW = clientWidth
      this.fullScreenH = clientHeight
    },

    handlePrevNext(flagStr) {
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
            this.$router.push('/');
            this.$refs.td[headFontIndex].click();
          });
        }
      }
    },

    // 更新进度条
    uploadProgress(numStr) {
      this.countAdd = numStr;
      this.progressData.width = this.countAdd + "%";
    },

    // 获取Query参数进行重现
    async fetchQuery() {
      const query = this.queryFont;
      if(query) {
        const splitQuery = query.split(",");
        splitQuery.pop(); // 去除最后一个空白项
        const popIndex = splitQuery.pop();
        const pushQuery = splitQuery.join(',') + ',';
        this.clickFont = splitQuery.map(item => Number(item));
        
        setTimeout(() => {
          this.$router.push({ query: { font: pushQuery } });
          this.$refs.td[popIndex].click();
        }, 1000)
      }
    },

    // 计算空白图片区 （横屏）
    computedArea() {

      let widthArr = [];
      for (let i = 42; i < 86; i++) {
        widthArr.push(i);
      }

      let widthValue = 0;
      widthArr.forEach((item) => {
        widthValue += this.$refs.td[item].getBoundingClientRect().width;
      });

      let heightArr = [42];
      for (let i = 1; i < 24; i++) {
        heightArr.push(42 + i * 129);
      }
      let heightValue = 0;
      heightArr.forEach((item) => {
        heightValue += this.$refs.td[item].getBoundingClientRect().height;
      });

      this.airWidth = widthValue; // 赋值宽度
      this.airHeight = heightValue; // 赋值高度

      this.$refs.airArea.style.width = this.airWidth + "px"; // (并且赋值)
      this.$refs.airArea.style.height = this.airHeight + "px"; // 计算图片区的高度(并且赋值)

      this.airLeft = this.$refs.td[42].offsetLeft; // 计算图片区距离页面最左的距离
      this.$refs.airArea.style.left = this.airLeft + "px"; // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border

      this.airTop = this.$refs.td[42].offsetTop; // 计算距离页面顶部的距离
      this.$refs.airArea.style.top = this.airTop + "px"; // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border


      this.$refs.prevBtn.style.width = this.$refs.td[9166].getBoundingClientRect().width + this.$refs.td[9167].getBoundingClientRect().width + 1 + 'px';
      this.$refs.prevBtn.style.height = this.$refs.td[9166].getBoundingClientRect().height + 'px';
      this.$refs.prevBtn.style.left = this.$refs.td[9166].offsetLeft + 'px';
      this.$refs.prevBtn.style.top = this.$refs.td[9166].offsetTop + 'px';

      this.$refs.nextBtn.style.width = this.$refs.td[9179].getBoundingClientRect().width + this.$refs.td[9180].getBoundingClientRect().width + 'px';
      this.$refs.nextBtn.style.height = this.$refs.td[9179].getBoundingClientRect().height + 'px';
      this.$refs.nextBtn.style.left = this.$refs.td[9179].offsetLeft + 'px';
      this.$refs.nextBtn.style.top = this.$refs.td[9179].offsetTop + 'px';
      
      this.$refs.screenBtn.style.width = this.$refs.td[9280].getBoundingClientRect().width + this.$refs.td[9281].getBoundingClientRect().width + 1 + 'px';
      this.$refs.screenBtn.style.height = this.$refs.td[9280].getBoundingClientRect().height + 'px';
      this.$refs.screenBtn.style.left = this.$refs.td[9280].offsetLeft + 'px';
      this.$refs.screenBtn.style.top = this.$refs.td[9280].offsetTop + 'px';
    },

    handleScroll() {
      this.scrolled = window.scrollY > 0;
      this.scrollY = window.scrollY;
      this.scrollX = window.scrollX;
    },

    mousedown(td) {
      this.rightClickTd = td;
    },

    openLink() {
      if (this.rightClickTd.link != "") {
        window.open(this.rightClickTd.link, "_blank");
        return;
      } else {
        window.alert("此字体并未设置超链接");
        return;
      }
    },

    /**
     * @method 重置点击
     */
    clear() {
      this.lineArr = [];
      this.clickFont = [];
      this.queryLinkFont = [];
      this.combination = {};
      // 重置变字
      this.changeStorage.reverse().forEach((item) => {
        this.dataTable[item.trLine][item.tdCol].font = item.font;
      });
      this.changeStorage = [];
      this.prevNextFontList = [];
    },

    /**
     * @method 请求表格数据
     */
    requestData() {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/tableVersion`).then((res) => {
          const serverVersion = res?.data?.data?.version || '';
          const localVersion = localStorage.getItem('localVersion');

          if (serverVersion === localVersion) {
            return db.tableData.get('table')
          } else {
            localStorage.setItem('localVersion', serverVersion);
            return this.$axios.get(`/tableData`, {
              onDownloadProgress: (p) => {
                // 对原生进度事件的处理
                this.uploadProgress((100 * (p.loaded / p.total)).toFixed(0));
              },
            })
          }
        }).then((res) => {
          const { info = '', data: { code } = {}, data = {} } = res;
          // console.log({ code })
          if (code !== 0) {
            this.dataTable = info
            this.uploadProgress('100')
            resolve("获取成功");
            return;
          }

          const list = data?.data || [];
          this.dataTable = list

          this.saveItemToIndexDB(list).then(() => {
            // console.log('SAVE SUCCESS');
            resolve("获取成功");
          })
        }).catch((err) => reject(err));
      });
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
      
      const {
        index,
        img,
        relation
      } = item;

      // 已经点击中的字体存入该数组中, 用于传输Ajax查询组合键
      this.clickFont.push(index);
      
      // === 处理点击字 Start ===
      this.$refs.td[index].className = "active"; // 1. 高亮点击字;
      this.customBgColorList.push({ // 2. 存入所点击字初始化自定义背景色;
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
        // 第一次点击字
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
      if(!executedLock) {
        this.clear();
        this.clickTdChildItem(item);
      }
    },

    recursiveContentBuilder({ curIndex, relation, content = '' }) {
      const isFindNextTag = relation.find((relaItem) => {
        return (relaItem.index === curIndex && relaItem.to === curIndex + 1)
      });

      if (!isFindNextTag) {
        return content
      }

      content += this.$refs.td[isFindNextTag.to].innerText;

      // 递归调用，更新索引继续查找下一个符合条件的元素并添加内容
      content = this.recursiveContentBuilder({ curIndex: isFindNextTag.to, relation, content });

      return content;
    },

    handleCopyContent ()  {
      const { relation } = this.combination;

      if (!relation?.length) {
        this.copyText = ' '
        this.handleTextAreaCopy()
        return
      }

      const content = []
      this.clickFont.forEach((curIndex) => {
        const initText = this.$refs.td[curIndex].innerText
        const result = this.recursiveContentBuilder({ curIndex, relation, content: initText })
        content.push(result)
      })

      const copyFilter = content.filter((item) => item.length > 1)

      this.copyText = copyFilter.join(' ')
      this.handleTextAreaCopy()
    },

    handleTextAreaCopy () {
      this.$nextTick(async () => {
        const copyTextInnerHTML = document.getElementById("copy-text").innerHTML;
        
        // 创建一个临时的textarea元素用于复制操作
        const textareaDom = document.createElement('textarea');
        textareaDom.value = copyTextInnerHTML;
        document.body.appendChild(textareaDom);
        // 选中textarea中的内容
        textareaDom.select();
        // 执行复制命令
        document.execCommand('copy');
        // 移除临时创建的textarea元素
        document.body.removeChild(textareaDom);

        alert("内容已复制到剪贴板！");
      })
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
      })
      this.relationActiveFont(this.activeFonts);
    },

    // 多次点击字体（ 发送组合键查询Ajax ）
    async multiClickFont() {
      const secondResult = await this.$axios.post(
        `/combination`,
        { data: this.clickFont }
      );
      const {
        data: { data },
      } = secondResult;
      if (data.length > 0) {
        this.combination = data?.[0] || {};
        const { change, img, relation } = this.combination;
        this.changeFont(change); // 执行变字逻辑
        this.changeImgUrl(img); // 赋值显示图片
        this.handleRelation(relation); // 处理Relation字段
        return true;
      } else {
        return false
      }
    },

    /**
     * 赋值显示图片
     * @param {String} imgUrl 图片连接
     */
    changeImgUrl(imgUrl = '') {
      if (this.imgSrc !== imgUrl) {
        this.imgSrc = imgUrl || "";
      }

      const pointIndex = imgUrl?.lastIndexOf(".") || 0;
      const fileType = imgUrl?.substring(pointIndex) || '';
      if(fileType === ".mp4" || fileType === ".rmvb" || fileType === ".avi" || fileType === ".ts") {
        this.isVideoSources = true;
      } else {
        this.isVideoSources = false;
      }
    },

    /**
     * @method 变字逻辑
     * @param {Array} changelist 所需变字列表
     */
    changeFont(changeList = []) {
      // 重置变字
      this.changeStorage.reverse().forEach((item) => {
        this.dataTable[item.trLine][item.tdCol].font = item.font;
      });
      this.changeStorage = [];
      
      changeList.forEach((item) => {
        // 改变字体
        let index = item.index;
        let trLine = Math.floor(index / 129);
        let tdCol = index % 129;

        this.changeStorage.push({
          trLine: trLine,
          tdCol: tdCol,

          font: JSON.parse(JSON.stringify(this.dataTable[trLine][tdCol].font)),
        });

        this.dataTable[trLine][tdCol].font = item.change; // 改变字体
      });
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

    /**
     * @method 清除高亮字体
     * @param {Array} fontList 高亮字列表
     */
    clearActiveStyle: function (fontList = [] , handleItem) {
      const { index } = handleItem;
      if (index || index === 0) {
        // 清除上一个本字高亮
        this.$refs.td[index].className = "";
      }

      const uniqueList = Array.from(new Set(fontList)).filter(item => item !== '');
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

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    // window.removeEventListener('popstate', this.popstate, false);
  },

  watch: {
    $route(to, from) {
      this.routeInfo = {
        to,
        from
      }
    }
  }
};
</script>

<style scope>
.home {
  position: relative;
}

.table {
  min-width: 100%;
  min-height: 100%;
}

.table td {
  text-align: center;
  cursor: pointer;
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
  background-color: #00ff00;
  border-radius: 2px;
  opacity: 1 !important;
}

.table td.active.re-active {
  color: green;
  background-color: #00ff00;
  border-radius: 2px;
  opacity: 1 !important;
}

.table td.re-active {
  color: fuchsia;
  background-color: MediumSpringGreen;
  border-radius: 2px;
  opacity: 1 !important;
}

.progress {
  position: relative;
  height: 2rem;
  background: rgba(212, 249, 232, 1);
  border-radius: 2px;
  margin-top: 2rem;
  cursor: pointer;
}
.progress-bar {
  position: absolute;
  height: 100%;
  background: rgba(5, 180, 147, 1);
  border-radius: 3px;
  transition: all 0.3s;
}

.handle-btn {
  position: absolute;
}

.air-area {
  position: absolute;
}

.air-area .videoWrapper {
  width: 100%;
  height: 100%;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.2s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>