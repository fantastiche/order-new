<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      pulldown: {
        type: Boolean,
        default: true
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      direction: {
        type: String,
        default: DIRECTION_V
      },
      startY: {
        type: Number,
        default: 0
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      }
    },
    mounted: function () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll: function () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh,
          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V,
          startY: this.startY
        })

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            console.log(pos)
            this.$emit('scroll', pos)
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.pulldown) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })

          this.scroll.on('touchEnd', (pos) => {
            this.$emit('touchEnd', pos)
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable: function () {
        this.scroll && this.scroll.disable()
      },
      enable: function () {
        this.scroll && this.scroll.enable()
      },
      refresh: function () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo: function () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement: function (el) {
        this.scroll && this.scroll.scrollToElement(el)
      }
    },
    watch: {
      data: function () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>

</style>
