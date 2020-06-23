import "./styles/reset.css";
import "./styles/index.scss";
import "./styles/about.css"
import "./styles/boxes.css"
import "./styles/random.css"

import "./scripts/three";

"use strict";

window.addEventListener("DOMContentLoaded", main);

function main() {
    // toggle the pages
    window.onhashchange = function(){
      document.getElementsByClassName("visible")[0].classList.remove("visible");
      let currLocation = window.location.hash.slice(1);
      document.getElementsByClassName(currLocation)[0].classList.add("visible");
    };

}
