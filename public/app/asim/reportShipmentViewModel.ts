/*
module myApp.main.crReportShipment {
    var _isInitialized = false;

    export var searchType: any;
    export var searchValue: any;
    export var _poData: any;
    export var _poNestedGridData: any;
    var _reportShipmentData = [];

    var _searchParam: string;
    var _grid = null;
    var reportShipmentResults = new kendo.data.ObservableArray([]);
    var checkedRows = {};

    var _gridDataSource = new kendo.data.DataSource({
        data: reportShipmentResults,
        pageSize: 10,
        pageable: {
            pageSizes: true,
            buttonCount: 5
        }
    });

    // This function is called when the controller is activated and the associated view is shown
    export function activate(searchValue: number) {
        if (!_isInitialized) {
            init();
        }

        //console.log("activated crReportShipment - (value is): " + searchValue);
        // code block below needs to be included to enable "Paging"
        $("#reportShipmentGrid").kendoGrid({
            dataSource: _gridDataSource,
            pageable: true
        });
    }

    export class ViewModel extends kendo.data.ObservableObject {

        constructor() {
            super();
            super.init(this);
        }

        isEditing = false;
        isNotEditing = true;
        isDirty = false;

        reportShipmentDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    // Load the data from the local variable
                    e.success(_reportShipmentData)
                }
            },
            schema: {
                model: {
                    id: "ticketNumber",
                    fields: {
                        includedInShipment: { from: "includedInShipment", type: "boolean" },
                        ticketNumber: { from: "ticketNumber", type: "number" },
                        poNumber: { from: "poNumber", editable: false, type: "number" },
                        lineNumber: { from: "lineNumber", editable: false, type: "number" },
                        shipTo: { from: "shipTo", editable: false, type: "string" },
                        itemNumber: { from: "itemNumber", editable: false, type: "string" },
                        description: { from: "description", editable: false, type: "string" },
                        ticketQty: { from: "ticketQty", editable: false, type: "number" },
                        supplierSiteID: { from: "supplierSiteID", editable: false, type: "number" },
                        qtyProdNotShipped: { from: "qtyProdNotShipped", editable: false, type: "number" },
                        qtyOpenToProduce: { from: "qtyOpenToProduce", editable: false, type: "number" },
                        container: { from: "container", editable: false, type: "string" },
                        dropShip: { from: "dropShip", editable: false, type: "string" },
                        createdBy: { from: "createdBy", editable: false },
                        creationDate: { from: "creationDate" }
                    }
                }
            },
            filter: { field: "rowState", operator: "neq", value: myApp.config.rowState.deleted },
            change: function (e) {
                if (myApp.utils.hasDataSourceDataChanged(e.action) && e.field !== "isSelected") {
                    // The change event fires when loading/filtering the datasource. However, we only
                    // want to trigger the dirty flag when a databound value has been updated, 
                    // so we need to check the action property. Also, don't fire this event if the 
                    // isSelected field (checkbox) is changed
                    viewModel.set("isDirty", true);
                    if (e.items && e.items.length > 0) {
                        var dataItem: any = e.items[0];

                        if (dataItem.rowState === myApp.config.rowState.unchanged) {
                            // Item has been changed. Update the rowState
                            dataItem.rowState = myApp.config.rowState.modified;
                        }
                    }
                }
            }
        });

        //Checkbox column Template, used for deleting rows and new task.
        checkboxTemplate = function (e) {
            return '<input type="checkbox" />';
        }

        navigateBack = function (e) {
            e.preventDefault();
            myApp.main.router.navigate(myApp.main.router.routes.reportShipment);
        }

        navigateToPO(e) {
            e.preventDefault();
            searchValue = $("#poNumber").val();
            searchType = "poNumber";

            //disable ReviewShipment button incase user has clicked th eback button"
            this.toggleEditMode(false);

            //check if value is a null or blank
            if ((!searchValue) || (searchValue == null)) {
                confirm("Please enter a valid PO Number")
                console.log("invalid PO Number")
                return;
            }

            //Clear contents of other textfields
            clearOutTextFields();
            //restore the text field value
            $('#poNumber').val(searchValue);

            var _searchValue = searchValue;
            var _searchType = myApp.main.crReportShipment.searchType;
            _searchParam = _searchType + ':' + _searchValue;

            if (!searchValue == null) {
            }
            else {
                getReportShipmentData();
            };
        }

        navigateToTicketNo(e) {
            e.preventDefault();
            searchValue = $("#ticketNumber").val();
            searchType = "ticketNumber";

            //disable ReviewShipment button incase user has clicked th eback button"
            this.toggleEditMode(false);

            //check if value is a null or blank
            if ((!searchValue) || (searchValue == null)) {
                confirm("Please enter a valid Ticket Number")
                console.log("invalid Ticket Number")
                return;
            }

            //Clear contents of other textfields
            clearOutTextFields();
            //restore the text field value
            $('#ticketNumber').val(searchValue);

            var _searchValue = searchValue;
            var _searchType = myApp.main.crReportShipment.searchType;
            _searchParam = _searchType + ':' + _searchValue;

            if (!searchValue) {
                //console.log("searchValue is not empty - " + searchValue);
            }
            else {
                //console.log("Reached ELSE clause - " + searchValue);
                getReportShipmentData();
            };
        }

        navigateToShip(e) {
            e.preventDefault();
            searchValue = $("#shipTo").val();
            searchType = "shipTo";

            //disable ReviewShipment button incase user has clicked th eback button"
            this.toggleEditMode(false);

            //check if value is a null or blank
            if ((!searchValue) || (searchValue == null)) {
                confirm("Please enter a valid Ship To Number")
                console.log("invalid Ship To Number")
                return;
            }

            //Clear contents of other textfields
            clearOutTextFields();
            //restore the text field value
            $('#shipTo').val(searchValue);

            var _searchValue = searchValue;
            var _searchType = myApp.main.crReportShipment.searchType;
            _searchParam = _searchType + ':' + _searchValue;

            if (!searchValue) {
                //console.log("searchValue is not empty - " + searchValue);
            }
            else {
                //console.log("Reached ELSE clause - " + searchValue);
                // return Report Shipment Data;
                getReportShipmentData();
            };
        }

        navigateToiSupplier(e) {
            e.preventDefault();
            searchValue = $("#supplierNumber").val();
            searchType = "supplierNumber";

            //disable ReviewShipment button incase user has clicked th eback button"
            this.toggleEditMode(false);

            //check if value is a null or blank
            if ((!searchValue) || (searchValue == null)) {
                confirm("Please enter a valid Supplier Number")
                console.log("invalid Supplier Number")
                return;
            }

            //Clear contents of other textfields
            clearOutTextFields();
            
            // restore the textfield alue;
            $('#supplierNumber').val(searchValue);

            var _searchValue = searchValue;
            var _searchType = myApp.main.crReportShipment.searchType;
            _searchParam = _searchType + ':' + _searchValue;

            if (!searchValue) {
                //console.log("searchValue is not empty - " + searchValue);
            }
            else {
                //console.log("Reached ELSE clause - " + searchValue);
                getReportShipmentData();
            };
        }

        navigateToContainerNo(e) {
            e.preventDefault();
            searchValue = $("#containerNumber").val();
            searchType = "containerNumber";

            //disable ReviewShipment button incase user has clicked th eback button"
            this.toggleEditMode(false);

            //check if value is a null or blank
            if ((!searchValue) || (searchValue == null)) {
                confirm("Please enter a valid Container Number")
                console.log("invalid Container Number")
                return;
            }

            //Clear contents of other textfields
            clearOutTextFields();
            //restore the text field value
            $('#containerNumber').val(searchValue);

            var _searchValue = searchValue;
            var _searchType = myApp.main.crReportShipment.searchType;
            _searchParam = _searchType = ':' + _searchValue;

            if (!searchValue) {
                //console.log("searchValue is not empty - " + searchValue);
            }
            else {
                //console.log("Reached ELSE clause - " + searchValue);
                getReportShipmentData();
            };
        }

        //Retrieve All Open Tickets
        navigateToAllOpenTickets(e) {
            e.preventDefault();
            //searchValue = 99;
            searchValue = "allOpenTickets";
            searchType = "allOpenTickets";

            //disable ReviewShipment button incase user has clicked th eback button"
            this.toggleEditMode(false);

            //Clear contents of other textfields
            clearOutTextFields();

            var _searchValue = searchValue;
            var _searchType = myApp.main.crReportShipment.searchType;
            _searchParam = _searchType + ':' + _searchValue;        //Seperator :

            if (!searchValue == null) {
                //console.log("searchValue is not empty - " + searchValue);
            }
            else {
                //console.log("Reached ELSE clause - " + searchValue);
                getReportShipmentData();
            };
        }

        // Add Tickets to Shipment - Get rows that the user has selected, set the rows into array;
        navigateAddTickets(e) {
            e.preventDefault();

            console.clear();

            //enable ReviewShipment button after user has clicked "Add Ticket To Shipment"
            this.toggleEditMode(true);

            // Set reference to the grid;
            var grid = $("#reportShipmentGrid").data("kendoGrid");
            var rows = new Array();

            $("#reportShipmentGrid").find("input:checked").each(function () {
                rows.push($(this).closest('tr'));

                // set removed rows into a variable;
                var dataItem = grid.dataItem($(this).closest('tr'));
                console.log("Removing TicketNumber => " + dataItem.ticketNumber + " " + dataItem.lineNumber);

                // store dataItem in session Storage;
                sessionStorage.setItem('userSelectedRecords', JSON.stringify(dataItem));
            })

          //remove rows;
          rows.forEach(function (row) {
                grid.removeRow(row);
            });
        }

        //Review Shipment
        navigateToReview(e) {
            e.preventDefault();

            // Call Shipment Info view;
            myApp.main.router.navigate(myApp.main.router.routes.shipmentInfo);
        }

        // toggle enable / disable button
        toggleEditMode = function (allowEdit) {
            this.set("isEditing", allowEdit);
            this.set("isNotEditing", !allowEdit);

            // When toggling edit mode, we need to reset the isDirty flag
            this.set("isDirty", false);
        }
    }

    // Create an instance of the viewModel
    export var viewModel = new ViewModel();

    function init() {
        _isInitialized = true;
        //console.log("initialized crReportShipment");
    }

    function clearViewModelData() {
        // Clear out the dataSource so that when we bind the viewModel, it
        // will have blank values to load.        
        _reportShipmentData = [];
        var ds = viewModel.get("reportShipmentDataSource");
        ds.read();
    }

    // Populate Report Shipment grid
    function getReportShipmentData() {
        utils.showBusyIndicator();

        //clear out grid contents
        $("#reportShipmentGrid").data('kendoGrid').dataSource.data([]);

        myApp.main.dcASNTool.getReportShipment(_searchParam)
            .done(function (poData) {
                _poData = poData;
                _gridDataSource.data(poData);
                viewModel.set("reportShipmentResults", _gridDataSource.data());
                //console.log("viewModel - crReportShipment.getReportShipmentData()");
            })
            .fail(function (data) {
                myApp.utils.handleServiceCallFailure(data);
                //console.log("failure - crReportShipment.getReportShipmentData()");
            })
            .always(function () {
                utils.hideBusyIndicator();
                //console.log("always function - crReportShipment.getReportShipmentData()");
            });
    }

    //Clears out text fields
    function clearOutTextFields() {

        $('#poNumber').val('');
        $('#ticketNumber').val('');
        $('#shipTo').val('');
        $('#supplierNumber').val('');
        $('#containerNumber').val('');
        //OpenAllTickets
    }

}*/