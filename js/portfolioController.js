(function() {
  "use strict";
  angular.module('portFolio', ['mwl.calendar','ui.bootstrap','ngAnimate','ngMap']).controller("portfolioController", function(NgMap) {
    var pc = this;
    this.myInterval = 3000;
    this.noWrapSlides = false;
    this.active = 0;
    this.calendarView = 'month';
    this.viewDate = new Date();
    this.events = [];
    this.cellIsOpen = true;

    this.locations = [
      {pos:"Addis Ababa, Ethiopia", name:"Addis Ababa, Ethiopia", date:"May 2015", link:""},

      {pos:"Kiev, Ukraine", name:"Kiev, Ukraine", date:"September 2017", link:""},
      {pos:"Odessa, Ukraine", name:"Odessa, Ukraine", date:"September 2017", link:""},
      {pos:"Chernobyl, Ukraine", name:"Chernobyl, Ukraine", date:"September 2017", link:""},

      {pos:"Tokyo, Japan", name:"Tokyo, Japan", date:"October 2014, June 2017", link:""},
      {pos:"Osaka, Japan", name:"Osaka, Japan", date:"October 2014", link:""},
      {pos:"Nara, Japan", name:"Nara, Japan", date:"June 2017", link:""},
      {pos:"Kiyoto, Japan", name:"Kiyoto, Japan", date:"June 2017", link:""},
      {pos:"Hiroshima, Japan", name:"Hiroshima, Japan", date:"June 2017", link:""},

      {pos:"Sydney, Australia", name:"Sydney, Australia", date:"Mar 2017", link:""},

      {pos:"Bangkok, Thailand", name:"Bangkok, Thailand", date:"", link:""},
      {pos:[7.949674,98.321200], name:"Phuket, Thailand", date:"", link:""},
      {pos:[-8.417036,115.181168], name:"Bali, Indonesia", date:"", link:""},
      {pos:[22.278545,114.173708], name:"Hong Kong", date:"", link:""},
      {pos:[1.356545,103.878514], name:"Singapore", date:"", link:""},
      {pos:[3.139018,101.685957], name:"Kuala Lumpur, Malaysia", date:"", link:""},
      {pos:[3.139018,101.685957], name:"Kuala Lumpur, Malaysia", date:"", link:""},

      {pos:[24.737871, 46.652076], name:"Riyadh, Saudi Arabia", date:"", link:""},
      {pos:[21.291310, 39.220721], name:"Jeddah, Saudi Arabia", date:"", link:""},
      {pos:[29.376588, 47.977661], name:"Kuwait City, Kuwait", date:"", link:""},
      {pos:[25.218046, 55.267532], name:"Dubai, United Arab Emirates", date:"", link:""},
      {pos:[24.458665, 54.375963], name:"Abu Dhabi, United Arab Emirates", date:"", link:""},
      {pos:[25.355906, 55.422020], name:"Sharjah, United Arab Emirates", date:"", link:""},
      {pos:[24.140932, 55.794922], name:"Al-Ain, United Arab Emirates", date:"", link:""},
      {pos:[23.594644, 58.405117], name:"Muscat, Oman", date:"", link:""},
      {pos:[24.352803, 56.705328], name:"Sohar, Oman", date:"", link:""},
      {pos:[25.292014, 51.526406], name:"Doha, Qatar", date:"", link:""},

      {pos:[40.441016, -79.988399], name:"Pittsburgh, PA, USA", date:"", link:""},
      {pos:[39.954006, -75.161987], name:"Philadelphia, PA, USA", date:"", link:""},
      {pos:[25.763531, -80.196502], name:"Miami, FL, USA", date:"", link:""},
      {pos:[28.540228, -81.379059], name:"Orlando, FL, USA", date:"", link:""},
      {pos:[41.877631, -87.620049], name:"Chicago, IL, USA", date:"", link:""},
      {pos:[42.362482, -71.054063], name:"Boston, MA, USA", date:"", link:""},
      {pos:[40.710683, -74.007181], name:"New York City, NY, USA", date:"", link:""},
      {pos:[38.906872, -77.036557], name:"Washington, DC, USA", date:"", link:""},
      {pos:[36.170939, -115.143423], name:"Las Vegas, NV, USA", date:"", link:""},
      {pos:[34.049750, -118.240108], name:"Los Angeles, CA, USA", date:"", link:""},
      {pos:[37.773963, -122.414943], name:"San Francisco, CA, United States", date:"", link:""},

      {pos:[48.856353, 2.349118], name:"Paris, France", date:"", link:""},
      {pos:[41.905898, 12.496851], name:"Rome, Italy", date:"", link:""},
      {pos:[48.206873, 16.375933], name:"Vienna, Austria", date:"", link:""},
      {pos:[50.111441, 8.683935], name:"Frankfurt, Germany", date:"", link:""},
      {pos:[52.520353, 13.397606], name:"Berlin, Germany", date:"", link:""},
      {pos:[52.382178, 4.901363], name:"Amsterdam, Netherlands", date:"", link:""},
      {pos:[52.382178, 4.901363], name:"Amsterdam, Netherlands", date:"", link:""},
      {pos:[59.918914, 10.753525], name:"Oslo, Norway", date:"", link:""},
      {pos:[62.674221, 8.566172], name:"Sunndalsora, Norway", date:"", link:""},
      {pos:[59.337975, 18.069251], name:"Stockholm, Sweden", date:"", link:""},
    ]

    NgMap.getMap().then(function(map) {
      pc.map = map;

      pc.showCustomMarker= function(evt,input) {
        map.showInfoWindow("",input);
      };

      pc.closeCustomMarker= function(evt) {
        this.style.display = 'none';
      };
    });

    this.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    this.timespanClicked = function(date, cell) {

      if (vm.calendarView === 'month') {
        if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      } else if (vm.calendarView === 'year') {
        if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      }

    };

    this.projects = [
      {
        name: "Kesa",
        id: "portfolioModal1",
        filter: "web-development",
        description: "Kesa is a web application used to write and read branching storylines stories collaboratively. You can create and allow your friends to help you write a story with branching storylines. After you are done, you can publish it and read it while making choices.",
        libraries: "The tree structure and visualization is built using D3 while the collaborative sessions were maintained by PeerJS which used a deployed server on heroku for communication. The frontend was done using AngularJS while the backend was done using Python's Django.",
        purpose: "Web Application and Development Course",
        date: "April - August 2016",
        service: "Web Development",
        images: [
          {image: "Kesa1.png", id: 0},
          {image: "Kesa2.png", id: 1}
        ],
        show: true,
        link: "https://github.com/yelsayed/Kesa",
        location: "Github"
      }, {
        name: "Embedded Systems: MC9S12C128",
        id: "portfolioModal2",
        filter: "embedded-systems",
        description: "I used a MC9S12C128 board where we coded all the programs in C and Assembly with input/output devices.",
        libraries: "",
        purpose: "Embedded Systems Course",
        date: "Jan - May 2016",
        service: "Embedded Systems",
        images: [
          {image: "EmbeddedSystems.jpg", id: 0}
        ],
        show: true,
        link: "https://github.com/Sharjeel-Khan/MC9S12C128",
        location: "Github"
      }, {
        name: "Pascaline",
        id: "portfolioModal3",
        filter: "3d-modeling",
        description: "In Solidworks, I created 3D models of a Pascaline which is a mechanical calculator invented by Pascal in the early 17th century.",
        libraries: "",
        purpose: "Rapid Prototyping Technologies Course",
        date: "September - November 2016",
        service: "3D Printing and Laser Cutting",
        images: [
          {image: "Pascaline1.png", id: 0},
          {image: "Pascaline2.jpg", id: 1},
          {image: "Pascaline3.jpg", id: 2},
          {image: "Pascaline4.jpg", id: 3},
          {image: "Pascaline5.jpg", id: 4},
          {image: "Pascaline6.jpg", id: 5},
          {image: "Pascaline7.jpg", id: 6}
        ],
        show: true,
        link: "",
        location: "None"
      }, {
        name: "Arcade Machine",
        id: "portfolioModal4",
        filter: "3d-modeling",
        description: "In Solidworks, I created a miniature arcade machine using parametrized equations. You can change the size by just changing the scale value and this causes all the pieces to change respectively. I used wood for the sides while I printed the screen, the buttons and the joystick using a 3D-printer.",
        libraries: "",
        purpose: "Rapid Prototyping Technologies Course",
        date: "December 2016",
        service: "3D Printing and Laser Cutting",
        images: [
          {image: "ArcadeMachine1.png", id: 0}
      ],
        show: true,
        link: "",
        location: "None"
      }
    ];

    this.filters = [
      {
        name: "All",
        filter: "all"
      }, {
        name: "Web Development",
        filter: "web-development"
      }, {
        name: "Embedded Systems",
        filter: "embedded-systems"
      }, {
        name: "3D Modeling",
        filter: "3d-modeling"
      }
    ];

    this.skills = [
      {
        name: "AngularJS",
        filter: "web",
        percentage: "85",
        show: true
      }, {
        name: "Django",
        filter: "web",
        percentage: "85",
        show: true
      }, {
        name: "jQuery",
        filter: "web",
        percentage: "80",
        show: true
      }, {
        name: "Bootstrap",
        filter: "web",
        percentage: "75",
        show: true
      }, {
        name: "NodeJS",
        filter: "web",
        percentage: "70",
        show: true
      }, {
        name: "Python",
        filter: "programming",
        percentage: "95",
        show: false
      }, {
        name: "Java",
        filter: "programming",
        percentage: "85",
        show: false
      }, {
        name: "SML",
        filter: "programming",
        percentage: "85",
        show: false
      }, {
        name: "Latex",
        filter: "programming",
        percentage: "85",
        show: false
      }, {
        name: "C",
        filter: "programming",
        percentage: "80",
        show: false
      }, {
        name: "Sublime",
        filter: "apps",
        percentage: "95",
        show: false
      }, {
        name: "Atom",
        filter: "apps",
        percentage: "85",
        show: false
      }, {
        name: "Solidworks",
        filter: "apps",
        percentage: "85",
        show: false
      }, {
        name: "Vim",
        filter: "apps",
        percentage: "80",
        show: false
      }, {
        name: "Adobe Indesign",
        filter: "apps",
        percentage: "70",
        show: false
      }
    ];

    this.skillfilters = [
      {
        name: "Web Development",
        filter: "web"
      }, {
        name: "Programming",
        filter: "programming"
      }, {
        name: "Applications",
        filter: "apps"
      }
    ];

    this.filterProjects = function(type) {
      var i;
      if (type === "all") {
        for (i = 0; i < this.projects.length; i++) {
          this.projects[i].show = true;
        }
      } else {
        for (i = 0; i < this.projects.length; i++) {
          if (type === this.projects[i].filter) {
            this.projects[i].show = true;
          } else {
            this.projects[i].show = false;
          }
        }
      }
    };

    this.filterSkills = function(type) {
      var i;
      for (i = 0; i < this.skills.length; i++) {
        if (type === this.skills[i].filter) {
          this.skills[i].show = true;
        } else {
          this.skills[i].show = false;
        }
      }
    };

    this.nextImage = function(project) {
      if (project.imageindex < project.images.length - 1) {
        project.imageindex += 1;
      }
    };

    this.prevImage = function(project) {
      if (project.imageindex > 0) {
        project.imageindex -= 1;
      }
    };
  });

})();
