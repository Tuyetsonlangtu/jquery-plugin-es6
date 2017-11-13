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
    let vslImg = $('<div id="vsl-img">');
    vslImg.css({
      'background-image' : "url('assets/images/ship_engine.png')"
    })
    this.sideView.append(vslImg);
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

    this.partitionView = this.template.partitionView;
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