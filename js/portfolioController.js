(function() {
    "use strict";
    angular.module('portFolio', [])
        .controller("portfolioController", function() {
            this.projects = [
              {
                name: "Kesa",
                id: "portfolioModal1",
                filter: "web-development",
                image: "img/portfolio/KESA.png",
                description: "Kesa is a web application used to write and read branching storylines stories collaboratively. You can create and allow your friends to help you write a story with branching storylines. After you are done, you can publish it and read it while making choices.",
                libraries: "The tree structure and visualization is built using D3 while the collaborative sessions were maintained by PeerJS which used a deployed server on heroku for communication. The frontend was done using AngularJS while the backend was done using Python's Django.",
                purpose: "Web Application and Development Course",
                date: "April - August 2016",
                service: "Web Development",
                show: true
              },
              {
                name: "Embedded Systems: MC9S12C128",
                id: "portfolioModal2",
                filter: "embedded-systems",
                image: "img/portfolio/EmbeddedSystems.jpg",
                description: "I used a MC9S12C128 board where we coded all the programs in C and Assembly with input/output devices.",
                libraries: "",
                purpose: "Embedded Systems Course",
                date: "Jan - May 2016",
                service: "Embedded Systems",
                show: true
              },
              {
                name: "Pascaline",
                id: "portfolioModal3",
                filter: "3d-modeling",
                image: "img/portfolio/Pascaline.png",
                description: "In Solidworks, I created 3D models of a Pascaline which is a mechanical calculator invented by Pascal in the early 17th century.",
                libraries: "",
                purpose: "Rapid Prototyping Technologies Course",
                date: "September - December 2016",
                service: "3D Printing and Laser Cutting",
                show: true
              }
            ];

            this.filters = [
              {
                name: "All",
                filter: "all"
              },
              {
                name: "Web Development",
                filter: "web-development"
              },
              {
                name: "Embedded Systems",
                filter: "embedded-systems"
              },
              {
                name: "3D Modeling",
                filter: "3d-modeling"
              }
            ];

            this.filterProjects = function(type) {
              var i;
              if(type === "all") {
                for(i = 0; i < this.projects.length; i++) {
                    this.projects[i].show = true;
                }
              }
              else {
                for(i = 0; i < this.projects.length; i++) {
                  if(type === this.projects[i].filter) {
                    this.projects[i].show = true;
                  }
                  else {
                    this.projects[i].show = false;
                  }
                }
              }
            };
        });

})();
