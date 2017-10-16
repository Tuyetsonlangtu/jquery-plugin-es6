import './berth-position-calculation.scss';
import $ from 'jquery';
import jqueryPlugin from '../../common/jquery-plugin';
import lodash from 'lodash';

import {
  PLUGIN_NAME,
  OPTIONS_DEFAULT,
  LIST_CONTROLS,
  BERTH_POSITION,
  BERTH_DIR,
  VESSEL_DIR,
  ERROR_MSG,
} from './const';
console.log("plugin name: ", PLUGIN_NAME);

class Plugin {
  constructor(element, options) {
    this.$element = $(element);
    this.elementId = element.id;
    this.init(options);
    this.$modal = $(`.${PLUGIN_NAME}`);
  }

  init(options) {
    this.pluginData = {};
    if (options.data) {
      if (typeof options.data === 'string') {
        options.data = $.parseJSON(options.data);
      }
      this.pluginData = $.extend(true, {}, options.data);
      delete options.data;
    }
    this.options = $.extend({}, OPTIONS_DEFAULT, options);
    this.destroy();
    this.subscribeEvents();
    this.render();
  }

  subscribeEvents() {
    this.unsubscribeEvents();
    this.$element.on('click', $.proxy(this.clickHandler, this));
    if (typeof (this.options.onPositionCalculated) === 'function') {
      this.$element.on('positionCalculated', this.options.onPositionCalculated);
    }
  }

  unsubscribeEvents(){
    this.$element.off('click');
    this.$element.off('positionCalculated');
  }

  buildTemplate() {
    console.log("plugin data: ", this.pluginData);
    let position = 0;
    let {vslData} = this.pluginData;
    if(vslData){
      position = vslData.head_position;
    }
    let {berthPosition} = this.options;
    let currentPos = vslData ? BERTH_POSITION.head : berthPosition;

    return `
     <div class="modal-content">
      <div class="modal-header">
          <span id="${LIST_CONTROLS.btnClose}" class="close">&times;</span>
          <h4>Berth Position Calculation</h4>
      </div>
      <div class="modal-body">
        <div class="col-1">
            <div class="group-control">
              <input ${berthPosition == BERTH_POSITION.head ? 'checked' : ''} type="radio" name="${LIST_CONTROLS.rdGroup}" id="${LIST_CONTROLS.rdHead}" value="${BERTH_POSITION.head}">
              <label for="${LIST_CONTROLS.rdHead}">Head</label> 
            </div>
           
           <div class="group-control">
              <input ${berthPosition == BERTH_POSITION.bridge ? 'checked' : ''} type="radio" name="${LIST_CONTROLS.rdGroup}" id="${LIST_CONTROLS.rdBridge}" value="${BERTH_POSITION.bridge}">
              <label for="${LIST_CONTROLS.rdBridge}">Bridge</label>
            </div>
           <div class="group-control">
              <input ${berthPosition == BERTH_POSITION.stern ? 'checked' : ''} type="radio" name="${LIST_CONTROLS.rdGroup}" id="${LIST_CONTROLS.rdStern}" value="${BERTH_POSITION.stern}">
              <label for="${LIST_CONTROLS.rdStern}">Stern</label>
            </div>
        </div>
        <div class="col-2">
           <div class="group-control">
               <input type="text" id="${LIST_CONTROLS.txtMeter}" value="${position}">
               Meter
           </div>
           <div class="group-control">
               <input type="text" id="${LIST_CONTROLS.txtBitt}">
               Bitt
           </div>
        </div>
        <div class="col-3">
            <button id="${LIST_CONTROLS.btnApply}" type="button">Apply</button> 
        </div>
      </div>
    </div>`;
  }

  render() {
    this.$element.addClass(`modal ${PLUGIN_NAME}`);
    this.$element.css({
      'z-index': 9999
    });

    this.$element.empty();
    let html = this.buildTemplate();
    this.$element.append(html);
  }

  destroy(){

  }

  open(data){
    this.pluginData = $.extend(true, {}, data);
    this.render();
    this.$modal.show();
  }

  close(){
    this.$modal.hide();
  }

  apply() {
    this.calculationBerthPosition();
  }

  getHeadPosByBridge(bridgePos, LOA, bridgeToStern, berthDir, vslDir) {
    let headPos = 0;
    if (berthDir == BERTH_DIR.leftRight) {
      if (vslDir == VESSEL_DIR.leftRight)
        headPos = bridgePos + LOA - bridgeToStern;
      else
        headPos = bridgePos - LOA + bridgeToStern;
    } else if (berthDir == BERTH_DIR.rightLeft) {
      if (vslDir == VESSEL_DIR.leftRight)
        headPos = bridgePos - LOA + bridgeToStern;
      else
        headPos = bridgePos + LOA - bridgeToStern;
    }

    return headPos;
  }

  getHeadPosByStern(stern, LOA, berthDir, vslDir) {
    let head = 0;
    if ((berthDir == BERTH_DIR.leftRight && vslDir == VESSEL_DIR.leftRight) || (berthDir == BERTH_DIR.rightLeft && vslDir == VESSEL_DIR.rightLeft))
      head = stern + LOA;
    else
      head = stern - LOA;

    return head;
  }

  getSternPosByHead(headPos, LOA, berthDir, vslDir) {
    let stern = 0;
    if ((berthDir == BERTH_DIR.leftRight && vslDir == VESSEL_DIR.leftRight) || (berthDir == BERTH_DIR.rightLeft && vslDir == VESSEL_DIR.rightLeft))
      stern = headPos - LOA;
    else
      stern = headPos + LOA;

    return stern;
  }

  getBridgePosByHead(headPos, LOA, bridgeToStern, berthDir, vslDir) {
    let bridge = 0;
    if (berthDir == BERTH_DIR.leftRight) {
      if (vslDir == VESSEL_DIR.leftRight)
        bridge = headPos - LOA + bridgeToStern;
      else
        bridge = headPos + LOA - bridgeToStern;
    }
    else {
      if (vslDir == VESSEL_DIR.leftRight)
        bridge = headPos + LOA - bridgeToStern;
      else
        bridge = headPos - LOA + bridgeToStern;
    }

    return bridge;
  }

  getBittByPos(pos, bitts){
    let arrLength = bitts.length, bitt, operator = '';
    for (let i = 0; i < arrLength; i++) {
      let start = bitts[i].start_position_original;
      let end = i < arrLength - 1 ? bitts[i + 1].start_position_original : start;
      if (pos >= start && pos <= end) {
        let midd = (end - start) / 2;
        if (midd >= (pos - start)) {
          operator = '+';
          bitt = bitts[i];
        }
        else {
          operator = '-';
          bitt = i < arrLength - 1 ? bitts[i + 1] : bitts[i];
        }
      }
    }

    if (!bitt) return;
    var result = {bitt: bitt, text: ''}
    if (operator == '+')
      result.text = bitt.name + "+" + Math.abs(pos - bitt.start_position_original).toFixed(2) + "m";
    else if (operator == '-')
      result.text = bitt.name + "-" + Math.abs(bitt.start_position_original - pos).toFixed(2) + "m";

    return result;
  }

  getMooringPos(headPos, sternPos, mooringDistance, berthDir, vslDir) {
    let mHead = 0, mStern = 0;
    if (berthDir == BERTH_DIR.leftRight) {
      if (vslDir == VESSEL_DIR.leftRight) {
        mHead = headPos + mooringDistance;
        mStern = sternPos - mooringDistance;
      } else {
        mHead = headPos - mooringDistance;
        mStern = sternPos + mooringDistance;
      }
    } else if (berthDir == BERTH_DIR.rightLeft) {
      if (vslDir == VESSEL_DIR.leftRight) {
        mHead = headPos - mooringDistance;
        mStern = sternPos + mooringDistance;
      } else {
        mHead = headPos + mooringDistance;
        mStern = sternPos - mooringDistance;
      }
    }

    return {
      mHead,
      mStern
    }
  }

  getMooringBittHead(mHeadPos, berthDir, vslDir, bitts) {
    let arrLength = bitts.length, bitt, index = 0;
    for (let i = 0; i < arrLength; i++) {
      let start = bitts[i].start_position_original;
      let end = i < arrLength - 1 ? bitts[i + 1].start_position_original : start;
      if (mHeadPos >= start && mHeadPos <= end) {
        let midd = (end - start) / 2;
        if (midd >= (mHeadPos - start)) {
          index = i;
          bitt = bitts[index];
          break;
        }
        else {
          index = i < arrLength - 1 ? i + 1 : i;
          bitt = bitts[index];
          break;
        }
      }
    }

    if (bitt) {
      if (berthDir == BERTH_DIR.leftRight && vslDir == VESSEL_DIR.leftRight && bitt.start_position_original < mHeadPos)
        bitt = index < arrLength - 1 ? bitts[index + 1] : bitts[index];

      if (berthDir == BERTH_DIR.leftRight && vslDir == VESSEL_DIR.rightLeft && bitt.start_position_original > mHeadPos)
        bitt = index > 0 ? bitts[index - 1] : bitts[index];

      if (berthDir == BERTH_DIR.rightLeft && vslDir == VESSEL_DIR.leftRight && bitt.start_position_original > mHeadPos)
        bitt = index > 0 ? bitts[index - 1] : bitts[index];

      if (berthDir == BERTH_DIR.rightLeft && vslDir == VESSEL_DIR.rightLeft && bitt.start_position_original < mHeadPos)
        bitt = index < arrLength - 1 ? bitts[index + 1] : bitts[index];
    }

    return bitt;
  }

  getMooringBittStern(mSternPos, berthDir, vslDir, bitts){
    let arrLength = bitts.length, bitt, index = 0;
    for (let i = 0; i < arrLength; i++) {
      let start = bitts[i].start_position_original;
      let end = i < arrLength - 1 ? bitts[i + 1].start_position_original : start;
      if (mSternPos >= start && mSternPos <= end) {
        let midd = (end - start) / 2;
        if (midd >= (mSternPos - start)) {
          index = i;
          bitt = bitts[index];
          break;
        }
        else {
          index = i < arrLength - 1 ? i + 1 : i;
          bitt = bitts[index];
          break;
        }
      }
    }

    if (bitt) {
      if (berthDir == BERTH_DIR.leftRight && vslDir == VESSEL_DIR.leftRight && bitt.start_position_original > mSternPos)
        bitt = index > 0 ? bitts[index - 1] : bitts[index];

      if (berthDir == BERTH_DIR.leftRight && vslDir == VESSEL_DIR.rightLeft && bitt.start_position_original < mSternPos)
        bitt = index < arrLength - 1 ? bitts[index + 1] : bitts[index];

      if (berthDir == BERTH_DIR.rightLeft && vslDir == VESSEL_DIR.leftRight && bitt.start_position_original < mSternPos)
        bitt = index < arrLength - 1 ? bitts[index + 1] : bitts[index];

      if (berthDir == BERTH_DIR.rightLeft && vslDir == VESSEL_DIR.rightLeft && bitt.start_position_original > mSternPos)
        bitt = index > 0 ? bitts[index - 1] : bitts[index];
    }

    return bitt;
  }

  getBittByName(bitts, bittName) {
    return lodash.find(bitts, obj => {
      return obj.name == bittName;
    });
  }

  processResult(result, isAutoClose) {
    this.$element.trigger('positionCalculated', $.extend(true, {}, result));
    if (isAutoClose) this.close();
  }

  getBerthByHeadPos(headPos, berthArr) {
    const length = berthArr.length;
    let result = null;
    for (let i = 0; i < length; i++) {
      let left = berthArr[i].start_position_original;
      let right = berthArr[i].end_position;
      if (( left == 0 ? headPos >= left : headPos > left) && headPos <= right) {
        result = berthArr[i];
        break;
      }
    }

    return result;
  }

  getBerthById(berthArr, id) {
    return lodash.find(berthArr, obj => {
      return obj.id == id;
    })
  }

  calculationBerthPosition() {

    let {vslData, bittData, berthData, mooringDistance} = this.pluginData;
    let {isAutoClose} = this.options;

    let {along_side, berth_dir_cd, bridge_to_stern, LOA, berth_id} = vslData;
    let txtMeter = $(`#${LIST_CONTROLS.txtMeter}`);
    let txtBitt = $(`#${LIST_CONTROLS.txtBitt}`);
    let brthCd = $(`input[name=${LIST_CONTROLS.rdGroup}]:checked`).val();

    let position = null;
    let result = {
      headPos: null,
      sternPos: null,
      bridgePos: null,
      headBitt: null,
      sternBitt: null,
      mBittHead: null,
      mBittStern: null,
      berth: null,
      error: null,
      vslData: vslData,
    }

    if (!vslData || !bittData || (!berthData || (!berthData[BERTH_DIR.rightLeft] && !berthData[BERTH_DIR.leftRight])) || mooringDistance == null) {
      result.error = ERROR_MSG.err01;
      this.processResult(result, isAutoClose);
      return;
    }

    if(berthData[BERTH_DIR.rightLeft] && berthData[BERTH_DIR.leftRight]) {
      result.error = ERROR_MSG.err06;
      this.processResult(result, isAutoClose);
      return;
    }

    if (txtMeter.val().length > 0 && txtBitt.val().length > 0) {
      txtMeter.focus();
      txtBitt.val('');
      result.error = ERROR_MSG.err02;
      this.processResult(result, isAutoClose);
      return;
    }

    if (txtMeter.val().length == 0 && txtBitt.val().length == 0) {
      result.error = ERROR_MSG.err03;
      this.processResult(result, isAutoClose);
      return;
    }

    if (brthCd.length == 0) {
      result.error = ERROR_MSG.err03;
      this.processResult(result, isAutoClose);
      return;
    }

    let berthDataArr = [];
    let berthDir = null;
    let berthTotalWidth = 0;
    berthTotalWidth = berthData.berth_total_width;
    if(berthData[BERTH_DIR.leftRight]){
      berthDataArr = berthData[BERTH_DIR.leftRight];
      berthDir = BERTH_DIR.leftRight;
    } else {
      berthDataArr = berthData[BERTH_DIR.rightLeft];
      berthDir = BERTH_DIR.rightLeft;
    }
    berthDataArr = lodash.orderBy(berthDataArr, ['start_position_original'], ['asc']);
    // let bitts = lodash.filter(bittData, obj => {
    //   return obj.berth_idx == berth_id;
    // });

    let bitts = lodash.orderBy(bittData, ['start_position_original'], ['asc']);
    console.log("bitts: ", bitts);
    let firstBitt = bitts[0];
    let lastBitt = bitts[bitts.length - 1];

    if (txtMeter.val().length > 0) {
      position = parseFloat(txtMeter.val());
    }
    else {
      let bittName = txtBitt.val();
      let selectBitt = this.getBittByName(bitts, bittName);
      position = selectBitt ? selectBitt.start_position_original : null;
    }

    if (position == null) {
      result.error = ERROR_MSG.err03;
      this.processResult(result, isAutoClose);
      return;
    }

    switch (brthCd) {
      case BERTH_POSITION.head:
        result.headPos = position;
        result.sternPos = this.getSternPosByHead(result.headPos, LOA, berth_dir_cd, along_side);
        result.bridgePos = this.getBridgePosByHead(result.headPos, LOA, bridge_to_stern, berth_dir_cd, along_side);
        break;
      case BERTH_POSITION.bridge:
        result.bridgePos = position;
        result.headPos = this.getHeadPosByBridge(result.bridgePos, LOA, bridge_to_stern, berth_dir_cd, along_side);
        result.sternPos = this.getSternPosByHead(result.headPos, LOA, berth_dir_cd, along_side);
        break;
      case BERTH_POSITION.stern:
        result.sternPos = position;
        result.headPos = this.getHeadPosByStern(result.sternPos, LOA, berth_dir_cd, along_side);
        result.bridgePos = this.getBridgePosByHead(result.headPos, LOA, bridge_to_stern, berth_dir_cd, along_side);
        break;
    }

    result.berth = this.getBerthByHeadPos(result.headPos, berthDataArr);
    if(!result.berth) {
      result.error = ERROR_MSG.err03;
      this.processResult(result, isAutoClose);
      return;
    }

    result.headBitt = this.getBittByPos(result.headPos, bitts);
    result.sternBitt = this.getBittByPos(result.sternPos, bitts);
    if(!result.headBitt || !result.sternBitt) {
      result.error = {
        code: ERROR_MSG.err04.code,
        msg: ERROR_MSG.err04.msg,
      }
      result.error.msg = `${result.error.msg} ${firstBitt.start_position_original} and ${lastBitt.start_position_original}.`;
      this.processResult(result, isAutoClose);
      return;
    }

    let mooringPos = this.getMooringPos(result.headPos, result.sternPos, mooringDistance, berth_dir_cd, along_side);
    result.mBittHead = this.getMooringBittHead(mooringPos.mHead, berth_dir_cd, along_side, bitts);
    result.mBittStern = this.getMooringBittStern(mooringPos.mStern, berth_dir_cd, along_side, bitts);
    if(!result.mBittHead || !result.mBittStern){
      result.error = {
        code: ERROR_MSG.err05.code,
        msg: ERROR_MSG.err05.msg,
      }
      result.error.msg = `${result.error.msg} ${firstBitt.name} and ${lastBitt.name}.`;
      this.processResult(result, isAutoClose);
      return;
    }

    let berthHead = this.getBerthById(berthDataArr, result.mBittHead.berth_idx);
    let berthStern = this.getBerthById(berthDataArr, result.mBittStern.berth_idx);
    if(berthHead.group != berthStern.group) {
      result.error = ERROR_MSG.err07;
      this.processResult(result, isAutoClose);
      return;
    }

    //update vessel data
    result.vslData.berth_id = result.berth.id;
    result.vslData.head_position = result.headPos;
    result.vslData.mooring_head = result.mBittHead.id;
    result.vslData.mooring_stern = result.mBittStern.id;
    result.vslData.data_error = false;
    result.vslData.is_change = true;

    console.log("berth: ", result.berth);
    console.log("headPos: ", result.headPos);
    console.log("sternPos: ", result.sternPos);
    console.log("bridgePos: ", result.bridgePos);
    console.log("headBitt: ", result.headBitt);
    console.log("sternBitt: ", result.sternBitt);
    console.log("mBittHead: ", result.mBittHead);
    console.log("mBittStern: ", result.mBittStern);

    this.processResult(result, isAutoClose);
  }


  clickHandler() {
    let target = $(event.target);
    let targetId = target.attr('id') ? target.attr('id') : "";
    switch (targetId) {
      case LIST_CONTROLS.btnClose:
        this.close();
        break;
      case LIST_CONTROLS.btnApply:
        this.apply();
        break;
    }
  }
}

jqueryPlugin(PLUGIN_NAME, Plugin);
