import './berth-right-tools.scss';
import $ from 'jquery';
import moment from 'moment';
import plugin from '../../common/plugin';
import {
  PLUGIN_NAME,
  OPTIONS_DEFAULT,
  RIGHT_BUTTON,
  LIST_BUTTON,
  VESSEL_DIR,
  GRID_HEIGHT
} from './const';


console.log("plugin name: ", PLUGIN_NAME);

class Plugin {
  constructor(element, options) {
    this.$element = $(element);
    this.elementId = element.id;

    this.template = {
      openButton: `<div class='left-button'><button id='${LIST_BUTTON.btnRighTool}'href='javascript:;'>Right Tool</button></div>`,
      rightContent: '<div class="right-content"></div>',
      wrapper: '<div class="wrapper"></div>',
      wrapperTittle: '<div class="tittle"><span>Position Unassigned Vessels</span></div>',
      wrapperContent: '<div class="content"></div>',
      listButton: `<div class="list-button"><button id='${LIST_BUTTON.btnWindow}' class="btn-default">Window</button><button id='${LIST_BUTTON.btnList}' class="btn-default">List</button></div>`,
      listVessel: '<div class="list-vessel"></div>',
      listTable: '<div class="list-table"></div>',
    }

    this.init(options);
    this.$RightTool = $(`.${PLUGIN_NAME}`);
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

    this.options = $.extend({}, OPTIONS_DEFAULT.settings, options);
    this.destroy();
    this.subscribeEvents();
    this.render();
  }

  destroy() {
    if (!this.initialized) return;
    this.$wrapper.remove();
    this.$wrapper = null;
    this.unsubscribeEvents();
    this.initialized = false;
  }

  unsubscribeEvents(){
    this.$element.off('click');
    this.$element.off('nodeChecked');
  }

  subscribeEvents() {
    this.unsubscribeEvents();
    this.$element.on('click', $.proxy(this.clickHandler, this));
    if (typeof (this.options.onNodeChecked) === 'function') {
      this.$element.on('nodeChecked', this.options.onNodeChecked);
    }
  }

  render() {
    let {width, height, backColor, borderColor, top, isOpen, isTabWindow} = this.options;
    if (!this.initialized) {
      this.$element.addClass(PLUGIN_NAME);
      let border = `1px solid ${borderColor}`;
      this.isOpen = isOpen;
      this.$element.css({
        'width': width,
        'height': height,
        'top': top,
        'margin-right': isOpen ? 0 : (-width + RIGHT_BUTTON.width),
      });

      this.$rightContent = $(this.template.rightContent);
      this.$wrapper = $(this.template.wrapper);
      this.$wrapper.css({
        'background': backColor,
        'border': border,
      });
      this.$wrapper.append(this.template.wrapperTittle);

      //wrapper content
      this.$wrapperContent = $(this.template.wrapperContent);
      this.$wrapperContent.append(this.template.listButton);

      this.$listVessel = $(this.template.listVessel);
      this.$wrapperContent.append(this.$listVessel);

      this.$listTable = $(this.template.listTable);
      this.$wrapperContent.append(this.$listTable);

      this.$wrapper.append(this.$wrapperContent);
      this.$rightContent.append(this.$wrapper);
      this.$element.append(this.template.openButton);
      this.$element.append(this.$rightContent);

      this.initialized = true;

      if(isTabWindow){
        let $btnWindow = $(`#${LIST_BUTTON.btnWindow}`);
        $btnWindow.addClass('active');

        this.$listVessel.addClass('active');
        this.$listTable.removeClass('active');
      }
      else {
        let $btnList = $(`#${LIST_BUTTON.btnList}`);
        $btnList.addClass('active');

        this.$listVessel.removeClass('active');
        this.$listTable.addClass('active');
      }
    }

    this.$listVessel.empty();
    this.$listTable.empty();
    this.buildTemplate();
  }

  getVesselPosFromDate(previousDate, eta_date, etb_date, etd_date) {

    let format = "DD/MM/YYYY hh:mm";
    let ETA_Date = moment(eta_date, format);
    let ETB_Date = moment(etb_date, format);
    let ETD_Date = moment(etd_date, format);

    let format_temp = "DD/MM/YYYY";
    let ETB_Date_temp = moment(etb_date, format_temp);
    let ETD_Date_temp = moment(etd_date, format_temp);

    let etb_number_days = ETB_Date.diff(previousDate, 'days');
    let etb_hh = parseInt(ETB_Date.format("HH"));
    let etb_ss = parseInt(ETB_Date.format("mm"));

    let etd_number_days = ETD_Date_temp.diff(ETB_Date_temp, 'days');
    let etd_hh = parseInt(ETD_Date.format("HH"));
    let etd_ss = parseInt(ETD_Date.format("mm"));

    let distance_ss_top = 0;
    if (etb_ss >= 30)
      distance_ss_top = GRID_HEIGHT / 2;

    let distance_ss_bottom = 0;
    if (etd_ss >= 30)
      distance_ss_bottom = GRID_HEIGHT / 2;

    //Vessel top
    let vslTop = etb_number_days * 6 * (GRID_HEIGHT * 4) + (etb_hh) * GRID_HEIGHT + distance_ss_top;
    //Vessel height
    let vslHeight = 0;
    if (etd_number_days <= 0)
      vslHeight = (24 - etb_hh) * GRID_HEIGHT - ((24 - etd_hh) * GRID_HEIGHT) + distance_ss_bottom - distance_ss_top;
    else
      vslHeight = (24 - etb_hh) * GRID_HEIGHT + (etd_number_days - 1) * 24 * GRID_HEIGHT + etd_hh * GRID_HEIGHT + distance_ss_bottom - distance_ss_top;

    return {
      top: vslTop,
      height: vslHeight,
      eta_date: ETA_Date,
      etb_date: ETB_Date,
      etd_date: ETD_Date,
    }
  }

  buildTemplate(data) {
    console.log("this.pluginData: ", this.pluginData);
    let {vslData, fromDate} = this.pluginData;
    const previousDate = moment(fromDate, 'YYYY-MM-DD');
    if(vslData){
      let {vslBackColor, vslBorderColor} = this.options;
      let tblData = [];
      for(let i=0; i<vslData.length; i++){
        let dirClass = VESSEL_DIR.leftRight == vslData[i].along_side ? 'right' : 'left';
        let {top, height} = this.getVesselPosFromDate(previousDate, vslData[i].eta_date, vslData[i].etb_date, vslData[i].etd_date);
        console.log("top: ", top)
        console.log("height: ", height)

        let vslHtml = `<div class="vessel-box" vsl-id="${vslData[i].id}">
            <div class="icon-head ${dirClass}"><i class="fa fa-play" aria-hidden="true"></i></div>
            <span class="vsl-code ${dirClass}">${vslData[i].code}</span>
        </div>`;

        let $vslBox = $(vslHtml);
        let border = `2px solid ${vslBorderColor}`;
        $vslBox.css({
          "height": height,
          "background": vslBackColor,
          "border": border,
          "top": top,
        });
        this.$listVessel.append($vslBox);

        tblData.push({
          vvd: vslData[i].code,
          etb: moment(vslData[i].etb_date, "DD/MM/YYYY hh:mm").format("YYYY-MM-DD HH:mm"),
          etd: moment(vslData[i].etd_date, "DD/MM/YYYY hh:mm").format("YYYY-MM-DD HH:mm"),
        })
      }

      let $tableHtml = this.buildDataTable(tblData);
      this.$listTable.append($tableHtml);
    }
    else {
      this.$listVessel.append('<span>No Data</span>');
      this.$listTable.append('<span>No Data</span>');
    }
  }

  buildDataTable(data) {
    return `<table>
        <thead>
          <tr>
            <td rowspan="2">VVD</td>
            <td>ETB</td>
          </tr>
          <tr>
            <td>ETD</td>
          </tr>
        </thead>  
        <tbody>
        ${data.map(row => `
            <tr>
              <td rowspan="2">${row.vvd}</td>
              <td>${row.etb}</td>
            </tr>
            <tr>
              <td>${row.etd}</td>
            </tr>`).join('\n')
        }
        </tbody>
      </table>`
  }

  //Event
  clickHandler() {
    let target = $(event.target);
    let targetId = target.attr('id') ? target.attr('id') : "";
    let targetClass = target.attr('class') ? target.attr('class') : "";
    $('.vessel-box').removeClass('selected');
    if (targetClass == 'vessel-box') {
      target.addClass('selected');
      let vslId = target.attr('vsl-id');
      console.log("vslId: ", vslId);
      return;
    }
    switch (targetId) {
      case LIST_BUTTON.btnRighTool:
        if (this.isOpen) {
          this.closeRightTool();
        }
        else {
          this.openRightTool();
        }
        this.isOpen = !this.isOpen;
        break;
      case LIST_BUTTON.btnWindow:
        target.addClass('active');
        $(`#${LIST_BUTTON.btnList}`).removeClass('active');
        this.$listTable.removeClass('active');
        this.$listVessel.addClass('active');
        break
      case LIST_BUTTON.btnList:
        target.addClass('active');
        $(`#${LIST_BUTTON.btnWindow}`).removeClass('active');
        this.$listVessel.removeClass('active');
        this.$listTable.addClass('active');
        break;
    }
  }

  closeRightTool() {
    let {width} = this.options;
    this.$RightTool.animate({'margin-right': (-width + RIGHT_BUTTON.width)});
  }

  /**
   * Open right objects tool
   */
  openRightTool() {
    this.$RightTool.animate({'margin-right': 0});
  }
}

plugin(PLUGIN_NAME, Plugin);
