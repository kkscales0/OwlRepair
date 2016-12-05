  $(function () {
      $.getJSON('http://owlrepair-148215.appspot.com/api/request/getAllPublic', function (data) {
          $("#grid").igGrid({
              dataSource: data.REQUESTS, //JSON Array defined above
              features: [{
                      name: 'Selection',
                      mode: 'row',
                      rowSelectionChanged: function (evt, ui) {
                          console.log("meme");
                          console.log(evt);
                          console.log(ui);
                          var row = $('.selector').igGridSelection("selectedRow");

                      }
                                      }
                                      ]
          });
      });


  });

  function toggleCurrentRowOfGrid(grid) {
      // get reference to current selected row
      var row = $(grid).igGridSelection("selectedRow");
      if (row) {
          // toggle row
          $("#grid").igHierarchicalGrid("toggle", row.element);
      }
  }

  function toggleCurrentRowOfRootGrid() {
      // get the top level grid
      var parentGrid = $("#grid").igHierarchicalGrid("root");
      toggleCurrentRowOfGrid(parentGrid);
  }