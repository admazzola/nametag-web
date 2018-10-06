
const $ = require('jquery');

import logo from '../img/0xbitcoin.png'
import titleLogo from '../img/logo-dark.png'
import githubLogo from '../img/GitHub-Mark-64px.png'
import redditLogo from '../img/reddit-mark-64px.png'
import contractQR from '../img/0xbitcoinContractQR.png'

import whiteLogo from '../img/logo.png'





import brutePool from '../img/0xbtcpool.png'
import TokenMiningPool from '../img/tokenminingpool.png'
import _0xPool from '../img/mikers.png'
import PizzaPool from '../img/pizza.png'


import Vue from 'vue'

import AlertRenderer from './alert-renderer'
import HomeRenderer from './home-renderer'

import EthHelper from './ethhelper'

import HomeDashboard from './home-dashboard'
import WalletDashboard from './wallet-dashboard'


var homeRenderer= new HomeRenderer()

var alertRenderer = new AlertRenderer();
var ethHelper = new EthHelper();

var wallet = new WalletDashboard();

var navbar = new Vue({
  el: '#navbar',
  data: {
    titleLogo: titleLogo,
    githubLogo: githubLogo,
    redditLogo: redditLogo,
    contractQR: contractQR
  }
})


$(document).ready(function(){



    if($("#home").length > 0){
      var web3 = ethHelper.init( alertRenderer);

      homeRenderer.init(ethHelper);
    }


    if($("#wallet").length > 0){
      // var web3 = ethHelper.init( alertRenderer);

      wallet.init(alertRenderer,ethHelper);
    }






              // Get all "navbar-burger" elements
              var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

              console.log($navbarBurgers.length)
              // Check if there are any navbar burgers
              if ($navbarBurgers.length > 0) {

                // Add a click event on each of them
                $navbarBurgers.forEach(function ($el) {
                  $el.addEventListener('click', function () {

                    // Get the target from the "data-target" attribute
                    var target = $el.dataset.target;
                    var $target = document.getElementById(target);

                    // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                    $el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');

                  });
                });
              }



              var $fadedin = $('.faded-in') ;
                  console.log('meep');

                if ($fadedin.length > 0) {
                  $.each($fadedin,function () {
                    var fadeTime = $(this).data('fade-time');
                    console.log($(this));
                    console.log(fadeTime);
                   $(this).delay(fadeTime).animate({ opacity: 1 }, 400)
                  });

                }


                var $activeDropdown = $('.dropdown-button') ;

                if ($activeDropdown.length > 0) {
                  $.each($activeDropdown,function () {
                    $(this).on('click',function (){
                        var parent = $(this).parent();
                        var dropdownContent = $(parent).find('.navbar-dropdown').first();

                        var visible = $(dropdownContent).css('display') == 'block';

                          $('.navbar-dropdown').css('display','none');

                        if(!visible)
                        {
                            $(dropdownContent).css('display','block');
                            $(dropdownContent).hide();
                            $(dropdownContent).fadeIn(100);
                        }

                    });


                  });

                }




});


//dashboardRenderer.hide();
