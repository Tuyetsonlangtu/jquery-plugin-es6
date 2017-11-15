import './vessel-structure.scss';
import $ from 'jquery';
import jqueryPlugin from '../../common/jquery-plugin';
import lodash from 'lodash';
import {
  PLUGIN_NAME,
  OPTIONS_DEFAULT,
} from './const';

console.log("plugin name: ", PLUGIN_NAME);

class Plugin {
  constructor(element, options) {
    this.$element = $(element);
    this.elementId = element.id;
    this.init(options);
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
    this.template = {
      sideView : '<div id="side-view"></div>',
      partitionView : '<div id="partition-view"></div>',
    }

    this.destroy();
    this.subscribeEvents();
    this.render();
  }

  subscribeEvents() {
    this.unsubscribeEvents();
    this.$element.on('click', $.proxy(this.clickHandler, this));
  }

  unsubscribeEvents(){
    this.$element.off('click');
  }

  buildTemplate() {
    console.log("plugin data: ", this.pluginData);
    let html = `
      <div id="side-view"></div>
      <div id="partition-view"></div>
    `
    return html;
  }

  renderVesselView() {
    console.log("plugin data: ", this.pluginData);

    let {hatchs} = this.pluginData;
    let {vslImages} = this.options;
    console.log("vslImages: ", vslImages);
    let $vslContent = $(`<div class="vsl-content"></div>`);

    let vslImgBody = $(`<img id="vsl-img-body" src="${vslImages.body}">`);
    let vslImgBridge = $(`<img id="vsl-img-bridge" src="${vslImages.bridge}">`);

    let partitionNm = $(`<div class="partition-nm"></div>`);

    $vslContent.append(vslImgBody);
    $vslContent.append(vslImgBridge);
    $vslContent.append(partitionNm);

    let html = `<div class="ship-crane"><span>C</span></div>`;
    if(hatchs){
      for(let i=0; i<hatchs.length; i++){

      }
    }

    $vslContent.append(html);

    this.sideView.append($vslContent);
  }

  renderPartitionView(){
    let {icons} = this.options;

    let $vslContent = $(`<div class="partition-content"></div>`);
    let $detail = $(`<div class="partition-detail"></div>`);

    let $lable = $(`<div class="partition-label"></div>`);
    let lblRowhtml = `
      <div class="lbl-left"><span>Row</span></div>
      <div class="lbl-center"></div>
      <div class="lbl-right"><span>Deck</span></div>
    `;
    $lable.append(lblRowhtml);
    $detail.append($lable);

    let $grid = $(`<div class="partition-grid"></div>`);
    let $leftCol = $(`<div class="left-col"></div>`);
    let $rightCol = $(`<div class="right-col"></div>`);
    $grid.append($leftCol);
    $grid.append($rightCol);

    //Build left col
    let totalDeck = 4;
    let rowHright = 100 / totalDeck;

    for(let i=0; i<totalDeck;i++) {
      let $row = $(`<div class="grid-row"></div>`);
      $row.css({
        "height" : `${rowHright}%`
      });

      let tableStyle = `
        border-top: ${i != totalDeck ? '2px solid' : 'none'};
        border-top-color: ${(i != 0 && i != totalDeck) ? '#d375f7' : '#000'};
        border-bottom: ${i == totalDeck - 1 ? '2px solid' : 'none'}
      `;

      let colHtml = `
      <div class="left-tools">
        <a href="javascript:;" class="btn-slot-plus">
          <i class="fa fa-plus-square-o" aria-hidden="true"></i>
        </a>
        <span class="slot-name">${i}</span>
        <a href="javascript:;" class="btn-slot-sub">
          <i class="fa fa-minus-square-o" aria-hidden="true"></i>
        </a>
      </div>
      <div class="partition-table" style="${tableStyle}"></div>
    `;
      $row.append(colHtml);
      $leftCol.append($row);
    }

    //Build right col
    let rightColHtml = `
      <a href="javascript:;" class="btn-deck-plus">
        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
      </a>
      <span class="deck-name">1</span>
      <a href="javascript:;" class="btn-deck-sub">
        <i class="fa fa-minus-square-o" aria-hidden="true"></i>
      </a>
    `;
    $rightCol.append(rightColHtml);
    $detail.append($grid);

    $vslContent.append($detail);

    this.partitionView.append($vslContent);
  }

  render() {
    let {width, height, bgColor} = this.options;
    this.$element.addClass(`${PLUGIN_NAME}`);
    this.$element.css({
      'background': bgColor,
      'width': width,
      'height': height,
    });
    this.$element.empty();

    this.sideView = $(this.template.sideView);
    this.renderVesselView();
    this.$element.append(this.sideView);

    this.partitionView = $(this.template.partitionView);
    this.renderPartitionView();
    this.$element.append(this.partitionView);
  }

  destroy(){

  }

  clickHandler() {
    let target = $(event.target);
    let targetId = target.attr('id') ? target.attr('id') : "";
    // switch (targetId) {
    //   case LIST_CONTROLS.btnClose:
    //     this.close();
    //     break;
    // }
  }
}

jqueryPlugin(PLUGIN_NAME, Plugin);