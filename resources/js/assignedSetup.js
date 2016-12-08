  $(function () {
      $("#dialog").igDialog({
          state: "closed",
          modal: true,
          draggable: true,
          resizable: true,
          height: "75%",
          width: "75%"
      });
      $.get('/api/assigned', function (data) {
          $("#grid").igGrid({
              autoGenerateColums: false,
              columns: [
                  {
                      headerText: "Request ID",
                      key: "REQUEST_ID",
                      datatype: "string",
                      width: "8%",
                      columnCssClass: "align-center"
                  },
                  {
                      headerText: "Category",
                      key: "CATEGORY_DESC",
                      datatype: "string"
                  },
                  {
                      headerText: "Building",
                      key: "BUILDING_DESC",
                      datatype: "string"
                  },
                  {
                      headerText: "Priority",
                      key: "PRIORITY_DESC",
                      datatype: "string",
                      width: "8%"
                  },
                  {
                      headerText: "Campus",
                      key: "CAMPUS_DESC",
                      datatype: "string"
                  },
                  {
                      headerText: "Status",
                      key: "STATUS_DESC",
                      datatype: "string",
                      width: "8%"
                  },
                  {
                      headerText: "Location",
                      key: "LOC_DESC",
                      datatype: "string",
                      width: "10%"
                  },
                  {
                      headerText: "Description",
                      key: "DESC",
                      datatype: "string",
                      width: "10%"
                  },
                  {
                      headerText: "Image",
                      key: "IMAGE_PATH",
                      datatype: "string",
                  }
                   ],
              dataSource: data.USERS_REQUESTS, //JSON Array defined above
              features: [{
                  name: 'Selection',
                  mode: 'row',
                  rowSelectionChanged: function (evt, ui) {

                      var rows = $("#grid").igGridSelection("selectedRow");
                      var dataRow = $('#grid').data('igGrid').dataSource.dataView()[rows.index];
                      console.log(dataRow);
                      $("#currentId").html("" + dataRow.REQUEST_ID);
                      $("#currentCat").html("" + dataRow.CATEGORY_DESC);
                      $("#currentBuilding").html("" + dataRow.BUILDING_DESC);
                      $('#currentPriority').html("" + dataRow.PRIORITY_DESC);
                      $('#currentCampus').html("" + dataRow.CAMPUS_DESC);
                      $('#currentDesc').html("" + dataRow.LOC_DESC);
                      $("#currentCom").html("" + dataRow.DESC);
                      $("#currentStatus").html("" + dataRow.STATUS_DESC);
                      if (dataRow.IMAGE_PATH == "") {
                          $('#currentImage').attr('src', "");
                      } else {
                          $('#currentImage').attr('src', '/uploads/' + dataRow.IMAGE_PATH);
                      }
                      $.get("https://owlrepair-148215.appspot.com/api/status/getAll", function (data, status) {
                          var users = data.STATUS;
                          console.log(users);
                          var optionsString = "<option hidden >Update Status</option>";
                          $.each(users, function (key, value) {
                              optionsString += "<option value='" + value.STATUS_ID + "'>" + value.STATUS_DESC + "</option>";
                          });
                          $("#updateSelect").html(optionsString);
                      });
                      $("#dialog").igDialog("open");

                  }
              }]
          });
      });

  });

  $("#updateButton").click(function () {
      var selected = parseInt($("#updateSelect").val());
      console.log(selected);
      if (selected > 0) {
          var rows = $("#grid").igGridSelection("selectedRow");
          var dataRow = $('#grid').data('igGrid').dataSource.dataView()[rows.index];
          var reqId = dataRow.REQUEST_ID;
          $.post("https://owlrepair-148215.appspot.com/api/request/updateStatus", {
              requestId: reqId,
              statusId: selected
          }, function (data, status) {
              console.log(data);
              if (data == "Success") {
                  window.location.href = 'assignedRequests';
              }
          });
      }
  });