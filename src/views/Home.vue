<template>
  <div class="home">
     <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg" 
      version="1.1">

      <foreignObject x="0" y="0" width="100%" height="100%">
        <table id="table" cellpadding="0" cellspacing="0" style="border-spacing:0px ">
          <tbody>
            <tr v-for="(trItem, index) in dataTable" :key="index">
              <td v-for="(tdItem, index) in trItem.td" :key="index">
                
                <table style="width: 100%; border-spacing: 0px" cellpadding="0" cellspacing="0">
                  <tr v-for="(trChild, index) in tdItem" :key="index" border="0">
                    <td class="font-item" style="border: 0px; transform: scale(1.3);" v-for="(tdChild, index) in trChild" :key="index">
                      <a :class="{active: activeItem === tdChild.index}" @click="clickTdChildItem($event, tdChild)" ref="tdChild" href="javascript:;">{{ tdChild.font }}</a>
                      <!-- <a ref="tdChild" href="javascript:;">{{ tdChild }}</a> -->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </foreignObject>
      <line 
        v-for="(item, index) in renderLines" :key="index"
        :x1="startX" 
        :y1="startY" 
        :x2="$refs.tdChild[item].getBoundingClientRect().left + 5" 
        :y2="$refs.tdChild[item].getBoundingClientRect().top + 10" 
        :style="{
          stroke: '#000',
          opacity: 0.6,
          strokeWidth: 2
        }" />

      <!-- <path :d="
        `M ${startX}, ${startY} 
        L ${endX}, ${endY}`" stroke="red" stroke-width="3"/> -->
      <!-- <path d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none" /> -->
    </svg>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      activeItem: '',
      dataTable: [
        {
          td: [
            [
              [
                {font: '你', index: 0, relation: [496, 272, 192, 300]},
                {font: '好', index: 1, relation: [529, 382, 201, 50,]},
                {font: '数', index: 2, relation: [123, 456, 621]},
                {font: '据', index: 3, relation: [211]},
                {font: '嗯', index: 4, relation: [451, 300]},
                {font: '结', index: 5, relation: [400, 187]},
                {font: '构', index: 6, relation: [611]},
              ],
              [
                {font: '你', index: 7, relation: [15]},
                {font: '好', index: 8, relation: [20]},
                {font: '数', index: 9, relation: [11]},
                {font: '据', index: 10, relation: [13]},
                {font: '嗯', index: 11, relation: [9]},
                {font: '结', index: 12, relation: [7]},
                {font: '构', index: 13, relation: [18]},
              ],
              [
                {font: '你', index: 14, relation: [19]},
                {font: '好', index: 15, relation: [17]},
                {font: '数', index: 16, relation: [14]},
                {font: '据', index: 17, relation: [4]},
                {font: '嗯', index: 18, relation: [2]},
                {font: '结', index: 19, relation: [15]},
                {font: '构', index: 20, relation: [14]},
              ],
              [
                {font: '你', index: 21, relation: [19]},
                {font: '好', index: 22, relation: [17]},
                {font: '数', index: 23, relation: [14]},
                {font: '据', index: 24, relation: [4]},
                {font: '嗯', index: 25, relation: [2]},
                {font: '结', index: 26, relation: [15]},
                {font: '构', index: 27, relation: [14]},
              ],
            ],
            [
              [
                {font: '你', index: 28, relation: [19]},
                {font: '好', index: 29, relation: [17]},
                {font: '数', index: 30, relation: [14]},
                {font: '据', index: 31, relation: [4]},
                {font: '嗯', index: 32, relation: [2]},
                {font: '结', index: 33, relation: [15]},
                {font: '构', index: 34, relation: [14]},
              ],
              [
                {font: '你', index: 35, relation: [19]},
                {font: '好', index: 36, relation: [17]},
                {font: '数', index: 37, relation: [14]},
                {font: '据', index: 38, relation: [4]},
                {font: '嗯', index: 39, relation: [2]},
                {font: '结', index: 40, relation: [15]},
                {font: '构', index: 41, relation: [14]},
              ],
              [
                {font: '你', index: 42, relation: [19]},
                {font: '好', index: 43, relation: [17]},
                {font: '数', index: 44, relation: [14]},
                {font: '据', index: 45, relation: [4]},
                {font: '嗯', index: 46, relation: [2]},
                {font: '结', index: 47, relation: [15]},
                {font: '构', index: 48, relation: [14]},
              ],
              [
                {font: '你', index: 49, relation: [19]},
                {font: '好', index: 50, relation: [17]},
                {font: '数', index: 51, relation: [14]},
                {font: '据', index: 52, relation: [4]},
                {font: '嗯', index: 53, relation: [2]},
                {font: '结', index: 54, relation: [15]},
                {font: '构', index: 55, relation: [14]},
              ],
            ],
            '',
            [
              [
                {font: '你', index: 56, relation: [19]},
                {font: '好', index: 57, relation: [17]},
                {font: '数', index: 58, relation: [14]},
                {font: '据', index: 59, relation: [4]},
                {font: '嗯', index: 60, relation: [2]},
                {font: '结', index: 61, relation: [15]},
                {font: '构', index: 62, relation: [14]},
              ],
              [
                {font: '你', index: 63, relation: [19]},
                {font: '好', index: 64, relation: [17]},
                {font: '数', index: 65, relation: [14]},
                {font: '据', index: 66, relation: [4]},
                {font: '嗯', index: 67, relation: [2]},
                {font: '结', index: 68, relation: [15]},
                {font: '构', index: 69, relation: [14]},
              ],
              [
                {font: '你', index: 70, relation: [19]},
                {font: '好', index: 71, relation: [17]},
                {font: '数', index: 72, relation: [14]},
                {font: '据', index: 73, relation: [4]},
                {font: '嗯', index: 74, relation: [2]},
                {font: '结', index: 75, relation: [15]},
                {font: '构', index: 76, relation: [14]},
              ],
              [
                {font: '你', index: 77, relation: [19]},
                {font: '好', index: 78, relation: [17]},
                {font: '数', index: 79, relation: [14]},
                {font: '据', index: 80, relation: [4]},
                {font: '嗯', index: 81, relation: [2]},
                {font: '结', index: 82, relation: [15]},
                {font: '构', index: 83, relation: [14]},
              ],
            ],
            [
              [
                {font: '你', index: 84, relation: [19]},
                {font: '好', index: 85, relation: [17]},
                {font: '数', index: 86, relation: [14]},
                {font: '据', index: 87, relation: [4]},
                {font: '嗯', index: 88, relation: [2]},
                {font: '结', index: 89, relation: [15]},
                {font: '构', index: 90, relation: [14]},
              ],
              [
                {font: '你', index: 91, relation: [19]},
                {font: '好', index: 92, relation: [17]},
                {font: '数', index: 93, relation: [14]},
                {font: '据', index: 94, relation: [4]},
                {font: '嗯', index: 95, relation: [2]},
                {font: '结', index: 96, relation: [15]},
                {font: '构', index: 97, relation: [14]},
              ],
              [
                {font: '你', index: 99, relation: [19]},
                {font: '好', index: 100, relation: [17]},
                {font: '数', index: 101, relation: [14]},
                {font: '据', index: 102, relation: [4]},
                {font: '嗯', index: 103, relation: [2]},
                {font: '结', index: 104, relation: [15]},
                {font: '构', index: 105, relation: [14]},
              ],
              [
                {font: '你', index: 106, relation: [19]},
                {font: '好', index: 107, relation: [17]},
                {font: '数', index: 108, relation: [14]},
                {font: '据', index: 109, relation: [4]},
                {font: '嗯', index: 110, relation: [2]},
                {font: '结', index: 111, relation: [15]},
                {font: '构', index: 112, relation: [14]},
              ],
            ],
          ],
        },
        {
          td: [
            [
              [
                {font: '你', index: 113, relation: [19]},
                {font: '好', index: 114, relation: [17]},
                {font: '数', index: 115, relation: [14]},
                {font: '据', index: 116, relation: [4]},
                {font: '嗯', index: 117, relation: [2]},
                {font: '结', index: 118, relation: [15]},
                {font: '构', index: 119, relation: [14]},
              ],
              [
                {font: '你', index: 120, relation: [19]},
                {font: '好', index: 121, relation: [17]},
                {font: '数', index: 122, relation: [14]},
                {font: '据', index: 123, relation: [4]},
                {font: '嗯', index: 124, relation: [2]},
                {font: '结', index: 125, relation: [15]},
                {font: '构', index: 126, relation: [14]},
              ],
              [
                {font: '你', index: 127, relation: [19]},
                {font: '好', index: 128, relation: [17]},
                {font: '数', index: 129, relation: [14]},
                {font: '嗯', index: 130, relation: [2]},
                {font: '结', index: 131, relation: [15]},
                {font: '构', index: 132, relation: [14]},
                {font: '据', index: 133, relation: [4]},
              ],
              [
                {font: '你', index: 134, relation: [19]},
                {font: '好', index: 135, relation: [17]},
                {font: '数', index: 136, relation: [14]},
                {font: '据', index: 137, relation: [4]},
                {font: '嗯', index: 138, relation: [2]},
                {font: '结', index: 139, relation: [15]},
                {font: '构', index: 140, relation: [14]},
              ],
            ],
            [
              [
                {font: '好', index: 141, relation: [17]},
                {font: '数', index: 142, relation: [14]},
                {font: '据', index: 143, relation: [4]},
                {font: '嗯', index: 144, relation: [2]},
                {font: '结', index: 145, relation: [15]},
                {font: '构', index: 146, relation: [14]},
                {font: '构', index: 147, relation: [14]},
              ],
              [
                {font: '好', index: 148, relation: [17]},
                {font: '数', index: 149, relation: [14]},
                {font: '据', index: 150, relation: [4]},
                {font: '嗯', index: 151, relation: [2]},
                {font: '结', index: 152, relation: [15]},
                {font: '构', index: 153, relation: [14]},
                {font: '构', index: 154, relation: [14]},
              ],
              [
                {font: '好', index: 155, relation: [17]},
                {font: '数', index: 156, relation: [14]},
                {font: '据', index: 157, relation: [4]},
                {font: '嗯', index: 158, relation: [2]},
                {font: '结', index: 159, relation: [15]},
                {font: '构', index: 160, relation: [14]},
                {font: '构', index: 161, relation: [14]},
              ],
              [
                {font: '好', index: 162, relation: [17]},
                {font: '数', index: 163, relation: [14]},
                {font: '据', index: 164, relation: [4]},
                {font: '嗯', index: 165, relation: [2]},
                {font: '结', index: 166, relation: [15]},
                {font: '构', index: 167, relation: [14]},
                {font: '构', index: 168, relation: [14]},
              ],
            ],
            '',
            [
              [
                {font: '好', index: 169, relation: [17]},
                {font: '数', index: 170, relation: [14]},
                {font: '据', index: 171, relation: [4]},
                {font: '嗯', index: 172, relation: [2]},
                {font: '结', index: 173, relation: [15]},
                {font: '构', index: 174, relation: [14]},
                {font: '构', index: 175, relation: [14]},
              ],
              [
                {font: '好', index: 176, relation: [17]},
                {font: '数', index: 177, relation: [14]},
                {font: '据', index: 178, relation: [4]},
                {font: '嗯', index: 179, relation: [2]},
                {font: '结', index: 180, relation: [15]},
                {font: '构', index: 181, relation: [14]},
                {font: '构', index: 182, relation: [14]},
              ],
              [
                {font: '好', index: 183, relation: [17]},
                {font: '数', index: 184, relation: [14]},
                {font: '据', index: 185, relation: [4]},
                {font: '嗯', index: 186, relation: [2]},
                {font: '结', index: 187, relation: [15]},
                {font: '构', index: 188, relation: [14]},
                {font: '构', index: 190, relation: [14]},
              ],
              [
                {font: '好', index: 191, relation: [17]},
                {font: '数', index: 192, relation: [14]},
                {font: '据', index: 193, relation: [4]},
                {font: '嗯', index: 194, relation: [2]},
                {font: '结', index: 195, relation: [15]},
                {font: '构', index: 196, relation: [14]},
                {font: '构', index: 197, relation: [14]},
              ],
            ],
            [
              [
                {font: '好', index: 198, relation: [17]},
                {font: '数', index: 199, relation: [14]},
                {font: '据', index: 200, relation: [4]},
                {font: '嗯', index: 201, relation: [2]},
                {font: '结', index: 202, relation: [15]},
                {font: '构', index: 203, relation: [14]},
                {font: '构', index: 204, relation: [14]},
              ],
              [
                {font: '据', index: 205, relation: [4]},
                {font: '嗯', index: 206, relation: [2]},
                {font: '结', index: 207, relation: [15]},
                {font: '构', index: 208, relation: [14]},
                {font: '构', index: 209, relation: [14]},
                {font: '构', index: 210, relation: [14]},
                {font: '构', index: 211, relation: [14]},
              ],
              [
                {font: '据', index: 212, relation: [4]},
                {font: '嗯', index: 213, relation: [2]},
                {font: '结', index: 214, relation: [15]},
                {font: '构', index: 215, relation: [14]},
                {font: '构', index: 216, relation: [14]},
                {font: '构', index: 217, relation: [14]},
                {font: '构', index: 218, relation: [14]},
              ],
              [
                {font: '据', index: 219, relation: [4]},
                {font: '嗯', index: 220, relation: [2]},
                {font: '结', index: 221, relation: [15]},
                {font: '构', index: 222, relation: [14]},
                {font: '构', index: 223, relation: [14]},
                {font: '构', index: 224, relation: [14]},
                {font: '构', index: 225, relation: [14]},
              ],
            ],
          ],
        },
        {
          td: [
            [
              [
                {font: '据', index: 226, relation: [4]},
                {font: '嗯', index: 227, relation: [2]},
                {font: '结', index: 228, relation: [15]},
                {font: '构', index: 229, relation: [14]},
                {font: '构', index: 230, relation: [14]},
                {font: '构', index: 231, relation: [14]},
                {font: '构', index: 232, relation: [14]},
              ],
              [
                {font: '据', index: 233, relation: [4]},
                {font: '嗯', index: 234, relation: [2]},
                {font: '结', index: 235, relation: [15]},
                {font: '构', index: 236, relation: [14]},
                {font: '构', index: 237, relation: [14]},
                {font: '构', index: 238, relation: [14]},
                {font: '构', index: 239, relation: [14]},
              ],
              [
                {font: '据', index: 241, relation: [4]},
                {font: '嗯', index: 242, relation: [2]},
                {font: '结', index: 243, relation: [15]},
                {font: '构', index: 244, relation: [14]},
                {font: '构', index: 245, relation: [14]},
                {font: '构', index: 246, relation: [14]},
                {font: '构', index: 247, relation: [14]},
              ],
              [
                {font: '据', index: 248, relation: [4]},
                {font: '嗯', index: 249, relation: [2]},
                {font: '结', index: 250, relation: [15]},
                {font: '构', index: 251, relation: [14]},
                {font: '构', index: 252, relation: [14]},
                {font: '构', index: 252, relation: [14]},
                {font: '构', index: 254, relation: [14]},
              ],
            ],
            [
              [
                {font: '据', index: 255, relation: [4]},
                {font: '嗯', index: 256, relation: [2]},
                {font: '结', index: 257, relation: [15]},
                {font: '构', index: 258, relation: [14]},
                {font: '构', index: 259, relation: [14]},
                {font: '构', index: 260, relation: [14]},
                {font: '构', index: 261, relation: [14]},
              ],
              [
                {font: '据', index: 262, relation: [4]},
                {font: '嗯', index: 263, relation: [2]},
                {font: '结', index: 264, relation: [15]},
                {font: '构', index: 265, relation: [14]},
                {font: '构', index: 266, relation: [14]},
                {font: '构', index: 267, relation: [14]},
                {font: '构', index: 268, relation: [14]},
              ],
              [
                {font: '据', index: 269, relation: [4]},
                {font: '嗯', index: 270, relation: [2]},
                {font: '结', index: 271, relation: [15]},
                {font: '构', index: 272, relation: [14]},
                {font: '构', index: 273, relation: [14]},
                {font: '构', index: 274, relation: [14]},
                {font: '构', index: 275, relation: [14]},
              ],
              [
                {font: '据', index: 276, relation: [4]},
                {font: '嗯', index: 277, relation: [2]},
                {font: '结', index: 278, relation: [15]},
                {font: '构', index: 279, relation: [14]},
                {font: '构', index: 280, relation: [14]},
                {font: '构', index: 281, relation: [14]},
                {font: '构', index: 282, relation: [14]},
              ],
            ],
            [
              [
                {font: '据', index: 283, relation: [4]},
                {font: '嗯', index: 284, relation: [2]},
                {font: '结', index: 285, relation: [15]},
                {font: '构', index: 286, relation: [14]},
                {font: '构', index: 287, relation: [14]},
                {font: '构', index: 288, relation: [14]},
                {font: '构', index: 290, relation: [14]},
              ],
              [
                {font: '据', index: 291, relation: [4]},
                {font: '嗯', index: 292, relation: [2]},
                {font: '结', index: 293, relation: [15]},
                {font: '构', index: 294, relation: [14]},
                {font: '构', index: 295, relation: [14]},
                {font: '构', index: 296, relation: [14]},
                {font: '构', index: 297, relation: [14]},
              ],
              [
                {font: '据', index: 298, relation: [4]},
                {font: '嗯', index: 299, relation: [2]},
                {font: '结', index: 301, relation: [15]},
                {font: '构', index: 302, relation: [14]},
                {font: '构', index: 303, relation: [14]},
                {font: '构', index: 304, relation: [14]},
                {font: '构', index: 306, relation: [14]},
              ],
              [
                {font: '结', index: 307, relation: [15]},
                {font: '构', index: 308, relation: [14]},
                {font: '构', index: 309, relation: [14]},
                {font: '构', index: 310, relation: [14]},
                {font: '构', index: 311, relation: [14]},
                {font: '构', index: 312, relation: [14]},
                {font: '构', index: 313, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 314, relation: [15]},
                {font: '构', index: 315, relation: [14]},
                {font: '构', index: 316, relation: [14]},
                {font: '构', index: 317, relation: [14]},
                {font: '构', index: 318, relation: [14]},
                {font: '构', index: 319, relation: [14]},
                {font: '构', index: 320, relation: [14]},
              ],
              [
                {font: '结', index: 321, relation: [15]},
                {font: '构', index: 322, relation: [14]},
                {font: '构', index: 323, relation: [14]},
                {font: '构', index: 324, relation: [14]},
                {font: '构', index: 325, relation: [14]},
                {font: '构', index: 326, relation: [14]},
                {font: '构', index: 327, relation: [14]},
              ],
              [
                {font: '结', index: 328, relation: [15]},
                {font: '构', index: 329, relation: [14]},
                {font: '构', index: 330, relation: [14]},
                {font: '构', index: 331, relation: [14]},
                {font: '构', index: 332, relation: [14]},
                {font: '构', index: 333, relation: [14]},
                {font: '构', index: 334, relation: [14]},
              ],
              [
                {font: '结', index: 335, relation: [15]},
                {font: '构', index: 336, relation: [14]},
                {font: '构', index: 337, relation: [14]},
                {font: '构', index: 338, relation: [14]},
                {font: '构', index: 339, relation: [14]},
                {font: '构', index: 340, relation: [14]},
                {font: '构', index: 341, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 342, relation: [15]},
                {font: '构', index: 343, relation: [14]},
                {font: '构', index: 344, relation: [14]},
                {font: '构', index: 345, relation: [14]},
                {font: '构', index: 346, relation: [14]},
                {font: '构', index: 347, relation: [14]},
                {font: '构', index: 348, relation: [14]},
              ],
              [
                {font: '结', index: 349, relation: [15]},
                {font: '构', index: 350, relation: [14]},
                {font: '构', index: 351, relation: [14]},
                {font: '构', index: 352, relation: [14]},
                {font: '构', index: 353, relation: [14]},
                {font: '构', index: 354, relation: [14]},
                {font: '构', index: 355, relation: [14]},
              ],
              [
                {font: '结', index: 356, relation: [15]},
                {font: '构', index: 357, relation: [14]},
                {font: '构', index: 358, relation: [14]},
                {font: '构', index: 359, relation: [14]},
                {font: '构', index: 360, relation: [14]},
                {font: '构', index: 361, relation: [14]},
                {font: '构', index: 362, relation: [14]},
              ],
              [
                {font: '结', index: 363, relation: [15]},
                {font: '构', index: 364, relation: [14]},
                {font: '构', index: 365, relation: [14]},
                {font: '构', index: 366, relation: [14]},
                {font: '构', index: 367, relation: [14]},
                {font: '构', index: 368, relation: [14]},
                {font: '构', index: 369, relation: [14]},
              ],
            ],
          ],
        },
        {
          td: [
            [
              [
                {font: '结', index: 370, relation: [15]},
                {font: '构', index: 371, relation: [14]},
                {font: '构', index: 372, relation: [14]},
                {font: '构', index: 373, relation: [14]},
                {font: '构', index: 374, relation: [14]},
                {font: '构', index: 375, relation: [14]},
                {font: '构', index: 376, relation: [14]},
              ],
              [
                {font: '结', index: 377, relation: [15]},
                {font: '构', index: 378, relation: [14]},
                {font: '构', index: 379, relation: [14]},
                {font: '构', index: 380, relation: [14]},
                {font: '构', index: 381, relation: [14]},
                {font: '构', index: 382, relation: [14]},
                {font: '构', index: 383, relation: [14]},
              ],
              [
                {font: '结', index: 384, relation: [15]},
                {font: '构', index: 385, relation: [14]},
                {font: '构', index: 386, relation: [14]},
                {font: '构', index: 387, relation: [14]},
                {font: '构', index: 388, relation: [14]},
                {font: '构', index: 389, relation: [14]},
                {font: '构', index: 390, relation: [14]},
              ],
              [
                {font: '结', index: 391, relation: [15]},
                {font: '构', index: 392, relation: [14]},
                {font: '构', index: 393, relation: [14]},
                {font: '构', index: 394, relation: [14]},
                {font: '构', index: 395, relation: [14]},
                {font: '构', index: 396, relation: [14]},
                {font: '构', index: 397, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 398, relation: [15]},
                {font: '构', index: 399, relation: [14]},
                {font: '构', index: 400, relation: [14]},
                {font: '构', index: 401, relation: [14]},
                {font: '构', index: 402, relation: [14]},
                {font: '构', index: 403, relation: [14]},
                {font: '构', index: 404, relation: [14]},
              ],
              [
                {font: '结', index: 405, relation: [15]},
                {font: '构', index: 406, relation: [14]},
                {font: '构', index: 407, relation: [14]},
                {font: '构', index: 408, relation: [14]},
                {font: '构', index: 409, relation: [14]},
                {font: '构', index: 410, relation: [14]},
                {font: '构', index: 411, relation: [14]},
              ],
              [
                {font: '结', index: 412, relation: [15]},
                {font: '构', index: 413, relation: [14]},
                {font: '构', index: 414, relation: [14]},
                {font: '构', index: 415, relation: [14]},
                {font: '构', index: 416, relation: [14]},
                {font: '构', index: 417, relation: [14]},
                {font: '构', index: 418, relation: [14]},
              ],
              [
                {font: '结', index: 419, relation: [15]},
                {font: '构', index: 420, relation: [14]},
                {font: '构', index: 421, relation: [14]},
                {font: '构', index: 422, relation: [14]},
                {font: '构', index: 423, relation: [14]},
                {font: '构', index: 424, relation: [14]},
                {font: '构', index: 425, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 426, relation: [15]},
                {font: '构', index: 427, relation: [14]},
                {font: '构', index: 428, relation: [14]},
                {font: '构', index: 429, relation: [14]},
                {font: '构', index: 430, relation: [14]},
                {font: '构', index: 431, relation: [14]},
                {font: '构', index: 432, relation: [14]},
              ],
              [
                {font: '结', index: 433, relation: [15]},
                {font: '构', index: 434, relation: [14]},
                {font: '构', index: 435, relation: [14]},
                {font: '构', index: 436, relation: [14]},
                {font: '构', index: 437, relation: [14]},
                {font: '构', index: 438, relation: [14]},
                {font: '构', index: 439, relation: [14]},
              ],
              [
                {font: '结', index: 440, relation: [15]},
                {font: '构', index: 441, relation: [14]},
                {font: '构', index: 442, relation: [14]},
                {font: '构', index: 443, relation: [14]},
                {font: '构', index: 444, relation: [14]},
                {font: '构', index: 445, relation: [14]},
                {font: '构', index: 446, relation: [14]},
              ],
              [
                {font: '结', index: 447, relation: [15]},
                {font: '构', index: 448, relation: [14]},
                {font: '构', index: 449, relation: [14]},
                {font: '构', index: 450, relation: [14]},
                {font: '构', index: 451, relation: [14]},
                {font: '构', index: 452, relation: [14]},
                {font: '构', index: 453, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 454, relation: [15]},
                {font: '构', index: 455, relation: [14]},
                {font: '构', index: 456, relation: [14]},
                {font: '构', index: 457, relation: [14]},
                {font: '构', index: 458, relation: [14]},
                {font: '构', index: 459, relation: [14]},
                {font: '构', index: 460, relation: [14]},
              ],
              [
                {font: '结', index: 461, relation: [15]},
                {font: '构', index: 462, relation: [14]},
                {font: '构', index: 463, relation: [14]},
                {font: '构', index: 464, relation: [14]},
                {font: '构', index: 465, relation: [14]},
                {font: '构', index: 466, relation: [14]},
                {font: '构', index: 467, relation: [14]},
              ],
              [
                {font: '结', index: 468, relation: [15]},
                {font: '构', index: 469, relation: [14]},
                {font: '构', index: 470, relation: [14]},
                {font: '构', index: 471, relation: [14]},
                {font: '构', index: 472, relation: [14]},
                {font: '构', index: 473, relation: [14]},
                {font: '构', index: 474, relation: [14]},
              ],
              [
                {font: '结', index: 475, relation: [15]},
                {font: '构', index: 476, relation: [14]},
                {font: '构', index: 477, relation: [14]},
                {font: '构', index: 478, relation: [14]},
                {font: '构', index: 479, relation: [14]},
                {font: '构', index: 480, relation: [14]},
                {font: '构', index: 481, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 482, relation: [15]},
                {font: '构', index: 483, relation: [14]},
                {font: '构', index: 484, relation: [14]},
                {font: '构', index: 485, relation: [14]},
                {font: '构', index: 486, relation: [14]},
                {font: '构', index: 487, relation: [14]},
                {font: '构', index: 488, relation: [14]},
              ],
              [
                {font: '结', index: 489, relation: [15]},
                {font: '构', index: 490, relation: [14]},
                {font: '构', index: 491, relation: [14]},
                {font: '构', index: 492, relation: [14]},
                {font: '构', index: 493, relation: [14]},
                {font: '构', index: 494, relation: [14]},
                {font: '构', index: 495, relation: [14]},
              ],
              [
                {font: '结', index: 496, relation: [15]},
                {font: '构', index: 497, relation: [14]},
                {font: '构', index: 498, relation: [14]},
                {font: '构', index: 499, relation: [14]},
                {font: '构', index: 500, relation: [14]},
                {font: '构', index: 501, relation: [14]},
                {font: '构', index: 502, relation: [14]},
              ],
              [
                {font: '结', index: 503, relation: [15]},
                {font: '构', index: 504, relation: [14]},
                {font: '构', index: 505, relation: [14]},
                {font: '构', index: 506, relation: [14]},
                {font: '构', index: 507, relation: [14]},
                {font: '构', index: 508, relation: [14]},
                {font: '构', index: 509, relation: [14]},
              ],
            ],
          ],
        },
        {
          td: [
            [
              [
                {font: '结', index: 510, relation: [15]},
                {font: '构', index: 511, relation: [14]},
                {font: '构', index: 512, relation: [14]},
                {font: '构', index: 513, relation: [14]},
                {font: '构', index: 514, relation: [14]},
                {font: '构', index: 515, relation: [14]},
                {font: '构', index: 516, relation: [14]},
              ],
              [
                {font: '结', index: 517, relation: [15]},
                {font: '构', index: 518, relation: [14]},
                {font: '构', index: 519, relation: [14]},
                {font: '构', index: 520, relation: [14]},
                {font: '构', index: 521, relation: [14]},
                {font: '构', index: 522, relation: [14]},
                {font: '构', index: 523, relation: [14]},
              ],
              [
                {font: '结', index: 524, relation: [15]},
                {font: '构', index: 525, relation: [14]},
                {font: '构', index: 526, relation: [14]},
                {font: '构', index: 527, relation: [14]},
                {font: '构', index: 528, relation: [14]},
                {font: '构', index: 529, relation: [14]},
                {font: '构', index: 530, relation: [14]},
              ],
              [
                {font: '结', index: 531, relation: [15]},
                {font: '构', index: 532, relation: [14]},
                {font: '构', index: 533, relation: [14]},
                {font: '构', index: 534, relation: [14]},
                {font: '构', index: 535, relation: [14]},
                {font: '构', index: 536, relation: [14]},
                {font: '构', index: 537, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 538, relation: [15]},
                {font: '构', index: 539, relation: [14]},
                {font: '构', index: 540, relation: [14]},
                {font: '构', index: 541, relation: [14]},
                {font: '构', index: 542, relation: [14]},
                {font: '构', index: 543, relation: [14]},
                {font: '构', index: 544, relation: [14]},
              ],
              [
                {font: '结', index: 545, relation: [15]},
                {font: '构', index: 546, relation: [14]},
                {font: '构', index: 547, relation: [14]},
                {font: '构', index: 548, relation: [14]},
                {font: '构', index: 549, relation: [14]},
                {font: '构', index: 550, relation: [14]},
                {font: '构', index: 551, relation: [14]},
              ],
              [
                {font: '结', index: 552, relation: [15]},
                {font: '构', index: 553, relation: [14]},
                {font: '构', index: 554, relation: [14]},
                {font: '构', index: 555, relation: [14]},
                {font: '构', index: 556, relation: [14]},
                {font: '构', index: 557, relation: [14]},
                {font: '构', index: 558, relation: [14]},
              ],
              [
                {font: '结', index: 559, relation: [15]},
                {font: '构', index: 560, relation: [14]},
                {font: '构', index: 561, relation: [14]},
                {font: '构', index: 562, relation: [14]},
                {font: '构', index: 563, relation: [14]},
                {font: '构', index: 564, relation: [14]},
                {font: '构', index: 565, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 566, relation: [15]},
                {font: '构', index: 567, relation: [14]},
                {font: '构', index: 568, relation: [14]},
                {font: '构', index: 569, relation: [14]},
                {font: '构', index: 570, relation: [14]},
                {font: '构', index: 571, relation: [14]},
                {font: '构', index: 572, relation: [14]},
              ],
              [
                {font: '结', index: 573, relation: [15]},
                {font: '构', index: 574, relation: [14]},
                {font: '构', index: 575, relation: [14]},
                {font: '构', index: 576, relation: [14]},
                {font: '构', index: 577, relation: [14]},
                {font: '构', index: 578, relation: [14]},
                {font: '构', index: 579, relation: [14]},
              ],
              [
                {font: '结', index: 580, relation: [15]},
                {font: '构', index: 581, relation: [14]},
                {font: '构', index: 582, relation: [14]},
                {font: '构', index: 583, relation: [14]},
                {font: '构', index: 584, relation: [14]},
                {font: '构', index: 585, relation: [14]},
                {font: '构', index: 586, relation: [14]},
              ],
              [
                {font: '结', index: 587, relation: [15]},
                {font: '构', index: 588, relation: [14]},
                {font: '构', index: 589, relation: [14]},
                {font: '构', index: 590, relation: [14]},
                {font: '构', index: 591, relation: [14]},
                {font: '构', index: 592, relation: [14]},
                {font: '构', index: 593, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 594, relation: [15]},
                {font: '构', index: 595, relation: [14]},
                {font: '构', index: 596, relation: [14]},
                {font: '构', index: 597, relation: [14]},
                {font: '构', index: 598, relation: [14]},
                {font: '构', index: 599, relation: [14]},
                {font: '构', index: 600, relation: [14]},
              ],
              [
                {font: '结', index: 601, relation: [15]},
                {font: '构', index: 602, relation: [14]},
                {font: '构', index: 603, relation: [14]},
                {font: '构', index: 604, relation: [14]},
                {font: '构', index: 605, relation: [14]},
                {font: '构', index: 606, relation: [14]},
                {font: '构', index: 607, relation: [14]},
              ],
              [
                {font: '结', index: 608, relation: [15]},
                {font: '构', index: 609, relation: [14]},
                {font: '构', index: 610, relation: [14]},
                {font: '构', index: 611, relation: [14]},
                {font: '构', index: 612, relation: [14]},
                {font: '构', index: 613, relation: [14]},
                {font: '构', index: 614, relation: [14]},
              ],
              [
                {font: '结', index: 615, relation: [15]},
                {font: '构', index: 616, relation: [14]},
                {font: '构', index: 617, relation: [14]},
                {font: '构', index: 618, relation: [14]},
                {font: '构', index: 619, relation: [14]},
                {font: '构', index: 620, relation: [14]},
                {font: '构', index: 621, relation: [14]},
              ],
            ],
            [
              [
                {font: '结', index: 622, relation: [15]},
                {font: '构', index: 623, relation: [14]},
                {font: '构', index: 624, relation: [14]},
                {font: '构', index: 625, relation: [14]},
                {font: '构', index: 626, relation: [14]},
                {font: '构', index: 627, relation: [14]},
                {font: '构', index: 628, relation: [14]},
              ],
              [
                {font: '结', index: 629, relation: [15]},
                {font: '构', index: 630, relation: [14]},
                {font: '构', index: 631, relation: [14]},
                {font: '构', index: 632, relation: [14]},
                {font: '构', index: 633, relation: [14]},
                {font: '构', index: 634, relation: [14]},
                {font: '构', index: 635, relation: [14]},
              ],
              [
                {font: '构', index: 636, relation: [14]},
                {font: '构', index: 637, relation: [14]},
                {font: '构', index: 638, relation: [14]},
                {font: '构', index: 639, relation: [14]},
                {font: '构', index: 640, relation: [14]},
                {font: '构', index: 641, relation: [14]},
                {font: '结', index: 642, relation: [15]},
              ],
              [
                {font: '结', index: 643, relation: [15]},
                {font: '构', index: 644, relation: [14]},
                {font: '构', index: 645, relation: [14]},
                {font: '构', index: 646, relation: [14]},
                {font: '构', index: 647, relation: [14]},
                {font: '构', index: 648, relation: [14]},
                {font: '构', index: 649, relation: [14]},
              ],
            ],
          ],
        },
      ],
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      timer: false,

      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,

      renderLines: [],
    }
  },
  methods: {
    clickTdChildItem(e, item) {
      this.activeItem = item.index
      this.startX = e.x
      this.startY = e.y

      if(this.renderLines.length > 0) {
        // 清空上一组关联到的Active样式
        for(let i = 0; i < this.renderLines.length; i++) {
          this.$refs.tdChild[this.renderLines[i]].className = '';
        }
        // 清空关联线
        this.renderLines = [];
      }

      for(let i = 0; i < item.relation.length; i++) {
        this.renderLines.push(item.relation[i]);
        this.$refs.tdChild[item.relation[i]].className = 'active_relation'
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

#table {
  width: 100%;
  margin: 0px auto 0px;
  border-collapse: collapse;
  border: 1px solid #000000;
  height: 100vh;
}

#table td{
  border-collapse: collapse;
  border: 1px solid #000000;
  text-align: center;
}

/* 空白边框 */
#table > tbody > tr:nth-child(1)>td:nth-child(3){
  border-bottom: 1px solid transparent;
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
</style>