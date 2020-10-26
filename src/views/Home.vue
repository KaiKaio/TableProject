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
            <!-- 本字相连字段 -->
            <line
              class="line"
              v-for="(item, index) in Item.self"
              :key="`${index}self`" 
              :x1="$refs.td[Item.index].getBoundingClientRect().left + 5 + scrollX" 
              :y1="$refs.td[Item.index].getBoundingClientRect().top + 10 + scrollY" 
              :x2="$refs.td[item].getBoundingClientRect().left + 5 + scrollX" 
              :y2="$refs.td[item].getBoundingClientRect().top + 10 + scrollY"
              :style="{
                stroke: '#000',
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

      changeStorage: [] // Change 变字存储数组
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
      setTimeout(() => {
        this.$refs.svg.setAttribute('width', this.$refs.tableWrapper.clientWidth)
        this.$refs.svg.setAttribute('height', this.$refs.tableWrapper.clientHeight)

        this.computedArea() // 计算图片区
        this.fetchQuery() // 执行Query操作
      }, 800)
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

    clear() {
      return new Promise((resolve) => {
        this.Item = ''
        this.clickFont = []
        this.queryLinkFont = []
        this.activeFonts = []
        this.lineArr = []
        this.combination = ''
        // 重置样式
        for(let i = 0; i < this.$refs.td.length; i++) {
          // 如果表格的某个子中有active样式，则清空
          if(this.$refs.td[i].className == 're-active') {
            this.$refs.td[i].className = ''
          }
          // 如果表格的某个子中有active样式，则清空
          if(this.$refs.td[i].className == 'active') {
            this.$refs.td[i].className = ''
          }
          // 如果表格的某个子中有self-active样式，则清空
          if(this.$refs.td[i].className == 'self-active') {
            this.$refs.td[i].className = ''
          }
        }
        // 重置变字
        this.changeStorage.map(item => {
          this.dataTable[item.trLine][item.tdCol].font = item.font
        })
        this.changeStorage = []
        resolve()
      })
    },

    // 第二版本
    requestData() {
      return new Promise((resolve, reject) => {
        this.$axios.get(`http://www.dooor.com/api/tableData`, {
          onDownloadProgress: function (p) {
            // 对原生进度事件的处理
            this.uploadProgress((100 * ( p.loaded / p.total )).toFixed(0))
          }.bind(this),
        }).then(res => {
        // this.$axios.get(`http://localhost:3000/api/tableData`).then(res => {
          this.dataTable = res.data.data
          resolve('获取成功')
        }).catch((err) => {
          reject(err, '获取失败')
        })
      })
    },

    clickTdChildItem(e, item) {
      // 清空 ActiveFonts 数组变量中的数据
      this.activeFonts = []
      // 重置样式
      for(let i = 0; i < this.$refs.td.length; i++) {
        // 如果表格的某个子中有active样式，则清空
        if(this.$refs.td[i].className == 're-active') {
          this.$refs.td[i].className = ''
        }
        // 如果表格的某个子中有active样式，则清空
        if(this.$refs.td[i].className == 'active') {
          this.$refs.td[i].className = ''
        }
        // 如果表格的某个子中有self-active样式，则清空
        if(this.$refs.td[i].className == 'self-active') {
          this.$refs.td[i].className = ''
        }
        // 清除自定义背景色
        if(this.$refs.td[i].style.backgroundColor) {
          this.$refs.td[i].style.backgroundColor = ''
        }
      }

      // 已经点击中的字体存入该数组中, 用于传输Ajax查询组合键
      this.clickFont.push(item.index)

      // 已经点击中的字体存入该数组中, 用于存入 Query 参数

      let fontArrStr = ''
      this.clickFont.map(item => {
        fontArrStr += item + ','
      })
      
      this.$router.push({ query: {'font': fontArrStr} });
      
      if(this.clickFont.length == 1) { // 第一次点击字
        this.Item = item
        // 高亮本字
        this.$refs.td[this.Item.index].className = 'active'

        // 将 `Relaiton` 字段的每一个字存入 ActiveFonts 数组变量当中
        for(let i = 0; i < this.Item.relation.length; i++){
          this.activeFonts.push(this.Item.relation[i].index)
          this.activeFonts.push(this.Item.relation[i].to)
        }

        // 高亮 `Relation` 字段中的每一个字
        for(let i = 0; i < this.activeFonts.length; i++) {
          if(this.activeFonts[i] != '') {
            this.$refs.td[this.activeFonts[i]].className = 're-active'
          }
        }

        // 高亮 `Relation` 字段中的每一个字的 `自定义` 样式
        for(let i = 0; i < this.Item.relation.length; i++) {
          if(this.Item.relation[i].style) { // 如果有自定义样式

            if(this.Item.relation[i].index != '') {
              this.$refs.td[this.Item.relation[i].index].style = this.Item.relation[i].style
            }

            if(this.Item.relation[i].to != '') {
              this.$refs.td[this.Item.relation[i].to].style = this.Item.relation[i].style
            }
          }
        }

        // 生成线段
        this.lineArr = [] // `Relation` 线段数组

        for(let i = 0 ; i < this.Item.relation.length; i++) {
          if(this.Item.relation[i].index == '' || this.Item.relation[i].to == '') {
            continue;
          } else {
            this.lineArr.push(this.Item.relation[i])
          }
        }

        // 高亮与本字连接字体
        for(let i = 0; i < this.Item.self.length; i++) {
          for(let j = 0; j < this.$refs.td.length; j++) {
            if(this.$refs.td[j].dataset.index == this.Item.self[i]) {
              this.$refs.td[j].className = 'self-active'
            }
          }
        }

      } else { // 第二次点击字
        // 清空第一次点击字体的线段
        this.lineArr = []
        this.Item = ''
        
        // 发送组合键查询Ajax
        // this.$axios.post(`http://localhost:3000/api/combination`, {data: this.clickFont}).then(res => {
        this.$axios.post(`http://www.dooor.com/api/combination`, {data: this.clickFont}).then(res => {

          if(res.data.data.length > 0) {
            this.combination = res.data.data[0]

            this.combination.change.map(item => { // 改变字体
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

            if(this.combination.img !== '') {
              this.imgSrc = this.combination.img
            }
            
            // 高亮Relation字段中的每一个字
            for(let i = 0; i < this.combination.relation.length; i++) {
              if(this.combination.relation[i].index != '') {
                this.$refs.td[this.combination.relation[i].index].className = 're-active'
              }

              if(this.combination.relation[i].to!= '') {
                this.$refs.td[this.combination.relation[i].to].className = 're-active'
              }
            }
          } else {
            this.clear().then(() => {
              this.clickTdChildItem(e, item)
            })
          }
        })
      }
    },
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
  background-color: pink;
  border-radius: 2px;
}

.table td.re-active{
  color: fuchsia;
  background-color: skyblue;
  border-radius: 2px;
}

.table td.self-active{
  color: teal;
  background-color: yellow;
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