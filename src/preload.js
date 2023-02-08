import { readFileSync } from 'fs'

export const readConfig = () => readFileSync('./config.json')
