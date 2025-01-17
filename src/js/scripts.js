//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector("#sideNav");
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#sideNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Series for World map
    var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.exclude = ["AQ"];
    worldSeries.useGeodata = true;

    var polygonTemplate = worldSeries.mapPolygons.template;
    // polygonTemplate.tooltipText = "{name}";
    // polygonTemplate.fill = chart.colors.getIndex(1);
    polygonTemplate.nonScalingStroke = true;

    // Hover state
    // var hs = polygonTemplate.states.create("hover");
    // hs.properties.fill = am4core.color("#367B25");

    // Series for United States map
    var usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
    usaSeries.geodata = am4geodata_usaLow;

    var usPolygonTemplate = usaSeries.mapPolygons.template;
    // usPolygonTemplate.tooltipText = "{name}";
    // usPolygonTemplate.fill = chart.colors.getIndex(1);
    usPolygonTemplate.nonScalingStroke = true;

    // Hover state
    // var hs = usPolygonTemplate .states.create("hover");
    // hs.properties.fill = am4core.color("#367B25");

    // Add image series
    var imageSeries = chart.series.push(new am4maps.MapImageSeries());
    var imageSeriesTemplate = imageSeries.mapImages.template;
    var circle = imageSeriesTemplate.createChild(am4core.Sprite);
    circle.scale = 0.4;
    circle.fill = new am4core.InterfaceColorSet().getFor(
      "alternativeBackground"
    );
    circle.path =
      "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
    // what about scale...

    // set propertyfields
    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";

    imageSeriesTemplate.horizontalCenter = "middle";
    imageSeriesTemplate.verticalCenter = "middle";
    imageSeriesTemplate.align = "center";
    imageSeriesTemplate.valign = "middle";
    imageSeriesTemplate.width = 8;
    imageSeriesTemplate.height = 8;
    imageSeriesTemplate.nonScaling = true;
    imageSeriesTemplate.tooltipText = "{title}";
    imageSeriesTemplate.fill = am4core.color("#ffffff");
    imageSeriesTemplate.background.fillOpacity = 0;
    imageSeriesTemplate.background.fill = am4core.color("#ffffff");
    imageSeriesTemplate.setStateOnChildren = true;
    imageSeriesTemplate.states.create("hover");

    imageSeries.data = [
      /* North America */
      {
        title: "Vancouver, BC, Canada",
        latitude: 49.2827,
        longitude: -123.1207,
      },

      /* USA */
      /* East Coast */
      {
        title: "Washington, D.C., USA",
        latitude: 38.8921,
        longitude: -77.0241,
      },
      {
        title: "Alexnadrid, Virginia, USA",
        latitude: 38.8048,
        longitude: -77.0469,
      },
      {
        title: "Philadelphia, PA, USA",
        latitude: 39.952583,
        longitude: -75.165222,
      },
      {
        title: "Pittsburgh, PA, USA",
        latitude: 40.440624,
        longitude: -79.995888,
      },
      { title: "Chicago, IL, USA", latitude: 41.878113, longitude: -87.629799 },
      { title: "Boston, MA, USA", latitude: 42.360081, longitude: -71.058884 },
      {
        title: "New York, NY, USA",
        latitude: 40.712776,
        longitude: -74.005974,
      },
      { title: "Buffalo, NY, USA", latitude: 42.886448, longitude: -78.878372 },
      { title: "Atlanta, GA, USA", latitude: 33.748997, longitude: -84.387985 },
      { title: "Miami, FL, USA", latitude: 25.761681, longitude: -80.191788 },
      { title: "Orlando, FL, USA", latitude: 28.538336, longitude: -81.379234 },
      { title: "Richmond, VA, USA", latitude: 37.540726, longitude: -77.43605 },
      {
        title: "Stamford, CT, USA",
        latitude: 41.053429,
        longitude: -73.538734,
      },
      /* West Coast */
      {
        title: "San Francisco, CA, USA",
        latitude: 37.775,
        longitude: -122.419,
      },
      {
        title: "Mountain View, CA, USA",
        latitude: 37.39,
        longitude: -122.0812,
      },
      { title: "San Diego, CA, USA", latitude: 32.716, longitude: -117.16 },
      { title: "Los Angeles, CA, USA", latitude: 34.052, longitude: -118.244 },
      { title: "Las Vegas, NV, USA", latitude: 36.17, longitude: -115.14 },
      { title: "Seattle, WA, USA", latitude: 47.608, longitude: -122.332 },
      { title: "Portland, Oregon, USA", latitude: 45.515, longitude: -122.678 },

      /* South America */

      /* Europe */
      { title: "Vienna, Austria", latitude: 48.2092, longitude: 16.3728 },
      { title: "Paris, France", latitude: 48.8567, longitude: 2.351 },
      { title: "Berlin, Germany", latitude: 52.5235, longitude: 13.4115 },
      { title: "Frankfurt, Germany", latitude: 50.1109, longitude: 8.6821 },
      { title: "Rome, Italy", latitude: 41.8955, longitude: 12.4823 },
      { title: "Amsterdam, Netherlands", latitude: 52.3738, longitude: 4.891 },
      { title: "Oslo, Norway", latitude: 59.9138, longitude: 10.7387 },
      { title: "Sunndalsora, Norway", latitude: 62.6735, longitude: 8.5661 },
      { title: "Stockholm, Sweden", latitude: 59.3328, longitude: 18.0645 },
      { title: "Kiev, Ukraine", latitude: 50.4422, longitude: 30.5367 },
      { title: "Lviv, Ukraine", latitude: 49.839684, longitude: 24.029716 },
      { title: "Istanbul, Turkey", latitude: 41.0082, longitude: 28.9784 },
      { title: "Ephseus, Turkey", latitude: 37.9484, longitude: 27.3681 },
      {
        title: "Cappadocia, Turkey",
        latitude: 38.640388,
        longitude: 34.846306,
      },

      /* Africa */
      { title: "Addis Ababa, Ethiopia", latitude: 9.0084, longitude: 38.7575 },

      /* Asia */
      { title: "Tokyo, Japan", latitude: 35.6785, longitude: 139.6823 },
      { title: "Osaka, Japan", latitude: 34.693737, longitude: 135.502167 },
      { title: "Kyoto, Japan", latitude: 35.011635, longitude: 135.768036 },
      { title: "Hiroshima, Japan", latitude: 34.385204, longitude: 132.455292 },
      { title: "Nara, Japan", latitude: 34.685085, longitude: 135.804993 },
      { title: "Hong Kong", latitude: 22.396427, longitude: 114.109497 },
      { title: "Sydney, Australia", latitude: -33.86882, longitude: 151.20929 },
      { title: "Singapore", latitude: 1.2894, longitude: 103.85 },
      {
        title: "Kuala Lampur, Malayasia",
        latitude: 3.15443,
        longitude: 101.715103,
      },
      { title: "Bali, Indonesia", latitude: -8.340539, longitude: 115.091949 },
      { title: "Bangkok, Thailand", latitude: 13.7573, longitude: 100.502 },
      { title: "Phuket, Thailand", latitude: 7.951933, longitude: 98.338089 },
      { title: "Hyderabad, India", latitude: 17.385, longitude: 78.4867 },
      { title: "Ahmedabad, India", latitude: 23.0225, longitude: 72.5714 },

      /* Middle East */
      { title: "Abu Dhabi, UAE", latitude: 24.4764, longitude: 54.3705 },
      { title: "Dubai, UAE", latitude: 24.4764, longitude: 54.3705 },
      { title: "Muscat, Oman", latitude: 23.6086, longitude: 58.5922 },
      { title: "Doha, Qatar", latitude: 25.2948, longitude: 51.5082 },
      { title: "Kuwait City, Kuwait", latitude: 29.3721, longitude: 47.9824 },
      { title: "Riyadh, Saudi Arabia", latitude: 24.6748, longitude: 46.6977 },
      {
        title: "Jeddah, Saudi Arabia",
        latitude: 21.485811,
        longitude: 39.192505,
      },
    ];
  });
});
