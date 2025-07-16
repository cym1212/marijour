import ProductInfoSkin from './ProductInfoSkin';
import './product-info-skin.scss';

// UMD 형식으로 export
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.MarijuourProductInfoSkin = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return ProductInfoSkin;
});