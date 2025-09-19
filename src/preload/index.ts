import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ai', {
  init: (q: string) => ipcRenderer.invoke('ai:init', q),
  expand: (args: { userQuery: string; selectedNodeId: string; existingTitles: string[] }) =>
    ipcRenderer.invoke('ai:expand', args),
  detail: (args: { userQuery: string; selectedTitle: string }) =>
    ipcRenderer.invoke('ai:detail', args)
})
