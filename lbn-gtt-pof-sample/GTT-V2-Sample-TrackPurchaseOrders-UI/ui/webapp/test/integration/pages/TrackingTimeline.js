sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/actions/EnterText",
  "sap/ui/test/matchers/Properties",
  "sap/ui/test/matchers/AggregationFilled",
  "sap/ui/test/matchers/AggregationLengthEquals",
], function (Opa5, Press, EnterText, Properties, AggregationFilled, AggregationLengthEquals) {
  "use strict";

  var sMapFragmentId            = "trackingTimelineMap";
  var sTimelineFragmentId       = "trackingTimelineEvents";
  var sTrackingTimelineViewName = "TrackingTimeline";

  Opa5.createPageObjects({
    onTheTrackingTimeline: {
      actions: {
        iPressLegend: function () {
          return this.waitFor({
            id: /listPanelLegend/,
            fragmentId: sMapFragmentId,
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            success: function (oControl) {
              oControl[0].fireExpand();
              this.waitFor({
                controlType: "sap.m.Button",
                matchers: new Properties({
                  "icon": "sap-icon://legend",
                }),
                success: function () {
                  this.waitFor({
                    controlType: "sap.m.Button",
                    matchers: new Properties({
                      "icon": "sap-icon://legend",
                    }),
                    actions: new Press(),
                  });
                },
              });
            },
            errorMessage: "The Map doesn't have legend.",
          });
        },
        iEnterFilterValue: function (sFilterText) {
          return this.waitFor({
            fragmentId: sTimelineFragmentId,
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            controlType: "sap.m.SearchField",
            actions: new EnterText({text: sFilterText}),
            errorMessage: "The Search field is not shown.",
          });
        },
      },
      assertions: {
        theTimelineShouldHaveEvents: function (iTimelinesNumber) {
          return this.waitFor({
            id: "trackingTimeline",
            fragmentId: sTimelineFragmentId,
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            matchers: [
              new AggregationFilled({
                name: "content",
              }),
              new AggregationLengthEquals({
                name: "content",
                length: iTimelinesNumber,
              }),
            ],
            success: function () {
              Opa5.assert.ok(true, "The number of timeline events is " + iTimelinesNumber);
            },
            errorMessage: "The Delivery Item doesn't have timeline events",
          });
        },
        theMapHasLegend: function () {
          return this.waitFor({
            id: /listPanelLegend/,
            fragmentId: sMapFragmentId,
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            success: function (oControl) {
              Opa5.assert.ok(true, "The Map has legend.");
            },
            errorMessage: "The Map doesn't have legend.",
          });
        },
        theLegendShouldBeExpanded: function (bExpanded) {
          return this.waitFor({
            id: /listPanelLegend/,
            fragmentId: sMapFragmentId,
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            success: function (oControl) {
              return bExpanded === oControl[0].getExpanded();
            },
            errorMessage: "The Map doesn't have legend.",
          });
        },
        theMapHasRoutesSpots: function () {
          return this.waitFor({
            fragmentId: sMapFragmentId,
            id: "geoMap",
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            matchers: new AggregationFilled({
              name: "vos",
            }),
            success: function () {
              Opa5.assert.ok(true, "The Map has spots.");
            },
            errorMessage: "The Map doesn't have spots.",
          });
        },
        theMapHasSpotWithErrorType: function () {
          return this.waitFor({
            fragmentId: sMapFragmentId,
            id: "geoMap",
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            matchers: function (oControl) {
              return oControl.getVos().some(function (oVos) {
                var bResult = false;
                var bIsSpots = oVos.getMetadata().getName() === "sap.ui.vbm.Spots";
                if(bIsSpots) {
                  bResult = oVos.getItems().some(function (oSpot) {
                    return oSpot.getType() === "Error";
                  });
                }
                return bResult;
              });
            },
            success: function () {
              Opa5.assert.ok(true, "The Map has spot with Error.");
            },
            errorMessage: "The Map doesn't have spots.",
          });
        },
        theMapHasNumberOfEventStops: function (iNumber) {
          return this.waitFor({
            fragmentId: sMapFragmentId,
            id: "geoMap",
            viewName: sTrackingTimelineViewName,
            viewNamespace: "com.sap.gtt.app.sample.pof.view.deliveryItem",
            matchers: function (oControl) {
              return oControl.getVos().some(function (oVos) {
                var bIsPlannedRoutes = oVos.getId().includes("eventStops");
                if(bIsPlannedRoutes) {
                  return oVos.getItems().length === iNumber;
                }
              });
            },
            success: function () {
              Opa5.assert.ok(true, "The Map has " + iNumber + " event stops");
            },
            errorMessage: "The Map doesn't have " + iNumber + " spots.",
          });
        },
      },
    },
  });
});
