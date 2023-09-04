import { useEffect, useState } from 'react'
import styles from './index.less'
import classNames from 'classnames'
import TextSide from '../../components/LeftSide/TextSide'
import ImgSide from '../../components/LeftSide/ImgSide'
import TplSide from '../../components/LeftSide/TplSide'
import GraphSide from '../../components/LeftSide/GraphSide'
import { isTextComponent, isImgComponent, isTplComponent, isGraphComponent } from '../../consts'


export default function Header() {
  const [showSide, setShowSide] = useState(0)
  const _setShowSide = side => setShowSide(showSide === side ? 0 :side)
  const hideSide = () => setShowSide(0)
  useEffect(() => {
    document.body.addEventListener('click', hideSide)
    return () => document.body.removeEventListener('click', hideSide)
  })
  return (
    <div className={styles.main}>
      <ul className={styles.cmps}>
      <li className={classNames(styles.cmp, showSide === isTplComponent ? styles.selected : '')} onClick={(e)=>{
          e.stopPropagation()
          _setShowSide(isTplComponent)
        }}><span className='iconfont icon-moban'></span><span>模板</span></li>
        <li className={classNames(styles.cmp, showSide === isTextComponent ? styles.selected : '')} onClick={(e)=>{
          e.stopPropagation()
          _setShowSide(isTextComponent)
        }}><span className='iconfont icon-wenben1'></span><span>文本</span></li>
        <li className={classNames(styles.cmp, showSide === isImgComponent ? styles.selected : '')} onClick={(e)=> {
          e.stopPropagation()
          _setShowSide(isImgComponent)
        }}><span className='iconfont icon-tupian'></span><span>图片</span></li>
        <li className={classNames(styles.cmp, showSide === isGraphComponent ? styles.selected : '')} onClick={(e)=> {
          e.stopPropagation()
          _setShowSide(isGraphComponent)
        }}><span className='iconfont icon-shape'></span><span>图形</span></li>
      </ul>
      {showSide === isTextComponent && <TextSide />}
      {showSide === isImgComponent && <ImgSide />}
      {showSide === isTplComponent && <TplSide />}
      {showSide === isGraphComponent && <GraphSide />}
    </div>
  )
}