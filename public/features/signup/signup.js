/* jshint esversion:6 */
/* globals jQuery, window, document, console */

(function ($) {

    var DOM = {};

    // cache DOM elements
    function cacheDom() {
        DOM.$signupForm = $('#signup-form');
        DOM.$signupUser = DOM.$signupForm.find('#signup-name');
        DOM.$signupUser = DOM.$signupForm.find('#signup-password');
        DOM.$signupKey  = DOM.$signupForm.find('#signup-key');
        DOM.$signupStat = $('#signup-stat');
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
        DOM.$signupForm.submit(formHandler);
    }
    
    
    // handle for submission
    function formHandler(e) {
        
        e.preventDefault();
        
        const uname  = e.target[0].value,
              pword  = e.target[1].value,
              key    = e.target[2].value,
              url    = '/api/signup';
        
        $.post(url, { username: uname, password: pword, key: key })
            .then( (data) => {
                console.log('Success', data);
                
                window.localStorage.setItem('token', JSON.stringify(data.token));
            
                DOM.$signupStat
                    .html(`<div class="alert alert-success" role="alert">
                           <strong>Registration successful</strong></div>`);
            })
            .catch( (err) => {
                DOM.$signupStat
                    .html(`<div class="alert alert-danger" role="alert">
                           <strong>Registration failed</strong><br>
                           ${err.responseJSON.message}`);
            });
        
    }
    

    // render
    function render() {
        DOM.$signupKey.attr('value', getUrlParams('key'));
    }


    // autoexec initialization
    (function init() {
        cacheDom();
        bindEvents();
        render();
    }());

}(jQuery));