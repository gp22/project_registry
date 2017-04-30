/* jshint esversion:6 */
/* globals jQuery, window, document, console */

(function ($) {

    var DOM = {};

    // cache DOM elements
    function cacheDom() {
        DOM.$loginForm = $('#login-form');
        DOM.$loginUser = DOM.$loginForm.find('#login-name');
        DOM.$loginUser = DOM.$loginForm.find('#login-password');
        DOM.$loginStat = $('#login-stat');
    }
    
    
    // get query paramter
    function getUrlParams() {
        const allParams = decodeURIComponent(window.location.search.substring(1)),
              paramsArr = allParams.split('&');
        
        return paramsArr
            .filter( (el) => {
                let parameter = el.split('=');
                return (parameter[0] === 'key');
            })[0]
            .replace(/^key=/, '');
    }
    
    
    // bind events
    function bindEvents() {
        DOM.$loginForm.submit(formHandler);
    }
    
    
    // handle for submission
    function formHandler(e) {
        
        e.preventDefault();
        
        const uname = e.target[0].value,
              pword = e.target[1].value,
              key   = e.target[2].value,
              url   = '/api/login';
        
        $.ajax({
            url  : url,
            type : 'POST',
            data : { username: uname, password: pword }
        })
            .then( (data) => {
                window.localStorage.setItem('token', JSON.stringify(data.token));
                render('success', 'Login successful, loading dashboard...');
                $.ajax({
                    type    : 'GET',
                    url     : '/api/dashboard',
                    headers : {'Authorization': 'Bearer ' + data.token},
                    success : function(data){
                        render('success', 'This message required a JWT token to see. The token came from your browser\'s local storage, and was stored there upon submitting the login form. A better frontend (Angular?!) would be able to handle redirect routing. jQuery and browser DOM methods cannot because they cannot attach the required Authorization header to "window.location.href".');
                    }
                });
            })
            .catch( (err) => {
                render('danger', `Login failed: ${err.responseJSON.message}`);
            });
        
    }
    

    // render
    function render(status, msg) {
        DOM.$loginStat
            .html(`<div class="alert alert-${status}" role="alert">
                   <strong>${msg}</strong></div>`);
    }


    // autoexec initialization
    (function init() {
        cacheDom();
        bindEvents();
    }());

}(jQuery));