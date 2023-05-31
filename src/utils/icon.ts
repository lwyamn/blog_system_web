import { h } from "vue"
import * as Icons from '@ant-design/icons-vue'

interface Module {
  [p:string]: any
}

const AIcon = (props:{icon:string}) => {
  const im: Module = Icons
  return h(im[toCamelCase(props.icon)])
}

function toCamelCase(str: string) { 
  return str.split('-') 
    .map((e)=> e.charAt(0).toUpperCase() + e.slice(1) ) 
    .join('')
}

export default AIcon