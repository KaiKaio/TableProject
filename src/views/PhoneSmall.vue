<template>
  <div ref="home" class="home">
     <svg
      width="100%"
      height="100%"
      v-contextmenu:contextmenu
      xmlns="http://www.w3.org/2000/svg" 
      version="1.1">

      <foreignObject class="foreign" x="0" y="0" width="100%" height="100%">
        <table class="table" cellpadding="0" cellspacing="0" style="border-spacing:0px ">
          <tbody>
            <tr ref="tr" v-for="(tr, index) in dataTable" :key="index">
              <td 
                @click="clickTdChildItem(td)"  
                v-for="(td, index) in tr" 
                :key="index"
                :data-index="td.index"
                ref="td"
                :style="td.style"
                @touchstart="mousedown(td)"
              >
                {{ td.font }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 清除区 -->
        <!-- <div @click="clear" class="clear-area" ref="clearArea">
          清除键
        </div> -->

        <!-- 空白区 -->
        <div class="air-area" ref="airArea">
          <img :src="imgSrc" style="width: 100%;" alt="">
          <div @click="handleChangePage('left')" class="page-button left">左</div>
          <div @click="handleChangePage('right')" class="page-button right">右</div>
        </div>

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


        
        <template v-if="screenStatus === true">
          <line
            class="line"
            v-for="(item, index) in lineArr"
            :key="index" 
            :x1="$refs.td[item.index].getBoundingClientRect().left + 5" 
            :y1="$refs.td[item.index].getBoundingClientRect().top + 10 + scrollY" 
            :x2="$refs.td[item.to].getBoundingClientRect().left + 5" 
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
            :x1="$refs.td[Item.index].getBoundingClientRect().left + 5" 
            :y1="$refs.td[Item.index].getBoundingClientRect().top + 10 + scrollY" 
            :x2="$refs.td[item].getBoundingClientRect().left + 5" 
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
            :x1="$refs.td[item.index].getBoundingClientRect().left + 5" 
            :y1="$refs.td[item.index].getBoundingClientRect().top + 10 + scrollY" 
            :x2="$refs.td[item.to].getBoundingClientRect().left + 5" 
            :y2="$refs.td[item.to].getBoundingClientRect().top + 10 + scrollY"
            :style="{
              stroke: 'green',
              opacity: 0.9,
              strokeWidth: 1
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
              strokeWidth: 1
            }"
            marker-end="url(#markerArrow)"
          />
          <!-- 本字相连字段 -->
          <line
            class="line"
            v-for="(item, index) in Item.self"
            :key="`${index}self`" 
            :x1="$refs.td[Item.index].offsetLeft + 5" 
            :y1="$refs.td[Item.index].offsetTop + 10 + scrollY" 
            :x2="$refs.td[item].offsetLeft + 5" 
            :y2="$refs.td[item].offsetTop + 10 + scrollY"
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
            :x1="$refs.td[item.index].offsetLeft + 5" 
            :y1="$refs.td[item.index].offsetTop + 10 + scrollY" 
            :x2="$refs.td[item.to].offsetLeft + 5" 
            :y2="$refs.td[item.to].offsetTop + 10 + scrollY"
            :style="{
              stroke: 'green',
              opacity: 0.9,
              strokeWidth: 1
            }"
            marker-end="url(#markerArrow)"
          />
        </template>

       
      </template>

    </svg>

    <div style="position: absolute; top: 0px; right: 0px;">
      <!-- <button style="" @click="requestData">请求数据</button> -->
      <!-- <button style="padding: 10px; margin-right: 20px; z-index: 10; background: #fff; color: #000;" @click="requestAdd">增加小表格表数据</button> -->
      <!-- <button style="margin-right: 20px;" @click="clear">告诉你们：这是唯一的清除键，可别给我点错了</button> -->
      <!-- <button @click="getScreenHeight">微微获取一下屏幕高度</button> -->
    </div>

    

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="openLink">打开超链接</v-contextmenu-item>
      <v-contextmenu-item @click="clear">清除已选数据</v-contextmenu-item>
      <v-contextmenu-item>取消</v-contextmenu-item>
    </v-contextmenu>

  </div>
</template>

<script>
export default {
  name: 'M',
  data() {
    return {
      scrolled: false, // 监听是否滚动
      scrollY: 0, // 滚动数值

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

      airWidth: 0,
      airHeight: 0,
      airLeft: 0,


      clearWidth: 0,
      clearHeight: 0,
      clearTop: 0,

      imgSrc: '',
      delFont: [], // 被删除的字

      screenStatus: false, // False为竖屏，True为横屏
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },

  mounted() {
    this.requestData().then(() => {
      // this.computedArea() // 计算空白区域
      var width = document.documentElement.clientWidth;
      var height =  document.documentElement.clientHeight;
      if(width < height) {
        this.$refs.home.style.height = width + 'px'
        this.$refs.home.style.width = height + 'px'
        this.$refs.home.style.top = (height - width) / 2 + 'px'
        this.$refs.home.style.left = 0 - (height - width) / 2  + 'px'
        this.$refs.home.style.transform = 'rotate(90deg)'
        this.$refs.home.style.transformOrigin = '50% 50%'
      } else {
        let _home = this.$refs.home
        _home.style.height = height + 'px'
        _home.style.width = width + 'px'

        _home.style.top = '0px'
        _home.style.left = '0px'
        
        _home.style.transform = 'none'
        _home.style.transformOrigin = '50% 50%'
      }

      var evt = "onorientationchange" in window ? "orientationchange" : "resize"

      var _home = this.$refs.home
      window.addEventListener(evt, () => {
        var width = document.documentElement.clientWidth
        var height =  document.documentElement.clientHeight
        if( width < height ){
          _home.style.height = width + 'px'
          _home.style.width = height + 'px'

          _home.style.top =  '0px'
          _home.style.left = '0px'
          
          _home.style.transform = 'none'
          _home.style.transformOrigin = '50% 50%'

          console.log('横屏')

          this.screenStatus = true
          
        } else {
          _home.style.height = height + 'px'
          _home.style.width = width + 'px'

          _home.style.top = -((height - width) / 2) + 'px'
          _home.style.left = -(0 - (height - width) / 2)  + 'px'
          
          _home.style.transform = 'rotate(90deg)'
          _home.style.transformOrigin = '50% 50%'

          console.log('竖屏')

          this.screenStatus = false
          
        }
      })

    })
  },

  methods: {
    handleChangePage(arrow) {
      // 重置数据
      if(arrow == 'left') {
        console.log('后退')
        this.delFont.unshift(this.clickFont.pop())

        let FontArr = this.clickFont // 创建临时数组来map循环才对

        this.clear() // 清空数组

        setTimeout(() => {
          FontArr.map(item => {
            let index = item
            let trLine = Math.floor(index / 45)
            let tdCol = index % 45
            this.clickTdChildItem(this.dataTable[trLine][tdCol])
          })
        }, 1000)

      } else if (arrow == 'right') {
        if(this.delFont.length === 0) {
          console.log('没有前进')
        } else {
          console.log('前进')
          let index = this.delFont[0]
          let trLine = Math.floor(index / 45)
          let tdCol = index % 45
          this.clickTdChildItem(this.dataTable[trLine][tdCol])
          this.delFont.shift() // 删除（被删数组）第一项
        }
      }
    },

    handleScroll () {
      this.scrolled = window.scrollY > 0;
      this.scrollY = window.scrollY
    },

    getScreenHeight() {
      console.log(document.documentElement.clientHeight)
    },

    mousedown(td) {
      this.rightClickTd = td
    },

    openLink() {
      console.log(this.rightClickTd.link, '=> this.rightClickTd.link')
      if(this.rightClickTd.link != '') {
        window.open('https://' + this.rightClickTd.link,'_system')
        return
      } else {
        window.alert('此字体并未设置超链接')
        return
      }
    },

    clear() {
      console.log('点击清除')
      return new Promise((resolve) => {
        this.Item = ''
        this.clickFont = []
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
        this.requestData().then(() => {resolve('获取成功')})
        this.imgSrc = ''
      })
    },

    // 大表格第一版本
    requestAdd() {
      // this.$axios.post('http://localhost:3000/111', {
      //   font: '张'
      // }).then(res => {
      //   console.log(res)
      // })

      // this.$axios.post('http://localhost:3000/api/111').then(res => {
      this.$axios.post('http://www.dooor.com/api/111').then(res => {
        console.log(res)
      })
    },

    // 第二版本
    requestData() {
      return new Promise((resolve, reject) => {
        this.$axios.get(`http://www.dooor.com/api/tableDataMobile`).then(res => {
        // this.$axios.get(`http://192.168.1.8:3000/tableDataMobile`).then(res => {
        // this.$axios.get(`http://10.254.75.27:3000/tableDataMobile`).then(res => {
        // this.$axios.get(`http://172.20.10.2:3000/tableDataMobile`).then(res => {
        // this.$axios.get(`http://192.168.0.105:3000/api/tableDataMobile`).then(res => {
        // this.$axios.get(`http://localhost:3000/api/tableDataMobile`).then(res => {
          this.dataTable = res.data.data
          resolve('获取成功')
        }).catch((err) => {
          console.log(err, '获取表格数据失败')
          reject('获取失败')
        })
      })
    },

    computedArea() {
      // 计算单个单元格宽高，设置空白区域长宽
      this.airWidth = this.$refs.td[19].getBoundingClientRect().width
      this.airHeight = this.$refs.td[1054].getBoundingClientRect().height


      this.$refs.airArea.style.width = this.airWidth * 9  + 'px'
      this.$refs.airArea.style.height = this.airHeight * 6 + 'px'
      this.airLeft = this.$refs.td[19].getBoundingClientRect().left
      this.$refs.airArea.style.left = this.airLeft + 'px'


      // 设置清除区
      this.clearWidth = this.$refs.td[495].getBoundingClientRect().width
      this.clearHeight = this.$refs.td[495].getBoundingClientRect().height
      this.$refs.clearArea.style.width = this.clearWidth * 5  + 'px'
      this.$refs.clearArea.style.height = this.clearHeight * 4 + 'px'
      this.$refs.clearArea.style.top = this.$refs.td[495].getBoundingClientRect().top + 'px'
    },

    clickTdChildItem(item) {
      item.change.map(item => {
        let index =  item.index
        let trLine = Math.floor(index / 30)
        let tdCol = index % 30
        this.dataTable[trLine][tdCol].font = item.change // 改变字体
      })
    
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
        // this.$axios.post(`http://172.20.10.2:3000/mcombination`, {data: this.clickFont}).then(res => {
        // this.$axios.post(`http://10.254.75.27:3000/mcombination`, {data: this.clickFont}).then(res => {
        // this.$axios.post(`http://192.168.1.8:3000/mcombination`, {data: this.clickFont}).then(res => {
        this.$axios.post(`http://www.dooor.com/api/mcombination`, {data: this.clickFont}).then(res => {
        // this.$axios.post(`http://192.168.1.229:3000/api/mcombination`, {data: this.clickFont}).then(res => {
        // this.$axios.post(`http://localhost:3000/api/mcombination`, {data: this.clickFont}).then(res => {

          if(res.data.data.length > 0) {
            this.combination = res.data.data[0]

            console.log(this.combination, 'this.combination')

            this.combination.change.map(item => { // 改变字体
              let index =  item.index
              let trLine = Math.floor(index / 29)
              let tdCol = index % 29

              this.dataTable[trLine][tdCol].font = item.change // 改变字体
            })

            if(this.combination.img !== '') {
              this.imgSrc = this.combination.img
            }

            // 高亮Relation字段中的每一个字
            for(let i = 0; i < this.combination.relation.length; i++) {
              if(this.combination.relation[i].index !== '') {
                this.$refs.td[this.combination.relation[i].index].className = 're-active'
              }

              if(this.combination.relation[i].to !== '') {
                this.$refs.td[this.combination.relation[i].to].className = 're-active'
              }
            }

          } else {
            console.log('没有对应组合键，自动清除已选字体')
            this.clear().then(()=> {
              this.clickTdChildItem(item)
            })
          }
        })

      }
    },
  },

}
</script>

<style scope>
/* @media screen and (orientation: portrait) {
  .home{
    -webkit-transform:rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);

    去掉overflow 微信显示正常，但是浏览器有问题，竖屏时强制横屏缩小
    overflow: hidden;
  }
} */

/* @media screen and (orientation: landscape) {
  .home {
    -webkit-transform:rotate(0);
    -moz-transform: rotate(0);
    -ms-transform: rotate(0);
    transform: rotate(0)
  }
} */

.home {
  /* width: 100vh; */
  /* height: 100vw; */
  position: relative;
}

.air-area {
  position: absolute;
  bottom: 64px;
  width: 126px;
  left: 256px;
  background: #FFF;
}

.clear-area {
  position: absolute;
  left: 0rem;
  background: #FFF;
}

.table {
  width: 100%;
  height: 100%;
}

.table td{
  /* border: 0.1rem solid #000; */
  text-align: center;
  cursor: pointer;
  font-size: 12px;
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
  color: #fff;
  background-color: rgb(139, 86, 86);
  border-radius: 2px;
}

.table td.self-active{
  color: teal;
  background-color: yellow;
  border-radius: 2px;
}

.page-button {
  position: absolute;
  top: 0rem;
  width: 50%;
  text-align: center;
  height: 100%;
}

.page-button.left {
  left: 0px;
}

.page-button.right {
  right: 0px;
}
</style>