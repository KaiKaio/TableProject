<template>
  <div class="home">
    <transition-group name="fade-transform" mode="out-in">

      <!-- 加载中 -->
      <template v-if="!loadComplete">
        <div key="load" style="width: 99vw; height: 99vh; margin: 0 auto; text-align:center;">
          <h1 style="font-size: 3rem; line-height: initial;">www.dooor.com</h1>
          <div style="line-height: initial; font-size: rem;">请等待，数据正在加载中...</div>

          <div class="progress">
            <div class="progress-bar" :style="progressData"></div>
          </div>

          <div style="line-height: initial; font-size: 2rem; color: #222;">{{ progressData.width }}</div>
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
          version="1.1">

          <foreignObject ref="foreignObject" class="foreign" x="0" y="0" width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              <table ref="tableWrapper" class="table" cellpadding="0" cellspacing="0" style="border-spacing:0px ">
                <tbody>
                  <tr ref="tr" v-for="(tr, index) in dataTable" :key="index">
                    <template v-for="(td, index) in tr">
                      <td
                        @click="clickTdChildItem($event, td)"  
                        :key="index"
                        :data-index="td.index"
                        ref="td"
                        :style="`${td.style};`"
                        @mousedown.right="mousedown(td)"
                      >
                        <span v-if="td.font === ''" style="visibility:hidden;">占</span>
                        <span v-else>{{ td.font }}</span>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 空白区 -->
            <div class="air-area" ref="airArea" :style="{ 
              backgroundImage: 'url('+  imgSrc + ')',
              backgroundSize :'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center'
            }"></div>
          </foreignObject>

          <!-- 连线 -->
          <template >
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
                <path d="M0,0 L0,4 L4,2 z" style="fill: red;" />
              </marker>
            </defs>

            <line
              class="line"
              v-for="(item, index) in lineArr"
              :key="index" 
              :x1="$refs.td[item.index].getBoundingClientRect().left + 5 + scrollX" 
              :y1="$refs.td[item.index].getBoundingClientRect().top + 10 + scrollY" 
              :x2="$refs.td[item.to].getBoundingClientRect().left + 5 + scrollX" 
              :y2="$refs.td[item.to].getBoundingClientRect().top + 10 + scrollY"
              :style="{
                stroke: 'green',
                opacity: 0.9,
                strokeWidth: 1
              }"
              marker-end="url(#markerArrow)"
            />
            <!-- 组合键线段 -->
            <line
              class="line"
              v-for="(item, index) in combination.relation"
              :key="`${index}combination`" 
              :x1="$refs.td[item.index].getBoundingClientRect().left + 5 + scrollX" 
              :y1="$refs.td[item.index].getBoundingClientRect().top + 10 + scrollY" 
              :x2="$refs.td[item.to].getBoundingClientRect().left + 5 + scrollX" 
              :y2="$refs.td[item.to].getBoundingClientRect().top + 10 + scrollY"
              :style="{
                stroke: 'green',
                opacity: 0.9,
                strokeWidth: 1
              }"
              marker-end="url(#markerArrow)"
            />
          </template>

        </svg>

        <v-contextmenu key="menu" ref="contextmenu">
          <v-contextmenu-item @click="openLink">打开超链接</v-contextmenu-item>
          <v-contextmenu-item @click="clear">清除已选数据</v-contextmenu-item>
          <v-contextmenu-item>取消</v-contextmenu-item>
        </v-contextmenu>
      </template>

    </transition-group>

  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      scrolled: false, // 监听是否滚动
      scrollY: 0, // 滚动数值
      scrollX: 0,

      relationline: [],
      activeItem: '',
      dataTable: [],
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      timer: false,

      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,

      renderLines: [],

      Item: {},

      activeFonts: [],
      lineArr: [],

      // 已经点击中的字体存入
      clickFont: [],

      // 组合键返回数据
      combination: [],

      // 右键选中的Td
      rightClickTd: '',

      loadComplete: false,

      progressData: { width: '0%' },
      countAdd: '0', // 进度条值

      queryLinkFont: [], // 已选中的字，加入到数组中
      imgSrc: '',

      changeStorage: [], // Change 变字存储数组
      customBgColorList: [], // 自定义背景色列表
    }
  },

  computed: {
    ...mapState({
        queryFont: state=> state.queryFont
    })
  },

  created () {
    window.addEventListener('scroll', this.handleScroll);

    this.requestData().then(() => {
      this.loadComplete = true
      this.$nextTick(() => {
        this.$refs.svg.setAttribute('width', this.$refs.tableWrapper.clientWidth)
        this.$refs.svg.setAttribute('height', this.$refs.tableWrapper.clientHeight)

        this.computedArea() // 计算图片区
        this.fetchQuery() // 执行Query操作
      })
    })

  },
  
  methods: {
    // 更新进度条
    uploadProgress(numStr) {
      this.countAdd = numStr
      this.progressData.width = this.countAdd + '%'
    },

    fetchQuery() {
      let query = this.queryFont
      let queryArr = query.split(",")
      queryArr.pop() // 删除最后一个元素

      let tr = 0
      let td = 0

      for(let i = 0; i < queryArr.length; i++) {
        setTimeout(() => {
          tr = (Math.floor(queryArr[i] / 129)) // 行数
          td = queryArr[i] % 129 // 列数)

          this.clickTdChildItem('', this.dataTable[tr][td])
        }, 1200 * i)
      }
    },

    // 计算空白图片区 （横屏）
    computedArea() { // 参数为竖屏还是横屏
      let widthArr = []
      for(let i = 7016; i < 7040; i++) {
        widthArr.push(i)
      }

      let widthValue = 0
      widthArr.map(item => {
        widthValue += this.$refs.td[item].getBoundingClientRect().width
      })
      
      let heightArr = [7016]
      for(let i = 1; i < 15; i++) {
        heightArr.push(7016 + (i * 18))
      }
      let heightValue = 0
      heightArr.map(item => {
        heightValue += this.$refs.td[item].getBoundingClientRect().height
      })

      this.airWidth = widthValue // 赋值宽度
      this.airHeight = heightValue  // 赋值高度

      this.$refs.airArea.style.width = this.airWidth - 3 + 'px' // (并且赋值) -3 是为了适应图片区的Border
      this.$refs.airArea.style.height = this.airHeight - 3 + 'px' // 计算图片区的高度(并且赋值) -3 是为了适应图片区的Border

      this.airLeft = this.$refs.td[7016].offsetLeft // 计算图片区距离页面最左的距离
      this.$refs.airArea.style.left = this.airLeft + 'px' // 计算图片区距离页面最左的距离（赋值操作）+3 是为了适应图片区的Border

      this.airTop = this.$refs.td[7016].offsetTop // 计算距离页面顶部的距离
      this.$refs.airArea.style.top = this.airTop + 'px' // 计算图片区距离页面最顶的距离（赋值操作） +3 是为了适应图片区的Border
    },
    
    handleScroll () {
      this.scrolled = window.scrollY > 0;
      this.scrollY = window.scrollY
      this.scrollX = window.scrollX
    },

    mousedown(td) {
      this.rightClickTd = td
    },

    openLink() {
      if(this.rightClickTd.link != '') {
        window.open(this.rightClickTd.link, '_blank')
        return
      } else {
        window.alert('此字体并未设置超链接')
        return
      }
    },

    /**
     * @method 重置点击
     */
    clear() {
      this.clickFont = []
      this.queryLinkFont = []
      this.combination = ''
      // 重置变字
      this.changeStorage.map(item => {
        this.dataTable[item.trLine][item.tdCol].font = item.font
      })
      this.changeStorage = []
    },

    /**
     * @method 请求表格数据
     */
    requestData() {
      return new Promise((resolve, reject) => {
        this.$axios.get(`http://www.dooor.com/api/tableData`, {
        // this.$axios.get(`http://localhost:3000/api/tableData`, {
          onDownloadProgress: function (p) {
            // 对原生进度事件的处理
            this.uploadProgress((100 * ( p.loaded / p.total )).toFixed(0))
          }.bind(this),
        }).then(res => {
          this.dataTable = res.data.data
          resolve('获取成功')
        }).catch((err) => {
          reject(err, '获取失败')
        })
      })
    },

    /**
     * @method 点击字体逻辑
     */
    clickTdChildItem(e, item) {
      this.lineArr = [] // `Relation` 线段数组重置为空
      // 消除Active样式
      this.clearActiveStyle(this.activeFonts);
      this.resetCustomBgColor();
      this.Item = item // 记录点击字
      this.$refs.td[this.Item.index].className = 'active' // 高亮点击字

      
      this.customBgColorList.push({
        index: this.Item.index,
        bgColor: this.$refs.td[this.Item.index].style.backgroundColor
      })
      this.$refs.td[this.Item.index].style.backgroundColor = '';

      // 已经点击中的字体存入该数组中, 用于传输Ajax查询组合键
      this.clickFont.push(item.index)

      // 已经点击中的字体存入该数组中, 用于存入 Query 参数

      let fontArrStr = ''
      this.clickFont.map(item => {
        fontArrStr += item + ','
      })
      this.$router.push({ query: {'font': fontArrStr} });
      
      if(this.clickFont.length == 1) { // 第一次点击字
        this.changeFont(item.change) // 执行变字逻辑

        // 遍历所点击字 relation 字段逻辑
        for(let i = 0; i < this.Item.relation.length; i++) {
          // 将 `Relaiton` 字段的每一个字存入 ActiveFonts 数组变量当中
          this.activeFonts.push(this.Item.relation[i].index);
          this.activeFonts.push(this.Item.relation[i].to);

          // 关系字连线
          if(this.Item.relation[i].index !== '' && this.Item.relation[i].to !== '') {
            this.lineArr.push(this.Item.relation[i])
          }
        }
        this.relationActiveFont(this.activeFonts)
      } else { // 第二次点击字
        // 发送组合键查询Ajax
        // this.$axios.post(`http://localhost:3000/api/combination`, {data: this.clickFont}).then(res => {
        this.$axios.post(`http://www.dooor.com/api/combination`, {data: this.clickFont}).then(res => {

          if(res.data.data.length > 0) {
            this.combination = res.data.data[0]

            this.changeFont(this.combination.change) // 执行变字逻辑

            if(this.combination.img !== '') {
              this.imgSrc = this.combination.img
            }
            
            // 高亮Relation字段中的每一个字
            for(let i = 0; i < this.combination.relation.length; i++) {
              this.activeFonts.push(this.combination.relation[i].index);
              this.activeFonts.push(this.combination.relation[i].to);
            }

            this.relationActiveFont(this.activeFonts)
          } else {
            this.clear();
            this.clickTdChildItem(e, item);
          }
        })
      }
    },

    /**
     * @method 变字逻辑
     * @param {Array} changelist 所需变字列表
     */
    changeFont(changeList = []) {
      changeList.map(item => { // 改变字体
        let index =  item.index
        let trLine = Math.floor(index / 129)
        let tdCol = index % 129

        this.changeStorage.push({
          trLine: trLine,
          tdCol: tdCol,
          
          font: JSON.parse(JSON.stringify(this.dataTable[trLine][tdCol].font))
        })

        this.dataTable[trLine][tdCol].font = item.change // 改变字体
      })
    },

    /**
     * @method 高亮relation字体
     * @param {Array} fontList 高亮字列表
     */
    relationActiveFont: function(fontList) {
      const uniqueList = Array.from(new Set(fontList))
      uniqueList.forEach(item => {
        if(item != '') {
          // 存入自定义背景色
          this.customBgColorList.push({
            index: item,
            bgColor: this.$refs.td[item].style.backgroundColor
          })
          this.$refs.td[item].style.backgroundColor = '';

          // 高亮
          this.$refs.td[item].className += ' re-active'
        }
      })
    },

    /**
     * @method 清除高亮字体
     * @param {Array} fontList 高亮字列表
     */
    clearActiveStyle: function(fontList = []) {
      let index = this.Item.index
      if(index || index === 0) {
        // 清除上一个本字高亮
        this.$refs.td[index].className = ''
      }

      const uniqueList = Array.from(new Set(fontList))
      uniqueList.forEach(item => {
        // 如果表格的某个子中有active样式，则清空
        this.$refs.td[item].className = ''
      })
      this.activeFonts = [] // 清空 ActiveFonts 数组变量中的数据
    },

    /**
     * @method 恢复自定义背景色
     */
    resetCustomBgColor: function() {
      let list = this.customBgColorList || []
      list.forEach(item => {
        this.$refs.td[item.index].style.backgroundColor = item.bgColor
      })
      this.customBgColorList = []
    }

  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scope>
.home {
  position: relative;
}

.table {
  min-width: 100%;
  min-height: 100%;
}

.table td{
  text-align: center;
  cursor: pointer;
}


#LineCanvas {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  border:1px solid red;
  z-index: 1;
}

.font-item > a {
  text-decoration: none;
  color: #333;
  transition: all .3s;
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
  transition: all .3s;
}

.table td.active{
  color: green;
  background-color: #00ff00;
  border-radius: 2px;
}

.table td.active.re-active{
  color: green;
  background-color: #00ff00;
  border-radius: 2px;
}

.table td.re-active{
  color: fuchsia;
  background-color: MediumSpringGreen;
  border-radius: 2px;
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
  transition: all .3s;
}

.air-area {
  position: absolute;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .2s;
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