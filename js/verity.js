

const Localization = {
    _dictionaries: {
        'en': {
            title: 'Verity Triumph Steps',
            created_by: 'Originally Created by',
            edited_by: 'Edited by',

            // 4th Encounter
            encounter_4: 'Triumph Steps',
            dissection_tool: 'Full Triumph Steps',
            reset: 'Reset',
            left: 'Left',
            middle: 'Middle',
            right: 'Right',
            leftS: 'Ended previously with Left',
            middleS: 'Ended previously with Middle',
            rightS: 'Ended previously with Right',
            inside: 'Inside Statue',
            insideW1: 'Inside Wall 1',
            insideW2: 'Inside Wall 2',
            outside: 'Outside Statue',
            circle: 'Circle',
            square: 'Square',
            triangle: 'Triangle',
            sphere: 'Sphere',
            cube: 'Cube',
            pyramid: 'Pyramid',
            cylinder: 'Cylinder',
            take: 'Take',
            depo: 'Deposit',
            prism: 'Prism',
            cone: 'Cone',
            start: 'Starting Statue',
            steps_for_outside: 'Steps for Outside',
            steps_for_inside: 'Steps for Inside',
            dissect: 'Dissect',
            grab: 'Grab',
            deposit: 'Deposit',
            from: 'From'
        },

    },

    dictionary: null,

    Initialize: function () {
        const lang = this._getLang();
        const dictionary = this._dictionaries[lang];

        $("[data-localize]").each(function () {
            const language = $(this).data('localize');
            $(this).html(dictionary[language]);
        });

        this.dictionary = dictionary;
    },

    _getLang: function () {
        return 'en';
    }
}


$(function () {
    Localization.Initialize();

    $('.se-btn-group button').on('click', function () {
        const button = $(this);
        const group = button.closest('.se-btn-group');
        const wasSelected = button.hasClass('btn-light');

        group.find('button').removeClass('btn-light');
        group.find('button').addClass('btn-dark');

        button.toggleClass('btn-dark', wasSelected);
        button.toggleClass('btn-light', !wasSelected);
    });
});
