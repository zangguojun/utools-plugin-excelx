import React, { useState, useEffect } from 'react'
import { Table } from '@alifd/next'

function App () {
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  console.log('🚀~ 10 App columns', columns)

  useEffect(() => {
    const files = window.utools.getCopyedFiles()
    if (Array.isArray(files) && files.length === 1 && files[0].isFile && files[0].path) {
      import(/* @vite-ignore */`${files[0].path}?sheetjs-10`).then(({ default: data }) => {
        setDataSource(data.map((item, index) => ({ ...item, index })))
        if (data?.[0]) {
          setColumns([{
            title: '行号',
            dataIndex: 'index',
            width: 60,
            lock: 'left'
          }].concat(Object.keys(data?.[0] || []).map((title) => {
            return {
              title,
              dataIndex: title,
              width: 100,
              asyncResizable: true
            }
          })))
        }
      })
    }
  }, [])

  return (
    <Table
      primaryKey="index"
      size="small"
      columns={columns}
      dataSource={dataSource}
      onResizeChange={(dataIndex, value) => {
        const toChangeIndex = columns.findIndex(item => item.dataIndex === dataIndex)
        columns[toChangeIndex].width = columns[toChangeIndex].width + value
        setColumns(columns)
      }}
      emptyContent="暂无数据"
    />
  )
}

export default App
