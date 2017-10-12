import $ from 'jquery';

function jqueryPlugin(pluginName, className, shortHand = false) {
  let dataName = pluginName;
  let old = $.fn[pluginName];
  $.fn[pluginName] = function (option) {
    return this.each(function () {
      let $this = $(this);
      let data = $this.data(dataName);
      let options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);

      if (!data) {
        $this.data(dataName, (data = new className(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  // - Short hand
  if (shortHand) {
    $[pluginName] = (options) => $({})[pluginName](options);
  }

  // - No conflict
  $.fn[pluginName].noConflict = () => $.fn[pluginName] = old;
}

export default jqueryPlugin;
