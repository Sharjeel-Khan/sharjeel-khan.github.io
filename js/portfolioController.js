(function() {
    "use strict";
    angular.module('portFolio', ['ui.bootstrap'])
        .controller("portfolioController", function() {
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
                images: ["KESA1.png","KESA2.png"],
                imageindex: 0,
                show: true
              },
              {
                name: "Embedded Systems: MC9S12C128",
                id: "portfolioModal2",
                filter: "embedded-systems",
                description: "I used a MC9S12C128 board where we coded all the programs in C and Assembly with input/output devices.",
                libraries: "",
                purpose: "Embedded Systems Course",
                date: "Jan - May 2016",
                service: "Embedded Systems",
                images: ["EmbeddedSystems.jpg"],
                imageindex: 0,
                show: true
              },
              {
                name: "Pascaline",
                id: "portfolioModal3",
                filter: "3d-modeling",
                description: "In Solidworks, I created 3D models of a Pascaline which is a mechanical calculator invented by Pascal in the early 17th century.",
                libraries: "",
                purpose: "Rapid Prototyping Technologies Course",
                date: "September - December 2016",
                service: "3D Printing and Laser Cutting",
                images: ["Pascaline1.png","Pascaline2.jpg","Pascaline3.jpg","Pascaline4.jpg",
                         "Pascaline5.jpg","Pascaline6.jpg","Pascaline7.jpg"],
                imageindex: 0,
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

            this.skills = [
              {
                  name: "AngularJS",
                  filter: "web",
                  percentage: "85",
                  show: true
              },
              {
                  name: "Django",
                  filter: "web",
                  percentage: "85",
                  show: true
              },
              {
                  name: "jQuery",
                  filter: "web",
                  percentage: "80",
                  show: true
              },
              {
                  name: "Bootstrap",
                  filter: "web",
                  percentage: "75",
                  show: true
              },
              {
                  name: "NodeJS",
                  filter: "web",
                  percentage: "70",
                  show: true
              },
              {
                  name: "Python",
                  filter: "programming",
                  percentage: "95",
                  show: false
              },
              {
                  name: "Java",
                  filter: "programming",
                  percentage: "85",
                  show: false
              },
              {
                  name: "SML",
                  filter: "programming",
                  percentage: "85",
                  show: false
              },
              {
                  name: "Latex",
                  filter: "programming",
                  percentage: "85",
                  show: false
              },
              {
                  name: "C",
                  filter: "programming",
                  percentage: "80",
                  show: false
              },
              {
                  name: "Sublime",
                  filter: "apps",
                  percentage: "95",
                  show: false
              },
              {
                  name: "Atom",
                  filter: "apps",
                  percentage: "85",
                  show: false
              },
              {
                  name: "Solidworks",
                  filter: "apps",
                  percentage: "85",
                  show: false
              },
              {
                  name: "Vim",
                  filter: "apps",
                  percentage: "80",
                  show: false
              },
              {
                  name: "Adobe Indesign",
                  filter: "apps",
                  percentage: "70",
                  show: false
              },
            ];

            this.skillfilters = [
              {
                    name: "Web Development",
                    filter: "web"
              },
              {
                    name: "Programming",
                    filter: "programming"
              },
              {
                  name: "Applications",
                  filter: "apps"
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

            this.filterSkills = function(type) {
              var i;
              for(i = 0; i < this.skills.length; i++) {
                if(type === this.skills[i].filter) {
                  this.skills[i].show = true;
                }
                else {
                  this.skills[i].show = false;
                }
              }
            };

            this.nextImage = function(project) {
              if(project.imageindex < project.images.length - 1)
              {
                project.imageindex += 1;
              }
            };

            this.prevImage = function(project) {
              if(project.imageindex > 0)
              {
                project.imageindex -= 1;
              }
            };
        });

})();
