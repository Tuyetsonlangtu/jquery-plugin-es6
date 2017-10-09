export const PLUGIN_NAME = "berthRightTools";
export const OPTIONS_DEFAULT = {
  settings: {
    width: 400,
    height: 600,
    top: "10%",
    backColor: "#dcdbdb",
    borderColor: "#ddd",
    vslBackColor: '#00ff45',
    vslBorderColor: '#000',
    isOpen: true,
    isTabWindow: true,
    onNodeSelected: undefined
  },
  options: {
    silent: false,
    ignoreChildren: false
  },
  searchOptions: {
    ignoreCase: true,
    exactMatch: false,
    revealResults: true
  }
}
export const RIGHT_BUTTON = {
  width: 30,
  btnId: 'btn-right-tool-plugin'
}

export const LIST_BUTTON = {
  btnRighTool: 'btn-right-tool-plugin',
  btnWindow: 'btn-window-plugin',
  btnList: 'btn-list-plugin',
}