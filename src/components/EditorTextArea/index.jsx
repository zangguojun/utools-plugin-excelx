import React from 'react'
import { Button, Dialog } from '@alifd/next'
import Editor from '@monaco-editor/react'

const defaultValue = `
/**
 * Name    Age
 * Aaron   18
 * Bob     20
 * Chad    14
 * ...     ...
 * 新增一列 名为 Introduction
 * function process (obj) {
 *   return obj["Name"] + ':' + obj.Age
 * }
 * 那么处理后数据如下所视
 * Name    Age  Introduction
 * Aaron   18   Aaron:18
 * Bob     20   Bob:20
 * Chad    14   Chad:14
 * ...     ...
 */
export default (obj) {

}
`

const EditorTextArea = (props) => {
  const { value = defaultValue, onChange } = props

  const handleEditorChange = (v) => {
    onChange(v)
  }

  const openEditorTextArea = () => {
    Dialog.show({
      title: '代码块',
      content: (
        <Editor
          width="100vh"
          height="100vh"
          defaultLanguage="javascript"
          value={value}
          onChange={handleEditorChange}
        />
      )
    })
  }

  return (
    <Button type="secondary" onClick={openEditorTextArea}>点击编辑脚本</Button>
  )
}

export default EditorTextArea
