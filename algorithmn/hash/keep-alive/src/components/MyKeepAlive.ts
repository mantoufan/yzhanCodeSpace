import { KeepAliveProps, SetupContext, ConcreteComponent, VNode, getCurrentInstance, onMounted, onUpdated, ComponentInternalInstance, RendererElement, RendererNode } from 'vue'

type CacheKey = string | number | symbol | ConcreteComponent;
type Cache = Map<CacheKey, VNode>; // 存储节点

export const MyKeepAlive = {
  name: "MyKeepAlive",
  __isKeepAlive: true,
  setup(props: KeepAliveProps, { slots }: SetupContext) {
    const instance = getCurrentInstance()

    const sharedContext = instance.ctx as KeepAliveContext

    const { renderer: { m: move, o: { createElement } } } = sharedContext

    sharedContext.activate = (vnode, container, anchor) => {
      move(vnode, container, anchor, MoveType.ENTER)
    }

    const storageContainer = createElement('DIV')

    sharedContext.deactivate = (vnode: VNode) => {
      move(vnode, storageContainer, null, MoveType.LEAVE)
    }

    let pendingCacheKey: CacheKey | null = null

    const cacheSubtree = () => {
      if (pendingCacheKey !== null) {
        cache.set(pendingCacheKey, instance?.subTree)
      }
    }

    onMounted(cacheSubtree)
    onUpdated(cacheSubtree)

    const cache: Cache = new Map()
    return () => {

      if (slots.default === void 0) return null
      const children = slots.default()
      if (children.length > 1) {
        console.warn('出错了')
        return children
      }
      const vnode = children[0]
      const comp = vnode.type as ConcreteComponent

      const key = vnode.key === null ? comp : vnode.key
      pendingCacheKey = key

      const cachedVNode = cache.get(key)

      if (cachedVNode) {
        vnode.el = cachedVNode.el
        vnode.component = cachedVNode.component

        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
      }

      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

      return vnode
    }
  }
}

export const enum ShapeFlags {
  ELEMENT = 1, // 原生DOM节点
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件
  STATEFUL_COMPONENT = 1 << 2, // 有状态组件
  TEXT_CHILDREN = 1 << 3, // 子节点是纯文本
  ARRAY_CHILDREN = 1 << 4, // 子节点是数组
  SLOTS_CHILDREN = 1 << 5, // 子节点是插槽
  TELEPORT = 1 << 6, // TELEPORT
  SUSPENSE = 1 << 7, // SUSPENSE
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // keep-alive 组件
  COMPONENT_KEPT_ALIVE = 1 << 9, // 已经被 keep-alive 的组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONE
}

export const enum MoveType {
  ENTER,
  LEAVE,
  REORDER,
}

export interface ComponentRenderContext {
  [key: string]: any;
  _: ComponentInternalInstance;
}

export interface KeepAliveContext extends ComponentRenderContext {
  renderer: Function; //RendererInternals
  activate: (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    isSVG: boolean,
    optimized: boolean
  ) => void;
  deactivate: (vnode: VNode) => void;
}
