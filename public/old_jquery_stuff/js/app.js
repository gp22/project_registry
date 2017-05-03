/* jshint esversion:6 */
/* globals jQuery, document */

(function ($) {
   
   var DOM = {};
   
   // cache DOM elements
   function cacheDom() {
      DOM.$output = $('#output');
      DOM.$table  = $(document.createElement('table'));
      DOM.$thead  = $(document.createElement('thead'));
      DOM.$tbody  = $(document.createElement('tbody'));
      DOM.$tr     = $(document.createElement('tr'));
   }
   
   
   // consume the API
   function hitApi() {
      const apiUrl = 'api/projects';
      $.getJSON(apiUrl).then( render );
   }
   
   
   // render the table
   function render(res) {
      
      DOM.$thead
         .append(`<th>Cohort</th>
                  <th>Team</th>
                  <th>Project</th>
                  <th>Repo</th>
                  <th>Demo</th>`)
         .appendTo(DOM.$table);
      
      res.forEach( (project) => {
         var newRow = DOM.$tr
            .clone()
            .append(`<td>${project.cohort}</td>
                     <td>${project.team_name}</td>
                     <td>${project.project_name}</td>
                     <td>${project.repo}</td>
                     <td>${project.demo}</td>`)
            .appendTo(DOM.$tbody);
      });
      
      DOM.$table
         .addClass('table')
         .append(DOM.$tbody);
      
      DOM.$output
         .empty()
         .append(DOM.$table);
   }
   
   
   // autoexec initialization
   (function init() {
      cacheDom();
      hitApi();
   }());
   
}(jQuery));
