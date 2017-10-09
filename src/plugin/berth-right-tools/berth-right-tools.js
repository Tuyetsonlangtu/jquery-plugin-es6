import './berth-right-tools.scss';
import $ from 'jquery';
import plugin from '../../common/plugin';
import {PLUGIN_NAME, OPTIONS_DEFAULT, RIGHT_BUTTON, LIST_BUTTON} from './const';
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
      listVessel: '<div class="list-vessel"></div>'
    };

    this.vesselTemplate = {
      vslBox : '<div class="vessel-box"></div>',
    }

    this.init(options);
    this.$RightTool = $(`.${PLUGIN_NAME}`);
  }

  init(options) {
    this.pluginData = [];
    if (options.data) {
      if (typeof options.data === 'string') {
        options.data = $.parseJSON(options.data);
      }
      this.pluginData = $.extend(true, [], options.data);
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
      this.$wrapper.append(this.$wrapperContent);
      this.$rightContent.append(this.$wrapper);
      this.$element.append(this.template.openButton);
      this.$element.append(this.$rightContent);

      this.initialized = true;

      if(isTabWindow){
        let $btnWindow = $(`#${LIST_BUTTON.btnWindow}`);
        $btnWindow.addClass('active');
      }
      else {
        let $btnList = $(`#${LIST_BUTTON.btnList}`);
        $btnList.addClass('active');
      }
    }
    this.$listVessel.empty();
    this.buildTemplate(this.pluginData, 0);
  }

  buildTemplate() {
    let {vslBackColor, vslBorderColor} = this.options;
    let $vslBox = $(this.vesselTemplate.vslBox);
    let border = `2px solid ${vslBorderColor}`;
    $vslBox.css({
      "height": 100,
      "background": vslBackColor,
      "border": border,
      "top": 0,
    });
    this.$listVessel.append($vslBox);

    let $vslBox1 = $(this.vesselTemplate.vslBox);
    $vslBox1 = $(this.vesselTemplate.vslBox);
    $vslBox1.css({
      "height": 200,
      "background": vslBackColor,
      "border": border,
      "top": 100,
    });

    this.$listVessel.append($vslBox1);
  }

  //Event
  clickHandler(){
    let target = $(event.target);
    let targetId = target.attr('id') ? target.attr('id') : "";
    switch (targetId) {
      case LIST_BUTTON.btnRighTool:
        if (this.isOpen) {
          this.closeRightTool();
        }
        else {
          this.openRightTool();
        }
        break;
      case LIST_BUTTON.btnWindow:
        target.addClass('active');
        $(`#${LIST_BUTTON.btnList}`).removeClass('active');
        break
      case LIST_BUTTON.btnList:
        target.addClass('active');
        $(`#${LIST_BUTTON.btnWindow}`).removeClass('active');
        break
    }

    this.isOpen = !this.isOpen;
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
