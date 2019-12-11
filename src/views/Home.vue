<template>
  <div class="home">
     <svg
      v-contextmenu:contextmenu
      class="svg-wrapper"
      xmlns="http://www.w3.org/2000/svg" 
      version="1.1">

      <foreignObject class="foreign" x="0" y="0">
        <!-- <table id="table" cellpadding="0" cellspacing="0" style="border-spacing:0px ">
          <tbody>
            <tr v-for="(trItem, index) in dataTable" :key="index">
              <td v-for="(tdItem, index) in trItem.td" :key="index">
                
                <table style="width: 100%; border-spacing: 0px" cellpadding="0" cellspacing="0">
                  <tr v-for="(trChild, index) in tdItem" :key="index" border="0">
                    <td class="font-item" style="border: 0px; transform: scale(1.3);" v-for="(tdChild, index) in trChild" :key="index">
                      <a :class="{active: activeItem === tdChild.index}" @click="clickTdChildItem($event, tdChild)" ref="tdChild" href="javascript:;">{{ tdChild.font }}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table> -->


        <!-- 大表格第一版本 -->
        <!-- <div style="display: flex; flex-wrap: wrap; margin: 0 auto;">
          <table v-for="(dataTableC, index) in dataTable" class="table" cellpadding="0" cellspacing="0" style="border-spacing:0px " :key="index">
            <tbody>
              <tr v-for="(tr, index) in dataTableC" :key="index">
                <td @click="clickTdChildItem($event, td)" v-for="(td, index) in tr" :key="index">
                  {{ td.font }}
                </td>
              </tr>
            </tbody>
          </table>
        </div> -->

        <div style="display: flex; flex-wrap: wrap;">
          <table class="table" cellpadding="0" cellspacing="0" style="border-spacing:0px ">
            <tbody>
              <tr ref="tr" v-for="(tr, index) in dataTable" :key="index">
                <td 
                  @click="clickTdChildItem($event, td)"  
                  v-for="(td, index) in tr" 
                  :key="index"
                  :data-index="td.index"
                  ref="td"
                  :style="td.style"
                  @mousedown.right="mousedown(td)"
                >
                  {{ td.font }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>



      </foreignObject>

      <!-- 连线 -->
      <template >
        <!-- <line
          v-for="(item, index) in Item.relation"
          :key="index" 
          :x1="$refs.tdChild[item.index].getBoundingClientRect().left + 5" 
          :y1="$refs.tdChild[item.index].getBoundingClientRect().top + 10" 
          :x2="$refs.tdChild[item.relationTo].getBoundingClientRect().left + 5" 
          :y2="$refs.tdChild[item.relationTo].getBoundingClientRect().top + 10"
          :style="{
            stroke: 'green',
            opacity: 0.9,
            strokeWidth: 1
          }"
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
          :x1="$refs.td[item.index].getBoundingClientRect().left + 5" 
          :y1="$refs.td[item.index].getBoundingClientRect().top + 10 + scrollY" 
          :x2="$refs.td[item.to].getBoundingClientRect().left + 5" 
          :y2="$refs.td[item.to].getBoundingClientRect().top + 10 + scrollY"
          :style="{
            stroke: 'green',
            opacity: 0.9,
            strokeWidth: 2
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
            strokeWidth: 2
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
            strokeWidth: 2
          }"
          marker-end="url(#markerArrow)"
        />
      </template>

    </svg>

    <div style="position: absolute; top: 0px; right: 0px;">
      已选字：
      <span v-for="(item, index) in clickFontShow" :key="item + index">
        {{ item }}
      </span>
      <!-- <button style="margin-right: 20px;" @click="requestData">请求数据</button> -->
      <!-- <button style="margin-right: 20px;" @click="requestAdd">增加链接字段</button> -->
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
  name: 'Home',
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
      clickFontShow: [], // 用于展示

      // 组合键返回数据
      combination: [],

      // 右键选中的Td
      rightClickTd: ''
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },

  mounted() {
    this.requestData()
  },

  methods: {
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
      if(this.rightClickTd.link != '') {
        window.open(this.rightClickTd.link,'_blank')
        return
      } else {
        window.alert('此字体并未设置超链接')
        return
      }
    },

    clear() {
      console.log('点击清除')
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
    },

    // clickTdChildItem(e, item) {
    //   console.log(item, 'item')
    //   return

    //   // 重置Active
    //   if(this.activeFonts.length > 0) {
    //     for(let i = 0; i < this.activeFonts.length; i++) {
    //       this.$refs.tdChild[this.activeFonts[i]].className = '';
    //     }
    //     this.activeFonts = [];
    //   }

    //   this.Item = item;

    //   for(let i = 0; i < item.relation.length; i++){
    //     this.$refs.tdChild[item.relation[i].index].className = 'active'
    //     this.$refs.tdChild[item.relation[i].relationTo].className = 'active'

    //     this.activeFonts.push(item.relation[i].relationTo, item.relation[i].index);
    //   }

    //   if(this.Item.self === true) {
    //     this.$refs.tdChild[item.index].className = 'active'
    //     this.activeFonts.push(item.index);
    //   }
    // },

    // 大表格第一版本
      requestAdd() {
        // this.$axios.post('http://localhost:3000', {
        //   font: '张'
        // }).then(res => {
        //   console.log(res)
        // })
        this.$axios.post('http://localhost:3000/111').then(res => {
          console.log(res)
        })
      },
      // requestData() {
      //   for(let i = 0; i < 19; i ++) {
      //     this.$axios.get(`http://localhost:3000?page=${i}`).then(res => {
      //       this.dataTable.push(res.data.data);
      //     })
      //   }
      //   setTimeout(() => {
      //     this.dataTable.splice(17, 0, '')
      //   }, 5000)
      // }
    // End


    // 第二版本
    requestData() {
      this.$axios.get(`http://localhost:3000/tableData`).then(res => {
        this.dataTable = res.data.data
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
      }

      // 已经点击中的字体存入该数组中
      this.clickFont.push(item.index)

      this.clickFontShow.push(item.font)

      if(this.clickFont.length == 1) { // 第一次点击字
        this.Item = item;
        // 高亮本字
        e.target.className = 'active'
        // 将 `Relaiton` 字段的每一个字存入 ActiveFonts 数组变量当中
        for(let i = 0; i < this.Item.relation.length; i++){
          this.activeFonts.push(this.Item.relation[i].index)
          this.activeFonts.push(this.Item.relation[i].to)
        }
        // 高亮Relation字段中的每一个字
        for(let i = 0; i < this.activeFonts.length; i++) {
          for(let j = 0; j < this.$refs.td.length; j++) {
            if(this.$refs.td[j].dataset.index == this.activeFonts[i]) {
              this.$refs.td[j].className = 're-active'
            }
          }
        }


        // 接下来是生成线段
        this.lineArr = []

        for(let i = 0 ; i < this.Item.relation.length; i++) {
          if(this.Item.relation[i].index == '' || this.Item.relation[i].to == '') {
            continue;
          } else {
            this.lineArr.push(this.Item.relation[i])
          }
        }

        // 生成与本字连接字段
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
        this.$axios.post(`http://localhost:3000/combination`, {data: this.clickFont}).then(res => {

          if(res.data.data.length > 0) {
            this.combination = res.data.data[0]
            // 高亮Relation字段中的每一个字
            for(let i = 0; i < this.combination.relation.length; i++) {
              for(let j = 0; j < this.$refs.td.length; j++) {
                if(this.$refs.td[j].dataset.index == this.combination.relation[i].index || this.$refs.td[j].dataset.index == this.combination.relation[i].to) {
                  this.$refs.td[j].className = 're-active'
                }
              }
            }
          } else {
            window.alert('没有对应组合键，请右键点击清除已选字体')
          }
        })
      }
    },
  },

}
</script>

<style>
.home {
  /* width: 100%; */
  /* height: 100%; */
  position: relative;
}

.svg-wrapper {
  /* width: 110%; */
  /* height: 110%; */
  /* width: 162vw; */
  /* height: 190vh; */
  /* transform: scale(0.8) translate(-18rem, -12rem); */
}

.foreign {
  /* width: 162vw; */
  /* height: 190vh; */
}

.table {
  /* width: 100%; */
  /* height: 100%; */
  border-collapse: collapse;
  border: 1px solid #000000;
}

.table td{
  border-collapse: collapse;
  border: 2px solid #000000;
  text-align: center;
  cursor: pointer;
  /* padding: 1px; */
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
  /* transform: scale(1.42) translate(-12.2%, -8%); */
}

.table td.active{
  color: green;
  background-color: pink;
  border-radius: 2px;
}

.table td.re-active{
  color: green;
  background-color: skyblue;
  border-radius: 2px;
}

.table td.self-active{
  color: teal;
  background-color: yellow;
  border-radius: 2px;
}




/* 在 1920 像素以上的的屏幕里 */
@media screen and (min-width: 1920px) {
  .svg-wrapper {
    width: 110vw;
    height: 120vh;
    /* transform: scale(0.81) translate(-21rem, -12rem); */
  }
  .foreign {
    width: 100%;
    height: 100%;
  }
  line {
    transition: all .3s;
    /* transform: scale(1.23) translate(-1.2rem, -0.9rem); */
  }
}

@media (min-width: 1600px) and (max-width: 1919px) {
  .svg-wrapper {
    width: 146vw;
    height: 145vh;
    transform: scale(0.68) translate(-45rem, -25rem);
    position: absolute;
    top: 0;
    left: 0;
  }
  .foreign {
    width: 146vw;
    height: 145vh;
  }
  line {
    transition: all .3s;
    transform: scale(1.46) translate(-0.2rem, -0.6rem);
  }
}

@media (min-width: 1440px) and (max-width: 1599px) {
  .svg-wrapper {
    width: 162vw;
    height: 182vh;
    transform: scale(0.58) translate(-62rem, -40rem);
    position: absolute;
    top: 0;
    left: 0;
  }
  .foreign {
    width: 162vw;
    height: 182vh;
  }
  line {
    transition: all .3s;
    transform: scale(1.72) translate(-4.8rem, -2.1rem);
  }
}

@media (min-width: 1366px) and (max-width: 1439px) {
  .svg-wrapper {
    width: 162vw;
    height: 182vh;
    transform: scale(0.58) translate(-62rem, -41rem);
    position: absolute;
    top: 0;
    left: 0;
  }
  .foreign {
    width: 162vw;
    height: 182vh;
  }
  line {
    transition: all .3s;
    transform: scale(1.72) translate(-4.6rem, -5.3rem);
  }
}
</style>