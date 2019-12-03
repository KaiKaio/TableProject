<template>
  <div class="home">
     <svg
      width="100%"
      height="130%"
      xmlns="http://www.w3.org/2000/svg" 
      version="1.1">

      <foreignObject x="0" y="0" width="100%" height="130%">
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

        <div style="display: flex; flex-wrap: wrap; margin: 0 auto;">
          <table class="table" cellpadding="0" cellspacing="0" style="border-spacing:0px ">
            <tbody>
              <tr v-for="(tr, index) in dataTable" :key="index">
                <td 
                  @click="clickTdChildItem($event, td)"  
                  v-for="(td, index) in tr" 
                  :key="index"
                  :data-index="td.index"
                  ref="td"
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
            markerWidth="10" 
            markerHeight="10" 
            refX="0" 
            refY="5" 
            orient="auto"
          >
            <path d="M0,0 L0,10 L10,5 z" style="fill: #000000;" />
          </marker>
        </defs>

        <line
          v-for="(item, index) in Item.relation"
          :key="index" 
          :x1="$refs.td[item.index].getBoundingClientRect().left + 5" 
          :y1="$refs.td[item.index].getBoundingClientRect().top + 10" 
          :x2="$refs.td[item.to].getBoundingClientRect().left + 5" 
          :y2="$refs.td[item.to].getBoundingClientRect().top + 10"
          :style="{
            stroke: 'green',
            opacity: 0.9,
            strokeWidth: 3
          }"
          marker-end="url(#markerArrow)"
        />
      </template>

    </svg>
    <button @click="requestData">请求数据</button>
    <button @click="requestAdd">xxx</button>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
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
    }
  },
  methods: {
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
      if(this.Item) {
        for(let j = 0; j < this.$refs.td.length; j++) {
          if(this.$refs.td[j].dataset.index == this.Item.index) {
            this.$refs.td[j].className = ''
            break;
          }
        }
      }

      // 清空 relation active 样式
      this.activeFonts = []
      for(let i = 0; i < this.$refs.td.length; i++) {
        if(this.$refs.td[i].className == 're-active') {
          this.$refs.td[i].className = ''
        }
      }

      this.Item = item;
      console.log(this.Item.relation)

      
      e.target.className = 'active'

      for(let i = 0; i < this.Item.relation.length; i++){
        this.activeFonts.push(this.Item.relation[i].index)
        this.activeFonts.push(this.Item.relation[i].to)
      }


      for(let i = 0; i < this.activeFonts.length; i++) {
        // this.activeFonts 是需要高亮的数组
        for(let j = 0; j < this.$refs.td.length; j++) {
          if(this.$refs.td[j].dataset.index == this.activeFonts[i]) {
            this.$refs.td[j].className = 're-active'
          }
        }
      }
    },
    
  },
}
</script>

<style>
.home {
  width: 100%;
  height: 100%;
}

.table {
  width: 100vw;
  height: 100%;
  margin: 0px auto 0px;
  border-collapse: collapse;
  border: 1px solid #000000;
  /* width: 19.7vw; */
  /* height: 25vh; */
}

.table td{
  border-collapse: collapse;
  border: 1px solid #000000;
  text-align: center;
  cursor: pointer;
}

/* 空白边框 */
.table > tbody > tr:nth-child(1)>td:nth-child(3){
  /* border-bottom: 1px solid transparent; */
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
  background-color: yellow;
  border-radius: 2px;
}

.table td.re-active{
  color: green;
  background-color: skyblue;
  border-radius: 2px;
}
</style>