import CenteredVisualBannerSkin from './CenteredVisualBannerSkin';
import './centered-visual-banner-skin.scss';

// UMD 형식으로 export
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.MarijuourCenteredVisualBannerSkin = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return CenteredVisualBannerSkin;
});