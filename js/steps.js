const Common = {
    GetAllowedComponents: function (area, initialCount) {
        const selected = $(`.se-btn-group[data-area="${area}"] button.btn-light`);

        let components = {
            C: initialCount,
            S: initialCount,
            T: initialCount,

            Allow: function (components) {
                let myComponents = {
                    C: (components.match(/C/g) || []).length,
                    S: (components.match(/S/g) || []).length,
                    T: (components.match(/T/g) || []).length
                };

                for (const counter in myComponents) {
                    if (this[counter] < myComponents[counter]) {
                        return false;
                    }
                }

                return true;
            }
        };

        selected.each(function () {
            for (let component of $(this).data('components')) {
                components[component]--;
            }
        });

        return components;
    }
}

const Encounter4 = {
    SequenceDissection: function () {
        const buttons = $(`.se-btn-group button.btn-light`);
        if (buttons.length < 13) return null;

        var prev = null;

        const state = {
            left: {
                inside: null,
                insideW1: null,
                insideW2: null,
                outside: null,
                shadows: null
            },

            middle: {
                inside: null,
                insideW1: null,
                insideW2: null,
                outside: null,
                shadows: null
            },

            right: {
                inside: null,
                insideW1: null,
                insideW2: null,
                outside: null,
                shadows: null
            }
        };

        buttons.each(function () {
            const button = $(this);
            const area = button.closest('.se-btn-group').data('area');
            const position = button.closest('.card-body').data('position');

            if (position == "top") {
                prev = button.data('components');
            } else {
                state[position][area] = button.data('components');
            }
        });

        // Define methods for each position in state
        for (const position in state) {
            state[position].shadows = state[position].inside;

            state[position].toAdd = function () {
                let required = this.insideW1 + this.insideW2;

                for (let component of this.outside) {
                    required = required.replace(component, '');
                }

                return required;
            };

            state[position].toAddInner = function () {
                let leftover = 'CST';

                for (let component of this.shadows) {
                    leftover = leftover.replace(component, '');
                }

                return leftover
            }

            state[position].toRemove = function (symbol) {
                if (this.outside.includes(this.inside)) {
                    return this.inside;
                }

                for (let component of this.outside) {
                    if (component != this.insideW1 && component != this.insideW2 && component != symbol) {
                        return component;
                    }
                }

                return this.outside[0];
            };

            state[position].swap = function (toRemove, toAdd) {
                this.outside = this.outside.replace(toRemove, toAdd);
            };

            state[position].hasSameAsStatue = function () {
                return this.inside === this.insideW1 || this.inside === this.insideW2;
            };

            state[position].hasWallDouble = function () {
                return this.insideW1 === this.insideW2;
            };

            state[position].whichWallSame = function () {
                if (this.inside === this.insideW1) {
                    return "insideW1";
                } else {
                    return "insideW2";
                }
            };

            state[position].outsideSolved = function () {
                return (this.insideW1 + this.insideW2 === this.outside) || (this.insideW2 + this.insideW1 === this.outside);
            };

            state[position].innerSolved = function () {
                let leftover = 'CST';

                for (let component of this.shadows) {
                    leftover = leftover.replace(component, '');
                }

                return (this.insideW1 != this.inside) && (this.insideW2 != this.inside) && (leftover === "");
            };
        }

        const stepsI = [];
        const stepsO = [];

        var leftT = {
            middle: null,
            right: null
        };
        
        var middleT = {
            left: null,
            right: null
        };

        var rightT = {
            middle: null,
            left: null
        };

        const statueL = state["left"].inside;
        const statueM = state["middle"].inside;
        const statueR = state["right"].inside;
        const insideW1L = state["left"].insideW1;
        const insideW1M = state["middle"].insideW1;
        const insideW1R = state["right"].insideW1;
        const insideW2L = state["left"].insideW2;
        const insideW2M = state["middle"].insideW2;
        const insideW2R = state["right"].insideW2;


        if (insideW1L === statueM && insideW2L != statueM) {
            leftT.middle = insideW2L;
            leftT.right = insideW1L;
        } else {
            leftT.middle = insideW1L;
            leftT.right = insideW2L;
        }

        if (insideW1M === statueL && insideW2M != statueL) {
            middleT.left = insideW2M;
            middleT.right = insideW1M;
        } else {
            middleT.left = insideW1M;
            middleT.right = insideW2M;
        }

        if (insideW1R === statueM && insideW2R != statueM) {
            rightT.middle = insideW2R;
            rightT.left = insideW1R;
        } else {
            rightT.middle = insideW1R;
            rightT.left = insideW2R;
        }

        if (prev === "left") {
            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(leftT.right)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(leftT.middle)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(middleT.left)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(middleT.right)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(rightT.middle)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(rightT.left)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
            });

            prev = "left";
        } else {
            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(middleT.left)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(middleT.right)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(rightT.middle)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(rightT.left)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(leftT.right)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
            });

            stepsI.push({
                type: 'instruction',
                text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(leftT.middle)} 
                    ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
            });

            prev = "middle";
        }

        state.left.insideW1 = middleT.left;
        state.left.insideW2 = rightT.left;
        state.left.shadows += middleT.left + rightT.left;
        state.middle.insideW1 = leftT.middle;
        state.middle.insideW2 = rightT.middle;
        state.middle.shadows += leftT.middle + rightT.middle;
        state.right.insideW1 = middleT.right;
        state.right.insideW2 = leftT.right;
        state.right.shadows += middleT.right + leftT.right;

        if (state.left.hasSameAsStatue() && state.middle.hasSameAsStatue() && state.right.hasSameAsStatue()) {
            var leftWallRemove = state.left.whichWallSame();
            var middleWallRemove = state.middle.whichWallSame();
            var rightWallRemove = state.right.whichWallSame();
            var oldLeft = state.left[leftWallRemove];
            var oldMiddle = state.middle[middleWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newLeft = null;
            var newMiddle = null;
            var newRight = null;
            
            if(state.left.toAddInner() === oldRight) {
                if (prev === "left") {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });
                } else {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });
                    prev = "right";
                }

                newLeft = oldRight;
                newMiddle = oldLeft;
                newRight = oldMiddle;
            } else {
                if (prev === "left") {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });
        
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    prev = "left";
                } else {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });
        
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });
        
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });
                    prev = "middle";
                }

                newLeft = oldMiddle;
                newMiddle = oldRight;
                newRight = oldLeft;
            }

            state.left[leftWallRemove] = newLeft;
            state.middle[middleWallRemove] = newMiddle;
            state.right[rightWallRemove] = newRight;
            state.left.shadows += newLeft;
            state.middle.shadows += newMiddle;
            state.right.shadows += newRight;
        } else if (state.left.hasWallDouble() && state.middle.hasWallDouble() && state.right.hasWallDouble()) {
            var leftWallRemove = "insideW1";
            var middleWallRemove = "insideW1";
            var rightWallRemove = "insideW1";
            var oldLeft = state.left[leftWallRemove];
            var oldMiddle = state.middle[middleWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newLeft = null;
            var newMiddle = null;
            var newRight = null;
            
            if(state.left.toAddInner() === oldRight) {
                if (prev === "left") {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });
                } else {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });
                    prev = "right";
                }

                newLeft = oldRight;
                newMiddle = oldLeft;
                newRight = oldMiddle;
            } else {
                if (prev === "left") {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });
        
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    prev = "left";
                } else {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });
        
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });
        
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });
                    prev = "middle";
                }

                newLeft = oldMiddle;
                newMiddle = oldRight;
                newRight = oldLeft;
            }

            state.left[leftWallRemove] = newLeft;
            state.middle[middleWallRemove] = newMiddle;
            state.right[rightWallRemove] = newRight;
            state.left.shadows += newLeft;
            state.middle.shadows += newMiddle;
            state.right.shadows += newRight;
        } else if (state.left.hasSameAsStatue() && state.middle.hasSameAsStatue()) {
            var leftWallRemove = state.left.whichWallSame();
            var middleWallRemove = state.middle.whichWallSame();
            var oldLeft = state.left[leftWallRemove];
            var oldMiddle = state.middle[middleWallRemove];
            var newLeft = null;
            var newMiddle = null;


            if (prev === "left") {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });
                
                prev = "middle";
            }

            newLeft = oldMiddle;
            newMiddle = oldLeft;
            state.left[leftWallRemove] = newLeft;
            state.middle[middleWallRemove] = newMiddle;
            state.left.shadows += newLeft;
            state.middle.shadows += newMiddle;
        } else if (state.left.hasSameAsStatue() && state.right.hasSameAsStatue()) {
            var leftWallRemove = state.left.whichWallSame();
            var rightWallRemove = state.right.whichWallSame();
            var oldLeft = state.left[leftWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newLeft = null;
            var newRight = null;


            if (prev === "left") {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                prev = "right";
            }

            newRight = oldLeft;
            newLeft = oldRight;
            state.left[leftWallRemove] = newLeft;
            state.right[rightWallRemove] = newRight;
            state.left.shadows += newLeft;
            state.right.shadows += newRight;
            
        } else if (state.right.hasSameAsStatue() && state.middle.hasSameAsStatue()) {
            var middleWallRemove = state.middle.whichWallSame();
            var rightWallRemove = state.right.whichWallSame();
            var oldMiddle = state.middle[middleWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newMiddle = null;
            var newRight = null;


            if (prev === "right") {
        
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

            } else {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                prev = "middle";
            }

            newRight = oldMiddle;
            newMiddle = oldRight;
            state.middle[middleWallRemove] = newMiddle;
            state.right[rightWallRemove] = newRight;
            state.middle.shadows += newMiddle;
            state.right.shadows += newRight;
        } else if (state.left.hasSameAsStatue() && state.middle.hasWallDouble()) {
            var leftWallRemove = state.left.whichWallSame();
            var middleWallRemove = "insideW1";
            var oldLeft = state.left[leftWallRemove];
            var oldMiddle = state.middle[middleWallRemove];
            var newLeft = null;
            var newMiddle = null;


            if (prev === "left") {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });
                
                prev = "middle";
            }

            newLeft = oldMiddle;
            newMiddle = oldLeft;
            state.left[leftWallRemove] = newLeft;
            state.middle[middleWallRemove] = newMiddle;
            state.left.shadows += newLeft;
            state.middle.shadows += newMiddle;
        } else if (state.left.hasSameAsStatue() && state.right.hasWallDouble()) {
            var leftWallRemove = state.left.whichWallSame();
            var rightWallRemove = "insideW1";
            var oldLeft = state.left[leftWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newLeft = null;
            var newRight = null;


            if (prev === "left") {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                prev = "right";
            }

            newRight = oldLeft;
            newLeft = oldRight;
            state.left[leftWallRemove] = newLeft;
            state.right[rightWallRemove] = newRight;
            state.left.shadows += newLeft;
            state.right.shadows += newRight;
            
        } else if (state.left.hasWallDouble() && state.middle.hasSameAsStatue()) {
            var leftWallRemove = "insideW1";
            var middleWallRemove = state.middle.whichWallSame();
            var oldLeft = state.left[leftWallRemove];
            var oldMiddle = state.middle[middleWallRemove];
            var newLeft = null;
            var newMiddle = null;


            if (prev === "left") {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });
                
                prev = "middle";
            }

            newLeft = oldMiddle;
            newMiddle = oldLeft;
            state.left[leftWallRemove] = newLeft;
            state.middle[middleWallRemove] = newMiddle;
            state.left.shadows += newLeft;
            state.middle.shadows += newMiddle;
        } else if (state.left.hasWallDouble() && state.right.hasSameAsStatue()) {
            var leftWallRemove = "insideW1";
            var rightWallRemove = state.right.whichWallSame();
            var oldLeft = state.left[leftWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newLeft = null;
            var newRight = null;


            if (prev === "left") {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });


                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(oldLeft)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                prev = "right";
            }

            newRight = oldLeft;
            newLeft = oldRight;
            state.left[leftWallRemove] = newLeft;
            state.right[rightWallRemove] = newRight;
            state.left.shadows += newLeft;
            state.right.shadows += newRight;
            
        } else if (state.right.hasWallDouble() && state.middle.hasSameAsStatue()) {
            var middleWallRemove = state.middle.whichWallSame();
            var rightWallRemove =  "insideW1";
            var oldMiddle = state.middle[middleWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newMiddle = null;
            var newRight = null;


            if (prev === "right") {
        
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

            } else {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                prev = "middle";
            }

            newRight = oldMiddle;
            newMiddle = oldRight;
            state.middle[middleWallRemove] = newMiddle;
            state.right[rightWallRemove] = newRight;
            state.middle.shadows += newMiddle;
            state.right.shadows += newRight;
        } else if (state.right.hasSameAsStatue() && state.middle.hasWallDouble()) {
            var middleWallRemove =  "insideW1";
            var rightWallRemove = state.right.whichWallSame();
            var oldMiddle = state.middle[middleWallRemove];
            var oldRight = state.right[rightWallRemove];
            var newMiddle = null;
            var newRight = null;


            if (prev === "right") {
        
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

            } else {

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(oldMiddle)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(oldRight)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                prev = "middle";
            }

            newRight = oldMiddle;
            newMiddle = oldRight;
            state.middle[middleWallRemove] = newMiddle;
            state.right[rightWallRemove] = newRight;
            state.middle.shadows += newMiddle;
            state.right.shadows += newRight;
        } 

        stepsI.push({
            type: 'infoW1',
            text: `3D Key = ${Localization.dictionary.left}: ${this._toIcon(state.left.insideW1+state.left.insideW2)}, 
                ${Localization.dictionary.middle}: ${this._toIcon(state.middle.insideW1+state.middle.insideW2)}, 
                ${Localization.dictionary.right}: ${this._toIcon(state.right.insideW1+state.right.insideW2)}`
        });

        if(!state.left.innerSolved() || !state.middle.innerSolved() || !state.right.innerSolved()) {
            throw new Error("Not solved correctly");
        }

        var temp = null;
        var temp2 = null;
        var first = null;
        var second = null;
        var stateF = null;
        var stateS = null;
        var count = 0;
        stepsO.push({
            type: 'info',
            text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
        });
        
        while (true) {
            if (state.left.outsideSolved() && state.middle.outsideSolved() && state.right.outsideSolved()) {
                break;
            }
            count = count + 1;

            if (count > 100) {
                break;
            }

            if (prev === "left") {
                if (state.middle.outsideSolved()) {
                    first = Localization.dictionary.right;
                    second = Localization.dictionary.left;
                    stateF = state.right;
                    stateS = state.left;

                    temp = stateF.toRemove();
                    temp2 = stateS.toRemove(temp);
                } else if (state.right.outsideSolved()) {
                    first = Localization.dictionary.middle;
                    second = Localization.dictionary.left;
                    stateF = state.middle;
                    stateS = state.left;

                    temp = stateF.toRemove();
                    temp2 = stateS.toRemove(temp);
                } else {
                    temp = state.middle.toRemove();
                    first = Localization.dictionary.middle;
                    stateF = state.middle;
                    if (state.right.toAdd().includes(temp)) {
                        temp2 = state.right.toRemove(temp);
                        second = Localization.dictionary.right;
                        stateS = state.right;
                        prev = "right";
                    } else {
                        temp2 = state.left.toRemove(temp);
                        second = Localization.dictionary.left;
                        stateS = state.left;
                    }
                }
            } else if (prev === "middle") {
                if (state.left.outsideSolved()) {
                    first = Localization.dictionary.right;
                    second = Localization.dictionary.middle;
                    stateF = state.right;
                    stateS = state.middle;

                    temp = stateF.toRemove();
                    temp2 = stateS.toRemove(temp);
                } else if (state.right.outsideSolved()) {
                    first = Localization.dictionary.left;
                    second = Localization.dictionary.middle;
                    stateF = state.left
                    stateS = state.middle;

                    temp = stateF.toRemove();
                    temp2 = stateS.toRemove(temp);
                } else {
                    temp = state.left.toRemove();
                    first = Localization.dictionary.left;
                    stateF = state.left;
                    if (state.right.toAdd().includes(temp)) {
                        temp2 = state.right.toRemove(temp);
                        second = Localization.dictionary.right;
                        stateS = state.right;
                        prev = "right";
                    } else {
                        temp2 = state.middle.toRemove(temp);
                        second = Localization.dictionary.middle;
                        stateS = state.middle;
                    }
                }
            } else {
                if (state.left.outsideSolved()) {
                    first = Localization.dictionary.middle;
                    second = Localization.dictionary.right;
                    stateF = state.middle;
                    stateS = state.right;

                    temp = stateF.toRemove();
                    temp2 = stateS.toRemove(temp);
                } else if (state.middle.outsideSolved()) {
                    first = Localization.dictionary.left;
                    second = Localization.dictionary.right;
                    stateF = state.left
                    stateS = state.right;

                    temp = stateF.toRemove();
                    temp2 = stateS.toRemove(temp);
                } else {
                    temp = state.left.toRemove();
                    first = Localization.dictionary.left;
                    stateF = state.left;
                    if (state.middle.toAdd().includes(temp)) {
                        temp2 = state.middle.toRemove(temp);
                        second = Localization.dictionary.middle;
                        stateS = state.middle;
                        prev = "middle";
                    } else {
                        temp2 = state.right.toRemove(temp);
                        second = Localization.dictionary.right;
                        stateS = state.right;
                    }
                } 
            }

            stepsO.push({
                type: 'instruction',
                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                    ${Localization.dictionary.from} ${first}.`
            });

            stepsO.push({
                type: 'instruction',
                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                    ${Localization.dictionary.from} ${second}.`
            });

            stateF.swap(temp, temp2);
            stateS.swap(temp2, temp);

            stepsO.push({
                type: 'info',
                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
            });
        }

        return [stepsI, stepsO];
    },

    _toIcon: function (component) {
        switch (component) {
            case 'C': return `<i class="symbol-sm circle"></i> (${Localization.dictionary.circle})`;
            case 'S': return `<i class="symbol-sm square"></i> (${Localization.dictionary.square})`;
            case 'T': return `<i class="symbol-sm triangle"></i> (${Localization.dictionary.triangle})`;

            case 'CC':
                return '<i class="symbol-sm sphere"></i>';
            case 'SS':
                return '<i class="symbol-sm cube"></i>';
            case 'TT':
                return '<i class="symbol-sm pyramid"></i>';
            case 'CS': case 'SC':
                return '<i class="symbol-sm cylinder"></i>';
            case 'ST': case 'TS':
                return '<i class="symbol-sm prism"></i>';
            case 'TC': case 'CT':
                return '<i class="symbol-sm cone"></i>';
        }
    }
}

$(function () {
    $('.btn-reset').on('click', function () {
        $('.se-btn-group button').each(function () {
            const button = $(this);

            button.removeClass('btn-light');
            button.addClass('btn-dark');
            button.attr('disabled', false);

            $('#stepsI').empty();
            $('#stepsO').empty();
            $('#stepsContainerInside').hide();
            $('#stepsContainerOutside').hide();

            window.scrollTo({ top: 0 });
        });
    });

    $('.se-btn-group button').on('click', function () {
        const button = $(this);
        const area = button.closest('.se-btn-group').data('area');

        // Block the ability to select buttons with invalid components.
        if (area === 'inside' || area === 'insideW1' || area === 'insideW2' || area === "start") {
            components = Common.GetAllowedComponents(area, 1);
        } else if (area === 'outside') {
            components = Common.GetAllowedComponents(area, 2);
        }

        $(`.se-btn-group[data-area="${area}"] button:not(.btn-light)`).each(function () {
            $(this).attr('disabled', !components.Allow($(this).data('components')));
        });

        // Enable the reset button.
        $('.btn-reset').attr('disabled', false);

        // Determine sequence for dissection.
        const steps = Encounter4.SequenceDissection();

        if (steps != null) {
            const stepsI = steps[0];
            const stepsO = steps[1];
            
            // Print steps for dissection.
            if (stepsI != null) {
                $('#stepsI').empty();

                for (let i = 0, step = 1; i < stepsI.length; i++) {
                    switch (stepsI[i].type) {
                        case 'instruction':
                            $('#stepsI').append(`<li>${step++}. ${stepsI[i].text}</li>`);
                            break;

                        case 'infoW1':
                            $('#stepsI').append(`<li>${stepsI[i].text}</li>`);
                            break;
                        
                        case 'infoW2':
                            $('#stepsI').append(`<li>${stepsI[i].text}</li>`);
                            if (i !== stepsI.length - 1) $('#stepsI').append('<hr />');
                            break;
                    }
                }

                $('#stepsContainerInside').show();
            }
            else {
                $('#stepsContainerInside').hide();
            }

            // Print steps for dissection.
            if (stepsO != null) {
                $('#stepsO').empty();

                for (let i = 0, step = 1; i < stepsO.length; i++) {
                    switch (stepsO[i].type) {
                        case 'instruction':
                            $('#stepsO').append(`<li>${step++}. ${stepsO[i].text}</li>`);
                            break;

                        case 'info':
                            $('#stepsO').append(`<li>${stepsO[i].text}</li>`);
                            if (i !== stepsO.length - 1) $('#stepsO').append('<hr />');
                            break;
                    }
                }

                $('#stepsContainerOutside').show();
            }
            else {
                $('#stepsContainerOutside').hide();
            }
        }
    });
});