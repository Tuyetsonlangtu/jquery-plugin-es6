export const PLUGIN_NAME = "berthPositionCalc";

export const BERTH_POSITION = {
  head : '0119H',
  bridge: '0119B',
  stern: '0119S'
}

export const BERTH_DIR = {
  leftRight: '0042LR',
  rightLeft: '0042RL'
}

export const VESSEL_DIR = {
  leftRight: '0123S', //Starboard
  rightLeft: '0123P' // Portside
}

export const OPTIONS_DEFAULT = {
  berthPosition: BERTH_POSITION.head,
  onPositionCalculated: undefined,
  isClose: false,
}

export const LIST_CONTROLS = {
  btnClose: `${PLUGIN_NAME}-btnClose`,
  btnApply: `${PLUGIN_NAME}-btnApply`,
  rdHead: `${PLUGIN_NAME}-rdHead`,
  rdBridge: `${PLUGIN_NAME}-rdBridge`,
  rdStern: `${PLUGIN_NAME}-rdStern`,
  rdGroup: `${PLUGIN_NAME}-position`,
  txtMeter: `${PLUGIN_NAME}-txtMeter`,
  txtBitt: `${PLUGIN_NAME}-txtBitt`,
}

export const ERROR_MSG = {
  err01: {code: 1, msg: 'Data input error'},
  err02: {code: 2, msg: 'Only one data must be filled between meter and bitt.'},
  err03: {code: 3, msg: 'Please select Berth Position.'},
  err04: {code: 4, msg: 'Berth Meter (Head) must be between'},
  err05: {code: 6, msg: 'Mooring Bitt must be between'}
}