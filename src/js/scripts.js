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

  // ── Konami Code Easter Egg ──────────────────────────────────────────────
  (function () {
    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                 'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;

    document.addEventListener('keydown', function (e) {
      idx = (e.key === SEQ[idx]) ? idx + 1 : (e.key === SEQ[0] ? 1 : 0);
      if (idx === SEQ.length) { idx = 0; launchTerminal(); }
    });

    const LINES = [
      { text: '$ clang++ -O3 -march=native -flto sharjeel.cpp', cls: 'kt-green', d: 0 },
      { text: '', d: 180 },
      { text: 'Parsing... ████████████████ 100%', d: 380 },
      { text: '', d: 560 },
      { text: '-- Module: sharjeel.cpp', cls: 'kt-blue', d: 760 },
      { text: '-- Found: 13 publications        (0 retracted, 0 p-hacked)', d: 960 },
      { text: '-- Found: compilers & PL          (LLVM backend detected)', d: 1160 },
      { text: '-- Found: video games             (loop unrolling: ∞)', d: 1360 },
      { text: '-- Found: board games             (register alloc via graph coloring ✓)', d: 1560 },
      { text: '-- Found: coding side projects    (heap: fully utilized)', d: 1760 },
      { text: '-- Found: 25 countries visited    (trip count: unbounded)', d: 1960 },
      { text: '-- Found: 5 national parks        (branch prediction: always go outside)', d: 2160 },
      { text: '', d: 2360 },
      { text: 'Running optimization passes...', cls: 'kt-yellow', d: 2560 },
      { text: '  [InstCombine]   coffee + deadlines → focus', d: 2960 },
      { text: '  [LoopVectorize] unrolling game nights        (factor: ∞)', d: 3300 },
      { text: '  [GVN]           deduplicating travel memories', d: 3640 },
      { text: '  [Inliner]       inlining advisor wisdom', d: 3980 },
      { text: '  [DeadCodeElim]  removing TODOs that never ship', d: 4320 },
      { text: '  [LICM]          hoisting bugs out of prod loops', d: 4660 },
      { text: '', d: 4900 },
      { text: 'Linking... ████████████████ 100%', d: 5100 },
      { text: '', d: 5450 },
      { text: '✓ Compilation successful  (0 errors, 0 warnings)', cls: 'kt-green', d: 5650 },
      { text: '  binary: sharjeel-khan   size: priceless   runtime: O(1)', cls: 'kt-dim', d: 5850 },
      { text: '', d: 6050 },
      { text: '  [esc] to close', cls: 'kt-dim', d: 6200 },
    ];

    function launchTerminal() {
      let overlay = document.getElementById('konami-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'konami-overlay';
        overlay.innerHTML =
          '<div class="kt-box">' +
            '<div class="kt-bar">' +
              '<span class="kt-dot kt-red"></span>' +
              '<span class="kt-dot kt-yellow"></span>' +
              '<span class="kt-dot kt-green"></span>' +
              '<span class="kt-title">clang++ &mdash; sharjeel.cpp &mdash; 80&times;24</span>' +
            '</div>' +
            '<div class="kt-body" id="kt-body"></div>' +
          '</div>';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeTerminal();
        });
      }
      var body = document.getElementById('kt-body');
      body.innerHTML = '';
      overlay.classList.add('kt-active');
      document.addEventListener('keydown', escHandler);

      LINES.forEach(function (line) {
        setTimeout(function () {
          var div = document.createElement('div');
          div.className = 'kt-line' + (line.cls ? ' ' + line.cls : '');
          div.textContent = line.text;
          body.appendChild(div);
          body.scrollTop = body.scrollHeight;
        }, line.d);
      });

      // blinking cursor after last line
      setTimeout(function () {
        var cur = document.createElement('span');
        cur.className = 'kt-cursor';
        body.appendChild(cur);
      }, LINES[LINES.length - 1].d + 50);
    }

    function escHandler(e) { if (e.key === 'Escape') closeTerminal(); }

    function closeTerminal() {
      var overlay = document.getElementById('konami-overlay');
      if (overlay) overlay.classList.remove('kt-active');
      document.removeEventListener('keydown', escHandler);
    }
  })();
  // ────────────────────────────────────────────────────────────────────────

  am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.responsive.enabled = true;

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Series for World map
    var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.exclude = ["AQ"];
    worldSeries.useGeodata = true;

    var polygonTemplate = worldSeries.mapPolygons.template;
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    var worldHoverState = polygonTemplate.states.create("hover");
    worldHoverState.properties.fill = am4core.color("#adb5bd");

    var worldActiveState = polygonTemplate.states.create("active");
    worldActiveState.properties.fill = am4core.color("#6e89d4");

    // Series for United States map
    var usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
    usaSeries.geodata = am4geodata_usaLow;

    var usPolygonTemplate = usaSeries.mapPolygons.template;
    usPolygonTemplate.nonScalingStroke = true;
    usPolygonTemplate.tooltipText = "{name}";
    usPolygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    var usHoverState = usPolygonTemplate.states.create("hover");
    usHoverState.properties.fill = am4core.color("#c5cbd3");

    var usActiveState = usPolygonTemplate.states.create("active");
    usActiveState.properties.fill = am4core.color("#6e89d4");

    // Click-to-zoom on countries/states
    var selectedPolygon = null;
    function handlePolygonHit(ev) {
      var target = ev.target;
      if (selectedPolygon === target) {
        chart.goHome(800);
        target.isActive = false;
        selectedPolygon = null;
      } else {
        if (selectedPolygon) selectedPolygon.isActive = false;
        chart.zoomToMapObject(target, 3, true, 800);
        target.isActive = true;
        selectedPolygon = target;
      }
    }
    polygonTemplate.events.on("hit", handlePolygonHit);
    usPolygonTemplate.events.on("hit", handlePolygonHit);

    // Add image series (cities)
    var imageSeries = chart.series.push(new am4maps.MapImageSeries());
    var imageSeriesTemplate = imageSeries.mapImages.template;
    var circle = imageSeriesTemplate.createChild(am4core.Sprite);
    circle.scale = 0.5;
    circle.path =
      "M9,0C5.686,0 3,2.686 3,6c0,4.5 6,12 6,12s6-7.5 6-12C15,2.686 12.314,0 9,0z M9,8.5c-1.381,0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5,1.119 2.5,2.5S10.381,8.5 9,8.5z";
    circle.propertyFields.fill = "fill";

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

    // National Parks series
    var parkSeries = chart.series.push(new am4maps.MapImageSeries());
    var parkTemplate = parkSeries.mapImages.template;
    var triangle = parkTemplate.createChild(am4core.Sprite);
    triangle.scale = 0.5;
    triangle.fill = am4core.color("#3a9e4f");
    triangle.path = "M0,-10 L8.66,5 L-8.66,5 Z";

    parkTemplate.propertyFields.latitude = "latitude";
    parkTemplate.propertyFields.longitude = "longitude";
    parkTemplate.horizontalCenter = "middle";
    parkTemplate.verticalCenter = "middle";
    parkTemplate.align = "center";
    parkTemplate.valign = "middle";
    parkTemplate.width = 10;
    parkTemplate.height = 10;
    parkTemplate.nonScaling = true;
    parkTemplate.tooltipText = "{title}";
    parkTemplate.background.fillOpacity = 0;
    parkTemplate.setStateOnChildren = true;
    parkTemplate.states.create("hover");

    parkSeries.data = [
      { title: "Kings Canyon National Park", latitude: 36.8879, longitude: -118.5551 },
      { title: "Lassen Volcanic National Park", latitude: 40.4977, longitude: -121.4207 },
      { title: "Pinnacles National Park", latitude: 36.4906, longitude: -121.1825 },
      { title: "Sequoia National Park", latitude: 36.4864, longitude: -118.5658 },
      { title: "Yosemite National Park", latitude: 37.8651, longitude: -119.5383 },
    ];

    // Region fill colors
    var C = { na: "#5b8dd9", eu: "#e07b39", ap: "#2cc4a8", af: "#e74c3c", me: "#a78bfa" };

    imageSeries.data = [
      /* North America */
      { title: "Vancouver, BC, Canada", latitude: 49.2827, longitude: -123.1207, fill: C.na },
      { title: "Washington, D.C., USA", latitude: 38.8921, longitude: -77.0241, fill: C.na },
      { title: "Alexandria, Virginia, USA", latitude: 38.8048, longitude: -77.0469, fill: C.na },
      { title: "Philadelphia, PA, USA", latitude: 39.952583, longitude: -75.165222, fill: C.na },
      { title: "Pittsburgh, PA, USA", latitude: 40.440624, longitude: -79.995888, fill: C.na },
      { title: "Chicago, IL, USA", latitude: 41.878113, longitude: -87.629799, fill: C.na },
      { title: "Boston, MA, USA", latitude: 42.360081, longitude: -71.058884, fill: C.na },
      { title: "New York, NY, USA", latitude: 40.712776, longitude: -74.005974, fill: C.na },
      { title: "Buffalo, NY, USA", latitude: 42.886448, longitude: -78.878372, fill: C.na },
      { title: "Atlanta, GA, USA", latitude: 33.748997, longitude: -84.387985, fill: C.na },
      { title: "Miami, FL, USA", latitude: 25.761681, longitude: -80.191788, fill: C.na },
      { title: "Orlando, FL, USA", latitude: 28.538336, longitude: -81.379234, fill: C.na },
      { title: "Richmond, VA, USA", latitude: 37.540726, longitude: -77.43605, fill: C.na },
      { title: "Stamford, CT, USA", latitude: 41.053429, longitude: -73.538734, fill: C.na },
      { title: "San Francisco, CA, USA", latitude: 37.775, longitude: -122.419, fill: C.na },
      { title: "Mountain View, CA, USA", latitude: 37.39, longitude: -122.0812, fill: C.na },
      { title: "San Diego, CA, USA", latitude: 32.716, longitude: -117.16, fill: C.na },
      { title: "Los Angeles, CA, USA", latitude: 34.052, longitude: -118.244, fill: C.na },
      { title: "Las Vegas, NV, USA", latitude: 36.17, longitude: -115.14, fill: C.na },
      { title: "Seattle, WA, USA", latitude: 47.608, longitude: -122.332, fill: C.na },
      { title: "Portland, OR, USA", latitude: 45.515, longitude: -122.678, fill: C.na },
      { title: "Dallas, TX, USA", latitude: 32.7767, longitude: -96.797, fill: C.na },
      { title: "Houston, TX, USA", latitude: 29.7604, longitude: -95.3698, fill: C.na },

      /* Europe */
      { title: "Vienna, Austria", latitude: 48.2092, longitude: 16.3728, fill: C.eu },
      { title: "Paris, France", latitude: 48.8567, longitude: 2.351, fill: C.eu },
      { title: "Berlin, Germany", latitude: 52.5235, longitude: 13.4115, fill: C.eu },
      { title: "Frankfurt, Germany", latitude: 50.1109, longitude: 8.6821, fill: C.eu },
      { title: "Rome, Italy", latitude: 41.8955, longitude: 12.4823, fill: C.eu },
      { title: "Amsterdam, Netherlands", latitude: 52.3738, longitude: 4.891, fill: C.eu },
      { title: "Oslo, Norway", latitude: 59.9138, longitude: 10.7387, fill: C.eu },
      { title: "Sunndalsora, Norway", latitude: 62.6735, longitude: 8.5661, fill: C.eu },
      { title: "Stockholm, Sweden", latitude: 59.3328, longitude: 18.0645, fill: C.eu },
      { title: "Kyiv, Ukraine", latitude: 50.4422, longitude: 30.5367, fill: C.eu },
      { title: "Lviv, Ukraine", latitude: 49.839684, longitude: 24.029716, fill: C.eu },
      { title: "Istanbul, Turkey", latitude: 41.0082, longitude: 28.9784, fill: C.eu },
      { title: "Ephesus, Turkey", latitude: 37.9484, longitude: 27.3681, fill: C.eu },
      { title: "Cappadocia, Turkey", latitude: 38.640388, longitude: 34.846306, fill: C.eu },

      /* Africa */
      { title: "Addis Ababa, Ethiopia", latitude: 9.0084, longitude: 38.7575, fill: C.af },

      /* Asia / Pacific */
      { title: "Tokyo, Japan", latitude: 35.6785, longitude: 139.6823, fill: C.ap },
      { title: "Osaka, Japan", latitude: 34.693737, longitude: 135.502167, fill: C.ap },
      { title: "Kyoto, Japan", latitude: 35.011635, longitude: 135.768036, fill: C.ap },
      { title: "Hiroshima, Japan", latitude: 34.385204, longitude: 132.455292, fill: C.ap },
      { title: "Nara, Japan", latitude: 34.685085, longitude: 135.804993, fill: C.ap },
      { title: "Hong Kong", latitude: 22.396427, longitude: 114.109497, fill: C.ap },
      { title: "Sydney, Australia", latitude: -33.86882, longitude: 151.20929, fill: C.ap },
      { title: "Singapore", latitude: 1.2894, longitude: 103.85, fill: C.ap },
      { title: "Kuala Lumpur, Malaysia", latitude: 3.15443, longitude: 101.715103, fill: C.ap },
      { title: "Bali, Indonesia", latitude: -8.340539, longitude: 115.091949, fill: C.ap },
      { title: "Bangkok, Thailand", latitude: 13.7573, longitude: 100.502, fill: C.ap },
      { title: "Phuket, Thailand", latitude: 7.951933, longitude: 98.338089, fill: C.ap },
      { title: "Hyderabad, India", latitude: 17.385, longitude: 78.4867, fill: C.ap },
      { title: "Ahmedabad, India", latitude: 23.0225, longitude: 72.5714, fill: C.ap },

      /* Middle East */
      { title: "Abu Dhabi, UAE", latitude: 24.4764, longitude: 54.3705, fill: C.me },
      { title: "Dubai, UAE", latitude: 25.2048, longitude: 55.2708, fill: C.me },
      { title: "Muscat, Oman", latitude: 23.6086, longitude: 58.5922, fill: C.me },
      { title: "Doha, Qatar", latitude: 25.2948, longitude: 51.5082, fill: C.me },
      { title: "Kuwait City, Kuwait", latitude: 29.3721, longitude: 47.9824, fill: C.me },
      { title: "Riyadh, Saudi Arabia", latitude: 24.6748, longitude: 46.6977, fill: C.me },
      { title: "Jeddah, Saudi Arabia", latitude: 21.485811, longitude: 39.192505, fill: C.me },
    ];

    function applyMapTheme(isDark) {
      if (isDark) {
        chart.background.fill = am4core.color("#161b22");
        chart.background.fillOpacity = 1;
        worldSeries.mapPolygons.template.fill = am4core.color("#21262d");
        worldSeries.mapPolygons.template.stroke = am4core.color("#30363d");
        worldSeries.mapPolygons.each(function(p) {
          if (!p.isActive) { p.fill = am4core.color("#21262d"); }
          p.stroke = am4core.color("#30363d");
        });
        worldHoverState.properties.fill = am4core.color("#3a4555");
        usaSeries.mapPolygons.template.fill = am4core.color("#1c2128");
        usaSeries.mapPolygons.template.stroke = am4core.color("#30363d");
        usaSeries.mapPolygons.each(function(p) {
          if (!p.isActive) { p.fill = am4core.color("#1c2128"); }
          p.stroke = am4core.color("#30363d");
        });
        usHoverState.properties.fill = am4core.color("#2d3748");
      } else {
        chart.background.fillOpacity = 0;
        worldSeries.mapPolygons.template.fill = am4core.color("#ced4da");
        worldSeries.mapPolygons.template.stroke = am4core.color("#adb5bd");
        worldSeries.mapPolygons.each(function(p) {
          if (!p.isActive) { p.fill = am4core.color("#ced4da"); }
          p.stroke = am4core.color("#adb5bd");
        });
        worldHoverState.properties.fill = am4core.color("#adb5bd");
        usaSeries.mapPolygons.template.fill = am4core.color("#c5cbd3");
        usaSeries.mapPolygons.template.stroke = am4core.color("#adb5bd");
        usaSeries.mapPolygons.each(function(p) {
          if (!p.isActive) { p.fill = am4core.color("#c5cbd3"); }
          p.stroke = am4core.color("#adb5bd");
        });
        usHoverState.properties.fill = am4core.color("#c5cbd3");
      }
    }

    applyMapTheme(document.body.classList.contains("dark-mode"));

    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === "class") {
          applyMapTheme(document.body.classList.contains("dark-mode"));
        }
      });
    }).observe(document.body, { attributes: true });
  });
});