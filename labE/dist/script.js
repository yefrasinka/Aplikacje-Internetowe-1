/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!***********************!*\
  !*** ./src/script.ts ***!
  \***********************/


var styles = {
  "Style 1": "css/page1.css",
  "Style 2": "css/page2.css",
  "Style 3": "css/page3.css"
};
var currentStyle = "Style 1";
function setStyle(styleName) {
  var styleLink = document.querySelector('link[rel="stylesheet"]');
  if (styleLink) {
    styleLink.href = styles[styleName];
  }
  currentStyle = styleName;
  var buttons = document.querySelectorAll("#style-switcher button");
  buttons.forEach(function (button) {
    if (button.textContent === styleName) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
function createStyleButtons() {
  var container = document.getElementById("style-switcher");
  if (container) {
    Object.keys(styles).forEach(function (styleName) {
      var button = document.createElement("button");
      button.textContent = styleName;
      button.addEventListener("click", function () {
        return setStyle(styleName);
      });
      container.appendChild(button);
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  createStyleButtons();
  setStyle(currentStyle);
});
/******/ })()
;