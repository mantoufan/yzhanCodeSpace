import { defineComponent, h, unref } from "vue";
// 需要更灵活的方式渲染
export default defineComponent({
  props: {
    to: {
      type: String,
      require: true
    }
  },
  setup(props, { slots }) {
    return () => {
      const to = unref(props.to) // ref 获 字符串
      return h('a', {
        href: '#' + to
      }, slots.default())
    }
  }
})