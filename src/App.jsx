import React, { useState, useEffect } from 'react'
import { Table, Divider } from '@alifd/next'
import {
  FormItem,
  Reset,
  ArrayCollapse,
  FormButtonGroup,
  Submit,
  Select,
  Input,
  Space
} from '@formily/next'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
import EditorTextArea from './components/EditorTextArea'

const SchemaField = createSchemaField({
  components: {
    ArrayCollapse,
    FormItem,
    Space,
    Input,
    Select,
    EditorTextArea
  }
})

const form = createForm()

function App () {
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])

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
    <div style={{ backgroundColor: 'white', padding: 20 }}>
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
      <Divider/>
      <FormProvider form={form}>
        <SchemaField>
          <SchemaField.Array
            name="array"
            maxItems={3}
            x-decorator="FormItem"
            x-component="ArrayCollapse"
          >
            <SchemaField.Object
              x-component="ArrayCollapse.CollapsePanel"
              x-component-props={{
                title: '操作列表'
              }}
            >
              <SchemaField.Void x-component="ArrayCollapse.Index" />
              <SchemaField.String
                title="操作类型"
                name="operationType"
                x-decorator="FormItem"
                x-component="Select"
                enum={[
                  { label: '新增一列', value: 'add' },
                  { label: '删除一列', value: 'del' }
                ]}
                required
              />
              <SchemaField.String
                title="列名"
                name="name"
                x-decorator="FormItem"
                x-component="Input"
                required
              />
               <SchemaField.String
                title="脚本"
                name="code"
                x-decorator="FormItem"
                x-component="EditorTextArea"
                x-visible={false}
                x-reactions={{
                  dependencies: ['.operationType'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] === "add"}}'
                    }
                  }
                }}
                required
               />
              <SchemaField.Void x-component="ArrayCollapse.Remove" />
              <SchemaField.Void x-component="ArrayCollapse.MoveUp" />
              <SchemaField.Void x-component="ArrayCollapse.MoveDown" />
            </SchemaField.Object>
            <SchemaField.Void
              x-component="ArrayCollapse.Addition"
              title="添加条目"
            />
          </SchemaField.Array>
        </SchemaField>
        <FormButtonGroup.Sticky align="center">
          <FormButtonGroup>
            <Submit onSubmit={console.log}>提交</Submit>
            <Reset>重置</Reset>
          </FormButtonGroup>
        </FormButtonGroup.Sticky>
      </FormProvider>
    </div>
  )
}

export default App
