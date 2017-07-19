// ==UserScript==
// @name         Youtube Scroll 'scrollToNew'
// @version      1.3
// @author       Leo Benkel
// @description  Check out the article here: http://leobenkel.com/2016/02/tampermonkey-youtube-subscription-button-to-scroll-to-last-viewed/
// @match        https://www.youtube.com/feed/subscriptions*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

var navBar = document.getElementsByClassName("appbar-nav-menu")[0];
var sample = document.getElementsByClassName("appbar-nav-menu")[0].firstChild.firstElementChild.classList;

var listclass = "";
for(var i = 0 ; i < sample.length ; i ++){
    listclass += sample[i] + " ";
}

var newdiv = document.createElement('li');
newdiv.innerHTML = '<input type="button" class="' + listclass+ '" onclick="scrollToNew();" value="Scroll To New" />';
navBar.appendChild(newdiv);

scrollToNew = function(){
    var elems = $(".watched, .resume-playback-progress-bar");
    elems = _.flatMap(elems, function(e) {
       return $(e).closest('.item-section').get(0);
    });
    elems = _.sortBy(elems, function(e) {
       return e.offsetTop;
    });
    
    console.log("Got " + elems.length + " elements.");

    if(elems.length === 0){
        $(".browse-items-load-more-button")[0].click();
        setTimeout(function(){scrollToNew();}, 100);
    } else {
        var index = -1;
        var scroll = -1;
        while(scroll <= body.scrollTop){
            index++;
            if(index >= elems.length){
                $(".browse-items-load-more-button")[0].click();
                setTimeout(function(){scrollToNew();},100);
                break;
            }
            var elem = elems[index];
            scroll = elem.offsetTop;
        }

        setTimeout(function(){
            console.log("Scroll to " + scroll + " from " + body.scrollTop) ;
            body.scrollTop = scroll;
            if(body.scrollTop != scroll){
                document.getElementsByClassName("browse-items-load-more-button")[0].click();
                setTimeout(function(){scrollToNew();},100);
            }
        },10);
    }
};
