import { useState } from 'react'
import EditCanvas from '../../components/EditCanvas'
import EditCmp from '../../components/EditCmp'
import { useCanvasByContext } from '../../store/hooks'
import styles from './index.less'

export default function Right() {
  const canvas = useCanvasByContext()
  const selectedCmp = canvas.getSelectedCmp()
  const [showEdit, setShowEdit] = useState(true)

  return <>
    <div className={styles.visibility} onClick={() => setShowEdit(!showEdit)}>
      {(showEdit ? '隐藏' : '显示') + '编辑区域'} 
    </div>
    {showEdit && (selectedCmp ? <EditCmp styles={styles} /> : <EditCanvas styles={styles} />)}
  </>
}