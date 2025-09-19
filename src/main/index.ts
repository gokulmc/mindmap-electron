import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'
import { MINDMAP_SCHEMA, NODE_DETAIL_SCHEMA } from './schema'
import { SYSTEM_INIT, SYSTEM_EXPAND, SYSTEM_NODE_DETAIL } from './prompts'

dotenv.config()

let win: BrowserWindow | null = null
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function callMindmapAPI(opts: {
  mode: 'init' | 'expand' | 'detail',
  userQuery: string,
  selectedNodeId?: string,
  existingTitles?: string[],
  selectedTitle?: string
}) {
  const { mode, userQuery, selectedNodeId, existingTitles = [], selectedTitle } = opts

  const system = mode === 'init'
    ? SYSTEM_INIT
    : mode === 'expand'
    ? SYSTEM_EXPAND
    : SYSTEM_NODE_DETAIL

  const schema = mode === 'detail' ? NODE_DETAIL_SCHEMA : MINDMAP_SCHEMA

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify({
          root_question: userQuery,
          selected_node_id: selectedNodeId,
          existing_node_titles: existingTitles,
          selected_title: selectedTitle
        })
      }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: schema as any
    },
    temperature: mode === 'init' ? 0.2 : 0.3
  })

  const text = response.output_text ?? '{}'
  return JSON.parse(text)
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    await win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    await win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers
ipcMain.handle('ai:init', async (_e, userQuery: string) => {
  return callMindmapAPI({ mode: 'init', userQuery })
})

ipcMain.handle('ai:expand', async (_e, args: { userQuery: string; selectedNodeId: string; existingTitles: string[] }) => {
  return callMindmapAPI({ mode: 'expand', userQuery: args.userQuery, selectedNodeId: args.selectedNodeId, existingTitles: args.existingTitles })
})

ipcMain.handle('ai:detail', async (_e, args: { userQuery: string; selectedTitle: string }) => {
  return callMindmapAPI({ mode: 'detail', userQuery: args.userQuery, selectedTitle: args.selectedTitle })
})
