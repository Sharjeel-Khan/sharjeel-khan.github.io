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

        var start = null;
        var prev = null;

        const state = {
            left: {
                inside: null,
                insideW1: null,
                insideW2: null,
                outside: null
            },

            middle: {
                inside: null,
                insideW1: null,
                insideW2: null,
                outside: null
            },

            right: {
                inside: null,
                insideW1: null,
                insideW2: null,
                outside: null
            }
        };

        buttons.each(function () {
            const button = $(this);
            const area = button.closest('.se-btn-group').data('area');
            const position = button.closest('.card-body').data('position');

            if (position == "top") {
                start = button.data('components');
            } else {
                state[position][area] = button.data('components');
            }
        });

        // Define methods for each position in state
        for (const position in state) {
            state[position].toAdd = function () {
                let required = this.insideW1 + this.insideW2;

                for (let component of this.outside) {
                    required = required.replace(component, '');
                }

                return required;
            };

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

            state[position].isWallDouble = function () {
                return this.insideW1 === this.insideW2;
            };

            state[position].isWallDoubleStatue = function () {
                return this.insideW1 === this.insideW2 && this.insideW1 === this.inside;
            };


            state[position].isWallDoubleNotStatue = function () {
                return this.insideW1 === this.insideW2 && this.insideW1 != this.inside;
            };

            state[position].hasSameAsStatue = function () {
                return this.inside === this.insideW1 || this.inside === this.insideW2;
            };

            state[position].whichWallSame = function () {
                if (this.inside === this.insideW1) {
                    return "insideW1";
                } else {
                    return "insideW2";
                }
            };

            state[position].whichWall = function (symbol) {
                if (symbol === this.insideW1) {
                    return "insideW1";
                } else {
                    return "insideW2";
                }
            };

            state[position].outsideSolved = function () {
                return (this.insideW1 + this.insideW2 === this.outside) || (this.insideW2 + this.insideW1 === this.outside);
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

        if (state["left"].isWallDouble() && state["right"].isWallDouble() && state["middle"].isWallDouble()) {
            console.log("All Double");
            leftT.middle = state["left"].insideW1;
            leftT.right = state["left"].insideW2;
            middleT.left = state["middle"].insideW1;
            middleT.right = state["middle"].insideW2;
            rightT.left = state["right"].insideW1;
            rightT.middle = state["right"].insideW2;

            if (start == "left") {

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
            } else if (start == "middle") {

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

                prev = "right";
            } else {

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
            }

            state.left.insideW1 = middleT.left;
            state.left.insideW2 = rightT.left;
            state.middle.insideW1 = leftT.middle;
            state.middle.insideW2 = rightT.middle;
            state.right.insideW1 = middleT.right;
            state.right.insideW2 = leftT.right;

            var leftTT = {
                middle: null
            };
            
            var middleTT = {
                right: null
            };
    
            var rightTT = {
                left: null
            };

            leftTT.middle = state.left.whichWallSame();
            middleTT.right = state.middle.whichWallSame();
            rightTT.left = state.right.whichWallSame();

            var tempL = state.right[state.right.whichWallSame()];
            var tempM = state.left[state.left.whichWallSame()];
            var tempR = state.middle[state.middle.whichWallSame()];

            if (start == "left") {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(tempL)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(tempR)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(tempM)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                prev = "middle";
            } else if (start == "middle") {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(tempM)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(tempL)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(tempR)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                prev = "right";
            } else {
                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(tempR)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(tempM)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                });

                stepsI.push({
                    type: 'instruction',
                    text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(tempL)} 
                        ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                });

                prev = "left";
            }

            state.left[leftTT.middle] = tempL;
            state.middle[middleTT.right] = tempM;
            state.right[rightTT.left] = tempR;

        } 
        else if (!state["left"].isWallDouble() && !state["right"].isWallDouble() && !state["middle"].isWallDouble()) {
            console.log("All Mixed");

            if (statueM === insideW1L) {
                leftT.middle = insideW2L;
                leftT.right = insideW1L;
            } else if (statueR === insideW2L) { 
                leftT.middle = insideW2L;
                leftT.right = insideW1L;
            } else {
                leftT.middle = insideW1L;
                leftT.right = insideW2L;
            }

            if (statueM === insideW1R) {
                rightT.middle = insideW2R;
                rightT.left = insideW1R;
            } else if (statueL === insideW2R) { 
                rightT.middle = insideW2R;
                rightT.left = insideW1R;
            } else {
                rightT.middle = insideW1R;
                rightT.left = insideW2R;
            }

            if (statueL === insideW1M) {
                middleT.left = insideW2M;
                middleT.right = insideW1M;
            } else if (statueR == insideW2M) {
                middleT.left = insideW2M;
                middleT.right = insideW1M;
            } else {
                middleT.left = insideW1M;
                middleT.right = insideW2M;
            }

            if (start == "left") {
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
            } else if (start == "middle") {

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

                prev = "right";
            } else {

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
            }

            state.left.insideW1 = middleT.left;
            state.left.insideW2 = rightT.left;
            state.middle.insideW1 = leftT.middle;
            state.middle.insideW2 = rightT.middle;
            state.right.insideW1 = middleT.right;
            state.right.insideW2 = leftT.right;

        } else {
            console.log("One Double and 2 mixed");

            if (statueM === insideW1L) {
                leftT.middle = insideW2L;
                leftT.right = insideW1L;
            } else if (statueR === insideW2L) { 
                leftT.middle = insideW2L;
                leftT.right = insideW1L;
            } else {
                leftT.middle = insideW1L;
                leftT.right = insideW2L;
            }

            if (statueM === insideW1R) {
                rightT.middle = insideW2R;
                rightT.left = insideW1R;
            } else if (statueL === insideW2R) { 
                rightT.middle = insideW2R;
                rightT.left = insideW1R;
            } else {
                rightT.middle = insideW1R;
                rightT.left = insideW2R;
            }

            if (statueL === insideW1M) {
                middleT.left = insideW2M;
                middleT.right = insideW1M;
            } else if (statueR == insideW2M) {
                middleT.left = insideW2M;
                middleT.right = insideW1M;
            } else {
                middleT.left = insideW1M;
                middleT.right = insideW2M;
            }

            if (start == "left") {
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
            } else if (start == "middle") {

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
            } else {

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
            }

            state.left.insideW1 = middleT.left;
            state.left.insideW2 = rightT.left;
            state.middle.insideW1 = leftT.middle;
            state.middle.insideW2 = rightT.middle;
            state.right.insideW1 = middleT.right;
            state.right.insideW2 = leftT.right;

            if (state.left.isWallDouble() || state.middle.isWallDouble() || state.right.isWallDouble()) {

                var leftTT = {
                    middle: null
                };
                
                var middleTT = {
                    right: null
                };
        
                var rightTT = {
                    left: null
                };

                
                var double = null;
                var sameS = null;
                var whichWall = null;

                if (state.left.isWallDouble()) {
                    double = "left";
                    leftTT.middle = "insideW1";
                } else if (state.middle.isWallDouble()) {
                    double = "middle";
                    middleTT.right = "insideW1";
                } else {
                    double = "right";
                    rightTT.left = "insideW1";
                }

                if (state.left.hasSameAsStatue()) {
                    sameS = "left";
                    leftTT.middle = state.left.whichWallSame();
                    if (double == "middle") {
                        rightTT.left = state.right.whichWall(state.left[leftTT.middle]);
                    } else {
                        middleTT.right = state.middle.whichWall(state.left[leftTT.middle]);
                    }
                } else if (state.middle.hasSameAsStatue()) {
                    sameS = "middle";
                    middleTT.right = state.middle.whichWallSame();
                    if (double == "left") {
                        rightTT.left = state.right.whichWall(state.middle[middleTT.right]);
                    } else {
                        leftTT.middle = state.left.whichWall(state.middle[middleTT.right]);
                    }
                } else {
                    sameS = "right";
                    rightTT.left = state.right.whichWallSame();
                    if (double == "middle") {
                        leftTT.middle = state.left.whichWall(state.right[rightTT.left]);
                    } else {
                        middleTT.right = state.middle.whichWall(state.right[rightTT.left]);
                    }
                }

                var tempL = state.right[rightTT.left];
                var tempM = state.left[leftTT.middle];
                var tempR = state.middle[middleTT.right];

                if (start == "left") {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(tempL)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(tempR)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(tempM)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    prev = "middle";
                } else if (start == "middle") {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(tempM)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(tempL)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(tempR)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });

                    prev = "right";
                } else {
                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.middle} ${Localization.dictionary.take} ${this._toIcon(tempR)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.right}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.left} ${Localization.dictionary.take} ${this._toIcon(tempM)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.middle}.`
                    });

                    stepsI.push({
                        type: 'instruction',
                        text: `${Localization.dictionary.right} ${Localization.dictionary.take} ${this._toIcon(tempL)} 
                            ${Localization.dictionary.deposit} ${Localization.dictionary.left}.`
                    });

                    prev = "left";
                }

                state.left[leftTT.middle] = tempL;
                state.middle[middleTT.right] = tempM;
                state.right[rightTT.left] = tempR;
            }
        }

        stepsI.push({
            type: 'infoW1',
            text: `3D Key = ${Localization.dictionary.left}: ${this._toIcon(state.left.insideW1+state.left.insideW2)}, 
                ${Localization.dictionary.middle}: ${this._toIcon(state.middle.insideW1+state.middle.insideW2)}, 
                ${Localization.dictionary.right}: ${this._toIcon(state.right.insideW1+state.right.insideW2)}`
        });

        var temp = null;
        var temp2 = null;
        var count = 0;
        while (true) {
            if (state.left.outsideSolved() && state.middle.outsideSolved() && state.right.outsideSolved()) {
                break;
            }
            count = count + 1;

            if (count > 100) {
                break;
            }

            if (start == "left") {
                if(state.left.outsideSolved()) {
                    if (prev === "middle") {
                        start = "right";
                    } else {
                        start = "middle";
                    }
                } else {
                    temp = state.left.toRemove();
                    if (prev === "middle") {
                        if (state.right.toAdd().includes(temp)) {
                            temp2 = state.right.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });

                            state.left.swap(temp, temp2);
                            state.right.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "right";
                            start = "middle";
                        } else {
                            temp2 = state.middle.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });

                            state.left.swap(temp, temp2);
                            state.middle.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "middle";
                            start = "right";
                        }   
                    } else {
                        if (state.middle.toAdd().includes(temp)) {
                            temp2 = state.middle.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });

                            state.left.swap(temp, temp2);
                            state.middle.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "middle";
                            start = "right";
                        } else {
                            temp2 = state.right.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });

                            state.left.swap(temp, temp2);
                            state.right.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "right";
                            start = "middle";
                        }   
                    }
                }
            } else if (start == "middle") {
                if(state.middle.outsideSolved()) {
                    if (prev === "left") {
                        start = "right";
                    } else {
                        start = "left";
                    }
                } else {
                    temp = state.middle.toRemove();
                    if (prev === "left") {
                        if (state.right.toAdd().includes(temp)) {
                            temp2 = state.right.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });

                            state.middle.swap(temp, temp2);
                            state.right.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "right";
                            start = "left";
                        } else {
                            temp2 = state.left.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });

                            state.middle.swap(temp, temp2);
                            state.left.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "left";
                            start = "right";
                        }   
                    } else {
                        if (state.left.toAdd().includes(temp)) {

                            temp2 = state.left.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });

                            state.middle.swap(temp, temp2);
                            state.left.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "left";
                            start = "right";
                        } else {
                            temp2 = state.right.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });

                            state.middle.swap(temp, temp2);
                            state.right.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "right";
                            start = "left";
                        }   
                    }

                }

            } else {
                if(state.right.outsideSolved()) {
                    if (prev === "middle") {
                        start = "left";
                    } else {
                        start = "middle";
                    }
                } else {
                    temp = state.right.toRemove();
                    if (prev === "middle") {
                        if (state.left.toAdd().includes(temp)) {
                            temp2 = state.left.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });

                            state.right.swap(temp, temp2);
                            state.left.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "left";
                            start = "middle";
                        } else {
                            temp2 = state.middle.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });

                            state.right.swap(temp, temp2);
                            state.middle.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "middle";
                            start = "left";
                        }   
                    } else {
                        if (state.middle.toAdd().includes(temp)) {
                            temp2 = state.middle.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.middle}.`
                            });

                            state.right.swap(temp, temp2);
                            state.middle.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "middle";
                            start = "left";
                        } else {
                            temp2 = state.left.toRemove(temp);
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.right}.`
                            });
                
                            stepsO.push({
                                type: 'instruction',
                                text: `${Localization.dictionary.dissect} ${this._toIcon(temp2)} 
                                    ${Localization.dictionary.from} ${Localization.dictionary.left}.`
                            });

                            state.right.swap(temp, temp2);
                            state.left.swap(temp2, temp);

                            stepsO.push({
                                type: 'info',
                                text: `${Localization.dictionary.left}: ${this._toIcon(state.left.outside)}, 
                                    ${Localization.dictionary.middle}: ${this._toIcon(state.middle.outside)}, 
                                    ${Localization.dictionary.right}: ${this._toIcon(state.right.outside)}`
                            });

                            prev = "left";
                            start = "middle";
                        }   
                    }   

                }

            }
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